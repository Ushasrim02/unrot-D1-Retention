import { useEffect, useRef, useState } from "react";
import {
  Confetti,
  PrimaryButton,
  ProgressBar,
  Screen,
  StreakPill,
  WeekStrip,
  useCountdown,
} from "./bits";
import {
  GOALS,
  GOAL_EMOJI,
  LEVELS,
  ROLES,
  ROLE_EMOJI,
  type Answers,
  type Goal,
  type Lesson,
  type Level,
  type Path,
  type Role,
} from "@/lib/unrot-data";

/* ---------------- 1. Onboarding quiz ---------------- */

export function Onboarding({ onDone }: { onDone: (a: Answers) => void }) {
  const [step, setStep] = useState(0);
  const [role, setRole] = useState<Role | null>(null);
  const [goal, setGoal] = useState<Goal | null>(null);

  const questions = [
    { q: "What's your role?", sub: "So we can pick examples from your world." },
    { q: "Why are you here?", sub: "This shapes your whole 5-minute path." },
    { q: "How much do you already know about AI?", sub: "No wrong answer — it sets the depth." },
  ];

  const pick = (fn: () => void) => {
    fn();
    setTimeout(() => setStep((s) => s + 1), 220);
  };

  return (
    <Screen>
      <div className="mb-8 flex items-center gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`h-2 flex-1 rounded-full transition-all duration-300 ${
              i <= step ? "surface-hero" : "bg-secondary"
            }`}
          />
        ))}
        <span className="ml-2 text-xs font-bold text-muted-foreground">{step + 1}/3</span>
      </div>

      <div key={step} className="animate-rise">
        <h1 className="text-[28px] font-extrabold leading-tight tracking-tight">{questions[step]!.q}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{questions[step]!.sub}</p>

        <div className="mt-7 space-y-3">
          {step === 0 &&
            ROLES.map((r) => (
              <Choice key={r} emoji={ROLE_EMOJI[r]} label={r} onClick={() => pick(() => setRole(r))} />
            ))}
          {step === 1 &&
            GOALS.map((g) => (
              <Choice key={g} emoji={GOAL_EMOJI[g]} label={g} onClick={() => pick(() => setGoal(g))} />
            ))}
          {step === 2 &&
            LEVELS.map((l, i) => (
              <Choice
                key={l}
                emoji={["🌱", "🌿", "🌳"][i]!}
                label={l}
                onClick={() => onDone({ role: role!, goal: goal!, level: l as Level })}
              />
            ))}
        </div>
      </div>
    </Screen>
  );
}

function Choice({ emoji, label, onClick }: { emoji: string; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="tap-card flex w-full items-center gap-3 px-4 py-4 text-left"
    >
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary-soft text-lg">
        {emoji}
      </span>
      <span className="min-w-0 text-[17px] font-bold tracking-tight">{label}</span>
    </button>
  );
}

/* ---------------- Personalizing loader ---------------- */

export function Personalizing() {
  const lines = ["Reading your answers…", "Matching lesson topics…", "Building your 7-day path…"];
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % lines.length), 500);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-8 text-center">
      <div className="size-16 animate-spin rounded-full border-4 border-secondary border-t-primary" />
      <h2 className="mt-6 text-xl font-extrabold tracking-tight">Personalizing your path…</h2>
      <p className="mt-2 h-5 text-sm text-muted-foreground">{lines[i]}</p>
    </div>
  );
}

/* ---------------- Path summary ---------------- */

export function PathSummary({
  answers,
  path,
  onStart,
}: {
  answers: Answers;
  path: Path;
  onStart: () => void;
}) {
  return (
    <Screen>
      <span className="inline-flex rounded-full bg-primary-soft px-3 py-1 text-xs font-bold text-primary">
        Your path is ready
      </span>
      <h1 className="mt-4 text-[30px] font-extrabold leading-tight tracking-tight">
        Here's your path, {answers.role.split(" / ")[0]}.
      </h1>
      <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
        Because you're a <b className="text-foreground">{answers.role}</b> focused on{" "}
        <b className="text-foreground">{answers.goal.toLowerCase()}</b> at a{" "}
        <b className="text-foreground">{answers.level.toLowerCase()}</b> level, we've picked lessons on:
      </p>
      <div className="mt-5 space-y-3">
        {path.topics.map((t, i) => (
          <div key={t} className="tap-card flex items-center gap-3 px-4 py-3.5">
            <span className="grid size-8 shrink-0 place-items-center rounded-lg surface-hero text-sm font-bold text-primary-foreground">
              {i + 1}
            </span>
            <span className="text-[15px] font-semibold">{t}</span>
          </div>
        ))}
      </div>
      <div className="mt-6 rounded-2xl bg-primary-soft p-4 text-sm font-medium text-primary">
        ⏱️ 5 minutes a day. That's the whole commitment.
      </div>
      <div className="mt-6">
        <PrimaryButton onClick={onStart}>Start lesson 1</PrimaryButton>
      </div>
    </Screen>
  );
}

/* ---------------- 2. Lesson ---------------- */

export function LessonScreen({
  lesson,
  dayNumber,
  onComplete,
}: {
  lesson: Lesson;
  dayNumber: number;
  onComplete: () => void;
}) {
  const [shown, setShown] = useState(1);
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [picked, setPicked] = useState<Record<number, number>>({});
  const [done, setDone] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const total = lesson.blocks.length;
  const progress = done ? 100 : (shown / total) * 100;

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [shown, done]);

  if (done) {
    return (
      <>
        <Confetti />
        <div className="flex min-h-[75vh] flex-col items-center justify-center px-8 text-center">
          <div className="animate-pop grid size-24 place-items-center rounded-full surface-hero text-5xl text-primary-foreground">
            ✅
          </div>
          <h2 className="animate-rise mt-6 text-[28px] font-extrabold tracking-tight">Lesson complete</h2>
          <p className="mt-2 text-sm text-muted-foreground">{lesson.title}</p>
          <div className="mt-6 animate-pop">
            <StreakPill day={dayNumber} />
          </div>
          <p className="mt-3 text-sm font-semibold text-muted-foreground">
            {dayNumber === 1 ? "Your streak just started." : "Streak extended. Keep it alive."}
          </p>
          <div className="mt-8 w-full">
            <PrimaryButton onClick={onComplete}>Continue</PrimaryButton>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="sticky top-0 z-20 bg-[oklch(0.965_0.01_285)]/90 px-5 pb-3 pt-4 backdrop-blur">
        <div className="mb-2 flex items-center justify-between text-xs font-bold text-muted-foreground">
          <span className="truncate pr-3">{lesson.topic}</span>
          <span className="shrink-0">
            {Math.min(shown, total)}/{total} · {lesson.minutes} min
          </span>
        </div>
        <ProgressBar value={progress} />
      </div>

      <Screen className="pt-2">
        <h1 className="text-[26px] font-extrabold leading-tight tracking-tight">{lesson.title}</h1>

        <div className="mt-6 space-y-4">
          {lesson.blocks.slice(0, shown).map((b, i) => (
            <div key={i} className="animate-rise">
              {b.kind === "text" && (
                <div className="rounded-2xl bg-card p-5 shadow-card">
                  {b.heading && (
                    <h3 className="mb-2 text-[13px] font-extrabold uppercase tracking-widest text-primary">
                      {b.heading}
                    </h3>
                  )}
                  <p className="text-[17px] leading-relaxed">{b.body}</p>
                </div>
              )}
              {b.kind === "callout" && (
                <div className="rounded-2xl border-l-4 border-accent bg-accent-soft p-5 text-[16px] font-medium italic leading-relaxed text-accent-foreground">
                  {b.body}
                </div>
              )}
              {b.kind === "reveal" && (
                <button
                  onClick={() => setRevealed((r) => ({ ...r, [i]: true }))}
                  className="tap-card w-full px-5 py-5 text-left"
                >
                  <p className="text-[13px] font-extrabold uppercase tracking-widest text-primary">
                    Check your understanding
                  </p>
                  <p className="mt-2 text-[17px] font-bold leading-snug">{b.prompt}</p>
                  {revealed[i] ? (
                    <p className="animate-rise mt-3 text-[16px] leading-relaxed text-muted-foreground">
                      {b.answer}
                    </p>
                  ) : (
                    <p className="mt-3 text-sm font-semibold text-primary">Tap to reveal →</p>
                  )}
                </button>
              )}
              {b.kind === "quiz" && (
                <div className="rounded-2xl bg-card p-5 shadow-card">
                  <p className="text-[13px] font-extrabold uppercase tracking-widest text-primary">
                    Quick gut check
                  </p>
                  <p className="mt-2 text-[17px] font-bold leading-snug">{b.prompt}</p>
                  <div className="mt-4 space-y-2.5">
                    {b.options.map((o, oi) => {
                      const chosen = picked[i] === oi;
                      const isRight = oi === b.correct;
                      const answered = picked[i] !== undefined;
                      return (
                        <button
                          key={o}
                          onClick={() => setPicked((p) => ({ ...p, [i]: oi }))}
                          className={`w-full rounded-xl border-2 px-4 py-3 text-left text-[15px] font-semibold transition ${
                            answered && isRight
                              ? "border-accent bg-accent-soft text-accent-foreground"
                              : chosen
                                ? "border-border bg-secondary text-muted-foreground"
                                : "border-border bg-card"
                          }`}
                        >
                          {o} {answered && isRight ? "✓" : ""}
                        </button>
                      );
                    })}
                  </div>
                  {picked[i] !== undefined && (
                    <p className="animate-rise mt-3 text-[15px] leading-relaxed text-muted-foreground">
                      {b.why}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <div ref={endRef} className="mt-6">
          {shown < total ? (
            <PrimaryButton onClick={() => setShown((s) => s + 1)}>Next</PrimaryButton>
          ) : (
            <PrimaryButton onClick={() => setDone(true)} tone="accent">
              Finish lesson
            </PrimaryButton>
          )}
        </div>
      </Screen>
    </>
  );
}

/* ---------------- 3. Day-0 hook screen ---------------- */

export function HookScreen({
  path,
  day,
  unlockAt,
  reminder,
  setReminder,
  onFinish,
}: {
  path: Path;
  day: number;
  unlockAt: number;
  reminder: { time: string; channel: "push" | "email"; on: boolean };
  setReminder: (r: { time: string; channel: "push" | "email"; on: boolean }) => void;
  onFinish: () => void;
}) {
  const countdown = useCountdown(unlockAt);
  return (
    <Screen>
      <h1 className="text-[26px] font-extrabold leading-tight tracking-tight">
        Nice work. Here's what's next.
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">One tap to lock in tomorrow.</p>

      <div className="mt-6 overflow-hidden rounded-2xl border-2 border-dashed border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-muted-foreground">
          🔒 Tomorrow · Day {day + 1}
        </div>
        <h3 className="mt-2 text-[19px] font-extrabold leading-snug">{path.teaser.title}</h3>
        <p className="mt-1.5 text-[15px] text-muted-foreground">{path.teaser.hook}</p>
        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1.5 text-sm font-bold text-primary tabular-nums">
          Unlocks in {countdown}
        </div>
      </div>

      <div className="mt-4 rounded-2xl bg-card p-5 shadow-card">
        <h3 className="text-[17px] font-extrabold">When should we remind you?</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          We'll send one short reminder — no spam, just your daily 5 minutes.
        </p>
        <div className="mt-4 flex items-center gap-3">
          <input
            type="time"
            value={reminder.time}
            onChange={(e) => setReminder({ ...reminder, time: e.target.value })}
            className="rounded-xl border-2 border-border bg-background px-3 py-2.5 text-[17px] font-bold tabular-nums"
          />
          <div className="flex flex-1 rounded-xl bg-secondary p-1">
            {(["push", "email"] as const).map((c) => (
              <button
                key={c}
                onClick={() => setReminder({ ...reminder, channel: c })}
                className={`flex-1 rounded-lg py-2 text-sm font-bold capitalize transition ${
                  reminder.channel === c ? "bg-card shadow-card text-primary" : "text-muted-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-2xl bg-card p-5 shadow-card">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-[17px] font-extrabold">Your week</h3>
          <StreakPill day={day} />
        </div>
        <WeekStrip completed={day} animateIndex={day - 1} />
        <p className="mt-3 text-sm text-muted-foreground">
          Reach a 7-day streak to unlock your first badge 🏅
        </p>
      </div>

      <div className="mt-6">
        <PrimaryButton
          onClick={() => {
            setReminder({ ...reminder, on: true });
            onFinish();
          }}
        >
          Set reminder & finish
        </PrimaryButton>
      </div>
    </Screen>
  );
}

/* ---------------- 4. Simulated push notification ---------------- */

export function PushNotification({
  title,
  body,
  time,
  onOpen,
  onDismiss,
}: {
  title: string;
  body: string;
  time: string;
  onOpen: () => void;
  onDismiss: () => void;
}) {
  return (
    <div className="animate-push-in fixed inset-x-0 top-3 z-50 mx-auto w-full max-w-[420px] px-3">
      <div className="rounded-3xl bg-[oklch(0.22_0.03_285/0.92)] p-4 text-left shadow-lift backdrop-blur-xl">
        <button onClick={onOpen} className="block w-full text-left">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-white/60">
            <span className="grid size-4 place-items-center rounded bg-white/20 text-[9px]">U</span>
            Unrot · now · {time}
          </div>
          <p className="mt-1.5 text-[15px] font-extrabold text-white">{title}</p>
          <p className="mt-0.5 text-[14px] leading-snug text-white/75">{body}</p>
        </button>
        <div className="mt-3 flex gap-2">
          <button
            onClick={onOpen}
            className="flex-1 rounded-xl bg-white/95 py-2 text-sm font-bold text-[oklch(0.22_0.03_285)]"
          >
            Open lesson
          </button>
          <button onClick={onDismiss} className="rounded-xl bg-white/10 px-4 py-2 text-sm font-bold text-white/80">
            Later
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- 5. Day 2 dashboard ---------------- */

export function Dashboard({
  answers,
  path,
  day,
  nextLesson,
  onStartLesson,
  onRewards,
}: {
  answers: Answers;
  path: Path;
  day: number;
  nextLesson: Lesson;
  onStartLesson: () => void;
  onRewards: () => void;
}) {
  const remaining = Math.max(0, 7 - day);
  return (
    <Screen>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-muted-foreground">Welcome back</p>
          <h1 className="truncate text-[26px] font-extrabold tracking-tight">Your daily 5</h1>
        </div>
        <button onClick={onRewards} className="shrink-0">
          <StreakPill day={day} />
        </button>
      </div>

      <div className="mt-5 rounded-2xl bg-card p-5 shadow-card">
        <WeekStrip completed={day} animateIndex={day - 1} />
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between text-sm font-bold">
            <span>7-Day Streak Badge 🏅</span>
            <span className="text-muted-foreground">{day}/7</span>
          </div>
          <ProgressBar value={(day / 7) * 100} />
          <p className="mt-2 text-sm text-muted-foreground">
            {remaining} more {remaining === 1 ? "day" : "days"} to your 7-Day Streak Badge
          </p>
        </div>
      </div>

      <h2 className="mt-7 text-[13px] font-extrabold uppercase tracking-widest text-muted-foreground">
        Continue your path
      </h2>
      <button onClick={onStartLesson} className="tap-card mt-3 block w-full p-5 text-left">
        <span className="text-xs font-bold uppercase tracking-widest text-primary">
          Day {day + 1} · {nextLesson.minutes} min
        </span>
        <h3 className="mt-1.5 text-[19px] font-extrabold leading-snug">{nextLesson.title}</h3>
        <span className="mt-3 inline-flex rounded-xl surface-hero px-4 py-2 text-sm font-bold text-primary-foreground">
          Start lesson →
        </span>
      </button>

      <h2 className="mt-7 text-[13px] font-extrabold uppercase tracking-widest text-muted-foreground">
        AI news for {answers.role.split(" / ")[0]}s
      </h2>
      <div className="mt-3 space-y-3">
        {path.news.map((n) => (
          <div key={n.headline} className="rounded-2xl bg-card p-4 shadow-card">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{n.source}</p>
            <p className="mt-1 text-[16px] font-semibold leading-snug">{n.headline}</p>
          </div>
        ))}
      </div>

      {path.interviewQuestion && (
        <>
          <h2 className="mt-7 text-[13px] font-extrabold uppercase tracking-widest text-muted-foreground">
            Interview question of the day
          </h2>
          <div className="mt-3 rounded-2xl border-l-4 border-accent bg-accent-soft p-5">
            <p className="text-[17px] font-semibold leading-snug text-accent-foreground">
              {path.interviewQuestion}
            </p>
          </div>
        </>
      )}
    </Screen>
  );
}

/* ---------------- 6. Rewards dashboard ---------------- */

export function Rewards({
  day,
  longest,
  interviewLessons,
  onBack,
}: {
  day: number;
  longest: number;
  interviewLessons: number;
  onBack: () => void;
}) {
  const score = Math.min(96, 34 + day * 9 + interviewLessons * 6);
  const badges = [
    { name: "7-Day Streak", art: "🏅", unlocked: longest >= 7, need: `${Math.max(0, 7 - longest)} days to go` },
    { name: "30-Day Streak", art: "🏆", unlocked: longest >= 30, need: `${Math.max(0, 30 - longest)} days to go` },
    {
      name: "Interview Ready",
      art: "🎯",
      unlocked: interviewLessons >= 3,
      need: `${Math.max(0, 3 - interviewLessons)} prep lessons to go`,
    },
  ];
  return (
    <Screen>
      <button onClick={onBack} className="text-sm font-bold text-primary">
        ← Back
      </button>
      <h1 className="mt-3 text-[26px] font-extrabold tracking-tight">Your progress</h1>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-2xl surface-streak p-5 text-accent-foreground">
          <p className="text-xs font-bold uppercase tracking-widest opacity-80">Current streak</p>
          <p className="mt-1 text-[34px] font-extrabold leading-none">{day} 🔥</p>
        </div>
        <div className="rounded-2xl bg-card p-5 shadow-card">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Longest</p>
          <p className="mt-1 text-[34px] font-extrabold leading-none">{longest}</p>
        </div>
      </div>

      <div className="mt-4 rounded-2xl bg-card p-6 shadow-card">
        <p className="text-center text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Readiness score
        </p>
        <div className="relative mx-auto mt-4 grid size-40 place-items-center">
          <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90">
            <circle cx="50" cy="50" r="42" fill="none" stroke="var(--secondary)" strokeWidth="10" />
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="var(--primary)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={`${(score / 100) * 264} 264`}
              className="transition-[stroke-dasharray] duration-1000"
            />
          </svg>
          <div className="text-center">
            <p className="text-[38px] font-extrabold leading-none">{score}%</p>
            <p className="text-xs font-semibold text-muted-foreground">interview ready</p>
          </div>
        </div>
      </div>

      <h2 className="mt-7 text-[13px] font-extrabold uppercase tracking-widest text-muted-foreground">
        Badges
      </h2>
      <div className="mt-3 space-y-3">
        {badges.map((b) => (
          <div
            key={b.name}
            className={`flex items-center gap-4 rounded-2xl p-4 ${
              b.unlocked ? "bg-accent-soft" : "bg-card shadow-card"
            }`}
          >
            <span
              className={`grid size-14 shrink-0 place-items-center rounded-2xl text-3xl ${
                b.unlocked ? "surface-streak" : "bg-secondary grayscale opacity-45"
              }`}
            >
              {b.art}
            </span>
            <div className="min-w-0">
              <p className="text-[16px] font-extrabold">{b.name}</p>
              <p className="text-sm text-muted-foreground">{b.unlocked ? "Earned" : `Locked · ${b.need}`}</p>
            </div>
          </div>
        ))}
      </div>
    </Screen>
  );
}
