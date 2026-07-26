import { useEffect } from "react";

/**
 * Every photograph on the site is a remote URL. When one is slow or fails,
 * its container would otherwise render as a blank box and the whole section
 * reads as "empty". This tags each <img> with data-img="loading|ready|failed"
 * so CSS can show a shimmer while waiting and a branded panel on failure.
 */
export function useImageStates() {
  useEffect(() => {
    const mark = (img: HTMLImageElement) => {
      if (img.dataset.img === "ready" || img.dataset.img === "failed") return;

      if (img.complete) {
        img.dataset.img = img.naturalWidth > 0 ? "ready" : "failed";
        return;
      }

      img.dataset.img = "loading";
      img.addEventListener("load", () => (img.dataset.img = "ready"), { once: true });
      img.addEventListener("error", () => (img.dataset.img = "failed"), { once: true });
    };

    const scan = (root: ParentNode) => {
      if (root instanceof HTMLImageElement) mark(root);
      root.querySelectorAll?.("img").forEach((el) => mark(el as HTMLImageElement));
    };

    scan(document);

    const mo = new MutationObserver((records) => {
      for (const r of records) {
        r.addedNodes.forEach((n) => {
          if (n.nodeType === 1) scan(n as Element);
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => mo.disconnect();
  }, []);
}
