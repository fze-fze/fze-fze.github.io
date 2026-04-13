# fze's journal

一个只保留文章的 Astro 静态博客，但首页仍保留了两个轻量的习惯打卡区块：`早睡` 和 `冥想`。

现在站点已经从 `文章 / 随笔 / 计划` 收敛成单线结构：公开内容只保留 `articles`，首页、导航、列表页和详情页都围绕文章展开；打卡数据只作为首页底部的个人习惯记录存在。

## 这次改了什么

- 删除了 `随笔 / 计划` 相关内容、页面和组件
- 顶部导航现在只保留 `首页 / 文章`
- 首页现在只展示文章，不再出现随笔区、计划区和 Todo List
- 内容 schema 现在只保留 `articles`
- 保留了首页底部的 `早睡 / 冥想` 打卡展示，以及对应的数据脚本

## 项目怎么运转

这个项目可以直接理解成三层：

1. 内容层  
   [src/content/articles](/Users/fze/Documents/fze/code/fze-fze.github.io/src/content/articles) 是唯一内容入口，文章和文章本地图都放这里。

2. 规则层  
   [src/content.config.ts](/Users/fze/Documents/fze/code/fze-fze.github.io/src/content.config.ts) 负责校验文章 frontmatter，字段写错会在构建时直接报出来。

3. 展示层  
   首页、文章列表页、文章详情页构成现在的博客骨架。页面在 `src/pages`，布局和组件在 `src/layouts`、`src/components`。

## 日常维护

### 新增文章

参考模板：[src/content/articles/template.md](/Users/fze/Documents/fze/code/fze-fze.github.io/src/content/articles/template.md)

常用 frontmatter：

```md
---
title: 文章标题
description: 用一句话概括文章内容
date: 2026-03-22
cover: ./your-slug/cover.jpg
tags:
  - 标签一
draft: false
---
```

维护约定：

- 想置顶，就在 `tags` 里加上 `置顶🔝`
- 其他文章默认按日期倒序排列
- 文章配图和封面图放在 `src/content/articles/<slug>/`
- 正文图片优先使用相对路径，例如 `![说明](./your-slug/your-image.png)`
- `draft: true` 的文章不会出现在正式页面

### 调整站点信息

如果要改站点标题、描述、导航，入口在：

[src/data/site.ts](/Users/fze/Documents/fze/code/fze-fze.github.io/src/data/site.ts)

### 页面怎么读数据

- 首页读取 `articles`，挑出一篇主文章和几篇侧栏文章
- 首页底部还会读取 `src/data/sleepCheckins.ts` 和 `src/data/mindfulnessCheckins.ts`，显示点状习惯打卡
- `/articles` 展示完整文章列表
- `/articles/[slug]` 渲染单篇文章详情

文章排序逻辑在：

[src/utils/content.ts](/Users/fze/Documents/fze/code/fze-fze.github.io/src/utils/content.ts)

这里现在只保留一件事：文章置顶排序。

## 打卡维护

习惯打卡的数据入口有两份：

- [src/data/sleepCheckins.ts](/Users/fze/Documents/fze/code/fze-fze.github.io/src/data/sleepCheckins.ts)
- [src/data/mindfulnessCheckins.ts](/Users/fze/Documents/fze/code/fze-fze.github.io/src/data/mindfulnessCheckins.ts)

推荐优先走脚本，不要手改：

```bash
node scripts/update-habit-checkin.mjs --habit sleep
node scripts/update-habit-checkin.mjs --habit mindfulness
node scripts/update-habit-checkin.mjs --habit sleep --date 2026-04-13
```

也可以直接用 npm 别名：

```bash
npm run habit:sleep
npm run habit:mindfulness
```

这套脚本会自动处理四件事：

- 默认按当天日期写入
- 本地时间凌晨 `02:00` 前执行，会默认记到前一天
- 跨月时自动创建新的 `YYYY-MM` key
- 同一天重复执行时会跳过，不会重复写入

如果你在 macOS 的“快捷指令”里绑定脚本入口，可以直接调用：

- `scripts/shortcuts/checkin-sleep.sh`
- `scripts/shortcuts/checkin-mindfulness.sh`

## 文章页补充说明

文章详情页保留了链接增强逻辑：

- 单独一行、且只有一个外链时，会渲染成预览卡片
- 段落里的普通链接仍然按正文链接显示

入口在：

[src/layouts/PostLayout.astro](/Users/fze/Documents/fze/code/fze-fze.github.io/src/layouts/PostLayout.astro)

如果后面你想继续微调正文观感，优先改这里，不要去每篇 Markdown 里重复补样式。

## 发布方式

仓库已经接好了 GitHub Pages 自动部署：

- 工作流文件：[.github/workflows/deploy.yml](/Users/fze/Documents/fze/code/fze-fze.github.io/.github/workflows/deploy.yml)
- 推送到 `main` 后会自动构建并发布
- 线上地址：[https://fze-fze.github.io/](https://fze-fze.github.io/)

## 目录速览

```text
/
├─ public/
│  └─ images/                 # 站点级静态图片
├─ src/
│  ├─ components/             # 导航、卡片等通用组件
│  ├─ content/
│  │  └─ articles/            # 唯一内容源
│  ├─ data/                   # 站点信息
│  ├─ layouts/                # 基础布局与文章布局
│  ├─ pages/                  # 首页、文章列表、文章详情
│  ├─ styles/                 # 全局样式
│  └─ content.config.ts       # 内容 schema
├─ astro.config.mjs
├─ .github/workflows/deploy.yml
└─ package.json
```

## 本地开发

```bash
npm install
npm run dev
```

常用命令：

- `npm run dev`
- `npm run build`
- `npm run preview`

## 给未来维护者的一句话

这个项目最适合的维护方式，不是频繁重搭，而是把它当成一套稳定的内容系统来照顾：

- 更新内容，优先改 Markdown
- 改站点信息，优先改 `src/data/site.ts`
- 改视觉或结构，再去动页面、布局和组件
- 涉及字段变更，先改 schema

顺着这个顺序维护，项目会一直很轻，也很好学。
