import { formatDate, sourceKindLabel, unquote, type Source } from "@/lib/apps";

/** Where the pain was found: each source is a thread, with the verbatim complaint if we have it. */
export function SourceList({ sources }: { sources: Source[] }) {
  if (sources.length === 0) {
    return <p className="text-muted">No sources recorded for this one.</p>;
  }

  return (
    <ol className="divide-y divide-rule">
      {sources.map((s) => (
        <li key={s.url} className="grid gap-2 py-5 first:pt-1 sm:grid-cols-[7.5rem_minmax(0,1fr)] sm:gap-6">
          <p className="note">{sourceKindLabel[s.kind] ?? "Elsewhere"}</p>
          <div className="min-w-0">
            <a href={s.url} className="link font-medium" rel="noopener">
              {s.title}
            </a>
            {s.quote ? (
              <blockquote className="complaint measure mt-2 text-lg text-ink-soft">
                {unquote(s.quote)}
              </blockquote>
            ) : null}
            {s.repliedAt ? (
              <p className="note mt-2">
                Replied in this thread on{" "}
                <time dateTime={s.repliedAt}>{formatDate(s.repliedAt)}</time>
                {" with the finished app."}
              </p>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
