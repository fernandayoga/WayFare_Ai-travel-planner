"use client";

import { useToast, ToastProvider } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";

function ToastList() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className={cn(
            "flex items-start gap-2.5 rounded-md border bg-card p-3.5 shadow-lg",
            t.variant === "destructive" && "border-danger/30",
            t.variant === "success" && "border-moss/30",
            (!t.variant || t.variant === "default") && "border-line"
          )}
        >
          {t.variant === "destructive" ? (
            <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-danger" />
          ) : t.variant === "success" ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-moss" />
          ) : (
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-ink-soft" />
          )}
          <div className="flex-1">
            <p className="text-sm font-medium text-ink">{t.title}</p>
            {t.description && (
              <p className="mt-0.5 text-xs text-ink-soft">{t.description}</p>
            )}
          </div>
          <button
            onClick={() => dismiss(t.id)}
            className="text-ink-soft/60 hover:text-ink-soft"
            aria-label="Dismiss"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}

export function Toaster() {
  return <ToastList />;
}

export { ToastProvider };
