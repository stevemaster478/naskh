import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";

interface InputTextAreaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  mode: "latin-to-din" | "arabic-to-din" | "latin-to-arabic";
}

export default function InputTextArea({
  value,
  onChange,
  placeholder,
  mode,
}: InputTextAreaProps) {
  const [dir, setDir] = useState<"ltr" | "rtl">("ltr");

  useEffect(() => {
    const hasArabic = /[\u0600-\u06FF]/.test(value);
    const isArabicMode = mode === "arabic-to-din";
    setDir(hasArabic || isArabicMode ? "rtl" : "ltr");
  }, [value, mode]);

  const charCount = value.length;

  return (
    <div className="relative">
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        dir={dir}
        data-testid="input-text"
        className={`min-h-[200px] text-lg leading-relaxed resize-none ${
          dir === "rtl" ? "font-arabic" : "font-latin"
        }`}
      />
      <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">
        {charCount} caratteri
      </div>
    </div>
  );
}
