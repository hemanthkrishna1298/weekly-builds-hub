import Link from "next/link";
import { appLink, unquote, weekLabel, type App } from "@/lib/apps";
import { TagList } from "@/components/tags";

/**
 * One entry on the front page. The complaint comes first, large and in the
 * user's own words; the app hangs underneath it like a reply in a thread.
 */
export function AppEntry({ app }: { app: App }) {
  const href = appLink(app);
  const detail = `/apps/${app.slug}/`;

  return (
    <article className="grid gap-4 py-10 md:grid-cols-[11rem_minmax(0,1fr)] md:gap-10">
      <p className="note md:pt-2">
        <time dateTime={app.week}>{weekLabel(app.week)}</time>
      </p>

      <div className="min-w-0">
        <blockquote className="complaint measure text-xl text-ink md:text-2xl">
          {unquote(app.problem)}
        </blockquote>

        <div className="reply mt-6">
          <h3 className="font-serif text-xl font-semibold tracking-tight">
            <Link href={detail} className="text-ink no-underline hover:text-stamp-ink">
              {app.name}
            </Link>
          </h3>
          <p className="measure mt-1 text-ink-soft">{app.tagline}</p>

          <div className="mt-4 flex flex-wrap items-baseline gap-x-6 gap-y-2 text-sm">
            {href ? (
              <a href={href} className="action">
                Open app
              </a>
            ) : null}
            <Link href={detail} className="link">
              Where this came from
            </Link>
          </div>

          {app.tags && app.tags.length > 0 ? (
            <TagList tags={app.tags} className="mt-4" />
          ) : null}
        </div>
      </div>
    </article>
  );
}
