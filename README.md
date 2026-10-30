# GOAT Atlas

### 一个可检索、可追溯、可分享的 C 罗职业生涯图鉴

**An open, source-backed career atlas for Cristiano Ronaldo — and eventually every footballer.**

🔗 **Live site:** <https://haohaohao-cell.github.io/goat-atlas/>  
🌐 **English:** <https://haohaohao-cell.github.io/goat-atlas/en/> · **Português:** <https://haohaohao-cell.github.io/goat-atlas/pt/>  
💻 **Repository:** <https://github.com/haohaohao-cell/goat-atlas>  
📘 **Handoff:** [HANDOFF.md](HANDOFF.md)

`Next.js 16` · `TypeScript` · `86 moments` · `6 chapters` · `78 sources` · `60 quiz questions` · `MIT + CC BY-SA 4.0`

![GOAT Atlas preview](docs/preview.webp)

![English overview](docs/en.webp)

| Atlas 检索 | Story 故事 |
| --- | --- |
| ![Atlas](docs/atlas.webp) | ![Story](docs/story.webp) |

| Live 数据 | 分享卡 |
| --- | --- |
| ![Live](docs/live.webp) | ![分享卡](docs/share-card.webp) |

![Match Center](docs/matches.webp)

| Play 玩法 | GOAT 对比器 |
| --- | --- |
| ![Play](docs/play.webp) | ![Compare](docs/compare.webp) |

![Daily Quiz](docs/quiz.webp)

![On This Day](docs/today.webp)

![Milestone Watch](docs/milestones.webp)

---

## 为什么做这个

球迷不缺集锦，缺的是一张能反复查看、可以验证、还能继续补充的地图。

- **集锦在短视频里**，看完就滑走，找不到上下文。
- **数据在表格里**，很全，但没有故事。
- **故事在评论区里**，很热闹，但常常没有出处。

GOAT Atlas 把名场面、数据、上下文和来源放在同一个页面上。你可以把它当成一部可滚动的传记，也可以把它当成一个可检索的数据库。

C 罗是第一号展馆。当前代码仍是单球员结构（`player.json` 是单对象），多球员抽象排在 Phase 5。

## 现在有什么

- **Atlas 检索**：按章节、类型、对手、关键词筛选 86 个名场面
- **Story 故事模式**：六个章节，从里斯本到利雅得
- **详情页**：比分、时间、球场、背景故事、为什么重要、来源分级与纠错入口
- **分享卡**：一键生成 4:5 图片，支持 Web Share / 下载 / 复制链接
- **Live 数据**：最新赛季、最近比赛、C 罗进球分钟、里程碑；免费方案已启用，GitHub Actions 每 6 小时自动同步
- **本赛季动态**：只收可核实事实（比赛、里程碑、冠军、纪录），每条带来源
- **原创章节插画**：6 张 SVG 线稿用于详情页，随项目以 CC BY-SA 4.0 发布，见 `/credits/`
- **影像档案**：7 张 CC BY / CC BY-SA 授权照片，逐张署名并明确标注“资料图”，见 `/gallery/`
- **官方视频**：2018 世界杯 3-3 西班牙已嵌入 FIFA 官方集锦（点击加载、站内不托管）；其他节点挂官方频道外链
- **Match Center**：近期赛程、赛后战报、赛前提醒
- **日历订阅**：`matches.ics` 可导入 Google Calendar / Apple Calendar / Outlook
- **每日问答**：每天 5 题（60 题题库），答题解析、连续天数、结果分享卡
- **GOAT 对比器**：6 个可核实指标，默认权重公开，权重可调
- **历史上的今天**：日期精确匹配才叫 On This Day，没有匹配就展示“今日坐标”
- **里程碑追踪**：职业生涯 1000 球（每 6 小时自动同步，当前 985 = 俱乐部 839 + 国家队 146）、国家队 150 球、250 场、Al-Nassr 联赛 120 球/场等进度
- **多语言入口**：英文 / 葡语 overview（页脚入口，非全站翻译）
- **Bot 通知**：ntfy / Telegram / Discord 单频道广播，每日摘要与赛前提醒，GitHub Actions 定时发送
- **来源分级**：每条记录至少一个可点击来源，按官方 / 媒体 / 百科标注；单源记录会显式提示
- **RSS**：`/feed.xml` 输出最新 30 条 moments，页脚和 `<link rel="alternate">` 都可发现
- **结构化数据**：首页 WebSite + Person，详情页 Article + BreadcrumbList（JSON-LD）
- **OG 图**：首页 + 6 个章节各一张（1200×630），详情页按章节复用
- **PWA**：manifest + service worker，可添加到主屏幕；已访问过的页面断网时仍能打开（不预缓存全站）
- **响应式**：手机、平板、桌面一套代码
- **静态优先**：所有页面构建时生成，部署成本接近于零

## 为什么是网站，不是 App 或小程序

结论：**Web 是核心，小程序是渠道，App 是后置选项。**

| 形态 | 角色 | 原因 |
| --- | --- | --- |
| Web + PWA | 现在 | SEO、分享、迭代速度、GitHub 用户直接打开 |
| 小程序 | 之后 | 适合国内传播，但需要主体资质、审核，且与开源生态割裂 |
| 原生 App | 最后 | 成本最高，等留存验证后再用 Capacitor / Expo 套壳 |

一套数据层，多个展示壳。不要一开始写三套代码。

## 快速开始

要求：Node.js >= 20.9。

```bash
pnpm install
pnpm dev
```

打开 `http://localhost:3000`。

没有 pnpm 也可以用 npm：

```bash
npm install
npm run dev
```

常用命令：

```bash
pnpm validate    # 校验 data/*.json
pnpm typecheck   # TypeScript 类型检查
pnpm build       # 生产构建（会生成 matches.ics）
pnpm start       # 启动生产服务
pnpm calendar    # 单独生成 public/matches.ics
pnpm art         # 单独生成六张章节 SVG
pnpm sync:live   # 同步 Live 数据（API-Football / Wikipedia 回退）
pnpm check:links # 检查 data/*.json 里的来源链接（需要正常外网）
pnpm audit:media # 核对 Commons 候选图许可并下载（需要正常外网）
pnpm verify:video <url> # 用 YouTube oEmbed 验证视频标题与频道
```

> 构建默认使用 webpack（`next build --webpack`）。原因是 Next 16 + pnpm 在部分 Windows 环境下 Turbopack 解析 `next` 链接会失败；等上游稳定后可以切回 Turbopack。

## 项目结构

```text
app/
  page.tsx                 # 首页
  atlas/page.tsx           # Atlas 检索
  atlas/[slug]/page.tsx    # 名场面详情
  story/page.tsx           # 故事模式
  live/page.tsx            # Live 数据、最近比赛、同步状态
  matches/page.tsx         # 赛程、赛后战报、日历提醒
  play/page.tsx            # 玩法入口
  quiz/page.tsx            # 每日 5 题
  compare/page.tsx         # GOAT 对比器
  today/page.tsx           # 历史上的今天 / 今日坐标
  milestones/page.tsx      # 里程碑进度
  en/page.tsx              # English overview
  pt/page.tsx              # Portuguese overview
  about/page.tsx           # 项目、数据原则、路线图
  credits/page.tsx         # 素材与许可
  gallery/page.tsx         # 影像档案（CC 授权照片）
  offline/page.tsx         # 离线回退页
  manifest.ts              # PWA manifest
  feed.xml/route.ts        # RSS（静态导出）
  sitemap.ts / robots.ts   # SEO
components/
  AtlasExplorer.tsx        # 搜索 + 筛选（客户端）
  StoryExperience.tsx      # 滚动叙事 + 章节导航
  ShareCard.tsx            # 分享卡导出
  MatchCalendarActions.tsx # 日历下载 / 订阅链接复制
  QuizGame.tsx             # 每日问答、连击、结果卡
  CompareTool.tsx          # 加权对比器
  LocalizedHome.tsx        # 英文 / 葡语 overview
  ServiceWorkerRegister.tsx # 注册 /sw.js（仅生产）
  JsonLd.tsx               # JSON-LD 输出
  MomentCard.tsx
  EraCard.tsx
components/Icons.tsx
public/
  sw.js                    # service worker：导航 network-first，静态资源 cache-first
  matches.ics              # 构建时生成
  art/era-*.svg            # 六张原创章节插画（构建时生成）
  og/                      # 首页 + 6 章 OG 图
  media/gal-*.webp         # 影像档案（CC 授权，已压缩）
  icons/ og.png            # PWA 图标 / OG 图
data/
  player.json              # 球员、俱乐部、章节
  moments.json             # 86 条名场面记录
  live.json                # 最新赛季 / 比赛 / 同步状态
  updates.json             # 本赛季动态（人工策展，每条带来源）
  match-corrections.json   # 比赛级改判（sync:live 每次套用）
  gallery.json             # 影像档案（许可、作者、原始文件页）
  media-candidates.json    # Commons 候选图（CI 审计输入）
  quiz.json                # 每日问答题库
  compare.json             # GOAT 对比指标
  milestones.json          # 里程碑目标与当前进度
  bot-state.json           # Bot 已发送状态（不触发 Pages 部署）
lib/
  data.ts                  # 数据加载、排序、关联
  live.ts                  # Live 数据加载
  updates.ts               # 本赛季动态加载
  gallery.ts               # 影像档案加载
  quiz.ts                  # 每日出题
  compare.ts               # 对比数据加载
  today.ts                 # 日期匹配 / 今日坐标
  milestones.ts            # 里程碑进度计算
  content.ts               # 内容最后更新日期（sitemap 用）
  structured-data.ts       # WebSite / Person / Article / Breadcrumb JSON-LD
  sources.ts               # 来源分级（官方 / 媒体 / 百科）与纠错链接
  i18n.ts                  # 英文 / 葡语文案
  schemas.ts               # Zod schema
  types.ts
scripts/
  validate-data.mjs        # CI 数据校验
  check-links.mjs          # 来源链接检查（每周 CI）
  sync-live.mjs            # API-Football / Wikipedia → data/live.json
  sync-milestones.mjs      # Wikipedia 生涯统计表 → data/milestones.json
  generate-calendar.mjs    # data/live.json → public/matches.ics
  generate-era-art.mjs     # 六张章节 SVG 插画
  generate-og.py           # 首页 + 6 章 OG 图（可选，需 Pillow）
  audit-media.mjs          # Commons 图片许可核验 + 下载（CI）
  verify-video.mjs         # YouTube oEmbed 验证
  bot.mjs                  # Telegram / Discord 每日摘要与赛前提醒
  generate-assets.py       # 生成 OG 图和 PWA 图标（可选）
```

## 数据贡献

最需要的三类贡献：

1. **纠错**：日期、比分、对手、球场、来源有误。
2. **补充来源**：给已有记录加更权威的链接。
3. **新增名场面**：尤其是被现有 86 条忽略的节点。

流程：

```bash
# 1. 修改 data/moments.json
# 2. 跑校验
pnpm validate
# 3. 本地确认页面
pnpm dev
# 4. 提 PR
```

一条记录至少需要：

```json
{
  "slug": "ucl-2008-final",
  "date": "2008-05-21",
  "title": "莫斯科雨夜，首夺欧冠",
  "kind": "trophy",
  "era": "manchester-1",
  "summary": "一句话说清楚发生了什么。",
  "context": "更完整的背景叙述。",
  "why": "为什么这个瞬间值得被记住。",
  "tags": ["trophy", "champions-league"],
  "sources": [
    { "label": "2008 UEFA Champions League final — Wikipedia", "url": "https://..." }
  ]
}
```

质量标准：

- 日期使用 `YYYY-MM-DD`
- 至少一个可点击来源；优先官方（赛事组织 / 俱乐部 / 联赛），其次媒体，Wikipedia 只做索引与交叉核对
- 来源类型由 `lib/sources.ts` 按域名自动分级，也可以在数据里用 `"tier": "official" | "media" | "reference" | "other"` 覆盖
- 中文媒体（包括懂球帝）可以作为二级来源补充，但不替代官方或一手报道
- 区分**事实**（比分、时间）和**叙事**（为什么重要）
- 不确定的内容标注“待核实”，不要编
- 不搬运未授权的比赛照片或转播画面
- 图片 / 视频必须同时提供 `credit`、`license`、`sourceUrl`，缺一项就不要加；规则见 [credits 页](app/credits/page.tsx)
- “本赛季动态”只收可核实的事实，转会传闻和未证实伤病不进列表

图片 / 视频使用 `media` 字段（可选）：

```json
"media": {
  "type": "image",
  "src": "/media/example.jpg",
  "alt": "图片说明",
  "credit": "作者 / 机构",
  "license": "CC BY-SA 4.0",
  "sourceUrl": "https://commons.wikimedia.org/wiki/File:...",
  "width": 1200,
  "height": 800
}
```

新增或修改来源后，可以在有正常外网的环境跑：

```bash
pnpm check:links
```

它会检查 `data/*.json` 里的所有链接，输出 `link-report.md`；CI 每周也会自动跑一次并开 issue。

### 图片怎么加

只接受明确 CC 授权的图片（CC0 / CC BY / CC BY-SA）。流程：

1. 把 Commons 文件标题加进 `data/media-candidates.json`；
2. 手动跑 **Media audit** workflow（或 `pnpm audit:media`）；
3. 看 `media-audit/report.md`：只有许可证通过的图才会被下载；
4. 压缩成 WebP 放进 `public/media/`，在 `data/gallery.json` 写清 `credit / license / licenseUrl / sourceUrl`；
5. `pnpm validate` 会检查文件存在、许可白名单和必填字段。

懂球帝、门户、Getty / Reuters / 俱乐部图库的图片**只外链，不下载**；比赛画面和转播镜头不进入站内。

详细说明见 [CONTRIBUTING.md](CONTRIBUTING.md)。

## Live 数据怎么更新

**当前默认是免费方案：API-Football 免费版 → 自动回退 Wikipedia。** 不需要付费订阅，也不影响每 6 小时更新。

免费方案能拿到：

- 当前赛季联赛/国家队总量：出场、进球
- 最近比赛结果、比分
- C 罗每场进球分钟、点球标记

免费方案拿不到：

- 助攻
- 每分钟/每场完整事件流
- 进球级秒级推送

`data/live.json` 与 `data/milestones.json` 是自动数据入口。`.github/workflows/deploy-pages.yml` 会：

1. 每 6 小时运行一次 `pnpm sync:live`，调用 API-Football 拉取本赛季统计和最近比赛。
2. API-Football 不可用时，自动回退到 Wikipedia 的当前生涯数据与最近比赛。
3. 运行 `pnpm sync:milestones`，从 Wikipedia 生涯统计表更新 1000 球总数和 Al-Nassr / 国家队进度。
4. 只有数据变化时才提交 `chore: sync live and milestone data`，避免无意义 commit。
5. 重新构建静态站点并部署到 GitHub Pages。

配置 API key：

```bash
gh secret set API_FOOTBALL_KEY --repo haohaohao-cell/goat-atlas
```

或者在 GitHub 仓库的 **Settings → Secrets and variables → Actions** 中添加 `API_FOOTBALL_KEY`。

说明：

- **API-Football 免费版只开放 2022–2024 赛季**，当前赛季需要付费套餐。因此现在默认走 Wikipedia 回退：当前生涯数据 + 2026–27 赛季最近比赛。
- Wikipedia 回退只提供联赛/国家队总量和比赛结果；助攻、分钟、逐场事件要等 API-Football 付费套餐。
- 自动数据会进入 Live 和里程碑页，**不会自动改写 Atlas 里的策展故事**。新里程碑值得长期收藏时，再由编辑整理进 `moments.json`。
- 数据源默认是 [API-Football](https://www.api-football.com/)，回退源是 [Wikipedia](https://en.wikipedia.org/wiki/Cristiano_Ronaldo)。球员 ID 固定为 `874`，可用 `API_FOOTBALL_PLAYER_ID` / `API_FOOTBALL_SEASON` 覆盖。
- 里程碑页面使用 Wikipedia 生涯统计表口径：俱乐部 839 球 + 国家队 146 球 = **985 球**，距离 1000 球还差 15 球。`sync:milestones` 会在每次同步时更新总数和 Al-Nassr / 国家队进度；解析失败则保留上一次已验证的 ledger，不会写坏数据。数字会跟随源数据修正，以页面为准。赛后改判等比赛级修正放在 `data/match-corrections.json`，由 `sync:live` 每次套用。

## 赛前提醒怎么工作

日历路径不依赖 Telegram / Discord / 微信机器人，而是用系统日历；想要群通知，见下一节 Bot：

1. `scripts/generate-calendar.mjs` 从 `data/live.json` 的 `fixtures` 生成 `public/matches.ics`。
2. 用户下载文件，或把 `https://haohaohao-cell.github.io/goat-atlas/matches.ics` 添加到 Google Calendar。
3. 日历 App 在赛前 1 天和 12 小时（有开球时间时再加 1 小时）提醒；事件描述里会带当前里程碑差距。
4. 页面上的赛后战报由每 6 小时的 Live 同步更新。

这条路径没有账号体系、没有服务器、没有推送费用，缺点是不是“进球后几十秒”的实时推送。

## Bot 通知怎么开

Bot 是可选层，不配置也能正常部署。它复用同一套数据，不另写内容。

- **每天 00:00 UTC（北京 08:00）**：一条 Today / 1000 球进度摘要。
- **每 6 小时**：检查未来 48 小时内的比赛，赛前发一次提醒。
- **状态**：`data/bot-state.json` 记录已发送的日期/比赛，避免重复；这个文件的提交不会触发 Pages 重新部署。

### 1. ntfy（免注册，最省事）

如果 Discord 的手机验证被限流，直接用 ntfy。它不需要账号、不需要服务器、不需要手机号。

1. 选一个足够长的 topic，例如 `goat-atlas-cr7-7f3a9c2e`。  
   **topic 就是密码**，别人知道就能订阅和发消息，别用太简单的。
2. 在 GitHub 仓库 **Settings → Secrets and variables → Actions** 添加：

```text
NTFY_TOPIC=goat-atlas-cr7-7f3a9c2e
```

3. 手机装 **ntfy** App，或电脑打开：

```text
https://ntfy.sh/goat-atlas-cr7-7f3a9c2e
```

在 App 里订阅同一个 topic，或在网页里允许通知。
4. 自建 ntfy 服务器时，再加一个 `NTFY_SERVER`，否则默认 `https://ntfy.sh`。

### 2. Telegram

1. 找 `@BotFather` 创建 bot，拿到 `TELEGRAM_BOT_TOKEN`。
2. 给 bot 发一条消息，然后访问  
   `https://api.telegram.org/bot<TOKEN>/getUpdates`  
   找到 `chat.id`，填入 `TELEGRAM_CHAT_ID`。
3. 在 GitHub 仓库 **Settings → Secrets and variables → Actions** 添加这两个 secret。

### 3. Discord（可选）

在频道 **Integrations → Webhooks** 创建 webhook，把 URL 填入 `DISCORD_WEBHOOK_URL`。

### 4. 测试

在 Actions 里手动运行 **Bot notifications**：

- `mode = daily`
- `dry_run = true`

日志里会打印消息，不会真的发送。确认格式后再关掉 dry run。

本地测试：

```bash
BOT_DRY_RUN=1 BOT_MODE=daily node scripts/bot.mjs
BOT_DRY_RUN=1 BOT_MODE=check BOT_TODAY=2026-10-28 node scripts/bot.mjs
```

`BOT_TODAY` 只用于测试，不会写进线上数据。

### 5. 不配置会怎样

没有 `NTFY_TOPIC` / `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID` / `DISCORD_WEBHOOK_URL` 时，脚本只打印“未配置”，不会报错、不会写状态。整个站点和自动同步继续正常工作。

## “历史上的今天”怎么不硬编

- 只有 `data/moments.json` 里存在同月同日记录时，才显示“历史上的今天”。
- 没有精确匹配时，页面会明确写“今天没有收录”，然后展示一个按日期确定的“今日坐标”。
- 当前 86 条数据决定命中率不会高；随着 Atlas 变厚，这个页面会越来越有内容。
- 分享卡、详情页和来源链接都复用同一套数据，不另写一份。

## 多语言现在到哪一步

- **入口页 only**：英文 `/en/`、葡语 `/pt/` overview，页脚有轻量入口；Header 语言切换已撤掉。
- **hreflang only on entry pages**：只有 `/en/`、`/pt/` 输出多语言 alternate，中文深页不再声明英文版。
- **仍以中文为主**：86 条名场面的长文、问答题库、故事叙述目前是中文。
- **不直接机翻上线**：深度内容需要逐条校对，避免把错误翻译写进“有出处”的 Atlas。
- 目前冻结翻译，优先扩充 Atlas 数据，而不是堆更多空页面。

## 数据与许可

- **代码**：[MIT](LICENSE)
- **策展数据**：[CC BY-SA 4.0](DATA-LICENSE.md)
- **第三方内容**：来源链接指向的页面、商标、比赛画面归各自权利人所有

数据不是完整数据库，而是一份策展式样本：86 条记录覆盖职业生涯关键坐标，远未穷尽所有比赛和进球。每条记录尽量保留可核验来源，欢迎纠错。

## Roadmap

| 阶段 | 内容 | 状态 |
| --- | --- | --- |
| Phase 1 | 内容底座：时间线、检索、详情、来源、分享卡 | ✅ 已完成 |
| Phase 1.5 | Live 数据层 + 6 小时自动同步 | ✅ 已完成（免费 Wikipedia fallback） |
| Phase 2 | 每日问答、GOAT 对比器 | ✅ 已完成 |
| Phase 3 | “历史上的今天”、里程碑追踪、提醒 bot、多语言 | ✅ MVP 已完成（Bot 单频道；翻译暂缓） |
| Phase 3.5 | 发布准备：题库扩容、PWA 离线（已完成）、分享与反馈 | 进行中 |
| Phase 4 | 球迷社区（先用 GitHub Discussions / 现成社群） | 等待时机 |
| Phase 5 | 多球员 Atlas、小程序、App | 长期 |

完整说明见 [About 页面](app/about/page.tsx) 和 [CONTRIBUTING.md](CONTRIBUTING.md)。

当前不建议继续堆页面。发布前只剩一件事：

1. 补最小分发反馈：至少知道哪些页面有人看。

题库已从 20 题扩到 60 题（每天 5 题，约 12 天的期望周期；每天独立洗牌，不保证不重复）。PWA 已补 `public/sw.js`：导航 network-first、静态资源 cache-first，断网时回退到已缓存页面或 `/offline/`。

## 部署

### GitHub Pages（当前默认）

当前线上地址：<https://haohaohao-cell.github.io/goat-atlas/>

仓库已包含 `.github/workflows/deploy-pages.yml`：

- push 到 `main` 自动构建并部署
- 每 6 小时同步 Live 数据并重新部署
- 静态导出由 `GITHUB_PAGES=true` 触发，输出到 `out/`
- 子路径由 `NEXT_PUBLIC_BASE_PATH=/<repo-name>` 处理

首次使用时，在仓库 **Settings → Pages → Build and deployment** 选择 **GitHub Actions**。

### Vercel（可选）

项目没有绑定 GitHub Pages，也可以直接导入 Vercel：

1. 把仓库导入 Vercel。
2. Framework 选择 Next.js，构建命令保持 `pnpm build`。
3. 设置环境变量：

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_GITHUB_URL=https://github.com/your-name/goat-atlas
```

Vercel 构建不设置 `GITHUB_PAGES`，因此不会启用 `basePath` 和静态导出。`NEXT_PUBLIC_GITHUB_URL` 可选；不设置时页面不会显示 GitHub 入口。

## 免责声明

这是一个非官方球迷项目，与 Cristiano Ronaldo、任何俱乐部、联赛或足协均无隶属关系。站内不使用官方标志、赛事转播画面或未授权照片。数据仅供参考，欢迎带着来源纠错。

---

如果这个项目对你有用，欢迎 star、提 issue，或者只是把它发给一个懂球的朋友。
