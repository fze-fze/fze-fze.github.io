import { useScrollProgress } from "./useScrollProgress";

let booted = false;

export function initStickySections() {
  if (booted) return;
  booted = true;

  const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-sticky-section]"));

  sections.forEach((section) => {
    if (section.dataset.stickyReady === "true") return;
    section.dataset.stickyReady = "true";

    const cleanup = useScrollProgress(section, {
      onProgress: (progress) => {
        section.style.setProperty("--section-progress", progress.toFixed(4));
        section.style.setProperty("--section-progress-inv", (1 - progress).toFixed(4));
      },
      onActiveChange: (active) => {
        section.dataset.stickyActive = active ? "true" : "false";
      }
    });

    window.addEventListener(
      "beforeunload",
      () => {
        cleanup();
      },
      { once: true }
    );
  });
}
