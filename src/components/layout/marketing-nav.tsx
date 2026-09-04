import Link from "next/link";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";

export function MarketingNav() {
  return (
    <header className="border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Logo />
        <nav className="hidden items-center gap-8 text-sm text-ink-soft md:flex">
          <a href="#how-it-works" className="hover:text-ink">How it works</a>
          <a href="#features" className="hover:text-ink">Features</a>
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link href="/login">Log in</Link>
          </Button>
          <Button asChild variant="primary" size="sm">
            <Link href="/register">Start planning</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
