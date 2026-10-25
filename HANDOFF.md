# GOAT Atlas 交接文档

> 最后更新：2026-10-25  
> 当前 main commit：以 `git log -1 --oneline` 为准  
> 用途：新开对话时，让新 agent 快速接上项目，不需要重新摸索。

---

## 0. 新对话开场提示

把下面这段直接贴给新对话：

```text
我们在继续开发 GOAT Atlas（C 罗职业生涯图鉴）。

请先读：
1. HANDOFF.md
2. README.md
3. data/moments.json、data/live.json、data/milestones.json

然后运行：
- git status
- pnpm validate
- pnpm typecheck

不要重新讨论已经定过的方向：
- 来源优先，不写没有出处的“事实”
- 免费数据方案优先，不买 API
- 当前只有 C 罗，单球员结构
- 多语言只保留 /en /pt 入口页，不做全站翻译
- Bot 是单频道广播，不做公共多用户 bot
- 不再盲目堆 Atlas 页面，先做发布前收口

当前优先级：
1. 小范围发布 + 收 5–10 条反馈
2. 发布后：analytics / RSS / JSON-LD
3. 补内容缺口：2015 / 2019 / 2024

先告诉我你读到了什么、当前状态是否一致，再开始改代码。
```

---

## 1. 项目一句话

**GOAT Atlas 是一个开源、可检索、每条记录尽量有来源的 C 罗职业生涯图鉴。**

不是 tribute page，不是新闻聚合，也不是完整数据库。它是“策展式样本 + 可验证来源 + 可分享的故事”。

长期想法：同一套结构以后可以服务其他球员，但**当前没有实现多球员**。

---

## 2. 线上地址

| 项目 | 地址 |
| --- | --- |
| 线上站点 | <https://haohaohao-cell.github.io/goat-atlas/> |
| 仓库 | <https://github.com/haohaohao-cell/goat-atlas> |
| Actions | <https://github.com/haohaohao-cell/goat-atlas/actions> |
| Atlas | <https://haohaohao-cell.github.io/goat-atlas/atlas/> |
| Live | <https://haohaohao-cell.github.io/goat-atlas/live/> |
| Matches | <https://haohaohao-cell.github.io/goat-atlas/matches/> |
| Today | <https://haohaohao-cell.github.io/goat-atlas/today/> |
| Milestones | <https://haohaohao-cell.github.io/goat-atlas/milestones/> |
| Play | <https://haohaohao-cell.github.io/goat-atlas/play/> |

GitHub 账号：`haohaohao-cell`  
仓库是 public，Pages 使用 GitHub Actions 部署。

---

## 3. 当前数据快照

| 指标 | 当前值 |
| --- | ---: |
| Moments | **86** |
| 唯一来源 | **78** |
| 章节 | 6 |
| 问答题库 | 60 |
| 对比指标 | 6 |
| Live fixtures | 6 |
| 最近比赛 | 10 |
| Live provider | Wikipedia (fallback) |
| Live status | fallback |
| 赛季 | 2026-27 |
| 生涯总进球 | **981** |
| 距离 1000 球 | **19** |
| Today 精确覆盖 | 72 个不同月日 / 365 ≈ **19.7%** |
| 问答重复周期（期望） | 约 **12 天**（60 题 ÷ 5 题/天；每天独立洗牌，不保证不重复） |
| 来源分级 | 官方 **4** / 媒体 **28** / 百科 **55**（共 87 条链接，按域名自动分级） |

### 生涯进球口径

- 俱乐部：**835**
- 葡萄牙国家队：**146**
- 合计：**981**
- 历史俱乐部固定值：**701**（Sporting 5 + 曼联 118 + 皇马 450 + 尤文 101 + 曼联二期 27）
- Al-Nassr 全赛事：**134**
- 目标：1000，还差 19

注意：曾经手工填过 982（836 + 146），后来 `sync:milestones` 从 Wikipedia 生涯统计表抓到 835，自动修正为 981。**以页面/自动同步为准，不要硬改回 982。**

---

## 4. 已定方向（不要重新讨论）

1. **来源优先**：每条 moment 至少一个 source；比分、日期、出场数是事实，“为什么重要”是编辑判断。
2. **免费数据优先**：API-Football 免费版不能访问当前赛季，继续用 Wikipedia fallback；不买付费 API。
3. **没有助攻**：免费方案拿不到助攻，不假装有。
4. **没有进球级实时推送**：目前是 6 小时同步 + 赛前日历提醒 + Bot 摘要，不是进球后几十秒推送。
5. **Web + 可添加到主屏幕优先**，小程序后置，App 最后。
6. **多语言只做入口页**：`/en/`、`/pt/` 是 overview，不是全站翻译；Header 语言切换已移除；hreflang 只在两个入口页。
7. **Bot 是单频道广播**：Telegram / Discord / ntfy 任一通道；不是公共多用户 bot。
8. **社区后置**：Phase 4，等有复访和审核能力再做。
9. **不再盲目堆页面**：86 条已经够第一版，接下来先做发布前收口。

---

## 5. 技术栈

- Next.js `16.4.3` App Router
- React `19.3.1`
- TypeScript `5.9.3`
- Zod `4.6.7`
- `html-to-image` `1.11.13`
- pnpm `11.28.5`
- 静态导出到 GitHub Pages

### 为什么用 webpack

`next build` 的 Turbopack 在当前 Windows/pnpm 环境会报找不到 `next/package.json`，所以脚本固定：

```json
"build": "next build --webpack",
"dev": "next dev --webpack"
```

不要改回 Turbopack，除非你实际验证通过。

### Pages 配置

`next.config.ts` 在 `GITHUB_PAGES=true` 时：

- `output: "export"`
- `trailingSlash: true`
- `images.unoptimized: true`
- `basePath` 来自 `NEXT_PUBLIC_BASE_PATH`

线上 basePath：`/goat-atlas`

本地普通开发可以不设这些环境变量。

---

## 6. 常用命令

```bash
pnpm dev
pnpm validate
pnpm typecheck
pnpm build
pnpm calendar
pnpm sync:live
pnpm sync:milestones
pnpm bot
```

### 构建 Pages 版本

PowerShell：

```powershell
$env:GITHUB_PAGES="true"
$env:NEXT_PUBLIC_BASE_PATH="/goat-atlas"
$env:NEXT_PUBLIC_SITE_URL="https://haohaohao-cell.github.io"
$env:NEXT_PUBLIC_GITHUB_URL="https://github.com/haohaohao-cell/goat-atlas"
pnpm build
```

构建产物在 `out/`。

---

## 7. 主要目录

```text
app/
  page.tsx                 首页
  atlas/                   Atlas 检索 + 详情
  story/                   滚动故事
  live/                    Live 数据
  matches/                 赛程 + 日历
  play/                    玩法入口
  quiz/                    每日问答
  compare/                 GOAT 对比
  today/                   历史上的今天
  milestones/              里程碑
  about/                   关于 + roadmap
  offline/                 离线回退页
  en/ pt/                  英文/葡语 overview
components/
  AtlasExplorer.tsx
  StoryExperience.tsx
  ShareCard.tsx
  QuizGame.tsx
  CompareTool.tsx
  MatchCalendarActions.tsx
  ServiceWorkerRegister.tsx
  MomentCard.tsx / EraCard.tsx
  Icons.tsx
public/
  sw.js                    service worker（导航 network-first / 静态 cache-first）
data/
  player.json              单球员资料 + 6 个章节
  moments.json             86 条名场面
  live.json                当前赛季 / 比赛 / fixtures
  milestones.json          里程碑 + 1000 球 ledger
  quiz.json                60 题
  compare.json             6 个对比指标
  bot-state.json           Bot 已发送状态
lib/
  data.ts                  moments/player 加载、排序、关联
  live.ts
  quiz.ts
  compare.ts
  today.ts
  milestones.ts
  schemas.ts
  types.ts
  site.ts                  basePath / absoluteUrl
scripts/
  validate-data.mjs
  sync-live.mjs
  sync-milestones.mjs
  generate-calendar.mjs
  bot.mjs
```

---

## 8. 功能状态

| 功能 | 状态 | 说明 |
| --- | --- | --- |
| Atlas 检索 / 详情 | ✅ | 86 条，按章节/类型/对手/关键词筛选 |
| 分享卡 | ✅ | 4:5 图片，Web Share / 下载 / 复制 |
| Story | ✅ | 6 章节滚动叙事 |
| Live | ⚠️ | 6 小时同步，Wikipedia fallback，无助攻 |
| Match Center | ✅ | 赛程、最近比赛、进球分钟 |
| 日历 ICS | ✅ | 6 个 fixture，赛前提醒，描述带里程碑 |
| 每日问答 | ✅ | 60 题，每天 5 题，约 12 天期望周期 |
| GOAT 对比 | ✅ | 6 指标，默认 3:3 / 50:50，权重可调 |
| Today | ✅ | 有精确日期就展示，没有就“今日坐标” |
| 里程碑 | ✅ | 981/1000，自动同步 |
| 来源分级 | ✅ | 官方 / 媒体 / 百科；详情页显示分级、域名与单源提示 |
| 多语言 | ⚠️ | 仅入口页，非全站 |
| Bot | ✅ | 单频道，已真实收到 ntfy 消息 |
| PWA | ✅ | manifest + service worker；已访问页面断网可开，不预缓存全站 |
| 社区 | ❌ | 未开始 |
| 多球员 | ❌ | 单球员结构 |
| 小程序 / App | ❌ | 未开始，按计划后置 |

---

## 9. 自动化

### `deploy-pages.yml`

- push 到 main 自动部署
- 每 6 小时：
  1. `sync:live`
  2. `sync:milestones`
  3. 有变化才提交 `data/live.json` / `data/milestones.json`
  4. validate
  5. generate calendar
  6. build + deploy
- 已加 `paths-ignore: data/bot-state.json`，Bot 状态提交不会触发 Pages 重新部署

### `validate.yml`

- install
- validate
- typecheck
- build

### `link-check.yml`

- 每周一 `06:00 UTC` + `workflow_dispatch`
- `node scripts/check-links.mjs --report link-report.md`
- 404/410/5xx 或网络错误 → 失败，并自动开 / 更新 issue「来源链接需要修复」
- 401/403/429 视为“被反爬拦截”，只警告，不判死链

### `bot.yml`

- 每天 `00:00 UTC`（北京 08:00）发 daily digest
- `06/12/18 UTC` 检查未来 48 小时比赛
- 支持手动 `workflow_dispatch`：
  - `mode = daily | check`
  - `dry_run = true/false`
- 通道：
  - Telegram：`TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID`
  - Discord：`DISCORD_WEBHOOK_URL`
  - ntfy：`NTFY_TOPIC`（+ 可选 `NTFY_SERVER`）
- 没有配置通道时只打印，不报错
- `data/bot-state.json` 去重
- 真实发送后 workflow 会提交状态；如果 push 被拒，先 `git pull --rebase`

---

## 10. 已知问题 / 技术债

### P0

1. **单球员结构**：`player.json` 是单对象，`lib/data.ts` 直接导出 `player`，没有 `players[]` / `playerId`，无法扩展其他球员。

### P1

2. **没有 analytics / RSS / JSON-LD**：不知道谁在看、无法被 feed 订阅、SEO 结构化数据缺失。
3. **详情页 OG 是通用图**：分享链接预览没有每条 moment 的独立图。
4. **sitemap 静态页 lastModified 用构建时间**，不是真实更新时间。
5. **Today 精确覆盖率 19.7%**：大多数日期走“今日坐标”，这是设计，不是 bug。
6. **内容分布不均**：2015 只有 1 条，2019 2 条，2024 2 条。
7. **Bot 单频道**：不是公共多用户 bot。
8. **85 条记录只有 1 个来源**（其中 55 条只有 Wikipedia）：单源、百科级，需要逐步补官方或媒体第二来源。

### P2

9. 没有 E2E / Lighthouse / 可访问性审计。
10. `sync:milestones` 依赖 Wikipedia 生涯统计表，解析器脆弱，没有第二来源。
11. 多语言入口页面的内容仍然很少。

---

## 11. 最近完成

- 从 26 条扩到 86 条 moments
- 新增曼联一期 10 条
- 新增皇马 2009–2013 10 条
- 新增 2010–11 赛季 10 条
- 新增 2013–2018 皇马 10 条
- 新增 2018–2022 尤文/回归 10 条
- 新增 2023–2026 Al Nassr/世界杯 10 条
- 1000 球里程碑 + 自动同步（当前 981）
- Today / Milestones / Bot / ntfy
- 数据审计：修正世界杯轮次、localized 计数、2025 过期标签
- Roadmap 更新：Phase 3 完成，新增 Phase 3.5/5
- Bot 真实发送测试通过（ntfy）
- 题库 20 → 60（q21–q60 全部复用 moments 里已验证的来源）
- 来源分级：官方 / 媒体 / 百科，详情页显示分级、域名、单源提示与预填纠错 issue
- 链接检查器 + 每周 `link-check.yml`
- 首页新增 981/1000 生涯进球 ledger，首页数据改为跟随 milestones
- 修正 q17 题干年份（2023 → 2022 年底）、README 多球员/ntfy/PWA 口径
- PWA 补 service worker：导航 network-first、静态资源 cache-first、`/offline/` 回退

---

## 12. 下一步建议

### 发布前（推荐）

1. 小范围发布 + 收 5–10 条反馈

### 发布后

1. analytics（GoatCounter / Plausible）
2. RSS + JSON-LD
3. 每页 OG 图
4. 补 2015 / 2019 / 2024
5. 多球员架构
6. 公共 bot / 社区
7. 小程序 / App

---

## 13. 重要坑

- **不要**把 `982` 硬写回去；当前源表是 981。
- **不要**声称“进球级实时推送”或“有助攻”。
- **不要**声称“全站离线可用”或“首次访问即可离线”；service worker 只缓存访问过的页面。
- **不要**把 Bot 说成公共多用户 bot；它是单频道广播。
- **不要**重新加 Header 语言切换；已经决定只保留 `/en`、`/pt` 入口。
- **不要**用旧的 Wikipedia fixture 跑 `sync:milestones`，会把 981 回退成旧值；要跑就用当前线上页面。
- **不要**为了凑题写没有出处的冷知识；新增 quiz 题先确认 `source` 能打开、且与 `data/moments.json` 不矛盾。
- **不要**把媒体标成“官方”，也不要把懂球帝这类中文转述当唯一来源；它只能做二级来源。
- **不要**在本地用 `pnpm check:links` 的死链结果直接下结论：这台机器 DNS 被污染，真实结果以 GitHub Actions 的 `link-check` 为准。
- **不要**在 push 被拒时强推；Bot workflow 会提交 `data/bot-state.json`，先 `git pull --rebase`。
- PowerShell 下 `Get-Content` 可能把 UTF-8 显示成乱码，不代表文件坏了；用 read 工具或 Node 读取。
- `public/matches.ics` 每次 build 会重新生成，出现 CRLF warning 正常。
- `data/bot-state.json` 里的 `daily` 不要手工乱改；要测试就用 `dry_run` 或本地 `BOT_TODAY`。
- 当前 ntfy topic 曾在截图里出现；长期使用建议换新 topic 并更新 `NTFY_TOPIC`。
- `API_FOOTBALL_KEY` 存在也没用，免费版错误是：

```text
Free plans do not have access to this season, try from 2022 to 2024.
```

---

## 14. 结束语

这个项目最重要的不是“再加一个页面”，而是：

> **每条记录都有出处，读者能验证，球迷愿意回来。**

新 agent 请优先维护这个原则，再做功能。
