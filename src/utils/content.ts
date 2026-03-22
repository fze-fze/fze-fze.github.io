import type { CollectionEntry } from "astro:content";

const PLAN_SLUG_PATTERN = /^(\d{4})-week-(\d{1,2})$/i;
export const PINNED_ARTICLE_TAG = "置顶🔝";

type ArticleEntry = CollectionEntry<"articles">;
type PlanEntry = CollectionEntry<"plans">;

interface ParsedPlanSlug {
  isoYear: number;
  isoWeek: number;
}

export const sortArticles = (articles: ArticleEntry[]) =>
  [...articles].sort((a, b) => {
    const aPinned = a.data.tags.includes(PINNED_ARTICLE_TAG);
    const bPinned = b.data.tags.includes(PINNED_ARTICLE_TAG);

    if (aPinned !== bPinned) {
      return aPinned ? -1 : 1;
    }

    return b.data.date.getTime() - a.data.date.getTime();
  });

export const parsePlanSlug = (slug: string): ParsedPlanSlug | null => {
  const match = slug.match(PLAN_SLUG_PATTERN);

  if (!match) return null;

  return {
    isoYear: Number(match[1]),
    isoWeek: Number(match[2])
  };
};

const getPlanSortValue = (plan: PlanEntry) => {
  const parsed = parsePlanSlug(plan.slug);

  if (!parsed) return Number.NEGATIVE_INFINITY;

  return parsed.isoYear * 100 + parsed.isoWeek;
};

export const sortPlans = (plans: PlanEntry[]) =>
  [...plans].sort((a, b) => {
    const aValue = getPlanSortValue(a);
    const bValue = getPlanSortValue(b);

    if (aValue === bValue) {
      return b.slug.localeCompare(a.slug);
    }

    return bValue - aValue;
  });

export const getIsoWeekInfo = (date: Date) => {
  const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = localDate.getDay() || 7;

  localDate.setDate(localDate.getDate() + 4 - day);

  const isoYear = localDate.getFullYear();
  const yearStart = new Date(isoYear, 0, 1);
  const isoWeek = Math.ceil((((localDate.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);

  return { isoYear, isoWeek };
};

export const getCurrentPlan = (plans: PlanEntry[], now = new Date()) => {
  const sortedPlans = sortPlans(plans);
  const currentWeek = getIsoWeekInfo(now);
  const currentValue = currentWeek.isoYear * 100 + currentWeek.isoWeek;

  const exactMatch = sortedPlans.find((plan) => {
    const parsed = parsePlanSlug(plan.slug);
    return parsed?.isoYear === currentWeek.isoYear && parsed?.isoWeek === currentWeek.isoWeek;
  });

  if (exactMatch) return exactMatch;

  return sortedPlans.find((plan) => {
    const value = getPlanSortValue(plan);
    return Number.isFinite(value) && value <= currentValue;
  });
};
