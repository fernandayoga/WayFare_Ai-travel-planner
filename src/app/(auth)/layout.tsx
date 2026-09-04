
import { Logo } from "@/components/layout/logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper px-6 py-12">
      <Logo className="mb-8" />
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
