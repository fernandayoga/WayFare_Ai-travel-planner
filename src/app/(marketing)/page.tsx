import Link from "next/link";
import { ArrowRight, MapPin, Wallet, MessageSquareText, Clock3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DestinationArt } from "@/components/trips/destination-art";

const SAMPLE_DAY = {
  destination: "Kyoto, Jepang",
  theme: "Kuil & Kedai Teh",
  activities: [
    { time: "08:30", title: "Jalur Fushimi Inari Torii", cost: "Gratis", category: "Wisata" },
    { time: "11:00", title: "Wisata kuliner Pasar Nishiki", cost: "$28", category: "Kuliner" },
    { time: "14:00", title: "Upacara minum teh Gion", cost: "$45", category: "Aktivitas" },
    { time: "18:30", title: "Makan malam Kaiseki, gang Pontocho", cost: "$62", category: "Kuliner" },
  ],
};

const STEPS = [
  {
    icon: MapPin,
    title: "Beri tahu Wayfare gambaran perjalanan Anda",
    body: "Tujuan, tanggal, jumlah wisatawan, Budget, gaya liburan, dan minat Anda — kuliner, alam, hiburan malam, apa saja.",
  },
  {
    icon: Clock3,
    title: "Dapatkan rencana harian dalam hitungan menit",
    body: "Sebuah Itinerary lengkap yang dilengkapi jadwal aktivitas, lokasi, durasi, dan estimasi biaya — bukan sekadar saran umum.",
  },
  {
    icon: MessageSquareText,
    title: "Sesuaikan hanya dengan meminta",
    body: '"Buat hari ke-3 lebih santai" atau "kurangi Budget sebesar 20%" — asisten AI akan menyusun ulang rencana dan biayanya sekaligus.',
  },
];

const FEATURES = [
  {
    title: "Struktur harian yang nyata",
    body: "Setiap hari memiliki jadwal aktivitas dengan lokasi, durasi, dan estimasi biaya. Bukan sekadar teks paragraf yang panjang.",
  },
  {
    title: "Budget yang masuk akal",
    body: "Rincian biaya per kategori dibuat bersamaan dengan Itinerary, sehingga Anda bisa melihat ke mana uang Anda dialokasikan.",
  },
  {
    title: "Asisten yang mengedit, bukan cuma mengobrol",
    body: "Minta perubahan dengan bahasa sehari-hari dan Itinerary serta Budget Anda akan otomatis diperbarui - tanpa harus mengulang dari awal.",
  },
  {
    title: "Perjalanan Anda, privasi Anda",
    body: "Setiap perjalanan terhubung ke akun Anda. Hanya Anda yang dapat melihat, mengedit, atau menghapus trip yang Anda buat.",
  },
];

export default function LandingPage() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-14 sm:pt-20">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <h1 className="font-display text-[2.6rem] font-medium leading-[1.08] text-ink sm:text-[3.4rem]">
              Rencana perjalanan utuh,
              <br />
              selesai sembari Anda ngopi.
            </h1>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-ink-soft">
              Wayfare mengubah tujuan, Budget, dan preferensi Anda menjadi sebuah Itinerary
              harian dengan aktivitas, lokasi, dan biaya nyata —
              lalu memungkinkan Anda menyesuaikannya cukup dengan meminta.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" variant="primary">
                <Link href="/register">
                  Rencanakan trip pertama Anda <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
             
            </div>
            <div className="mt-10 flex items-center gap-6 text-xs text-ink-soft">
              <span>Tanpa kartu kredit</span>
              <span className="hairline w-6" />
              <span>Gratis dicoba</span>
              <span className="hairline w-6" />
              <span>Data Anda tetap milik Anda</span>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-xl border border-line bg-card shadow-[0_20px_50px_-25px_rgba(23,35,31,0.35)]">
              <div className="h-28 w-full">
                <DestinationArt destination={SAMPLE_DAY.destination} />
              </div>
              <div className="border-t border-line p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-ink-soft/70">Hari ke-2</p>
                    <p className="font-display text-lg text-ink">{SAMPLE_DAY.theme}</p>
                  </div>
                  <Badge variant="gold">{SAMPLE_DAY.destination}</Badge>
                </div>
                <div className="mt-4 space-y-0">
                  {SAMPLE_DAY.activities.map((a, i) => (
                    <div key={a.title} className="relative flex gap-3 pb-4 pl-1 last:pb-0">
                      {i !== SAMPLE_DAY.activities.length - 1 && (
                        <span className="absolute left-[7px] top-4 h-full w-px bg-line" />
                      )}
                      <span className="relative z-10 mt-1.5 h-3 w-3 shrink-0 rounded-full border-2 border-moss bg-paper" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-medium text-ink">{a.title}</p>
                          <span className="whitespace-nowrap text-xs text-ink-soft">{a.cost}</span>
                        </div>
                        <p className="text-xs text-ink-soft">{a.time} · {a.category}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="border-t border-line bg-paper-dim/60">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="font-display text-2xl font-medium text-ink sm:text-3xl">Cara kerjanya</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {STEPS.map((step, i) => (
              <div key={step.title}>
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-moss text-paper">
                  <step.icon className="h-5 w-5" />
                </div>
                <p className="text-xs font-medium text-gold">Langkah {i + 1}</p>
                <h3 className="mt-1 font-display text-lg text-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-6xl px-6 py-16">
        <div className="max-w-lg">
          <h2 className="font-display text-2xl font-medium text-ink sm:text-3xl">
            Dibuat untuk merencanakan trip, bukan sekadar basa-basi
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            Wayfare fokus pada hasil akhir - dari ide menjadi rencana yang siap dipakai. Struktur Itinerary yang rapi, Budget yang bisa dipercaya, dan kemudahan edit saat rencana Anda berubah.
          </p>
        </div>
        <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2">
          {FEATURES.map((f) => (
            <div key={f.title} className="bg-card p-6">
              <h3 className="font-display text-base text-ink">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 py-16 sm:flex-row sm:items-center">
          <div>
            <Wallet className="mb-3 h-6 w-6 text-gold" />
            <h2 className="font-display text-2xl font-medium text-ink">Siap melihat Itinerary Anda?</h2>
            <p className="mt-1 text-sm text-ink-soft">Hanya butuh semenit untuk memberi tahu kami tentang rencana perjalanan Anda.</p>
          </div>
          <Button asChild size="lg" variant="primary">
            <Link href="/register">
              Buat trip pertama Anda <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
