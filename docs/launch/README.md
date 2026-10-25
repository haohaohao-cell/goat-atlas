# GOAT Atlas 发布素材与文案（v1）

> 生成日期：2026-10-25  
> 站点：<https://haohaohao-cell.github.io/goat-atlas/>  
> 仓库：<https://github.com/haohaohao-cell/goat-atlas>

---

## 一、发布前 checklist

- [ ] 打开首页、Atlas、Quiz、Milestones、Gallery，确认移动端不溢出
- [ ] 点一次分享卡（`/atlas/ucl-2008-final/`），确认能生成图片
- [ ] 点一次 FIFA 视频封面，确认点击后才加载播放器
- [ ] 用手机浏览器“添加到主屏幕”，断网后打开一个已访问页面
- [ ] 确认 `/feed.xml`、`/sitemap.xml`、`/robots.txt` 可访问
- [ ] 准备一个专门收反馈的入口：GitHub issue 模板已就绪
  - 纠错：<https://github.com/haohaohao-cell/goat-atlas/issues/new?template=data-correction.yml>
  - 建议：<https://github.com/haohaohao-cell/goat-atlas/issues/new?template=feature_request.yml>

## 二、可直接用的素材

| 文件 | 用途 | 建议 |
| --- | --- | --- |
| [home.webp](home.webp) | 首图 / 帖子封面 | 1200×833，30KB |
| [atlas.webp](atlas.webp) | 展示检索与筛选 | 1200×833，28KB |
| [quiz.webp](quiz.webp) | 展示每日问答 | 1200×833，28KB |
| [gallery.webp](gallery.webp) | 展示 CC 授权影像档案 | 1200×833，56KB |
| [../../public/og/home.png](../../public/og/home.png) | 链接预览 / OG | 1200×630 |

发布时建议：**首图 + 2 张功能图**，不要一口气贴 4 张，信息密度太高。

---

## 三、文案 A：中文社群（懂球帝 / 虎扑 / 微信群）

**标题：**

> 我做了一个 C 罗职业生涯图鉴：86 个瞬间，每条都能点开出处

**正文：**

> 不是集锦站，也不是又一个致敬页。GOAT Atlas 把 C 罗的 86 个名场面按 6 个章节排成一张可以检索的地图：比分、日期、球场、背景故事，以及每条记录对应的来源。
>
> 来源做了分级：官方（赛事组织 / 俱乐部 / 联赛）> 媒体 > 百科。单源记录会明确标出来，不会假装“已证实”。目前 981 球（俱乐部 835 + 国家队 146），距离 1000 球还差 19 球。
>
> 另外还有：每天 5 题的 60 题题库、历史上的今天、1000 球进度、7 张 CC 授权照片的影像档案，以及一个可以点开看的 FIFA 官方 2018 集锦。免费、开源、没有广告。
>
> 网址：https://haohaohao-cell.github.io/goat-atlas/
>
> 最欢迎的反馈是**具体的事实纠错**：哪一场日期 / 比分 / 对手不对，或者有更权威的来源。带链接来，我会改。

**注意：** 部分社区限制正文外链。若不能贴链接，把网址放在主页/签名，正文写“搜 GOAT Atlas / 主页有链接”。

---

## 四、文案 B：Reddit / 英文社区（r/soccer）

**Title:**

> I built a source-first Cristiano Ronaldo career atlas — 86 moments, every entry links to its evidence

**Body:**

> Most Ronaldo content is either a highlight reel or a stats table. I wanted a map: 86 moments across 6 chapters, each with score, date, venue, context, and a clickable source.
>
> Sources are tiered: official (competition / club / league) > media > reference. Single-source entries are labelled as such instead of pretending to be confirmed. Right now it tracks 981 career goals (835 club + 146 Portugal), 19 short of 1000.
>
> Also included: a 60-question daily quiz, an on-this-day page, milestone tracking, 7 CC-licensed photos with full attribution, and a click-to-load FIFA embed for the 2018 Spain hat-trick.
>
> It's free, open source, and static. The content is Chinese-first; the `/en/` page is an overview, not a full translation.
>
> Link: https://haohaohao-cell.github.io/goat-atlas/
>
> Feedback welcome — especially factual corrections with sources. Issue templates: https://github.com/haohaohao-cell/goat-atlas/issues

---

## 五、文案 C：X / Twitter

> 86 moments. 6 chapters. 78 sources. One career.
>
> A source-first Cristiano Ronaldo atlas — every entry links to its evidence, with official/media/reference tiers.
>
> 60-question daily quiz, 1000-goal tracker (981), CC photo archive, FIFA 2018 embed.
>
> Free & open source: https://haohaohao-cell.github.io/goat-atlas/

Hashtags（可选，别堆）：`#CR7 #Ronaldo #Football`

---

## 六、发布节奏建议

| 时间 | 动作 |
| --- | --- |
| Day 1 | GitHub 更新 README；发 1 个最熟的中文社群 |
| Day 2–3 | 根据第一批反馈改 1–2 个具体问题，再发第 2 个渠道 |
| Day 4–7 | Reddit / X（英文），用英文文案 |
| Week 2 | 整理反馈，决定下一轮做 analytics 还是补内容 |

不要同一天全平台发同一段话；每个渠道至少改开头一句。

---

## 七、收反馈时问的三个问题

1. 你是从哪一条记录开始看的？
2. 有没有哪条数据你一眼觉得不对？（请附来源）
3. 你会为了“每日问答 / 历史上的今天”再回来吗？

---

## 八、不要说的话

- 不要说“进球级实时推送”——目前是 6 小时同步 + 赛前日历。
- 不要说“有助攻数据”——免费方案拿不到。
- 不要说“全站可离线”——service worker 只缓存访问过的页面。
- 不要说“多球员平台”——当前是单球员结构。
- 不要说“公共多用户 bot”——Bot 是单频道广播。

---

## 九、当前数据口径（2026-10-25）

| 指标 | 值 |
| --- | ---: |
| Moments | 86 |
| 章节 | 6 |
| 唯一来源 | 78 |
| 来源分级 | 官方 5 / 媒体 28 / 百科 54 |
| 生涯总进球 | 981（俱乐部 835 + 国家队 146） |
| 距 1000 球 | 19 |
| 问答题库 | 60 |
| 影像档案 | 7 张 CC 授权照片 |
| 官方视频 | 1 个 FIFA 嵌入 + 3 个官方频道外链 |
