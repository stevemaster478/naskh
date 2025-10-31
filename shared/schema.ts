import { z } from "zod";

export const conversionModeSchema = z.enum([
  "latin-to-din",
  "arabic-to-din",
  "latin-to-arabic",
]);

export type ConversionMode = z.infer<typeof conversionModeSchema>;

export const conversionRequestSchema = z.object({
  text: z.string().min(1, "Il testo non può essere vuoto"),
  mode: conversionModeSchema,
});

export type ConversionRequest = z.infer<typeof conversionRequestSchema>;

export const conversionResponseSchema = z.object({
  result: z.string(),
  source: z.enum(["dictionary", "ai"]),
  mode: conversionModeSchema,
});

export type ConversionResponse = z.infer<typeof conversionResponseSchema>;

export interface ConversionLog {
  id: string;
  timestamp: Date;
  inputText: string;
  outputText: string;
  mode: ConversionMode;
  source: "dictionary" | "ai";
}
