# fze's journal

一个极简、安静、易维护的 Astro 静态博客：白底黑字，Markdown 驱动，重点始终是内容本身。

## 这次做了什么

- 建好了 `首页 / 文章 / 随笔 / 每周计划` 四个主板块
- 内容统一放在 `src/content/articles`、`src/content/essays`、`src/content/plans`
- 补上了 GitHub Pages 部署配置：
  - `astro.config.mjs` 现在使用正式站点地址 `https://fze-fze.github.io`
  - 仓库已切到用户主页仓库模式，不再使用 `/NewBlog` 前缀
  - 新增 [.github/workflows/deploy.yml](/Users/fze/Documents/fze/code/NewBlog/.github/workflows/deploy.yml)，推送到 `main` 后自动构建并发布
  - 站内导航、列表跳转和页脚图标统一基于 `BASE_URL` 生成，路径在本地和线上都能保持一致
- 首页改成更稳的编辑式结构：
  - 左侧主文章，右侧次级入口
  - 最近随笔独立展示
  - 每周计划单独归档
- 清理了一轮仓库冗余内容：
  - 删除了不再属于主站的信息架构的 `sticky` 实验页和相关组件
  - 删除了重复的根目录 `images/` 资源目录，保留正式使用的 `public/images/`
  - 删除了 `dist`、Astro 缓存和 `.DS_Store` 这类生成物与系统垃圾文件
  - 新增 `.gitignore`，避免这些文件再次混入仓库
- 修正了首页主文章卡片标题的残留硬编码，让它直接读取真实文章标题
- 调整了文章详情页大标题的断行逻辑：优先单行居中；需要换行时按语义边界优先断开，并且最多只分成两行，让中文标题更接近人工排版

## 项目结构

```text
/
├─ public/
│  └─ images/            # 站点正式使用的图标和静态资源
├─ src/
│  ├─ components/        # 导航、Hero、摘要组件
│  ├─ content/
│  │  ├─ articles/       # 文章 Markdown
│  │  ├─ essays/         # 随笔 Markdown
│  │  └─ plans/          # 每周计划 Markdown
│  ├─ data/              # 站点信息和导航
│  ├─ layouts/           # 基础布局、正文布局
│  ├─ pages/             # 路由页面
│  ├─ styles/            # 全局样式
│  └─ content.config.ts  # 内容 schema 校验
├─ astro.config.mjs
├─ .github/workflows/deploy.yml
└─ package.json
```

## 怎么启动

```bash
npm install
npm run dev
```

默认本地地址一般是 `http://localhost:4321`。

## 部署到 GitHub Pages

这个仓库已经按 `GitHub Pages + GitHub Actions` 的方式配好了，目标地址是：

`https://fze-fze.github.io/`

你只需要做这几步：

1. 把本地代码推到 GitHub：

```bash
git add .
git commit -m "chore: prepare github pages deploy"
git push origin main
```

2. 打开仓库设置页：

`GitHub -> fze-fze.github.io -> Settings -> Pages`

3. 在 `Build and deployment` 里确认：

- `Source` 选择 `GitHub Actions`

4. 回到仓库的 `Actions` 标签页，等 `Deploy to GitHub Pages` 这个工作流跑完

5. 部署成功后，访问：

`https://fze-fze.github.io/`

### 以后怎么更新

以后每次你写完新文章或改完页面，只要：

```bash
git add .
git commit -m "feat: update blog content"
git push origin main
```

GitHub 会自动重新部署，不需要你手动上传 `dist`。

### 一个很关键的说明

- 现在这是“用户主页仓库”，正式地址就是根域名 `https://fze-fze.github.io/`
- 因为不再有仓库子路径，所以 `astro.config.mjs` 里不需要再写 `base`
- 如果将来你又改回普通项目仓库，再把 `base` 按仓库名补回来即可

## 怎么新增文章

1. 复制 [src/content/articles/template.md](/Users/fze/Documents/fze/code/NewBlog/src/content/articles/template.md)
2. 改成你想要的 slug，例如 `my-first-post.md`
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
5. 保存后会自动出现在 `/articles`

## 怎么新增随笔

1. 复制 [src/content/essays/essay-template.md](/Users/fze/Documents/fze/code/NewBlog/src/content/essays/essay-template.md)
2. 改成你想要的 slug，例如 `small-note.md`
3. 填好 frontmatter：

```md
---
title: 随笔标题
description: 一句话概括
date: 2026-03-22
tags:
  - 随笔
draft: false
---
```

4. 写正文
5. 保存后会自动出现在 `/essays`

## 怎么新增每周计划

1. 复制 [src/content/plans/template.md](/Users/fze/Documents/fze/code/NewBlog/src/content/plans/template.md)
2. 改名，例如 `2026-week-13.md`
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

4. 按模板补完“目标 / 推进中 / 已完成 / 复盘”
5. 保存后会自动出现在 `/plans`

## 内容规范

### `articles`

- 必填：`title` `description` `date`
- 可选：`tags` `cover` `draft`

### `essays`

- 必填：`title` `description` `date`
- 可选：`tags` `cover` `draft`

### `plans`

- 必填：`title` `week` `status` `summary`
- 可选：`goals` `review` `draft`
- `status` 只能是：`planned` / `active` / `done`

如果 frontmatter 写错，Astro 会在开发或构建时直接报错，方便尽早发现问题。

## 仓库约定

- `src/content` 是唯一内容源，`dist` 只是构建结果，不参与日常维护
- `.astro`、`node_modules/.astro`、`node_modules/.vite` 都是缓存目录，可以随时重建
- `.DS_Store` 属于系统垃圾文件，不应该进入仓库
- `public/images` 是当前正式使用的静态资源目录

## 下一步可以继续优化

- 把 `articles` 和 `essays` 的列表页、详情页继续抽象，减少重复实现
- 统一内容 slug 命名规则，避免中英文和标点混用
- 给文章图片建立单独素材目录
- 加上 RSS、自动部署、标签归档
