# Contributing to GOAT Atlas

线上地址：<https://haohaohao-cell.github.io/goat-atlas/>  
代码仓库：<https://github.com/haohaohao-cell/goat-atlas>

谢谢你来。这个项目最需要的不是更多代码，而是更准确的数据、更好的问题，以及愿意花时间核对细节的球迷。

## 你可以贡献什么

- **纠错**：日期、比分、对手、球场、出场数、来源有误
- **补充来源**：给已有记录加更权威的链接
- **新增名场面**：尤其是被现有 26 条忽略的节点
- **翻译**：英文、葡萄牙语，或把中文文案改得更像人话
- **代码**：搜索、可视化、可访问性、性能、PWA
- **设计**：分享卡模板、信息层级、移动端体验

## 数据修正

### 方式一：开 issue（推荐给第一次贡献的人）

使用 [Data correction issue](.github/ISSUE_TEMPLATE/data-correction.yml)，写清楚：

- 哪条记录（标题或 slug）
- 哪个字段错了
- 现在是什么
- 应该是什么
- 来源链接

### 方式二：直接提 PR

1. 修改 `data/moments.json`
2. 运行 `pnpm validate`
3. 本地打开页面确认
4. 提 PR，并在描述里贴来源

## 新增一条记录

先看现有记录的结构：

```json
{
  "id": "m06",
  "slug": "ucl-2008-final",
  "date": "2008-05-21",
  "title": "莫斯科雨夜，首夺欧冠",
  "titleEn": "Moscow, and the first Champions League",
  "kind": "trophy",
  "club": "Manchester United",
  "clubZh": "曼联",
  "competition": "欧冠决赛",
  "opponent": "Chelsea",
  "venue": "Luzhniki Stadium",
  "city": "Moscow",
  "score": "1-1（点球6-5）",
  "minute": "26'",
  "summary": "一句话说清楚发生了什么。",
  "context": "更完整的背景叙述，2–4 句。",
  "why": "为什么这个瞬间值得被记住。",
  "tags": ["trophy", "champions-league", "man-utd"],
  "featured": false,
  "era": "manchester-1",
  "stat": { "label": "冠军", "value": "欧冠" },
  "sources": [
    {
      "label": "2008 UEFA Champions League final — Wikipedia",
      "url": "https://en.wikipedia.org/wiki/2008_UEFA_Champions_League_final"
    }
  ]
}
```

字段说明：

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `id` | 是 | 唯一，格式 `mNN` |
| `slug` | 是 | URL 用，小写字母/数字/连字符，唯一 |
| `date` | 是 | `YYYY-MM-DD` |
| `title` | 是 | 中文标题，尽量短 |
| `titleEn` | 是 | 英文副标题 |
| `kind` | 是 | `goal` / `trophy` / `award` / `debut` / `moment` |
| `club` / `clubZh` | 是 | 英文/中文俱乐部或国家队 |
| `competition` | 是 | 赛事名称 |
| `opponent` | 否 | 对手 |
| `venue` / `city` | 否 | 球场/城市 |
| `score` / `minute` | 否 | 比分/时间 |
| `summary` | 是 | 卡片上的一句话 |
| `context` | 是 | 详情页的故事 |
| `why` | 是 | 为什么重要（编辑判断） |
| `tags` | 是 | 至少一个 |
| `featured` | 是 | 是否进入首页精选 |
| `era` | 是 | 必须是 `player.json` 里的章节 id |
| `stat` | 否 | 一个最有记忆点的数字 |
| `sources` | 是 | 至少一个可点击来源 |

`kind` 的选择：

- `goal`：具体进球或进球纪录
- `trophy`：夺冠、捧杯
- `award`：金球奖等个人荣誉
- `debut`：首秀
- `moment`：转会、告别、争议、情绪节点

## 质量标准

- **来源优先**：优先 Wikipedia / Wikidata、官方比赛报告、UEFA/FIFA 页面。
- **不编细节**：不确定的分钟、比分、观众人数，宁可不写。
- **区分事实与判断**：`context` 写事实，`why` 写为什么重要。
- **不搬运素材**：不要提交未授权的比赛照片、转播截图、俱乐部标志。
- **中文可读**：不要机翻腔；短句优先。
- **一条记录只讲一件事**：不要把整届赛事塞进一个条目。

如果你使用 AI 辅助写作或翻译，请逐条对照来源核实事实。没有来源的“感觉”不要写进 JSON。

## 本地开发

```bash
pnpm install
pnpm dev
pnpm validate
pnpm typecheck
```

构建：

```bash
pnpm build
```

## 代码约定

- TypeScript strict，尽量不引入 `any`
- 组件保持小而可读；客户端组件只在需要交互时使用
- 数据只在 `lib/data.ts` 里加载和排序，页面不直接读 JSON
- 新增样式优先复用 `app/globals.css` 里的变量
- 提交信息用英文，短句，例如：
  - `fix: correct 2014 Champions League final score`
  - `feat: add era filter to atlas`
  - `docs: explain data license`

## PR 检查清单

- [ ] `pnpm validate` 通过
- [ ] `pnpm typecheck` 通过
- [ ] `pnpm build` 通过
- [ ] 桌面和手机都看过
- [ ] 新记录带来源
- [ ] 没有提交未授权图片或 `.env`

## 行为准则

请保持基本的尊重。可以争论 GOAT，不要攻击人。详见 [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)。
