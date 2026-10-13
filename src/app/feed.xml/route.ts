import { appLink, hub, shippedApps, siteUrl, weekLabel } from "@/lib/apps";

// Rendered to a static file (out/feed.xml) at build time.
export const dynamic = "force-static";

function escape(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function rfc822(iso: string | undefined): string | undefined {
  if (!iso) return undefined;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? undefined : d.toUTCString();
}

export function GET() {
  const items = shippedApps
    .map((app) => {
      const page = `${siteUrl}/apps/${app.slug}/`;
      const link = appLink(app) ?? page;
      const pubDate = rfc822(app.shippedAt);
      const body = [
        `<p><em>${escape(app.problem)}</em></p>`,
        `<p>${escape(app.tagline)}</p>`,
        app.description ? `<p>${escape(app.description)}</p>` : "",
        `<p>Built in ${escape(weekLabel(app.week))}. <a href="${escape(link)}">Open the app</a> or <a href="${escape(page)}">read where it came from</a>.</p>`,
      ].join("");
      return [
        "    <item>",
        `      <title>${escape(`${app.name} — ${app.tagline}`)}</title>`,
        `      <link>${escape(page)}</link>`,
        `      <guid isPermaLink="true">${escape(page)}</guid>`,
        pubDate ? `      <pubDate>${pubDate}</pubDate>` : "",
        `      <description>${escape(app.problem)}</description>`,
        `      <content:encoded><![CDATA[${body}]]></content:encoded>`,
        ...(app.tags ?? []).map((t) => `      <category>${escape(t)}</category>`),
        "    </item>",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");

  const lastBuild = rfc822(shippedApps[0]?.shippedAt) ?? new Date().toUTCString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escape(hub.name)}</title>
    <link>${escape(siteUrl)}/</link>
    <atom:link href="${escape(siteUrl)}/feed.xml" rel="self" type="application/rss+xml" />
    <description>${escape(hub.description ?? hub.tagline)}</description>
    <language>en</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
