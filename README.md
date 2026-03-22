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
   `src/data/sleepCheckins.ts` 和 `src/data/mindfulnessCheckins.ts` 管计划页顶部的月度打卡数据。

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

### 3. 计划页除了 Markdown，还依赖两份手写数据

- 早睡打卡：`src/data/sleepCheckins.ts`
- 正念打卡：`src/data/mindfulnessCheckins.ts`

这两块不是从 Markdown 自动生成的，而是手动维护的月份记录。  
如果你发现计划页顶部的点阵没有更新，优先检查这两个文件。

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
│  └─ images/                 # 所有正式使用的静态图片
├─ src/
│  ├─ components/             # 卡片、导航、首页区块等组件
│  ├─ content/
│  │  ├─ articles/            # 文章内容
│  │  ├─ essays/              # 随笔内容
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
cover: /images/covers/articles/your-cover.jpg
tags:
  - 标签一
draft: false
---
```

补充约定：

- 想置顶，就在 `tags` 里加入 `置顶🔝`
- 封面图放 `public/images/covers/articles/`
- 正文配图放 `public/images/articles/<slug>/`

### 新增随笔

参考模板：[src/content/essays/template.md](/Users/fze/Documents/fze/code/fze-fze.github.io/src/content/essays/template.md)

最常用字段：

```md
---
title: 随笔标题
description: 一句话概括
date: 2026-03-22
cover: /images/covers/essays/your-cover.jpg
tags:
  - 随笔
draft: false
---
```

补充约定：

- 封面图放 `public/images/covers/essays/`
- 正文配图放 `public/images/essays/<slug>/`

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

- 早睡打卡：[src/data/sleepCheckins.ts](/Users/fze/Documents/fze/code/fze-fze.github.io/src/data/sleepCheckins.ts)
- 正念打卡：[src/data/mindfulnessCheckins.ts](/Users/fze/Documents/fze/code/fze-fze.github.io/src/data/mindfulnessCheckins.ts)

数据按月份维护，改完页面会自动按当月渲染。

### 调整全站信息

如果要改站点标题、描述、顶部导航，先看：

[src/data/site.ts](/Users/fze/Documents/fze/code/fze-fze.github.io/src/data/site.ts)

这是全站级配置入口，比去每个页面里硬改要稳得多。

## 几条重要约定

### 图片统一放 `public/images`

不要再把正式图片混放进 `src/content`。  
现在站内图片路径统一走 `/images/...`，这样本地开发和线上部署都更稳定。

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

## 给未来维护者的一句话

这个项目现在最适合的维护方式，不是频繁“重搭一遍”，而是把它当成一套已经稳定的内容系统来照顾：

- 内容更新，优先改 Markdown
- 站点信息更新，优先改 `src/data`
- 视觉改版，再动组件和页面
- 涉及字段变更，先改 schema

顺着这个顺序维护，项目会一直很轻，也很好学。
