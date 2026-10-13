import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-24 sm:px-6">
      <p className="note">404</p>
      <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight">
        There is no page here
      </h1>
      <p className="measure mt-4 text-ink-soft">
        The address may be mistyped, or the app it pointed to has been retired.
      </p>
      <p className="mt-6">
        <Link href="/" className="action">
          Back to the front page
        </Link>
      </p>
    </div>
  );
}
