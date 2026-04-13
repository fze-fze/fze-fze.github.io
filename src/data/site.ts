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
  description: "一个只保留文章的极简静态博客。",
  author: "fze"
};

export const navigation = [
  { href: withBase("/"), label: "首页" },
  { href: withBase("/articles"), label: "文章" }
];
