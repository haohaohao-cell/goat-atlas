import type { Metadata } from "next";
import Link from "next/link";
import { compare } from "@/lib/compare";
import { CompareTool } from "@/components/CompareTool";
import { ArrowUpRight, SparkIcon } from "@/components/Icons";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Compare · GOAT 对比器",
  description:
    "C 罗 vs 梅西：把金球奖、欧冠、世界杯、金靴、欧冠进球、国家队进球放在一起，权重由你调。",
  alternates: { canonical: absoluteUrl("/compare/") },
};

const PRINCIPLES = [
  {
    title: "只选稳定指标",
    body: "金球奖、欧冠、世界杯、欧洲金靴、欧冠历史进球、国家队进球。都是可核实、不会每天变的数字。",
  },
  {
    title: "默认权重公开",
    body: "金球 15、欧冠 20、世界杯 20、金靴 15、欧冠进球 15、国家队进球 15，合计 100。默认 3 : 3。",
  },
  {
    title: "权重可调",
    body: "你觉得世界杯更重，就把它的权重拉高；觉得 longevity 更重要，就调高国家队进球。结论随你变。",
  },
];

export default function ComparePage() {
  return (
    <>
      <section className="page-hero compare-hero">
        <div className="container">
          <div className="eyebrow">
            GOAT INDEX <span>·</span> AS OF {compare.asOf}
          </div>
          <h1>
            把 GOAT 争论，
            <br />
            <span>变成可调的参数。</span>
          </h1>
          <div className="page-hero-bottom">
            <p>
              “谁更强”没有标准答案，但可以把指标摊开。
              默认权重，随时可调；每一行都能点回来源。
            </p>
            <div className="page-hero-meta">
              <span>2 位球员</span>
              <span>{compare.metrics.length} 个维度</span>
              <span>权重可调</span>
            </div>
          </div>
        </div>
      </section>

      <section className="compare-section">
        <div className="container">
          <CompareTool data={compare} />

          <div className="compare-principles">
            <div className="section-head">
              <div>
                <p className="eyebrow">METHODOLOGY</p>
                <h2>它是一个工具，不是判决书。</h2>
              </div>
            </div>
            <div className="compare-principles-grid">
              {PRINCIPLES.map((item, index) => (
                <article key={item.title}>
                  <span>0{index + 1}</span>
                  <SparkIcon />
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="compare-links">
            <p>{compare.note}</p>
            <div>
              <Link className="button button-gold" href="/quiz">
                去玩每日问答
                <ArrowUpRight />
              </Link>
              <Link className="button button-ghost" href="/about#data">
                阅读数据原则
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
