import { useState, useEffect } from "react";
import { Copy, Check } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface OutputDisplayProps {
  value: string;
  mode: "latin-to-din" | "arabic-to-din" | "latin-to-arabic";
}

export default function OutputDisplay({ value, mode }: OutputDisplayProps) {
  const [dir, setDir] = useState<"ltr" | "rtl">("ltr");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const hasArabic = /[\u0600-\u06FF]/.test(value);
    const isArabicOutput = mode === "latin-to-arabic";
    setDir(hasArabic || isArabicOutput ? "rtl" : "ltr");
  }, [value, mode]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <Textarea
        value={value}
        readOnly
        dir={dir}
        data-testid="output-text"
        className={`min-h-[200px] text-lg leading-relaxed resize-none bg-muted/30 ${
          dir === "rtl" ? "font-arabic" : "font-latin"
        }`}
      />
      {value && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCopy}
          data-testid="button-copy"
          className="absolute top-3 right-3 rounded-full"
        >
          {copied ? (
            <Check className="h-4 w-4 text-primary" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
          <span className="sr-only">Copia</span>
        </Button>
      )}
    </div>
  );
}
