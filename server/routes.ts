import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  conversionRequestSchema, 
  type ConversionResponse 
} from "@shared/schema";
import { processWithDictionary } from "./dictionary";
import { convertWithAI } from "./gemini";
import { logConversion } from "./logger";

export async function registerRoutes(app: Express): Promise<Server> {
  
  /**
   * POST /api/convert
   * Endpoint principale per la conversione di testi
   * 
   * Strategia:
   * 1. Prova prima con il dizionario statico
   * 2. Se non trova corrispondenze, usa Google Gemini AI
   * 3. Registra le conversioni AI per futura analisi
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

  const httpServer = createServer(app);

  return httpServer;
}
