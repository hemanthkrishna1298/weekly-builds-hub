import registry from "@/data/apps.json";

export type SourceKind =
  | "hn"
  | "reddit"
  | "github"
  | "review"
  | "forum"
  | "twitter"
  | "other";

export type AppStatus =
  | "candidate"
  | "picked"
  | "building"
  | "preview"
  | "shipped"
  | "retired";

export interface Source {
  title: string;
  url: string;
  kind: SourceKind;
  quote?: string;
  repliedAt?: string;
}

export interface App {
  slug: string;
  name: string;
  tagline: string;
  problem: string;
  description?: string;
  week: string;
  status: AppStatus;
  url?: string;
  previewUrl?: string;
  repoPath?: string;
  /** Default true. When false, no public repo exists and no Source link is shown. */
  openSource?: boolean;
  /** Public repo for this app (set by scripts/publish-app.mjs). */
  sourceUrl?: string;
  sources: Source[];
  tags?: string[];
  stack?: string[];
  pickedAt?: string;
  shippedAt?: string;
}

export interface Hub {
  name: string;
  tagline: string;
  description?: string;
  url: string;
  /** Public repo of the hub site itself; the pipeline monorepo is private. */
  github: string;
  /** Where "request a tool" and hub feedback go. Defaults to `${github}/issues/new`. */
  issuesUrl?: string;
  author: { name: string; url?: string };
}

/** Public source link for an app, or null when it isn't open source. */
export function appSourceUrl(app: App): string | null {
  if (app.openSource === false) return null;
  return app.sourceUrl ?? null;
}

interface Registry {
  hub: Hub;
  apps: App[];
}

const data = registry as unknown as Registry;

export const hub: Hub = data.hub;

/** Strip a trailing slash so paths can be appended safely. */
export const siteUrl = hub.url.replace(/\/+$/, "");

/** Newest week first; ties broken by shippedAt (newest first). */
function byNewest(a: App, b: App): number {
  if (a.week !== b.week) return a.week < b.week ? 1 : -1;
  return (b.shippedAt ?? "").localeCompare(a.shippedAt ?? "");
}

export const shippedApps: App[] = data.apps
  .filter((a) => a.status === "shipped")
  .sort(byNewest);

export const previewApps: App[] = data.apps
  .filter((a) => a.status === "preview")
  .sort(byNewest);

/** Apps that get a page on the hub: shipped (indexed) and preview (noindex). */
export const publicApps: App[] = [...shippedApps, ...previewApps];

export function getPublicApp(slug: string): App | undefined {
  return publicApps.find((a) => a.slug === slug);
}

/** The link a visitor should open: production if shipped, else the preview. */
export function appLink(app: App): string | undefined {
  return app.status === "shipped" ? app.url ?? app.previewUrl : app.previewUrl ?? app.url;
}

export interface WeekParts {
  year: number;
  week: number;
}

export function parseWeek(week: string): WeekParts {
  const m = /^(\d{4})-W(\d{2})$/.exec(week);
  if (!m) return { year: NaN, week: NaN };
  return { year: Number(m[1]), week: Number(m[2]) };
}

/** "2026-W42" -> "Week 42, 2026" */
export function weekLabel(week: string): string {
  const { year, week: n } = parseWeek(week);
  if (Number.isNaN(year)) return week;
  return `Week ${n}, ${year}`;
}

/** "2026-W42" -> "week 42 of 2026" (for running text) */
export function weekPhrase(week: string): string {
  const { year, week: n } = parseWeek(week);
  if (Number.isNaN(year)) return week;
  return `week ${n} of ${year}`;
}

const longDate = new Intl.DateTimeFormat("en-GB", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

const shortDate = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

export function formatDate(iso: string | undefined): string | undefined {
  if (!iso) return undefined;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return shortDate.format(d);
}

/**
 * The next Monday on or after `from` (UTC), formatted for the empty state.
 * Evaluated at build time, so it is the Monday after the last deploy.
 */
export function nextMondayLabel(from: Date = new Date()): string {
  const d = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate()));
  const day = d.getUTCDay(); // 0 = Sunday
  const add = day === 1 ? 0 : (8 - day) % 7;
  d.setUTCDate(d.getUTCDate() + add);
  return longDate.format(d);
}

/** Cut text at a word boundary and add an ellipsis. */
export function truncate(text: string, max: number): string {
  const t = text.trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  const atSpace = cut.lastIndexOf(" ");
  return `${(atSpace > max * 0.6 ? cut.slice(0, atSpace) : cut).replace(/[\s,;:.]+$/, "")}…`;
}

/** Remove wrapping quote marks so we can add our own typographic ones. */
export function unquote(text: string): string {
  return text.trim().replace(/^["'“‘]+/, "").replace(/["'”’]+$/, "");
}

export const sourceKindLabel: Record<SourceKind, string> = {
  hn: "Hacker News",
  reddit: "Reddit",
  github: "GitHub",
  review: "Review",
  forum: "Forum",
  twitter: "X / Twitter",
  other: "Elsewhere",
};
