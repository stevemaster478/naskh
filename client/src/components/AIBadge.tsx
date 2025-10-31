import { Sparkles, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AIBadgeProps {
  isAI: boolean;
}

export default function AIBadge({ isAI }: AIBadgeProps) {
  if (isAI) {
    return (
      <Badge
        variant="secondary"
        data-testid="badge-ai"
        className="bg-accent/20 text-accent-foreground border-accent/30"
      >
        <Sparkles className="h-3 w-3 mr-1" />
        Conversione AI
      </Badge>
    );
  }

  return (
    <Badge
      variant="secondary"
      data-testid="badge-dictionary"
      className="bg-muted text-muted-foreground"
    >
      <BookOpen className="h-3 w-3 mr-1" />
      Dizionario
    </Badge>
  );
}
