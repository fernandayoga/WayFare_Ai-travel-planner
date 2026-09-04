"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, ArrowRight, MapPin, Wallet, Sparkles, Heart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { createTripSchema, type CreateTripInput } from "@/lib/validations";
import { INTEREST_OPTIONS, TRAVEL_STYLE_OPTIONS, CURRENCY_OPTIONS } from "@/components/trips/interest-options";
import { useToast } from "@/components/ui/use-toast";
import type { Interest, TravelStyle } from "@/models/Trip";

const STEPS = [
  { key: "destination", label: "Tujuan", icon: MapPin },
  { key: "budget", label: "Wisatawan & Budget", icon: Wallet },
  { key: "style", label: "Gaya liburan", icon: Sparkles },
  { key: "interests", label: "Minat", icon: Heart },
] as const;

const LOADING_MESSAGES = [
  "Mempelajari destinasi Anda...",
  "Menyeimbangkan jadwal dan waktu istirahat...",
  "Menghitung estimasi biaya...",
  "Menyusun Itinerary harian...",
  "Memastikan Budget tetap sesuai...",
];

type FormState = {
  destination: string;
  startDate: string;
  endDate: string;
  travelers: string;
  budget: string;
  currency: (typeof CURRENCY_OPTIONS)[number];
  travelStyle: TravelStyle | "";
  interests: Interest[];
};

const initialState: FormState = {
  destination: "",
  startDate: "",
  endDate: "",
  travelers: "2",
  budget: "",
  currency: "USD",
  travelStyle: "",
  interests: [],
};

export function CreateTripForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(initialState);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);

  useEffect(() => {
    if (!submitting) return;
    const interval = setInterval(() => {
      setLoadingMsgIndex((i) => (i + 1) % LOADING_MESSAGES.length);
    }, 2600);
    return () => clearInterval(interval);
  }, [submitting]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function toggleInterest(interest: Interest) {
    setForm((f) => ({
      ...f,
      interests: f.interests.includes(interest)
        ? f.interests.filter((i) => i !== interest)
        : [...f.interests, interest],
    }));
  }

  function validateStep(index: number): string | null {
    if (index === 0) {
      if (!form.destination.trim()) return "Beritahu kami tujuan Anda";
      if (!form.startDate || !form.endDate) return "Pilih tanggal perjalanan Anda";
      if (new Date(form.endDate) < new Date(form.startDate))
        return "Tanggal selesai harus sama atau setelah tanggal mulai";
    }
    if (index === 1) {
      if (!form.travelers || Number(form.travelers) < 1) return "Minimal 1 orang";
      if (!form.budget || Number(form.budget) <= 0) return "Masukkan Budget lebih besar dari 0";
    }
    if (index === 2) {
      if (!form.travelStyle) return "Pilih gaya liburan";
    }
    if (index === 3) {
      if (form.interests.length === 0) return "Pilih minimal satu minat";
    }
    return null;
  }

  function goNext() {
    const err = validateStep(step);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function goBack() {
    setError(null);
    setStep((s) => Math.max(s - 1, 0));
  }

  async function handleSubmit() {
    const err = validateStep(3);
    if (err) {
      setError(err);
      return;
    }

    const payload: CreateTripInput = {
      destination: form.destination.trim(),
      startDate: form.startDate,
      endDate: form.endDate,
      travelers: Number(form.travelers),
      budget: Number(form.budget),
      currency: form.currency,
      travelStyle: form.travelStyle as TravelStyle,
      interests: form.interests,
    };

    const parsed = createTripSchema.safeParse(payload);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Periksa kembali detail Anda dan coba lagi");
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Tidak dapat membuat trip ini");
        setSubmitting(false);
        return;
      }

      if (data.status === "error") {
        toast({
          title: "AI perencana mengalami kendala",
          description: "Anda bisa mencoba membuat ulang dari halaman trip.",
          variant: "destructive",
        });
      } else {
        toast({ title: "Itinerary siap", description: "Perjalanan Anda telah direncanakan.", variant: "success" });
      }

      router.push(`/trips/${data.id}`);
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
      setSubmitting(false);
    }
  }

  if (submitting) {
    return (
      <Card className="flex flex-col items-center justify-center gap-4 px-8 py-20 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-moss" />
        <div>
          <p className="font-display text-xl text-ink">Merencanakan {form.destination}</p>
          <p className="mt-1 text-sm text-ink-soft">{LOADING_MESSAGES[loadingMsgIndex]}</p>
        </div>
        <p className="max-w-xs text-xs text-ink-soft/70">
          Biasanya membutuhkan 10–30 detik. Mohon jangan tutup tab ini.
        </p>
      </Card>
    );
  }

  return (
    <div>
      <ol className="mb-8 flex items-center gap-2">
        {STEPS.map((s, i) => (
          <li key={s.key} className="flex flex-1 items-center gap-2">
            <div
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-medium",
                i < step && "border-moss bg-moss text-paper",
                i === step && "border-moss text-moss",
                i > step && "border-line text-ink-soft/60"
              )}
            >
              <s.icon className="h-3.5 w-3.5" />
            </div>
            <span
              className={cn(
                "hidden text-xs font-medium sm:inline",
                i === step ? "text-ink" : "text-ink-soft/60"
              )}
            >
              {s.label}
            </span>
            {i < STEPS.length - 1 && <span className="hairline flex-1" />}
          </li>
        ))}
      </ol>

      <Card className="p-6 sm:p-8">
        {step === 0 && (
          <div className="space-y-5">
            <div>
              <h2 className="font-display text-xl text-ink">Ke mana tujuan Anda?</h2>
              <p className="text-sm text-ink-soft">Bisa berupa nama kota, wilayah, atau negara.</p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="destination">Tujuan</Label>
              <Input
                id="destination"
                placeholder="contoh: Kyoto, Jepang"
                value={form.destination}
                onChange={(e) => update("destination", e.target.value)}
                autoFocus
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="startDate">Tanggal mulai</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={form.startDate}
                  onChange={(e) => update("startDate", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="endDate">Tanggal selesai</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={form.endDate}
                  onChange={(e) => update("endDate", e.target.value)}
                  min={form.startDate || undefined}
                />
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5">
            <div>
              <h2 className="font-display text-xl text-ink">Wisatawan &amp; Budget</h2>
              <p className="text-sm text-ink-soft">Budget ini mencakup keseluruhan pengeluaran semua wisatawan.</p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="travelers">Jumlah wisatawan</Label>
              <Input
                id="travelers"
                type="number"
                min={1}
                max={30}
                value={form.travelers}
                onChange={(e) => update("travelers", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-[1fr_auto] gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="budget">Total Budget</Label>
                <Input
                  id="budget"
                  type="number"
                  min={1}
                  placeholder="e.g. 2000"
                  value={form.budget}
                  onChange={(e) => update("budget", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="currency">Mata uang</Label>
                <Select value={form.currency} onValueChange={(v) => update("currency", v as FormState["currency"])}>
                  <SelectTrigger id="currency" className="w-28">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCY_OPTIONS.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h2 className="font-display text-xl text-ink">Bagaimana gaya liburan Anda?</h2>
              <p className="text-sm text-ink-soft">Ini akan menentukan sepadat apa jadwal setiap harinya.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {TRAVEL_STYLE_OPTIONS.map((opt) => (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => update("travelStyle", opt.value)}
                  className={cn(
                    "rounded-md border p-4 text-left transition-colors",
                    form.travelStyle === opt.value
                      ? "border-moss bg-moss-tint"
                      : "border-line hover:bg-paper-dim"
                  )}
                >
                  <p className="font-medium text-ink">{opt.label}</p>
                  <p className="mt-1 text-xs text-ink-soft">{opt.body}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <div>
              <h2 className="font-display text-xl text-ink">Apa saja minat Anda?</h2>
              <p className="text-sm text-ink-soft">Pilih sebanyak yang cocok - ini akan menentukan jenis aktivitasnya.</p>
            </div>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {INTEREST_OPTIONS.map((opt) => {
                const checked = form.interests.includes(opt.value);
                return (
                  <label
                    key={opt.value}
                    className={cn(
                      "flex cursor-pointer items-center gap-2 rounded-md border p-3 text-sm transition-colors",
                      checked ? "border-moss bg-moss-tint" : "border-line hover:bg-paper-dim"
                    )}
                  >
                    <Checkbox
                      checked={checked}
                      onCheckedChange={() => toggleInterest(opt.value)}
                    />
                    <opt.icon className="h-4 w-4 text-ink-soft" />
                    {opt.label}
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {error && (
          <p className="mt-5 rounded-md bg-danger-tint px-3 py-2 text-sm text-danger">{error}</p>
        )}

        <div className="mt-8 flex items-center justify-between">
          <Button type="button" variant="ghost" onClick={goBack} disabled={step === 0}>
            <ArrowLeft className="h-4 w-4" /> Kembali
          </Button>
          {step < STEPS.length - 1 ? (
            <Button type="button" variant="primary" onClick={goNext}>
              Lanjut <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button type="button" variant="primary" onClick={handleSubmit}>
              <Sparkles className="h-4 w-4" /> Buat Itinerary
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
