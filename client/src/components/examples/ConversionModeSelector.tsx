import { useState } from "react";
import ConversionModeSelector, { type ConversionMode } from "../ConversionModeSelector";

export default function ConversionModeSelectorExample() {
  const [mode, setMode] = useState<ConversionMode>("latin-to-din");

  return (
    <div className="p-8">
      <ConversionModeSelector value={mode} onChange={setMode} />
      <p className="mt-4 text-center text-sm text-muted-foreground">
        Modalità selezionata: {mode}
      </p>
    </div>
  );
}
