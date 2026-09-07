export type Role =
  | "Product Manager"
  | "Software Engineer"
  | "Marketer"
  | "Student / Career Switcher"
  | "Other";

export type Goal =
  | "Stay updated on AI news"
  | "Prep for interviews"
  | "Learn to build with AI tools"
  | "Just curious";

export type Level = "Beginner" | "Some exposure" | "Comfortable but want structure";

export type Answers = { role: Role; goal: Goal; level: Level };

export const ROLES: Role[] = [
  "Product Manager",
  "Software Engineer",
  "Marketer",
  "Student / Career Switcher",
  "Other",
];

export const GOALS: Goal[] = [
  "Stay updated on AI news",
  "Prep for interviews",
  "Learn to build with AI tools",
  "Just curious",
];

export const LEVELS: Level[] = ["Beginner", "Some exposure", "Comfortable but want structure"];

export const ROLE_EMOJI: Record<Role, string> = {
  "Product Manager": "🧭",
  "Software Engineer": "🛠️",
  Marketer: "📣",
  "Student / Career Switcher": "🎒",
  Other: "✨",
};

export const GOAL_EMOJI: Record<Goal, string> = {
  "Stay updated on AI news": "📰",
  "Prep for interviews": "🎯",
  "Learn to build with AI tools": "⚡",
  "Just curious": "🔍",
};

export type LessonBlock =
  | { kind: "text"; heading?: string; body: string }
  | { kind: "callout"; body: string }
  | { kind: "reveal"; prompt: string; answer: string }
  | { kind: "quiz"; prompt: string; options: [string, string]; correct: 0 | 1; why: string };

export type Lesson = {
  id: string;
  title: string;
  minutes: number;
  topic: string;
  blocks: LessonBlock[];
};

export type Path = {
  key: string;
  topics: string[];
  lessons: [Lesson, Lesson];
  teaser: { title: string; hook: string };
  news: { source: string; headline: string }[];
  interviewQuestion?: string;
};

const pmInterview: Path = {
  key: "pm-interview",
  topics: ["Talking about AI in PM interviews", "AI agents for product teams", "Evaluating AI features"],
  lessons: [
    {
      id: "l1",
      title: "How to talk about AI in a PM interview",
      minutes: 5,
      topic: "Interview prep",
      blocks: [
        {
          kind: "text",
          heading: "The trap most PMs fall into",
          body: "Interviewers don't want a definition of a large language model. They want to know whether you can tell the difference between a feature that needs AI and a feature that just sounds good with AI attached.",
        },
        {
          kind: "text",
          heading: "The 3-part answer",
          body: "1. Name the user problem. 2. Say why a probabilistic system beats a deterministic one here. 3. Name the failure mode and how you'd contain it. That third part is what separates senior answers from junior ones.",
        },
        {
          kind: "callout",
          body: "\"We used a model because the input is messy free text, and we capped the blast radius with a human review step on anything above $500.\"",
        },
        {
          kind: "reveal",
          prompt: "What's the single most-forgotten part of an AI product answer?",
          answer: "Evaluation. Say how you'd measure quality after launch — offline evals plus a thumbs-up/down loop feeding a weekly review.",
        },
        {
          kind: "quiz",
          prompt: "An interviewer asks: 'Why not just use rules here?' Best opening move?",
          options: ["Explain that AI is more modern", "Describe the input variety rules can't cover"],
          correct: 1,
          why: "Ground the choice in the shape of the input, not in technology fashion.",
        },
        {
          kind: "text",
          heading: "Your 30-second script",
          body: "Problem → why probabilistic → guardrail → how you'd measure it. Practice saying it out loud once today. Tomorrow we go one level deeper into agents, which is now the most common follow-up question.",
        },
      ],
    },
    {
      id: "l2",
      title: "Why every AI interview now asks about agents",
      minutes: 5,
      topic: "Interview prep",
      blocks: [
        {
          kind: "text",
          heading: "Agents, minus the hype",
          body: "An agent is a model given a goal, a set of tools, and permission to loop until it thinks it's done. Everything interesting — and everything risky — comes from that loop.",
        },
        {
          kind: "text",
          heading: "What interviewers are testing",
          body: "They want to hear you talk about scope of permission, cost per task, and what happens on step 7 of a 10-step plan when step 3 was quietly wrong.",
        },
        {
          kind: "quiz",
          prompt: "Strongest agent guardrail to name in an interview?",
          options: ["A confirmation step before irreversible actions", "A longer system prompt"],
          correct: 0,
          why: "Reversibility is a product decision. Prompt length is not a guardrail.",
        },
        {
          kind: "reveal",
          prompt: "One metric that shows an agent is actually working",
          answer: "Task completion rate without human intervention — paired with cost per completed task, so you know whether the win is affordable.",
        },
      ],
    },
  ],
  teaser: {
    title: "Why every AI interview now asks about agents",
    hook: "The follow-up question that trips up 8 in 10 candidates.",
  },
  news: [
    { source: "The Verge", headline: "Product teams are shipping agent features faster than they can evaluate them" },
    { source: "Lenny's Newsletter", headline: "The new PM interview loop: one case, one AI tradeoff question" },
  ],
  interviewQuestion: "Walk me through a feature where you'd deliberately choose NOT to use AI. Why?",
};

const engBuild: Path = {
  key: "eng-build",
  topics: ["Prompt patterns that survive production", "Retrieval basics", "Evals for engineers"],
  lessons: [
    {
      id: "l1",
      title: "Prompt patterns that survive production",
      minutes: 5,
      topic: "Building with AI",
      blocks: [
        {
          kind: "text",
          heading: "Prompts are interfaces",
          body: "Treat a prompt like an API contract: fixed structure, typed output, versioned. The clever wording matters far less than the predictability of what comes back.",
        },
        {
          kind: "text",
          heading: "Three patterns worth memorising",
          body: "Structured output (ask for JSON and validate it), few-shot anchoring (2-3 examples beat a paragraph of instructions), and refusal paths (tell the model exactly what to emit when it doesn't know).",
        },
        {
          kind: "quiz",
          prompt: "Model returns malformed JSON 3% of the time. First fix?",
          options: ["Add 'please return valid JSON' in caps", "Validate and retry with the parse error fed back"],
          correct: 1,
          why: "Validation plus a repair loop is deterministic engineering. Louder prompts are not.",
        },
        {
          kind: "reveal",
          prompt: "Why version your prompts?",
          answer: "Because a prompt edit is a deploy. Without versions you can't attribute a quality regression to the change that caused it.",
        },
      ],
    },
    {
      id: "l2",
      title: "Retrieval in 5 minutes: when RAG actually helps",
      minutes: 5,
      topic: "Building with AI",
      blocks: [
        {
          kind: "text",
          heading: "The one-line version",
          body: "Retrieval swaps 'the model must remember' for 'the model must read'. It fixes freshness and citations. It does not fix reasoning.",
        },
        {
          kind: "callout",
          body: "If your answers are wrong because the model can't reason, adding a vector database makes them wrong with footnotes.",
        },
        {
          kind: "quiz",
          prompt: "Retrieval quality is bad. Where do you look first?",
          options: ["Chunking and the retrieval step", "A bigger model"],
          correct: 0,
          why: "Most RAG failures are retrieval failures — bad chunks, wrong top-k, no reranking.",
        },
      ],
    },
  ],
  teaser: {
    title: "Retrieval in 5 minutes: when RAG actually helps",
    hook: "The 2-minute check that tells you if RAG is even your problem.",
  },
  news: [
    { source: "Hacker News", headline: "Teams report eval suites cut AI incident count by half" },
    { source: "InfoQ", headline: "Structured outputs are quietly becoming the default API shape" },
  ],
};

const marketerNews: Path = {
  key: "marketer-news",
  topics: ["AI in the content workflow", "What buyers now expect", "Spotting AI slop"],
  lessons: [
    {
      id: "l1",
      title: "The AI content workflow that doesn't sound like AI",
      minutes: 5,
      topic: "AI for marketers",
      blocks: [
        {
          kind: "text",
          heading: "Where AI actually earns its place",
          body: "Not the first draft — the messy middle. Research synthesis, angle generation, and variant testing are where teams see real time back.",
        },
        {
          kind: "text",
          heading: "The voice problem",
          body: "Generic output happens when the model has no constraints. Feed it three of your own best-performing pieces and a list of words you never use. Specificity in, specificity out.",
        },
        {
          kind: "quiz",
          prompt: "Fastest way to kill 'AI voice' in a draft?",
          options: ["Ask for a friendlier tone", "Paste in 3 real examples of your voice"],
          correct: 1,
          why: "Examples beat adjectives every time.",
        },
        {
          kind: "reveal",
          prompt: "One thing to never automate",
          answer: "The customer quote. Real language from real users is the only part competitors genuinely can't copy.",
        },
      ],
    },
    {
      id: "l2",
      title: "What your buyers now assume about AI",
      minutes: 5,
      topic: "AI for marketers",
      blocks: [
        {
          kind: "text",
          heading: "The trust shift",
          body: "\"AI-powered\" is no longer a claim, it's wallpaper. Buyers now ask what the model touches, what it can't do, and who reviews it.",
        },
        {
          kind: "quiz",
          prompt: "Which line converts better in 2026?",
          options: ["Powered by advanced AI", "Drafts in 20 seconds, you approve every send"],
          correct: 1,
          why: "Concrete outcome plus retained control beats a capability claim.",
        },
      ],
    },
  ],
  teaser: {
    title: "What your buyers now assume about AI",
    hook: "The claim that stopped working — and what replaced it.",
  },
  news: [
    { source: "Marketing Brew", headline: "Brands quietly drop 'AI-powered' from homepage copy" },
    { source: "Ahrefs Blog", headline: "Search behaviour shifts as answer engines take top-of-funnel" },
  ],
};

const foundations: Path = {
  key: "foundations",
  topics: ["How models actually work", "Prompting fundamentals", "AI that matters this week"],
  lessons: [
    {
      id: "l1",
      title: "What an AI model is actually doing",
      minutes: 5,
      topic: "AI foundations",
      blocks: [
        {
          kind: "text",
          heading: "Prediction, all the way down",
          body: "A language model reads everything so far and predicts what plausibly comes next, one small piece at a time. That single mechanic explains both the magic and the mistakes.",
        },
        {
          kind: "text",
          heading: "Why it makes things up",
          body: "Plausible and true aren't the same thing. When the model has no grounding, the most plausible continuation is a confident, well-formed, wrong sentence.",
        },
        {
          kind: "reveal",
          prompt: "So when should you double-check it?",
          answer: "Anything with a name, a number, or a date. Those are exactly the details a plausibility engine is happy to invent.",
        },
        {
          kind: "quiz",
          prompt: "Which task is a model most reliable at?",
          options: ["Recalling last quarter's exact revenue", "Rewriting text you already gave it"],
          correct: 1,
          why: "Transforming supplied text is grounded. Recall from memory is not.",
        },
      ],
    },
    {
      id: "l2",
      title: "Prompting: the 4 moves that do 90% of the work",
      minutes: 5,
      topic: "AI foundations",
      blocks: [
        {
          kind: "text",
          heading: "Move 1-2",
          body: "Give it a role and give it the raw material. Most weak answers come from a model guessing at context you already had.",
        },
        {
          kind: "text",
          heading: "Move 3-4",
          body: "Show one example of a good answer, then say what the output should look like — length, format, audience.",
        },
        {
          kind: "quiz",
          prompt: "Your answer is too generic. Best next move?",
          options: ["Add a concrete example of what 'good' looks like", "Ask it to try harder"],
          correct: 0,
          why: "Examples are the highest-leverage thing you can add.",
        },
      ],
    },
  ],
  teaser: {
    title: "Prompting: the 4 moves that do 90% of the work",
    hook: "Four small habits that make every answer sharper.",
  },
  news: [
    { source: "MIT Tech Review", headline: "The everyday AI skills employers now screen for" },
    { source: "Wired", headline: "Why 'just ask better questions' became real career advice" },
  ],
};

export function pickPath(a: Answers): Path {
  if (a.goal === "Prep for interviews") {
    if (a.role === "Software Engineer") return { ...engBuild, interviewQuestion: "Design an eval suite for a support-reply assistant. What do you measure?" };
    if (a.role === "Marketer") return { ...marketerNews, interviewQuestion: "How would you brief AI into a campaign without losing brand voice?" };
    if (a.role === "Product Manager") return pmInterview;
    return { ...foundations, interviewQuestion: "Explain a large language model to a non-technical hiring manager in 60 seconds." };
  }
  if (a.goal === "Learn to build with AI tools") {
    return a.role === "Marketer" ? marketerNews : engBuild;
  }
  if (a.goal === "Stay updated on AI news") {
    if (a.role === "Product Manager") return pmInterview;
    if (a.role === "Marketer") return marketerNews;
    if (a.role === "Software Engineer") return engBuild;
    return foundations;
  }
  return foundations;
}

export const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
