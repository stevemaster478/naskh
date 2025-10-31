import { ArrowDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConversionButtonProps {
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export default function ConversionButton({
  onClick,
  loading = false,
  disabled = false,
}: ConversionButtonProps) {
  return (
    <div className="flex justify-center my-6">
      <Button
        onClick={onClick}
        disabled={disabled || loading}
        data-testid="button-convert"
        size="lg"
        className="px-12 py-6 text-base font-semibold rounded-full shadow-md hover:shadow-lg transition-all"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Conversione...
          </>
        ) : (
          <>
            <ArrowDown className="mr-2 h-5 w-5" />
            Converti
          </>
        )}
      </Button>
    </div>
  );
}
