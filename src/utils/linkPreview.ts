export interface StandaloneLink {
  text: string;
  url: string;
}

export interface LinkPreview {
  url: string;
  title?: string;
  siteName?: string;
  image?: string;
}

const STANDALONE_LINK_PATTERN = /^\[([^\]]+)\]\((https?:\/\/[^\s)]+(?:\([^\s)]*\))*)\)\s*$/;

const META_PATTERNS = {
  title: [
    /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["'][^>]*>/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:title["'][^>]*>/i,
    /<meta[^>]+name=["']twitter:title["'][^>]+content=["']([^"']+)["'][^>]*>/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:title["'][^>]*>/i,
    /<title>([^<]+)<\/title>/i,
  ],
  siteName: [
    /<meta[^>]+property=["']og:site_name["'][^>]+content=["']([^"']+)["'][^>]*>/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:site_name["'][^>]*>/i,
    /<meta[^>]+name=["']application-name["'][^>]+content=["']([^"']+)["'][^>]*>/i,
  ],
  image: [
    /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["'][^>]*>/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["'][^>]*>/i,
    /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["'][^>]*>/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["'][^>]*>/i,
  ],
} as const;

const previewCache = new Map<string, Promise<LinkPreview | null>>();

const decodeHtml = (value: string) =>
  value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");

const extractFirstMatch = (html: string, patterns: readonly RegExp[]) => {
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) {
      return decodeHtml(match[1].trim());
    }
  }

  return undefined;
};

const withTimeout = async (input: RequestInfo | URL, init: RequestInit, timeoutMs = 5000) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(input, {
      ...init,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
};

export const extractStandaloneLinks = (markdown: string): StandaloneLink[] =>
  markdown
    .split(/\r?\n/)
    .map((line) => line.trim())
    .map((line) => {
      const match = line.match(STANDALONE_LINK_PATTERN);
      if (!match) return null;

      return {
        text: match[1].trim(),
        url: match[2].trim(),
      };
    })
    .filter((item): item is StandaloneLink => item !== null);

export const getLinkPreview = async (url: string): Promise<LinkPreview | null> => {
  const cached = previewCache.get(url);
  if (cached) return cached;

  const request = (async () => {
    try {
      const response = await withTimeout(
        url,
        {
          redirect: "follow",
          headers: {
            "user-agent":
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
            accept: "text/html,application/xhtml+xml",
          },
        },
        6000,
      );

      if (!response.ok) {
        return null;
      }

      const html = await response.text();
      const finalUrl = response.url || url;

      const title = extractFirstMatch(html, META_PATTERNS.title);
      const siteName = extractFirstMatch(html, META_PATTERNS.siteName);
      const imageValue = extractFirstMatch(html, META_PATTERNS.image);
      const image = imageValue ? new URL(imageValue, finalUrl).toString() : undefined;

      return {
        url: finalUrl,
        title,
        siteName,
        image,
      };
    } catch {
      return null;
    }
  })();

  previewCache.set(url, request);
  return request;
};

export const getLinkPreviews = async (urls: string[]) => {
  const uniqueUrls = [...new Set(urls)];
  const previews = await Promise.all(uniqueUrls.map(async (url) => [url, await getLinkPreview(url)] as const));

  return Object.fromEntries(previews.filter(([, preview]) => preview)) as Record<string, LinkPreview>;
};
