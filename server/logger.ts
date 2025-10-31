import fs from "fs/promises";
import path from "path";
import type { ConversionLog, ConversionMode } from "@shared/schema";
import { randomUUID } from "crypto";

const LOG_FILE = path.join(process.cwd(), "data", "conversion-logs.json");

/**
 * Assicura che la directory data esista
 */
async function ensureDataDir() {
  const dataDir = path.dirname(LOG_FILE);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

/**
 * Legge i log esistenti
 */
async function readLogs(): Promise<ConversionLog[]> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(LOG_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

/**
 * Scrive i log su file
 */
async function writeLogs(logs: ConversionLog[]): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(LOG_FILE, JSON.stringify(logs, null, 2), "utf-8");
}

/**
 * Registra una conversione AI per futura analisi e integrazione nel dizionario
 */
export async function logConversion(
  inputText: string,
  outputText: string,
  mode: ConversionMode,
  source: "dictionary" | "ai"
): Promise<void> {
  if (source !== "ai") return;

  try {
    const logs = await readLogs();
    
    const newLog: ConversionLog = {
      id: randomUUID(),
      timestamp: new Date(),
      inputText,
      outputText,
      mode,
      source,
    };

    logs.push(newLog);
    
    await writeLogs(logs);
    
    console.log(`[LOG] Conversione AI registrata: ${inputText} → ${outputText}`);
  } catch (error) {
    console.error("Errore nel logging della conversione:", error);
  }
}

/**
 * Recupera i log delle conversioni AI (utile per revisione manuale)
 */
export async function getConversionLogs(): Promise<ConversionLog[]> {
  return await readLogs();
}
