// Blueprint reference: javascript_gemini
import { GoogleGenAI } from "@google/genai";
import type { ConversionMode } from "@shared/schema";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY non configurata");
}

const ai = new GoogleGenAI({ apiKey });

/**
 * Prompts specializzati per ogni modalità di conversione
 */
const conversionPrompts = {
  "latin-to-din": (text: string) => `
Sei un esperto di trascrizione araba secondo lo standard DIN 31635.

Converti il seguente testo latino in trascrizione DIN 31635:
"${text}"

REGOLE IMPORTANTI:
- Se il testo contiene parole arabe scritte in caratteri latini, convertile in DIN 31635
- Usa i caratteri speciali DIN 31635: ḥ, ṣ, ḍ, ṭ, ẓ, ʿ, ġ, ḫ, ṯ, ḏ, š, ǧ, ecc.
- Se una parola NON è araba, lasciala invariata
- Mantieni la punteggiatura e gli spazi
- Rispondi SOLO con il testo convertito, senza spiegazioni

Testo convertito:`,

  "arabic-to-din": (text: string) => `
Sei un esperto di trascrizione araba secondo lo standard DIN 31635.

Converti il seguente testo arabo in trascrizione DIN 31635:
"${text}"

REGOLE IMPORTANTI:
- Usa lo standard DIN 31635 (non altri sistemi)
- Caratteri speciali: ḥ (ح), ṣ (ص), ḍ (ض), ṭ (ط), ẓ (ظ), ʿ (ع), ġ (غ), ḫ (خ), ṯ (ث), ḏ (ذ), š (ش), ǧ (ج)
- Mantieni le vocali lunghe con macron: ā, ī, ū
- Rispondi SOLO con il testo convertito, senza spiegazioni

Testo convertito:`,

  "latin-to-arabic": (text: string) => `
Sei un esperto di lingua araba e trascrizione.

Converti il seguente testo latino in scrittura araba:
"${text}"

REGOLE IMPORTANTI:
- Se il testo contiene parole arabe scritte in caratteri latini, convertile in arabo
- Usa la corretta ortografia araba
- Se una parola NON è araba, lasciala in caratteri latini
- Mantieni la punteggiatura
- Rispondi SOLO con il testo convertito, senza spiegazioni

Testo convertito:`
};

/**
 * Converte testo usando Google Gemini AI (versione standard non-streaming)
 */
export async function convertWithAI(
  text: string,
  mode: ConversionMode
): Promise<string> {
  try {
    const prompt = conversionPrompts[mode](text);
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }]
        }
      ],
    });
    
    const convertedText = response.text?.trim();
    
    if (!convertedText) {
      throw new Error("Gemini non ha restituito alcun testo");
    }
    
    return convertedText;
  } catch (error) {
    console.error("Errore conversione Gemini:", error);
    throw new Error("Errore durante la conversione AI");
  }
}

/**
 * Converte testo usando Google Gemini AI con streaming
 * Restituisce un async generator che emette chunks di testo progressivamente
 */
export async function* convertWithAIStream(
  text: string,
  mode: ConversionMode
): AsyncGenerator<string, void, unknown> {
  try {
    const prompt = conversionPrompts[mode](text);
    
    const responseStream = await ai.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }]
        }
      ],
    });
    
    for await (const chunk of responseStream) {
      if (chunk.text) {
        yield chunk.text;
      }
    }
  } catch (error) {
    console.error("Errore conversione Gemini streaming:", error);
    throw new Error("Errore durante la conversione AI");
  }
}
