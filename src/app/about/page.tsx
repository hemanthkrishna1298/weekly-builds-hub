import type { Metadata } from "next";
import { hub } from "@/lib/apps";

export const metadata: Metadata = {
  title: "About",
  description: `Who builds ${hub.name}, why it ships weekly, and how to ask for a tool.`,
  alternates: { canonical: "/about/" },
};

export default function AboutPage() {
  const requestUrl = hub.issuesUrl ?? `${hub.github}/issues/new`;

  return (
    <article className="mx-auto max-w-5xl px-4 pt-14 sm:px-6 md:pt-20">
      <h1 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">About</h1>

      <div className="mt-12 space-y-12">
        <Section title="Who builds this">
          <p className="measure">
            {hub.author.url ? (
              <a href={hub.author.url} className="link" rel="author">
                {hub.author.name}
              </a>
            ) : (
              hub.author.name
            )}
            , an engineer who builds AI systems for a living and small, sharp tools for
            everyone else. Every app here is built with an AI pair in the loop and
            reviewed by a person before it ships.
          </p>
        </Section>

        <Section title="Why weekly">
          <div className="measure space-y-4 text-ink-soft">
            <p>
              Most useful software is small. A week is enough time to build one thing
              properly, and too little time to over-build it. The deadline forces a
              decision about what matters: the thing people actually complained about.
            </p>
            <p>
              Starting from complaints rather than ideas keeps the apps honest. If nobody
              is asking for it in public, it does not get built.
            </p>
          </div>
        </Section>

        <Section title="Open source">
          <p className="measure text-ink-soft">
            Each app ships with its own public repository (MIT), linked from its page,
            so you can read exactly what it does with your data, run it yourself, or fork
            it. This site is open too:{" "}
            <a href={hub.github} className="link">
              weekly-builds-hub on GitHub
            </a>
            .
          </p>
        </Section>

        <Section title="Request a tool">
          <div className="measure space-y-4 text-ink-soft">
            <p>
              Stuck with a task that no app does well? Describe it in your own words,
              ideally with a link to where other people are asking for the same thing.
              The best requests become next week&rsquo;s build.
            </p>
            <p>
              <a href={requestUrl} className="action">
                Open a request on GitHub
              </a>
            </p>
          </div>
        </Section>
      </div>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-3 border-t border-rule pt-4 md:grid-cols-[11rem_minmax(0,1fr)] md:gap-10">
      <h2 className="note">{title}</h2>
      <div className="min-w-0">{children}</div>
    </section>
  );
}
