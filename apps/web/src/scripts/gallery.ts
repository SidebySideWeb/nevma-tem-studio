/** Room gallery: three slots show i, i+1, i+2 (wrap); prev/next move i by one. */

type Photo = { src: string; alt: string };

const FADE_MS = 150;

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

function wait(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function initGallery(root: HTMLElement) {
  let items: Photo[] = [];
  try {
    items = JSON.parse(root.getAttribute('data-gallery-items') || '[]') as Photo[];
  } catch {
    return;
  }
  if (items.length < 1) return;

  const slots = [0, 1, 2]
    .map((i) => root.querySelector<HTMLImageElement>(`[data-gallery-slot="${i}"]`))
    .filter((el): el is HTMLImageElement => !!el);
  if (slots.length !== 3) return;

  const counter = root.querySelector<HTMLElement>('[data-gallery-counter]');
  const prev = root.querySelector<HTMLButtonElement>('[data-gallery-prev]');
  const next = root.querySelector<HTMLButtonElement>('[data-gallery-next]');
  let index = 0;
  let busy = false;

  const show = (i: number) => {
    const n = items.length;
    for (let s = 0; s < 3; s++) {
      const photo = items[(i + s) % n]!;
      slots[s]!.src = photo.src;
      slots[s]!.alt = photo.alt;
    }
    if (counter) counter.textContent = `${pad2(i + 1)} / ${pad2(n)}`;
  };

  const go = async (delta: number) => {
    if (busy || items.length < 2) return;
    busy = true;
    const nextIndex = (index + delta + items.length) % items.length;
    const animate = !prefersReducedMotion();
    if (animate) {
      for (const img of slots) img.style.opacity = '0';
      await wait(FADE_MS);
    }
    index = nextIndex;
    show(index);
    if (animate) {
      void slots[0]!.offsetWidth;
      for (const img of slots) img.style.opacity = '1';
    }
    busy = false;
  };

  prev?.addEventListener('click', () => void go(-1));
  next?.addEventListener('click', () => void go(1));
}

export function initGalleries() {
  document.querySelectorAll<HTMLElement>('[data-gallery]').forEach(initGallery);
}
