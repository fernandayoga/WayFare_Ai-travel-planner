"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

const SUGGESTIONS = [
  "Buat lebih santai",
  "Kurangi Budget 20%",
  "Tambah lebih banyak spot kuliner lokal",
  "Buat hari ke-2 tidak terlalu padat",
];

export function AssistantChat({
  tripId,
  initialMessages,
  disabled,
  onUpdated,
}: {
  tripId: string;
  initialMessages: ChatMessage[];
  disabled?: boolean;
  onUpdated: (trip: {
    title: string;
    summary?: string;
    days: unknown[];
    budgetBreakdown?: unknown;
  }) => void;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function send(message: string) {
    const trimmed = message.trim();
    if (!trimmed || loading || disabled) return;

    setError(null);
    setMessages((m) => [...m, { role: "user", content: trimmed, createdAt: new Date().toISOString() }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`/api/trips/${tripId}/assistant`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Tidak dapat menerapkan perubahan itu");
        if (data.trip) {
          setMessages(
            data.trip.chatHistory.map((m: ChatMessage) => ({
              role: m.role,
              content: m.content,
              createdAt: m.createdAt,
            }))
          );
        }
        return;
      }

      setMessages(
        data.trip.chatHistory.map((m: ChatMessage) => ({
          role: m.role,
          content: m.content,
          createdAt: m.createdAt,
        }))
      );
      onUpdated(data.trip);
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-line p-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-moss text-paper">
          <Sparkles className="h-4 w-4" />
        </span>
        <div>
          <p className="text-sm font-medium text-ink">Asisten Trip</p>
          <p className="text-xs text-ink-soft">Minta perubahan dengan bahasa sehari-hari</p>
        </div>
      </div>

      <div ref={scrollRef} className="thin-scroll flex-1 space-y-3 overflow-y-auto p-4">
        {messages.length === 0 && (
          <p className="rounded-md bg-paper-dim p-3 text-sm text-ink-soft">
            Coba minta ubah tempo, ganti aktivitas, atau kurangi Budget - Itinerary akan langsung diperbarui di sini.
          </p>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={cn(
              "max-w-[85%] rounded-md px-3 py-2 text-sm leading-relaxed",
              m.role === "user"
                ? "ml-auto bg-ink text-paper"
                : "bg-paper-dim text-ink"
            )}
          >
            {m.content}
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 rounded-md bg-paper-dim px-3 py-2 text-sm text-ink-soft">
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Memperbarui Itinerary Anda...
          </div>
        )}
      </div>

      {error && <p className="px-4 pb-2 text-xs text-danger">{error}</p>}

      {messages.length === 0 && (
        <div className="flex flex-wrap gap-1.5 px-4 pb-3">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              disabled={disabled || loading}
              className="rounded-full border border-line px-2.5 py-1 text-xs text-ink-soft hover:bg-paper-dim disabled:opacity-50"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex items-end gap-2 border-t border-line p-3"
      >
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send(input);
            }
          }}
          placeholder={disabled ? "Tersedia setelah Itinerary siap" : "contoh: Buat hari ke-3 lebih santai"}
          disabled={disabled || loading}
          className="min-h-[42px] resize-none"
          rows={1}
        />
        <Button type="submit" size="icon" variant="primary" disabled={disabled || loading || !input.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
