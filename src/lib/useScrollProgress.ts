export interface ScrollProgressOptions {
  onProgress: (progress: number) => void;
  onActiveChange?: (active: boolean) => void;
}

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

export function useScrollProgress(
  section: HTMLElement,
  { onProgress, onActiveChange }: ScrollProgressOptions
) {
  let frame = 0;
  let active = false;
  let lastProgress = -1;

  const measure = () => {
    frame = 0;
    const rect = section.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const scrollable = Math.max(section.offsetHeight - viewportHeight, 1);
    const progress = clamp(-rect.top / scrollable);

    if (Math.abs(progress - lastProgress) > 0.001) {
      lastProgress = progress;
      onProgress(progress);
    }

    if (active) {
      frame = window.requestAnimationFrame(measure);
    }
  };

  const start = () => {
    if (active) return;
    active = true;
    onActiveChange?.(true);
    frame = window.requestAnimationFrame(measure);
  };

  const stop = () => {
    active = false;
    onActiveChange?.(false);
    if (frame) {
      window.cancelAnimationFrame(frame);
      frame = 0;
    }
  };

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        start();
      } else {
        stop();
      }
    },
    {
      threshold: 0,
      rootMargin: "20% 0px 20% 0px"
    }
  );

  observer.observe(section);

  const resizeObserver = new ResizeObserver(() => {
    if (active && !frame) {
      frame = window.requestAnimationFrame(measure);
    }
  });

  resizeObserver.observe(section);

  const onScroll = () => {
    if (active && !frame) {
      frame = window.requestAnimationFrame(measure);
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);

  return () => {
    stop();
    observer.disconnect();
    resizeObserver.disconnect();
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onScroll);
  };
}
