export function TagList({
  tags,
  label,
  className = "",
}: {
  tags: string[];
  label?: string;
  className?: string;
}) {
  return (
    <ul
      aria-label={label ?? "Tags"}
      className={`flex flex-wrap gap-1.5 ${className}`}
    >
      {tags.map((t) => (
        <li key={t} className="chip">
          {t}
        </li>
      ))}
    </ul>
  );
}
