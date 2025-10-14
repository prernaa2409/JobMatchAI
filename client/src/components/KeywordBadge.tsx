import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";

interface KeywordBadgeProps {
  keyword: string;
  present: boolean;
}

export default function KeywordBadge({ keyword, present }: KeywordBadgeProps) {
  return (
    <Badge 
      variant={present ? "default" : "secondary"} 
      className="gap-1"
      data-testid={`badge-keyword-${keyword.toLowerCase().replace(/\s+/g, '-')}`}
    >
      {present ? (
        <Check className="h-3 w-3" />
      ) : (
        <X className="h-3 w-3" />
      )}
      {keyword}
    </Badge>
  );
}
