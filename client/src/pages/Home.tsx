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

export default function Home() {
  const [mode, setMode] = useState<ConversionMode>("latin-to-din");
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAI, setIsAI] = useState(false);

  const placeholders = {
    "latin-to-din": "Inserisci testo latino (es. hadith, salah, rasoul)...",
    "arabic-to-din": "أدخل النص العربي (مثل حديث، صلاة، رسول)...",
    "latin-to-arabic": "Inserisci testo latino (es. hadith, salah, ilm)...",
  };

  const handleConvert = async () => {
    if (!inputText.trim()) return;

    setLoading(true);
    console.log("Conversione iniziata:", { mode, inputText });

    await new Promise((resolve) => setTimeout(resolve, 1500));

    //todo: remove mock functionality - replace with actual API call
    const mockConversions: Record<ConversionMode, string> = {
      "latin-to-din": "ḥadīṯ, ṣalāh, rasūl",
      "arabic-to-din": "ḥadīṯ, ṣalāh, rasūl",
      "latin-to-arabic": "حديث، صلاة، علم",
    };

    setOutputText(mockConversions[mode] || inputText);
    setIsAI(Math.random() > 0.5);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-6 md:px-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-arabic">
              Benvenuto su Naṣkh
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
