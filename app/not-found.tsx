import Link from "next/link";
import { ArrowLeft } from "@/components/Icons";

export default function NotFound() {
  return (
    <section className="not-found">
      <div className="container">
        <p className="eyebrow">404 · OFFSIDE</p>
        <h1>这个瞬间不存在。</h1>
        <p>它可能还在路上，或者已经被时间收进了别处。</p>
        <Link className="button button-gold" href="/atlas">
          <ArrowLeft />
          回到 Atlas
        </Link>
      </div>
    </section>
  );
}
