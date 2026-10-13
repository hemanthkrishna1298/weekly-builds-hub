import { hub } from "@/lib/apps";
import { ogCard, ogContentType, ogSize } from "@/lib/og";

export const alt = `${hub.name} — ${hub.tagline}`;
export const dynamic = "force-static";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogCard({
    quote: hub.tagline,
    title: hub.name,
    subtitle: hub.description,
    note: "Every week",
  });
}
