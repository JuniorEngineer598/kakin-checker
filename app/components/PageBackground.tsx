import type { ReactNode } from "react";

export default function PageBackground({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <main
      className={`relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-white to-slate-50 ${className}`}
    >
      <div className="pointer-events-none absolute -left-28 -top-32 h-80 w-80 rounded-full bg-blue-100/45 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-28 w-full bg-blue-100/55 [clip-path:ellipse(74%_70%_at_50%_100%)]" />
      <div className="relative z-10">{children}</div>
    </main>
  );
}
