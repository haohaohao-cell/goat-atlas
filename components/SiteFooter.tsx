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
          <div className="footer-languages">
            <Link href="/en">EN overview</Link>
            <span>·</span>
            <Link href="/pt">PT overview</Link>
          </div>
        </div>

        <div className="footer-col">
          <h3>Explore</h3>
          <Link href="/atlas">Atlas 图鉴</Link>
          <Link href="/story">Story 故事</Link>
          <Link href="/live">Live 数据</Link>
          <Link href="/matches">Matches 赛程</Link>
          <Link href="/today">Today 今日</Link>
          <Link href="/milestones">Milestones 里程碑</Link>
          <Link href="/play">Play 玩法</Link>
          <Link href="/about">About 关于</Link>
        </div>

        <div className="footer-col">
          <h3>Project</h3>
          <Link href="/about#roadmap">Roadmap</Link>
          <Link href="/gallery">影像档案</Link>
          <Link href="/about#data">数据原则</Link>
          <Link href="/credits">素材与许可</Link>
          <a href={`${siteConfig.basePath}/feed.xml`}>RSS 订阅</a>
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
