import { useEffect, useMemo, useState, type ReactNode } from "react";
import { WEEKDAYS } from "@/lib/unrot-data";

export function Screen({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`animate-rise px-5 pb-28 pt-6 ${className}`}>{children}</div>;
}

export function PrimaryButton({
  children,
  onClick,
  disabled,
  tone = "primary",
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  tone?: "primary" | "accent" | "ghost";
}) {
  const tones = {
    primary: "surface-hero text-primary-foreground shadow-lift",
    accent: "surface-streak text-accent-foreground shadow-lift",
    ghost: "bg-card text-foreground border border-border",
  } as const;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full rounded-2xl px-5 py-4 text-base font-bold tracking-tight transition active:scale-[0.98] disabled:opacity-40 ${tones[tone]}`}
    >
      {children}
    </button>
  );
}

export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
      <div
        className="h-full rounded-full surface-hero transition-[width] duration-500 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

export function StreakPill({ day }: { day: number }) {
  return (
    <span className="animate-flame inline-flex items-center gap-1.5 rounded-full surface-streak px-3 py-1.5 text-sm font-extrabold text-accent-foreground">
      Day {day} 🔥
    </span>
  );
}

export function WeekStrip({ completed, animateIndex }: { completed: number; animateIndex?: number }) {
  return (
    <div className="flex justify-between gap-1.5">
      {WEEKDAYS.map((d, i) => {
        const filled = i < completed;
        return (
          <div key={d} className="flex flex-1 flex-col items-center gap-1.5">
            <span className="text-[11px] font-semibold text-muted-foreground">{d}</span>
            <div
              className={`grid aspect-square w-full max-w-11 place-items-center rounded-xl text-sm font-bold ${
                filled
                  ? "surface-streak text-accent-foreground"
                  : "border-2 border-dashed border-border bg-card text-muted-foreground"
              } ${animateIndex === i ? "animate-pop" : ""}`}
            >
              {filled ? "🔥" : ""}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 34 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
        dur: 1.6 + Math.random() * 1.2,
        color: ["var(--accent)", "var(--primary)", "oklch(0.72 0.18 340)", "oklch(0.78 0.17 145)"][i % 4],
        size: 6 + Math.random() * 7,
      })),
    [],
  );
  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
      {pieces.map((p) => (
        <span
          key={p.id}
          style={{
            left: `${p.left}%`,
            top: "-6vh",
            width: p.size,
            height: p.size * 1.6,
            background: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.dur}s`,
          }}
          className="absolute rounded-[2px]"
          // eslint-disable-next-line react/no-unknown-property
          data-confetti
        />
      ))}
      <style>{`[data-confetti]{animation-name:unrot-fall;animation-timing-function:linear;animation-fill-mode:forwards;}`}</style>
    </div>
  );
}

export function useCountdown(targetMs: number) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const left = Math.max(0, targetMs - now);
  const h = Math.floor(left / 3_600_000);
  const m = Math.floor((left % 3_600_000) / 60_000);
  const s = Math.floor((left % 60_000) / 1000);
  return `${h}h ${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`;
}
