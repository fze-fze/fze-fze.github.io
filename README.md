# fze's journal

一个极简、安静、易维护的静态博客骨架：白底黑字、清晰层级、Markdown 驱动内容。

## 这次做了什么

- 用 `Astro` 初始化了静态博客底座
- 建好了 `首页 / 文章 / 每周计划` 三个主板块
- 使用 `src/content/articles` 和 `src/content/plans` 管理 Markdown 内容
- 把界面收敛成更极简的白色风格：
  - 白底黑字，阅读更直接
  - 去掉状态栏式标签和多余装饰
  - 更强调正文阅读和内容入口
- 首页“最近文章”改成了 `sticky storytelling` 结构：
  - 用独立的 `StickySection` 给首页这段提供完整滚动空间
  - 左侧主卡在 sticky 期间保持稳定，只做极轻的位移和缩放
  - 右侧三张卡根据 section progress 分层推进，形成更明显的滚动节奏
  - 同时压缩了和下一个区块之间的留白，避免中段发空
- 底部改成三段式结构：
  - 左侧联系方式图标
  - 中间小商标式 `fze's journal`
  - 右侧当前地址 `中国`
- 提供了文章和周计划模板，方便后续直接复制写作

## 项目结构

```text
/
├─ src/
│  ├─ components/        # 导航、Hero、摘要组件
│  ├─ content/
│  │  ├─ articles/       # 文章 Markdown
│  │  └─ plans/          # 每周计划 Markdown
│  ├─ layouts/           # 基础布局、正文布局
│  ├─ pages/             # 路由页面
│  ├─ styles/            # 全局视觉 token 和样式
│  ├─ data/              # 站点信息和导航
│  └─ content.config.ts  # 内容 schema 校验
├─ astro.config.mjs
└─ package.json
```

## 怎么启动

```bash
npm install
npm run dev
```

默认本地开发地址一般是 `http://localhost:4321`。

## 怎么新增文章

1. 复制 [src/content/articles/template.md](/Users/fze/Documents/fze/code/NewBlog/src/content/articles/template.md)
2. 改文件名为你想要的 slug，比如 `my-first-post.md`
3. 填好 frontmatter：

```md
---
title: 文章标题
description: 文章摘要
date: 2026-03-22
tags:
  - 标签一
draft: false
---
```

4. 写正文
5. 保存后，文章会自动出现在 `/articles`，并生成对应详情页

## 怎么新增每周计划

1. 复制 [src/content/plans/template.md](/Users/fze/Documents/fze/code/NewBlog/src/content/plans/template.md)
2. 改文件名，比如 `2026-week-13.md`
3. 填好 frontmatter：

```md
---
title: 第 13 周计划 / 本周主题
week: 2026 · Week 13
status: active
summary: 一句话总结这周重点
goals:
  - 目标一
review:
  - 一条复盘
draft: false
---
```

4. 按模板填写“本周目标 / 推进中 / 已完成 / 复盘”
5. 保存后，它会自动出现在 `/plans`

## 内容规范

### `articles`

- 必填：`title` `description` `date`
- 可选：`tags` `cover` `draft`

### `plans`

- 必填：`title` `week` `status` `summary`
- 可选：`goals` `review` `draft`
- `status` 只能是：`planned` / `active` / `done`

如果 frontmatter 写错，Astro 内容集合会在开发或构建时直接报错，方便尽早发现问题。

## 设计说明

这套界面不是传统博客模板，也不追求复杂视觉效果，而是更接近一种克制的内容工作台：

- 首页像海报，负责建立气质和入口
- 列表页像信号面板，负责归档和导航
- 详情页回到高可读正文，负责让内容站住

重点不是堆组件，而是让内容在统一、安静的视觉语言里被长期维护。

## 后续可以继续加什么

- 标签归档页
- 自动部署
- RSS
- 文章封面图规范
- 深浅色主题切换
