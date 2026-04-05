# fze's journal

一个以内容为中心的 Astro 静态站点，主内容分成 `文章 / 随笔 / 计划` 三条线。  
现在这份 README 不再记录中途搭建过程，而是专门说明项目当前的维护逻辑和日常更新要点。

## 项目现在怎么运转

这个站点的维护思路可以简单理解成四层：

1. **内容层**
   `src/content/articles`、`src/content/essays`、`src/content/plans` 负责真正的内容输入，站点主要靠 Markdown 驱动。

2. **规则层**
   `src/content.config.ts` 负责校验 frontmatter。也就是说，标题、日期、状态这些字段不是随便写的，写错了构建时会直接暴露问题。

3. **展示层**
   `src/pages` 负责路由页面，`src/components` 和 `src/layouts` 负责页面结构与视觉表现。  
   平时如果只是发内容，通常不需要动这里；只有在改版式、交互或信息结构时才需要改。

4. **站点数据层**
   `src/data/site.ts` 管站点标题、描述、导航；  
   `src/data/sleepCheckins.ts` 和 `src/data/mindfulnessCheckins.ts` 管计划页顶部的月度打卡数据，日常更新优先走打卡脚本。

## 维护逻辑

### 1. 内容优先，页面自动读取

- 首页文章区会自动读取 `articles` 集合
- 随笔列表会自动读取 `essays` 集合
- “本周计划”会自动读取 `plans` 集合
- 带 `draft: true` 的内容不会出现在正式页面

这意味着日常维护时，最常见的工作不是改组件，而是新增或修改 Markdown。

### 2. 首页有几条固定选择规则

- 文章支持“置顶排序”：`tags` 里包含 `置顶🔝` 的文章会优先排在最前
- 其他文章按日期倒序排列
- 当前周计划会优先按 `YYYY-week-N` 这种 slug 自动匹配；如果本周还没写，会回退到最近一篇过去计划

所以：

- 想让一篇文章长期顶在前面，就加 `置顶🔝`
- 想让首页正确识别本周计划，就不要随意破坏计划文件名格式

### 3. 计划页除了 Markdown，还依赖两份打卡数据

- 早睡打卡：`src/data/sleepCheckins.ts`
- 正念打卡：`src/data/mindfulnessCheckins.ts`

现在推荐的维护方式不是手改，而是执行仓库里的打卡脚本。  
脚本会自动识别当天日期、自动补当月的 `YYYY-MM` key，并避免重复写入。

### 4. 发布是自动的，不需要再写施工步骤

仓库已经接好了 GitHub Pages 工作流：

- 配置文件在 [.github/workflows/deploy.yml](/Users/fze/Documents/fze/code/fze-fze.github.io/.github/workflows/deploy.yml)
- 推送到 `main` 后会自动构建并发布
- 正式地址是 [https://fze-fze.github.io/](https://fze-fze.github.io/)

所以 README 里不再保留那种一步步的构建过程记录；现在真正需要记住的是“内容怎么维护、哪些约定别破坏”。

## 目录速览

```text
/
├─ public/
│  └─ images/                 # 站点级静态图片（图标、通用资源）
├─ src/
│  ├─ components/             # 卡片、导航、首页区块等组件
│  ├─ content/
│  │  ├─ articles/            # 文章内容与文章本地图片
│  │  ├─ essays/              # 随笔内容与随笔本地图片
│  │  └─ plans/               # 每周计划内容
│  ├─ data/                   # 站点信息与打卡数据
│  ├─ layouts/                # 基础布局与正文布局
│  ├─ pages/                  # 路由页面
│  ├─ styles/                 # 全局样式
│  └─ content.config.ts       # 内容 schema
├─ astro.config.mjs
├─ .github/workflows/deploy.yml
└─ package.json
```

## 日常维护看这里

### 新增文章

参考模板：[src/content/articles/template.md](/Users/fze/Documents/fze/code/fze-fze.github.io/src/content/articles/template.md)

最常用字段：

```md
---
title: 文章标题
description: 文章摘要
date: 2026-03-22
cover: ./your-slug/cover.jpg
tags:
  - 标签一
draft: false
---
```

补充约定：

- 想置顶，就在 `tags` 里加入 `置顶🔝`
- 文章配图和封面图都放在 `src/content/articles/<slug>/`
- Markdown 正文里的图片优先写相对路径，例如 `![说明](./your-slug/your-image.png)`

### 新增随笔

参考模板：[src/content/essays/template.md](/Users/fze/Documents/fze/code/fze-fze.github.io/src/content/essays/template.md)

最常用字段：

```md
---
title: 随笔标题
description: 一句话概括
date: 2026-03-22
cover: ./your-slug/cover.jpg
tags:
  - 随笔
draft: false
---
```

补充约定：

- 随笔配图和封面图都放在 `src/content/essays/<slug>/`
- Markdown 正文里的图片优先写相对路径，例如 `![说明](./your-slug/your-image.png)`

### 新增每周计划

参考模板：[src/content/plans/template.md](/Users/fze/Documents/fze/code/fze-fze.github.io/src/content/plans/template.md)

最重要的不是标题，而是文件名格式：

`YYYY-week-N.md`

例如：

`2026-week-13.md`

常用 frontmatter：

```md
---
title: 第 13 周计划 / 本周主题
week: Week 13
status: active
goal:
  - text: 完成首页改版
    done: true
  - text: 写完一篇文章
    done: false
draft: false
---
```

补充约定：

- `status` 只能是 `planned` / `active` / `done`
- `goal` 支持 `text + done`
- 首页 Todo List 会直接读取 `goal`
- 首页计划摘要会优先从正文里的 `## 本周目标` 一节抽取内容

### 更新打卡

推荐入口：

```bash
node scripts/update-habit-checkin.mjs --habit sleep
node scripts/update-habit-checkin.mjs --habit mindfulness
node scripts/update-habit-checkin.mjs --habit sleep --date 2026-03-28
```

也可以直接用 npm 别名：

```bash
npm run habit:sleep
npm run habit:mindfulness
```

这套脚本会做三件事：

- 自动按当天日期写入
- 本地时间凌晨 `02:00` 之前执行时，默认仍记到前一天
- 跨月时自动创建新的 `YYYY-MM` 月份 key
- 同一天重复执行时自动跳过，不会重复打卡

- 早睡打卡：[src/data/sleepCheckins.ts](/Users/fze/Documents/fze/code/fze-fze.github.io/src/data/sleepCheckins.ts)
- 正念打卡：[src/data/mindfulnessCheckins.ts](/Users/fze/Documents/fze/code/fze-fze.github.io/src/data/mindfulnessCheckins.ts)

页面仍然按月份读取这两份数据文件。  
如果脚本没法用，才回退到手动编辑这两个文件。

### macOS 快捷指令

现在仓库里已经准备好了两个给快捷指令调用的脚本入口：

- 早睡：`scripts/shortcuts/checkin-sleep.sh`
- 冥想：`scripts/shortcuts/checkin-mindfulness.sh`

在 macOS 的“快捷指令”里各建一个快捷方式，名字就叫：

- `早睡打卡`
- `冥想打卡`

每个快捷指令都使用同样的结构：

1. 添加“运行 Shell 脚本”
2. Shell 选 `/bin/zsh`
3. 脚本内容填：

```bash
zsh "/Users/fze/Documents/fze/code/fze-fze.github.io/scripts/shortcuts/checkin-sleep.sh"
```

或：

```bash
zsh "/Users/fze/Documents/fze/code/fze-fze.github.io/scripts/shortcuts/checkin-mindfulness.sh"
```

4. 再接一个“显示结果”或“显示通知”，把脚本输出展示出来

这样以后你只要点一下快捷指令，就会自动按当天日期维护打卡。 
跨月时不需要再手动补新的月份 key。

### 调整全站信息

如果要改站点标题、描述、顶部导航，先看：

[src/data/site.ts](/Users/fze/Documents/fze/code/fze-fze.github.io/src/data/site.ts)

这是全站级配置入口，比去每个页面里硬改要稳得多。

### 文章链接现在有两种显示方式

文章详情页的正文链接现在会按写法自动分成两类：

- 单独一行、且这一行只有一个外链时，会自动渲染成预览卡片
- 出现在段落里的行内链接，会保留正文流式排版，但颜色和下划线会更明显
- 预览卡片会优先在构建时抓取目标页面的 OG 封面图；抓不到时会自动回退到站点 favicon

推荐写法：

```md
[生动早咖啡：在AI快速「回答」的时代，我们如何保持深度思考能力？](https://example.com/episode)
```

上面这种“独占一行”的链接会在文章页里显示成类似备忘录的卡片。  
如果你把链接写在一段话中间，它就会作为 inline link 显示，不会打断阅读节奏。

这套逻辑目前是在文章布局层做增强，入口在：

- [src/layouts/PostLayout.astro](/Users/fze/Documents/fze/code/fze-fze.github.io/src/layouts/PostLayout.astro)

它的好处是：不用改现有 Markdown 内容，旧文章也会自动获得新的链接展示效果。

### 文章引用块已收敛为原生 Markdown 风格

文章详情页里的 `blockquote` 现在不再使用“卡片式引用”，而是改回更接近 Markdown 默认渲染的样式：

- 透明背景
- 左侧浅灰竖线
- 更干净的段落流式排版

对应样式入口在：

- [src/layouts/PostLayout.astro](/Users/fze/Documents/fze/code/fze-fze.github.io/src/layouts/PostLayout.astro)

如果你后面想继续微调文章正文观感，优先在这个布局文件里改，不要去每篇 Markdown 里单独补样式。

## 几条重要约定

### 内容图片跟内容文件放在一起

现在文章和随笔的图片不再优先放 `public/images`，而是直接跟对应的 Markdown 放在同级内容目录里。  
这样做的主要原因是：Typora 打开单篇内容时，`./相对路径` 能直接预览图片，维护时也更不容易找错资源。

推荐结构：

```text
src/content/articles/
├─ 某篇文章.md
└─ 某篇文章/
   ├─ cover.jpg
   └─ figure-1.png
```

补充说明：

- `public/images` 现在更适合放全站通用资源，比如图标、下载按钮、站点级插图
- 和单篇内容强绑定的封面图、正文配图，优先放回对应内容旁边

### 计划 slug 不要随便改格式

当前周计划的识别逻辑依赖 `YYYY-week-N`。  
如果格式改乱，首页“本周计划”就可能拿不到正确内容。

### 内容 schema 以 `src/content.config.ts` 为准

如果你想给文章、随笔、计划新增字段，先改 schema，再改模板，再改页面读取逻辑。  
不要只在 Markdown 里偷偷加字段，不然很容易出现“内容写了，但页面没接住”的情况。

### 改内容和改结构是两类维护

- 改内容：优先动 `src/content` 和 `src/data`
- 改结构：再去动 `src/pages`、`src/components`、`src/layouts`

这样维护会更稳，也更不容易把展示逻辑和内容逻辑搅在一起。

## 本地开发

```bash
npm install
npm run dev
```

常用脚本在 [package.json](/Users/fze/Documents/fze/code/fze-fze.github.io/package.json)：

- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run habit:sleep`
- `npm run habit:mindfulness`

## 给未来维护者的一句话

这个项目现在最适合的维护方式，不是频繁“重搭一遍”，而是把它当成一套已经稳定的内容系统来照顾：

- 内容更新，优先改 Markdown
- 站点信息更新，优先改 `src/data`
- 视觉改版，再动组件和页面
- 涉及字段变更，先改 schema

顺着这个顺序维护，项目会一直很轻，也很好学。
