import { getPublicApp, hub, truncate, unquote, weekLabel } from "@/lib/apps";
import { ogCard, ogContentType, ogSize } from "@/lib/og";

export { generateStaticParams } from "./page";

export const dynamic = "force-static";
export const size = ogSize;
export const contentType = ogContentType;
export const alt = "The problem this app solves, and the app that solves it";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const app = getPublicApp(slug);

  if (!app) {
    return ogCard({ quote: hub.tagline, title: hub.name, subtitle: hub.description });
  }

  return ogCard({
    quote: truncate(unquote(app.problem), 220),
    title: app.name,
    subtitle: app.tagline,
    note: weekLabel(app.week),
  });
}
