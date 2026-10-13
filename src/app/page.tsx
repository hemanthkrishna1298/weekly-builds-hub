import { AppEntry } from "@/components/app-entry";
import { hub, shippedApps } from "@/lib/apps";

const steps = [
  {
    title: "Find a real pain point",
    body: "Each week starts in the places people complain: Hacker News threads, subreddits, app-store reviews, GitHub issues. The pick is something many people keep asking for and nobody has built well.",
  },
  {
    title: "Build a proper app for it",
    body: "Not a demo. A working app with the boring parts done: it loads fast, handles the edge cases people mentioned, and does the one job well.",
  },
  {
    title: "Ship it and reply to the people who asked",
    body: "It goes live here, free to use, and the link goes back into every thread it came from. The people who complained are the first to hear.",
  },
];

export default function HomePage() {
  const count = shippedApps.length;

  return (
    <>
      <section className="mx-auto max-w-5xl px-4 pt-16 pb-14 sm:px-6 md:pt-24 md:pb-20">
        <h1 className="font-serif text-3xl font-normal tracking-tight text-balance sm:text-4xl md:text-5xl md:max-w-[18ch]">
          {hub.tagline}
        </h1>
        {hub.description ? (
          <p className="measure mt-6 text-lg text-ink-soft">{hub.description}</p>
        ) : null}
      </section>

      <section
        id="apps"
        aria-labelledby="apps-heading"
        className="mx-auto max-w-5xl scroll-mt-6 px-4 sm:px-6"
      >
        <div className="flex items-baseline justify-between border-b border-ink pb-3">
          <h2 id="apps-heading" className="font-serif text-xl font-semibold tracking-tight">
            {count === 0 ? "Shipped so far" : count === 1 ? "One app so far" : `${count} apps so far`}
          </h2>
          {count > 0 ? <p className="note">Newest first</p> : null}
        </div>

        {count === 0 ? (
          <EmptyState />
        ) : (
          <div className="divide-y divide-rule">
            {shippedApps.map((app) => (
              <AppEntry key={app.slug} app={app} />
            ))}
          </div>
        )}
      </section>

      <section
        aria-labelledby="how-heading"
        className="mx-auto mt-24 max-w-5xl px-4 sm:px-6"
      >
        <h2 id="how-heading" className="font-serif text-2xl font-semibold tracking-tight">
          How this works
        </h2>
        <ol className="mt-8 grid gap-8 md:grid-cols-3 md:gap-10">
          {steps.map((step, i) => (
            <li key={step.title} className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-3 md:block">
              <span
                aria-hidden="true"
                className="font-serif text-3xl leading-none text-stamp md:mb-4 md:block"
              >
                {i + 1}
              </span>
              <div>
                <h3 className="font-medium">{step.title}</h3>
                <p className="mt-2 text-sm text-ink-soft">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="measure mt-10 border-t border-rule pt-6 text-ink-soft">
          The cadence is fixed: one app every week, picked on Monday, shipped by Sunday.
          A week is long enough to build something real and short enough that no single
          idea gets precious.
        </p>
      </section>
    </>
  );
}

function EmptyState() {
  return (
    <div className="grid gap-4 py-14 md:grid-cols-[11rem_minmax(0,1fr)] md:gap-10 md:py-20">
      <p className="note md:pt-2">Next week</p>
      <div>
        <p className="complaint measure text-xl text-ink md:text-2xl">
          The first app ships next week.
        </p>
        <div className="reply mt-6">
          <p className="measure text-ink-soft">
            Nothing has shipped yet. Watch the repository or subscribe to the feed and
            you will see the first one the moment it goes live.
          </p>
          <div className="mt-4 flex flex-wrap items-baseline gap-x-6 gap-y-2 text-sm">
            <a href={hub.github} className="action">
              Watch on GitHub
            </a>
            <a href="/feed.xml" className="link">
              RSS feed
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
