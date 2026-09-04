import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, AlertTriangle } from "lucide-react";

export function StatusBadge({ status }: { status: "generating" | "ready" | "error" }) {
  if (status === "generating") {
    return (
      <Badge variant="gold">
        <Loader2 className="h-3 w-3 animate-spin" /> Generating
      </Badge>
    );
  }
  if (status === "error") {
    return (
      <Badge variant="danger">
        <AlertTriangle className="h-3 w-3" /> Failed
      </Badge>
    );
  }
  return (
    <Badge variant="default">
      <CheckCircle2 className="h-3 w-3" /> Ready
    </Badge>
  );
}
