import Link from "next/link";
import { hub } from "@/lib/apps";

export function Header() {
  return (
    <header className="border-b border-rule">
      <div className="mx-auto flex max-w-5xl items-baseline justify-between gap-6 px-4 py-5 sm:px-6">
        <Link
          href="/"
          className="font-serif text-lg font-semibold tracking-tight text-ink no-underline"
        >
          {hub.name}
        </Link>
        <nav aria-label="Primary" className="flex items-baseline gap-5 text-sm sm:gap-7">
          <Link href="/#apps" className="link">
            Apps
          </Link>
          <Link href="/about/" className="link">
            About
          </Link>
          <a href={hub.github} className="link" rel="me">
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}
