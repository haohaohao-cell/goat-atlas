import type { Metadata } from "next";
import Link from "next/link";
import { gallery } from "@/lib/gallery";
import { absoluteUrl, withBasePath } from "@/lib/site";
import { ArrowUpRight } from "@/components/Icons";

export const metadata: Metadata = {
  title: "影像档案",
  description:
    "GOAT Atlas 收录的 CC 授权 C 罗照片：每张都标注作者、许可与原始文件页，全部是资料图。",
  alternates: { canonical: absoluteUrl("/gallery/") },
};

export default function GalleryPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="eyebrow">PHOTO ARCHIVE · CC LICENSED</div>
          <h1>
            影像
            <br />
            <span>档案。</span>
          </h1>
          <div className="page-hero-bottom">
            <p>
              这里只放能署名的照片：CC BY 或 CC BY-SA，作者、许可和原始文件页都能点开。
              全部是资料图，不对应某一场具体比赛；比赛画面和转播镜头不收录。
            </p>
            <div className="page-hero-meta">
              <span>{gallery.items.length} 张</span>
              <span>CC 授权</span>
              <span>更新于 {gallery.asOf}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="gallery-grid">
            {gallery.items.map((item) => (
              <figure className="gallery-card" key={item.id}>
                <img
                  src={withBasePath(item.src)}
                  alt={item.alt}
                  width={item.width}
                  height={item.height}
                  loading="lazy"
                />
                <figcaption>
                  <p className="gallery-caption">{item.caption}</p>
                  <p className="gallery-meta">
                    {item.credit} ·{" "}
                    <a
                      href={item.licenseUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {item.license}
                    </a>
                  </p>
                  <a
                    className="gallery-source"
                    href={item.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    原始文件页
                    <ArrowUpRight />
                  </a>
                </figcaption>
              </figure>
            ))}
          </div>

          <div className="data-note credits-policy">
            <h3>关于这些照片</h3>
            <p>{gallery.note}</p>
            <p>
              图片经过等比缩放和 WebP 转码；CC BY-SA 图片的衍生版本继续以 CC BY-SA 发布。
              完整规则和第三方素材政策见{" "}
              <Link href="/credits">素材与许可</Link>。
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
