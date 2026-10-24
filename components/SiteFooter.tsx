import Link from "next/link";
import { Logo } from "./Logo";
import { GithubIcon } from "./Icons";
import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Logo />
          <p>
            一个由球迷维护的 C 罗职业生涯图鉴。
            <br />
            每一个瞬间，都应该有出处。
          </p>
        </div>

        <div className="footer-col">
          <h3>Explore</h3>
          <Link href="/atlas">Atlas 图鉴</Link>
          <Link href="/story">Story 故事</Link>
          <Link href="/about">About 关于</Link>
        </div>

        <div className="footer-col">
          <h3>Project</h3>
          <Link href="/about#roadmap">Roadmap</Link>
          <Link href="/about#data">数据原则</Link>
          <Link href="/about#contribute">参与贡献</Link>
        </div>

        <div className="footer-col footer-note">
          <h3>Disclaimer</h3>
          <p>
            Unofficial fan project. Not affiliated with Cristiano Ronaldo, any
            club, league or federation.
          </p>
          {siteConfig.githubUrl ? (
            <a href={siteConfig.githubUrl} target="_blank" rel="noreferrer">
              <GithubIcon />
              GitHub
            </a>
          ) : null}
        </div>
      </div>

      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} GOAT Atlas</span>
        <span>Built for fans, by fans.</span>
        <span>Madeira → Lisbon → Manchester → Madrid → Turin → Riyadh</span>
      </div>
    </footer>
  );
}
