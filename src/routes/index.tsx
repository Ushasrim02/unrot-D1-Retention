import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Dashboard,
  HookScreen,
  LessonScreen,
  Onboarding,
  PathSummary,
  Personalizing,
  PushNotification,
  Rewards,
} from "@/components/unrot/screens";
import { pickPath, type Answers } from "@/lib/unrot-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Unrot – Day 1 · Retention Loop Prototype" },
      {
        name: "description",
        content:
          "Interactive prototype of Unrot's onboarding-to-return loop: 30-second personalization quiz, a 5-minute AI micro-lesson, a Day-0 hook screen, and a Day 2 return.",
      },
      { property: "og:title", content: "Unrot – Day 1 · Retention Loop Prototype" },
      {
        property: "og:description",
        content: "Quiz → first lesson → Day-0 hook → reminder → Day 2 return, in under two minutes.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: UnrotDemo,
});

type Stage =
  | "onboarding"
  | "personalizing"
  | "path"
  | "lesson"
  | "hook"
  | "waiting"
  | "dashboard"
  | "rewards";

const DAY_MS = 24 * 60 * 60 * 1000;

function UnrotDemo() {
  const [stage, setStage] = useState<Stage>("onboarding");
  const [answers, setAnswers] = useState<Answers | null>(null);
  const [day, setDay] = useState(1);
  const [longest, setLongest] = useState(1);
  const [lessonIndex, setLessonIndex] = useState(0);
  const [unlockAt, setUnlockAt] = useState(() => Date.now() + 18 * 3600_000 + 42 * 60_000);
  const [reminder, setReminder] = useState<{ time: string; channel: "push" | "email"; on: boolean }>({
    time: "09:00",
    channel: "push",
    on: false,
  });
  const [notif, setNotif] = useState(false);

  const path = useMemo(() => (answers ? pickPath(answers) : null), [answers]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [stage]);

  const reset = () => {
    setStage("onboarding");
    setAnswers(null);
    setDay(1);
    setLongest(1);
    setLessonIndex(0);
    setNotif(false);
    setReminder({ time: "09:00", channel: "push", on: false });
    setUnlockAt(Date.now() + 18 * 3600_000 + 42 * 60_000);
  };

  const nextDay = () => {
    if (!answers) return;
    setNotif(false);
    if (stage === "onboarding" || stage === "personalizing") return;
    const newDay = day + 1;
    setDay(newDay);
    setLongest((l) => Math.max(l, newDay));
    setLessonIndex((i) => Math.min(i + 1, 1));
    setUnlockAt(Date.now() + DAY_MS);
    setNotif(true);
    setStage("waiting");
  };

  const lesson = path ? path.lessons[Math.min(lessonIndex, path.lessons.length - 1)]! : null;
  const nextLesson = path ? path.lessons[Math.min(lessonIndex, path.lessons.length - 1)]! : null;

  return (
    <main className="mx-auto min-h-screen w-full max-w-[420px] bg-background shadow-lift">
      {notif && path && (
        <PushNotification
          time={reminder.time}
          title={`🔥 Your Day ${day} streak is waiting`}
          body={`Today's lesson: "${path.teaser.title}" (5 min)`}
          onOpen={() => {
            setNotif(false);
            setStage("lesson");
          }}
          onDismiss={() => {
            setNotif(false);
            setStage("dashboard");
          }}
        />
      )}

      {stage === "onboarding" && (
        <Onboarding
          onDone={(a) => {
            setAnswers(a);
            setStage("personalizing");
            setTimeout(() => setStage("path"), 1500);
          }}
        />
      )}

      {stage === "personalizing" && <Personalizing />}

      {stage === "path" && answers && path && (
        <PathSummary answers={answers} path={path} onStart={() => setStage("lesson")} />
      )}

      {stage === "lesson" && lesson && (
        <LessonScreen lesson={lesson} dayNumber={day} onComplete={() => setStage("hook")} />
      )}

      {stage === "hook" && path && (
        <HookScreen
          path={path}
          day={day}
          unlockAt={unlockAt}
          reminder={reminder}
          setReminder={setReminder}
          onFinish={() => setStage("waiting")}
        />
      )}

      {stage === "waiting" && path && (
        <div className="flex min-h-[80vh] flex-col items-center justify-center px-8 text-center">
          <div className="grid size-20 place-items-center rounded-3xl surface-hero text-4xl text-primary-foreground">
            ⏰
          </div>
          <h2 className="mt-6 text-[24px] font-extrabold tracking-tight">
            You're set for tomorrow at {reminder.time}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {notif
              ? "Your reminder just arrived — tap it above."
              : `We'll ${reminder.channel === "push" ? "send a push" : "email you"} when Day ${day + 1} unlocks.`}
          </p>
          <p className="mt-6 text-xs font-semibold text-muted-foreground">
            Demo tip: use “⏩ Simulate: Next Day” below to jump ahead.
          </p>
        </div>
      )}

      {stage === "dashboard" && answers && path && nextLesson && (
        <Dashboard
          answers={answers}
          path={path}
          day={day}
          nextLesson={nextLesson}
          onStartLesson={() => setStage("lesson")}
          onRewards={() => setStage("rewards")}
        />
      )}

      {stage === "rewards" && (
        <Rewards
          day={day}
          longest={longest}
          interviewLessons={answers?.goal === "Prep for interviews" ? day : 0}
          onBack={() => setStage("dashboard")}
        />
      )}

      {/* Demo controls — not part of the real product UX */}
      <div className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-[420px] border-t border-border bg-card/95 px-4 py-2.5 backdrop-blur">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">
            Demo
          </span>
          <button
            onClick={nextDay}
            disabled={!answers || stage === "onboarding" || stage === "personalizing"}
            className="flex-1 rounded-xl bg-secondary px-3 py-2 text-xs font-bold text-secondary-foreground disabled:opacity-40"
          >
            ⏩ Simulate: Next Day
          </button>
          {answers && stage !== "onboarding" && (
            <button
              onClick={() => setStage(stage === "dashboard" ? "rewards" : "dashboard")}
              className="rounded-xl bg-secondary px-3 py-2 text-xs font-bold text-secondary-foreground"
            >
              {stage === "dashboard" ? "🏅 Rewards" : "🏠 Home"}
            </button>
          )}
          <button
            onClick={reset}
            className="rounded-xl px-3 py-2 text-xs font-bold text-muted-foreground underline"
          >
            Reset demo
          </button>
        </div>
      </div>
    </main>
  );
}
