"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Loader2, MoreVertical, Pencil, RefreshCcw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

export function TripActions({
  tripId,
  destination,
  travelers,
  budget,
  currency,
  status,
}: {
  tripId: string;
  destination: string;
  travelers: number;
  budget: number;
  currency: string;
  status: "generating" | "ready" | "error";
}) {
  const router = useRouter();
  const { toast } = useToast();

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const [form, setForm] = useState({
    destination,
    travelers: String(travelers),
    budget: String(budget),
  });

  async function saveEdit() {
    setSaving(true);
    try {
      const res = await fetch(`/api/trips/${tripId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination: form.destination,
          travelers: Number(form.travelers),
          budget: Number(form.budget),
        }),
      });
      if (!res.ok) throw new Error();
      toast({ title: "Trip diperbarui", variant: "success" });
      setEditOpen(false);
      router.refresh();
    } catch {
      toast({ title: "Tidak dapat menyimpan perubahan", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/trips/${tripId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast({ title: "Trip dihapus", variant: "success" });
      router.push("/trips");
      router.refresh();
    } catch {
      toast({ title: "Tidak dapat menghapus trip ini", variant: "destructive" });
      setDeleting(false);
    }
  }

  async function handleRegenerate() {
    setRegenerating(true);
    abortControllerRef.current = new AbortController();
    try {
      const res = await fetch(`/api/trips/${tripId}/regenerate`, { 
        method: "POST",
        signal: abortControllerRef.current.signal
      });
      if (!res.ok) throw new Error();
      toast({ title: "Itinerary dibuat ulang", variant: "success" });
      router.refresh();
    } catch (err: any) {
      if (err.name === 'AbortError') {
        toast({ title: "Dibatalkan", description: "Proses dibatalkan.", variant: "default" });
      } else {
        toast({ title: "Pembuatan ulang gagal", variant: "destructive" });
      }
    } finally {
      setRegenerating(false);
      abortControllerRef.current = null;
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => setEditOpen(true)}>
            <Pencil className="mr-2 h-4 w-4" /> Edit detail
          </DropdownMenuItem>
          {status !== "generating" && (
            <DropdownMenuItem onSelect={handleRegenerate} disabled={regenerating}>
              {regenerating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCcw className="mr-2 h-4 w-4" />
              )}
              Buat ulang Itinerary
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-danger" onSelect={() => setDeleteOpen(true)}>
            <Trash2 className="mr-2 h-4 w-4" /> Hapus trip
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit detail trip</DialogTitle>
            <DialogDescription>
              Mengubah ini tidak akan membuat ulang Itinerary secara otomatis.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="edit-destination">Tujuan</Label>
              <Input
                id="edit-destination"
                value={form.destination}
                onChange={(e) => setForm({ ...form, destination: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="edit-travelers">Wisatawan</Label>
                <Input
                  id="edit-travelers"
                  type="number"
                  min={1}
                  value={form.travelers}
                  onChange={(e) => setForm({ ...form, travelers: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-budget">Budget ({currency})</Label>
                <Input
                  id="edit-budget"
                  type="number"
                  min={1}
                  value={form.budget}
                  onChange={(e) => setForm({ ...form, budget: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditOpen(false)}>
              Batal
            </Button>
            <Button variant="primary" onClick={saveEdit} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              Simpan perubahan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus trip ini?</DialogTitle>
            <DialogDescription>
              Ini akan menghapus Itinerary dan Budget untuk {destination} secara permanen. Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteOpen(false)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting && <Loader2 className="h-4 w-4 animate-spin" />}
              Hapus trip
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {regenerating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-paper/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4 text-center p-6 bg-paper rounded-xl shadow-lg max-w-sm mx-4">
            <Loader2 className="h-10 w-10 animate-spin text-moss" />
            <div className="space-y-1">
              <p className="text-lg font-medium text-ink">Merancang ulang Itinerary...</p>
              <p className="text-sm text-ink-soft">Tunggu sebentar, AI sedang menyusun jadwal baru untuk Anda.</p>
            </div>
            <Button 
              variant="outline" 
              className="mt-2 w-full"
              onClick={() => abortControllerRef.current?.abort()}
            >
              Batal
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
