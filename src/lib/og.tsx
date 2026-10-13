import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { hub } from "@/lib/apps";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const paper = "#f4f5f2";
const ink = "#1a1d1a";
const inkSoft = "#3b403b";
const muted = "#5f655e";
const stamp = "#1e5c47";

async function font(file: string) {
  return readFile(join(process.cwd(), "src", "fonts", file));
}

async function fonts() {
  const [serif, serifItalic, sans, sansMedium] = await Promise.all([
    font("fraunces-latin-600-normal.woff"),
    font("fraunces-latin-400-italic.woff"),
    font("instrument-sans-latin-400-normal.woff"),
    font("instrument-sans-latin-500-normal.woff"),
  ]);
  return [
    { name: "Fraunces", data: serif, weight: 600 as const, style: "normal" as const },
    { name: "Fraunces", data: serifItalic, weight: 400 as const, style: "italic" as const },
    { name: "Instrument Sans", data: sans, weight: 400 as const, style: "normal" as const },
    { name: "Instrument Sans", data: sansMedium, weight: 500 as const, style: "normal" as const },
  ];
}

export interface OgCardProps {
  /** The complaint, in the user's words (rendered as the big italic quote). */
  quote: string;
  /** App name, or the hub name on the front page. */
  title: string;
  subtitle?: string;
  /** Right-aligned note, e.g. "Week 42, 2026". */
  note?: string;
}

/** A typographic card: the complaint large and italic, the answer underneath. */
export async function ogCard({ quote, title, subtitle, note }: OgCardProps) {
  const quoteSize = quote.length > 170 ? 36 : quote.length > 120 ? 42 : quote.length > 70 ? 48 : 56;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px 64px",
          background: paper,
          color: ink,
          fontFamily: "Instrument Sans",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            fontSize: 26,
            color: muted,
          }}
        >
          <span style={{ fontFamily: "Fraunces", fontWeight: 600, color: ink }}>
            {hub.name}
          </span>
          {note ? <span>{note}</span> : null}
        </div>

        <div
          style={{
            display: "flex",
            fontFamily: "Fraunces",
            fontStyle: "italic",
            fontSize: quoteSize,
            lineHeight: 1.18,
            color: ink,
            maxWidth: 1000,
          }}
        >
          <span>{`\u201C${quote}\u201D`}</span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            borderLeft: `4px solid ${stamp}`,
            paddingLeft: 28,
            gap: 8,
          }}
        >
          <span style={{ fontFamily: "Fraunces", fontWeight: 600, fontSize: 38, color: ink }}>
            {title}
          </span>
          {subtitle ? (
            <span style={{ fontSize: 26, color: inkSoft, maxWidth: 980 }}>{subtitle}</span>
          ) : null}
        </div>
      </div>
    ),
    { ...ogSize, fonts: await fonts() },
  );
}
