import Link from "next/link";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link className="logo" href="/" aria-label="GOAT Atlas 首页">
      <span className="logo-mark" aria-hidden="true">
        7
      </span>
      <span className="logo-type">
        <strong>GOAT</strong>
        {!compact && <em>ATLAS</em>}
      </span>
    </Link>
  );
}
