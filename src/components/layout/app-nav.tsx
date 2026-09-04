"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LogOut, Map, Plus, LayoutGrid } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { cn, initials } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { href: "/trips", label: "My Trips", icon: Map },
];

export function AppNav({ userName, userEmail }: { userName: string; userEmail: string }) {
  const pathname = usePathname();

  return (
    <header className="border-b border-line bg-paper/90 backdrop-blur sticky top-0 z-40">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Logo />
          <nav className="hidden items-center gap-1 sm:flex">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href || pathname.startsWith(link.href + "/");
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                    active ? "bg-moss-tint text-moss-dark" : "text-ink-soft hover:text-ink"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild size="sm" variant="primary">
            <Link href="/trips/new">
              <Plus className="h-4 w-4" />
              New trip
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-xs font-semibold text-paper"
                aria-label="Account menu"
              >
                {initials(userName || userEmail)}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium text-ink">{userName}</p>
                <p className="truncate text-xs text-ink-soft">{userEmail}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-danger"
                onSelect={() => signOut({ callbackUrl: "/" })}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <nav className="flex items-center gap-1 overflow-x-auto border-t border-line px-6 py-2 sm:hidden">
        {NAV_LINKS.map((link) => {
          const active = pathname === link.href || pathname.startsWith(link.href + "/");
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium",
                active ? "bg-moss-tint text-moss-dark" : "text-ink-soft"
              )}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
