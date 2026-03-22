const BASE_URL = import.meta.env.BASE_URL;

export function withBase(path: string) {
  if (path === "/") {
    return BASE_URL;
  }

  const normalizedBase = BASE_URL.endsWith("/") ? BASE_URL.slice(0, -1) : BASE_URL;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
}

export const siteMeta = {
  title: "fze's journal",
  description: "一个极简静态博客，记录文章、随笔与每周计划。",
  author: "fze"
};

export const navigation = [
  { href: withBase("/"), label: "首页" },
  { href: withBase("/articles"), label: "文章" },
  { href: withBase("/essays"), label: "随笔" },
  { href: withBase("/plans"), label: "每周计划" }
];
