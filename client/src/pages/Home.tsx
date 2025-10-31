import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ConversionModeSelector, {
  type ConversionMode,
} from "@/components/ConversionModeSelector";
import InputTextArea from "@/components/InputTextArea";
import OutputDisplay from "@/components/OutputDisplay";
import ConversionButton from "@/components/ConversionButton";
import AIBadge from "@/components/AIBadge";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { ConversionResponse } from "@shared/schema";

export default function Home() {
  const [mode, setMode] = useState<ConversionMode>("latin-to-din");
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAI, setIsAI] = useState(false);
  const { toast } = useToast();

  const placeholders = {
    "latin-to-din": "Inserisci testo latino (es. hadith, salah, rasoul)...",
    "arabic-to-din": "أدخل النص العربي (مثل حديث، صلاة، رسول)...",
    "latin-to-arabic": "Inserisci testo latino (es. hadith, salah, ilm)...",
  };

  const handleConvert = async () => {
    if (!inputText.trim()) return;

    setLoading(true);
    setOutputText("");
    console.log("Conversione iniziata:", { mode, inputText });

    try {
      const response = await fetch("/api/convert/stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: inputText,
          mode: mode,
        }),
      });

      if (!response.ok) {
        throw new Error("Errore durante la conversione");
      }

      const contentType = response.headers.get("content-type");
      
      if (contentType?.includes("application/json")) {
        const data = await response.json();
        setOutputText(data.result);
        setIsAI(data.source === "ai");
        
        toast({
          title: "Conversione completata",
          description: data.cached 
            ? "Risultato dalla cache" 
            : data.source === "ai"
              ? "Conversione effettuata con AI" 
              : "Conversione dal dizionario statico",
        });
        setLoading(false);
        return;
      }

      if (contentType?.includes("text/event-stream")) {
        setOutputText("");
        setIsAI(true);
        
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        if (!reader) {
          throw new Error("Stream non disponibile");
        }

        while (true) {
          const { done, value } = await reader.read();
          
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n\n");
          
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const jsonData = line.slice(6);
              try {
                const parsed = JSON.parse(jsonData);
                
                if (parsed.error) {
                  throw new Error(parsed.error);
                }
                
                if (parsed.done) {
                  setOutputText(parsed.fullResult || "");
                  toast({
                    title: "Conversione completata",
                    description: "Conversione effettuata con AI in streaming",
                  });
                } else if (parsed.chunk) {
                  setOutputText((prev) => prev + parsed.chunk);
                }
              } catch (parseError) {
                console.error("Errore parsing SSE:", parseError);
              }
            }
          }
        }

        setLoading(false);
      }
    } catch (error) {
      console.error("Errore conversione:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante la conversione",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-6 md:px-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-arabic">
              Benvenuto su Naskh
            </h2>
            <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              Converti e traslittera testi arabi e latini secondo lo standard
              DIN 31635 con precisione linguistica e rispetto per la scienza islamica
            </p>
          </div>

          <Card className="p-6 md:p-8 mb-8">
            <ConversionModeSelector value={mode} onChange={setMode} />

            <div className="mt-8 space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">
                  Testo di input
                </label>
                <InputTextArea
                  value={inputText}
                  onChange={setInputText}
                  placeholder={placeholders[mode]}
                  mode={mode}
                />
              </div>

              <ConversionButton
                onClick={handleConvert}
                loading={loading}
                disabled={!inputText.trim()}
              />

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-foreground">
                    Risultato
                  </label>
                  {outputText && <AIBadge isAI={isAI} />}
                </div>
                <OutputDisplay value={outputText} mode={mode} />
              </div>
            </div>
          </Card>

          <div className="text-center text-sm text-muted-foreground">
            <p>
              Utilizza questo strumento per uniformare la scrittura delle parole
              arabe in caratteri latini secondo lo standard internazionale DIN 31635
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
