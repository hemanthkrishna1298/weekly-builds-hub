import { hub } from "@/lib/apps";
import { ogCard, ogContentType, ogSize } from "@/lib/og";

export const alt = `About ${hub.name}`;
export const dynamic = "force-static";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogCard({
    quote: "If nobody is asking for it in public, it does not get built.",
    title: `About ${hub.name}`,
    subtitle: `Built by ${hub.author.name}. One app a week, free to use.`,
  });
}
