import type { Metadata } from "next";
import Link from "next/link";
import { SourceList } from "@/components/sources";
import { TagList } from "@/components/tags";
import {
  appLink,
  formatDate,
  appSourceUrl,
  getPublicApp,
  hub,
  publicApps,
  siteUrl,
  truncate,
  unquote,
  weekLabel,
  weekPhrase,
} from "@/lib/apps";

/**
 * With `output: "export"` a dynamic route must produce at least one path.
 * When no app is shipped or in preview yet, we emit a single placeholder page
 * (noindex) so the empty build still succeeds. Nothing links to it.
 */
const PLACEHOLDER = "coming-soon";

export const dynamicParams = false;

export function generateStaticParams() {
  if (publicApps.length === 0) return [{ slug: PLACEHOLDER }];
  return publicApps.map((app) => ({ slug: app.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/apps/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const app = getPublicApp(slug);
  if (!app) {
    return { title: "Nothing here yet", robots: { index: false, follow: false } };
  }

  // The problem, in the users' words, is the SEO headline.
  const problem = truncate(unquote(app.problem), 70);
  const description = truncate(
    `${unquote(app.problem)} ${app.name}: ${app.tagline}`,
    155,
  );
  const path = `/apps/${app.slug}/`;

  return {
    title: { absolute: `${app.name} — ${problem}` },
    description,
    alternates: { canonical: path },
    robots: app.status === "preview" ? { index: false, follow: false } : undefined,
    openGraph: {
      type: "article",
      url: path,
      title: `${app.name} — ${app.tagline}`,
      description,
      siteName: hub.name,
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function AppPage({ params }: PageProps<"/apps/[slug]">) {
  const { slug } = await params;
  const app = getPublicApp(slug);

  if (!app) return <Placeholder />;

  const href = appLink(app);
  const isPreview = app.status === "preview";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: app.name,
    description: app.description ?? app.tagline,
    applicationCategory: "WebApplication",
    operatingSystem: "Any",
    url: href ?? `${siteUrl}/apps/${app.slug}/`,
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    author: {
      "@type": "Person",
      name: hub.author.name,
      ...(hub.author.url ? { url: hub.author.url } : {}),
    },
    ...(app.shippedAt ? { datePublished: app.shippedAt } : {}),
    ...(app.tags && app.tags.length ? { keywords: app.tags.join(", ") } : {}),
  };

  return (
    <article className="mx-auto max-w-5xl px-4 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {isPreview ? (
        <p
          role="status"
          className="mt-6 inline-block border-l-2 border-stamp bg-stamp-tint px-3 py-2 text-sm text-stamp-ink"
        >
          Preview — not final. This app is still being reviewed and may change before it ships.
        </p>
      ) : null}

      <header className="grid gap-4 pt-14 pb-10 md:grid-cols-[11rem_minmax(0,1fr)] md:gap-10 md:pt-20">
        <p className="note md:pt-3">
          <time dateTime={app.week}>{weekLabel(app.week)}</time>
        </p>
        <div className="min-w-0">
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-balance sm:text-4xl md:text-5xl">
            {app.name}
          </h1>
          <p className="measure mt-3 text-xl text-ink-soft">{app.tagline}</p>
          <div className="mt-7 flex flex-wrap items-baseline gap-x-6 gap-y-2">
            {href ? (
              <a href={href} className="action text-lg">
                {isPreview ? "Open preview" : "Open app"}
              </a>
            ) : (
              <span className="note">Link coming once it is live.</span>
            )}
            {appSourceUrl(app) ? (
              <a href={appSourceUrl(app)!} className="link text-sm">
                Source
              </a>
            ) : null}
          </div>
        </div>
      </header>

      <div className="space-y-12">
        <Section title="The problem">
          <blockquote className="complaint measure text-xl text-ink md:text-3xl">
            {unquote(app.problem)}
          </blockquote>
          {app.description ? (
            <div className="reply mt-8">
              <p className="measure text-ink-soft">{app.description}</p>
            </div>
          ) : null}
        </Section>

        <Section title="Where this came from">
          <SourceList sources={app.sources} />
        </Section>

        <Section title="Details">
          <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
            <div>
              <dt className="note">Built in</dt>
              <dd className="mt-1">{weekPhrase(app.week)}</dd>
            </div>
            {app.shippedAt ? (
              <div>
                <dt className="note">Shipped</dt>
                <dd className="mt-1">
                  <time dateTime={app.shippedAt}>{formatDate(app.shippedAt)}</time>
                </dd>
              </div>
            ) : null}
            {app.stack && app.stack.length > 0 ? (
              <div className="sm:col-span-2">
                <dt className="note">Stack</dt>
                <dd className="mt-2">
                  <TagList tags={app.stack} label="Stack" />
                </dd>
              </div>
            ) : null}
            {app.tags && app.tags.length > 0 ? (
              <div className="sm:col-span-2">
                <dt className="note">Tags</dt>
                <dd className="mt-2">
                  <TagList tags={app.tags} />
                </dd>
              </div>
            ) : null}
          </dl>
        </Section>
      </div>

      <p className="mt-16">
        <Link href="/#apps" className="link text-sm">
          All apps
        </Link>
      </p>
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

function Placeholder() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-24 sm:px-6">
      <h1 className="font-serif text-3xl font-semibold tracking-tight">Nothing here yet</h1>
      <p className="measure mt-4 text-ink-soft">
        No app has shipped yet, so there is no page at this address. The first one is on
        its way.
      </p>
      <p className="mt-6">
        <Link href="/" className="action">
          Back to the front page
        </Link>
      </p>
    </div>
  );
}
