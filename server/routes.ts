import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  conversionRequestSchema, 
  type ConversionResponse 
} from "@shared/schema";
import { processWithDictionary } from "./dictionary";
import { convertWithAI, convertWithAIStream } from "./gemini";
import { logConversion } from "./logger";
import { conversionCache } from "./cache";

export async function registerRoutes(app: Express): Promise<Server> {
  
  /**
   * POST /api/convert
   * Endpoint principale per la conversione di testi (con cache)
   * 
   * Strategia:
   * 1. Controlla cache in-memory
   * 2. Prova con il dizionario statico
   * 3. Se non trova, usa Google Gemini AI
   * 4. Salva in cache e registra conversioni AI
   */
  app.post("/api/convert", async (req, res) => {
    try {
      const validationResult = conversionRequestSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: "Richiesta non valida", 
          details: validationResult.error 
        });
      }

      const { text, mode } = validationResult.data;

      const cached = conversionCache.get(text, mode);
      if (cached) {
        console.log(`[CACHE] ${text} → ${cached.result}`);
        const response: ConversionResponse = {
          result: cached.result,
          source: cached.source,
          mode,
        };
        return res.json(response);
      }

      let result: string;
      let source: "dictionary" | "ai";

      const dictionaryResult = processWithDictionary(text, mode);
      
      if (dictionaryResult.foundInDictionary) {
        result = dictionaryResult.result;
        source = "dictionary";
        console.log(`[DICTIONARY] ${text} → ${result}`);
      } else {
        result = await convertWithAI(text, mode);
        source = "ai";
        console.log(`[AI] ${text} → ${result}`);
        
        await logConversion(text, result, mode, source);
      }

      conversionCache.set(text, mode, result, source);

      const response: ConversionResponse = {
        result,
        source,
        mode,
      };

      res.json(response);
    } catch (error) {
      console.error("Errore conversione:", error);
      res.status(500).json({ 
        error: "Errore durante la conversione",
        message: error instanceof Error ? error.message : "Errore sconosciuto"
      });
    }
  });

  /**
   * POST /api/convert/stream
   * Endpoint streaming per conversioni AI rapide
   * 
   * Restituisce i chunks di testo progressivamente via Server-Sent Events
   */
  app.post("/api/convert/stream", async (req, res) => {
    try {
      const validationResult = conversionRequestSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: "Richiesta non valida", 
          details: validationResult.error 
        });
      }

      const { text, mode } = validationResult.data;

      const cached = conversionCache.get(text, mode);
      if (cached) {
        console.log(`[CACHE STREAM] ${text} → ${cached.result}`);
        return res.json({
          result: cached.result,
          source: cached.source,
          mode,
          cached: true,
        });
      }

      const dictionaryResult = processWithDictionary(text, mode);
      
      if (dictionaryResult.foundInDictionary) {
        console.log(`[DICTIONARY STREAM] ${text} → ${dictionaryResult.result}`);
        conversionCache.set(text, mode, dictionaryResult.result, "dictionary");
        return res.json({
          result: dictionaryResult.result,
          source: "dictionary",
          mode,
          cached: false,
        });
      }

      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      res.flushHeaders();

      let fullResult = "";

      try {
        for await (const chunk of convertWithAIStream(text, mode)) {
          fullResult += chunk;
          res.write(`data: ${JSON.stringify({ chunk, done: false })}\n\n`);
        }

        res.write(`data: ${JSON.stringify({ chunk: "", done: true, fullResult })}\n\n`);
        res.end();

        console.log(`[AI STREAM] ${text} → ${fullResult}`);
        
        conversionCache.set(text, mode, fullResult, "ai");
        await logConversion(text, fullResult, mode, "ai");
      } catch (streamError) {
        console.error("Errore durante streaming:", streamError);
        res.write(`data: ${JSON.stringify({ error: "Errore durante la conversione" })}\n\n`);
        res.end();
      }
    } catch (error) {
      console.error("Errore conversione stream:", error);
      res.status(500).json({ 
        error: "Errore durante la conversione",
        message: error instanceof Error ? error.message : "Errore sconosciuto"
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
