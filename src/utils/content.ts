import type { CollectionEntry } from "astro:content";

export const PINNED_ARTICLE_TAG = "置顶🔝";

type ArticleEntry = CollectionEntry<"articles">;

export const sortArticles = (articles: ArticleEntry[]) =>
  [...articles].sort((a, b) => {
    const aPinned = a.data.tags.includes(PINNED_ARTICLE_TAG);
    const bPinned = b.data.tags.includes(PINNED_ARTICLE_TAG);

    if (aPinned !== bPinned) {
      return aPinned ? -1 : 1;
    }

    return b.data.date.getTime() - a.data.date.getTime();
  });
