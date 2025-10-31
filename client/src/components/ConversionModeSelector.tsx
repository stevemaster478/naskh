import { useState } from "react";

export type ConversionMode = "latin-to-din" | "arabic-to-din" | "latin-to-arabic";

interface ConversionModeSelectorProps {
  value: ConversionMode;
  onChange: (mode: ConversionMode) => void;
}

const modes: { value: ConversionMode; label: string }[] = [
  { value: "latin-to-din", label: "Latino → DIN" },
  { value: "arabic-to-din", label: "Arabo → DIN" },
  { value: "latin-to-arabic", label: "Latino → Arabo" },
];

export default function ConversionModeSelector({
  value,
  onChange,
}: ConversionModeSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center" data-testid="conversion-mode-selector">
      {modes.map((mode) => (
        <button
          key={mode.value}
          onClick={() => onChange(mode.value)}
          data-testid={`mode-${mode.value}`}
          className={`
            px-6 py-2.5 rounded-lg font-medium transition-all text-sm md:text-base
            ${
              value === mode.value
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-transparent text-foreground hover-elevate active-elevate-2"
            }
          `}
        >
          {mode.label}
        </button>
      ))}
    </div>
  );
}
