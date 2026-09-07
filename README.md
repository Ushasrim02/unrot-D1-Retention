# Daily Unrot Boost

Build a mobile-first web app prototype called "Unrot – Day 1" that demonstrates a retention-focused onboarding-to-return loop for an AI micro-learning product. This is a product prototype for a stakeholder demo, not a production app — use realistic mock data, simulate backend behavior (notifications, scheduling, streaks) entirely in frontend state, and prioritize a polished, believable UX over real infrastructure.

Brand & style

Clean, modern, slightly playful edtech aesthetic. Think Duolingo's warmth crossed with a sleek B2B SaaS dashboard (Unrot targets working professionals, not kids).

Primary color: deep indigo/violet (#4F46E5-ish) with a warm accent (amber/coral) reserved only for streaks, rewards, and celebratory moments.

Rounded cards, generous whitespace, micro-animations on completion states (confetti/checkmark pop, progress bar fill).

Typography: confident sans-serif, larger type for lesson content since this is "5 minutes a day" — content should feel snackable, not dense.

Mobile-first layout (max width ~420px centered), since most usage is on phone.

App structure — build these 6 screens/flows in order:

1. Onboarding & Personalization Quiz (30 seconds, 3 questions)

Q1: "What's your role?" — options: Product Manager, Software Engineer, Marketer, Student/Career Switcher, Other

Q2: "Why are you here?" — options: Stay updated on AI news, Prep for interviews, Learn to build with AI tools, Just curious

Q3: "How much do you already know about AI?" — Beginner / Some exposure / Comfortable but want structure

Each question is single-select, big tappable cards, progress dots at top (1/3, 2/3, 3/3), no back-tracking friction.

On completion, show a 1.5s animated "Personalizing your path..." loading state, then transition to a "Here's your path" summary screen: "Because you're a [role] focused on [goal], we've picked lessons on [2-3 relevant topic names]." This makes personalization visible, not just backend magic.

2. First Lesson (Session 1 — the core "Day 0" experience)

A single micro-lesson, ~5 min read, on a topic pulled from the personalization (e.g. if role=PM and goal=interview prep, show "How to talk about AI in a PM interview"). Hardcode 3-4 lesson variants keyed to quiz answers.

Lesson format: short text blocks + 1 inline "check your understanding" tap-to-reveal or 2-option quiz question (low stakes, just for engagement, not a real quiz).

A persistent progress bar at the top fills as the user scrolls/advances through lesson cards.

End with a clear "Lesson Complete ✅" celebratory moment (confetti animation, streak counter appears for the first time: "Day 1 🔥").

3. The Day-0 Hook Screen (critical — this is the retention mechanism, build this carefully) Immediately after lesson completion, show a dedicated screen (not a modal that's easy to dismiss) with three stacked elements:

Tomorrow's lesson teaser: a locked card showing the title + a one-line hook for tomorrow's lesson ("🔒 Tomorrow: Why every AI interview now asks about agents — unlocks in 18h 42m"), with a live-updating countdown timer to next unlock. This creates a concrete reason to return.

Notification opt-in with time picker: "When should we remind you?" — a simple time picker (default 9:00 AM, editable) with a toggle for push vs. email. Frame the copy around value, not nagging: "We'll send one short reminder — no spam, just your daily 5 minutes."

Streak visual: a 7-day week strip (Mon–Sun) with today filled in, showing the mechanic before the user has even built a streak, so they understand what they're building toward. Include a small label: "Reach a 7-day streak to unlock your first badge."

Primary CTA: "Set reminder & finish" — this is the screen's only exit, so the commitment device is unavoidable but not annoying (single tap, no forced permissions dialog spam).

4. Simulated Notification / Reminder

Build a mock "phone notification" component (styled like an iOS/Android push banner) that can be triggered via a demo button ("⏩ Simulate: Next Day" in the corner, for demo purposes only — labeled clearly as a demo control, not part of the real UX).

Notification copy should be personalized and specific, e.g.: "🔥 Your streak is waiting — today's lesson: 'Why every AI interview now asks about agents' (5 min)". Never generic "Don't forget to open the app!" copy.

Tapping the notification deep-links into Day 2's lesson directly (not the home screen) — remove friction between trigger and value.

5. Day 2 Return Experience

Home/dashboard screen shown on return: streak counter now shows "Day 2 🔥", the week strip fills in one more day with a satisfying animation.

Personalized content feed below the streak: "Continue your path" (next lesson), "AI news for you" (1-2 mock headlines relevant to their role), "Interview question of the day" (if goal = interview prep) — this reinforces that personalization persists, not just at onboarding.

A visible weekly reward progress bar: "3 more days to your 7-Day Streak Badge 🏅" with a preview of the badge art (locked/greyed out state) — gamifies the mid-week gap where drop-off usually happens.

Repeat the Day-0 Hook pattern after Day 2's lesson too (tomorrow's teaser + streak update), showing the loop is designed to repeat, not a one-off.

6. Rewards / Progress Dashboard

A simple profile-adjacent screen showing: current streak, longest streak, badges earned (7-day, 30-day, "Interview Ready" badge if they've done N interview-prep lessons), and a "readiness score" gauge (mock %, ties to Unrot's existing interview-prep positioning).

This screen doesn't need to be interactive beyond static display — it's there to show the "why keep going" payoff visually.

Technical/demo requirements

All state (quiz answers, streak count, unlocked lessons, notification settings) should live in React state / localStorage-equivalent in-memory store — no real backend needed.

Include the "⏩ Simulate: Next Day" demo control (small, unobtrusive, corner of screen) on every screen so a reviewer can click through the full Day 1 → Day 2 loop in under 2 minutes without waiting for real time to pass.

Include a tiny "Reset demo" button to restart the flow from onboarding.

Make transitions between screens smooth (fade/slide) — this is a demo that needs to feel like a real product, not a slide deck.

Prioritize: onboarding quiz → first lesson → Day-0 hook screen → simulated notification → Day 2 return, in that build order, since that's the core narrative arc for the pitch.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/a38517d1-ca82-4dc7-9133-f154aa0af8d9).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
