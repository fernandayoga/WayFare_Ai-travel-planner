"use client";

import { useState } from "react";
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
      toast({ title: "Trip updated", variant: "success" });
      setEditOpen(false);
      router.refresh();
    } catch {
      toast({ title: "Couldn't save changes", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/trips/${tripId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast({ title: "Trip deleted", variant: "success" });
      router.push("/trips");
      router.refresh();
    } catch {
      toast({ title: "Couldn't delete this trip", variant: "destructive" });
      setDeleting(false);
    }
  }

  async function handleRegenerate() {
    setRegenerating(true);
    try {
      const res = await fetch(`/api/trips/${tripId}/regenerate`, { method: "POST" });
      if (!res.ok) throw new Error();
      toast({ title: "Itinerary regenerated", variant: "success" });
      router.refresh();
    } catch {
      toast({ title: "Regeneration failed", variant: "destructive" });
    } finally {
      setRegenerating(false);
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
            <Pencil className="mr-2 h-4 w-4" /> Edit details
          </DropdownMenuItem>
          {status !== "generating" && (
            <DropdownMenuItem onSelect={handleRegenerate} disabled={regenerating}>
              {regenerating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCcw className="mr-2 h-4 w-4" />
              )}
              Regenerate itinerary
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-danger" onSelect={() => setDeleteOpen(true)}>
            <Trash2 className="mr-2 h-4 w-4" /> Delete trip
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit trip details</DialogTitle>
            <DialogDescription>
              Changing these won&rsquo;t regenerate the itinerary automatically.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="edit-destination">Destination</Label>
              <Input
                id="edit-destination"
                value={form.destination}
                onChange={(e) => setForm({ ...form, destination: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="edit-travelers">Travelers</Label>
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
              Cancel
            </Button>
            <Button variant="primary" onClick={saveEdit} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this trip?</DialogTitle>
            <DialogDescription>
              This permanently deletes the itinerary and budget for {destination}. This can&rsquo;t be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting && <Loader2 className="h-4 w-4 animate-spin" />}
              Delete trip
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
