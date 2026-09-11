import { MarketingNav } from "@/components/layout/marketing-nav";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <MarketingNav />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-8 text-sm text-ink-soft sm:flex-row">
          <p>© {new Date().getFullYear()} Wayfare. Plan smarter, wander further.</p>
        </div>
      </footer>
    </div>
  );
}
