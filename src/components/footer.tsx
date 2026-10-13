import { hub } from "@/lib/apps";

export function Footer() {
  const author = hub.author.url ? (
    <a href={hub.author.url} className="link" rel="author">
      {hub.author.name}
    </a>
  ) : (
    hub.author.name
  );

  return (
    <footer className="mt-24 border-t border-rule">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-8 text-sm text-muted sm:flex-row sm:items-baseline sm:justify-between sm:px-6">
        <p>
          Built and maintained by {author}. One app a week, free to use.
        </p>
        <ul className="flex gap-5">
          <li>
            <a href="/feed.xml" className="link" type="application/rss+xml">
              RSS
            </a>
          </li>
          <li>
            <a href={hub.github} className="link">
              GitHub
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
