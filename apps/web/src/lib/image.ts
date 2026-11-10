import { createImageUrlBuilder } from '@sanity/image-url';
import type { SanityImage } from './types';

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = import.meta.env.PUBLIC_SANITY_DATASET || 'production';

const builder = createImageUrlBuilder({ projectId, dataset });

const DEFAULT_WIDTHS = [480, 768, 1200, 1600, 2400];

type ImgOpts = {
  /** Only for fixed aspect-ratio slots (CONTENT-MODEL.md). */
  hotspot?: boolean;
};

/**
 * Sanity CDN URL: auto=format, fit=max, q=80.
 * Omit `width` (or pass the asset's native width) when CSS uses `height: N; width: auto`
 * or `width: N; height: auto` — downscaling can change the intrinsic aspect ratio by a
 * fraction of a pixel and shift flex layouts enough to fail the fidelity test.
 */
export function img(image: SanityImage | null | undefined, width?: number, opts: ImgOpts = {}): string {
  if (!image?.asset) return '';
  let b = builder.image(image).auto('format').fit('max').quality(80);
  if (width) b = b.width(width);
  if (opts.hotspot && image.hotspot) {
    b = b.fit('crop').crop('focalpoint').focalPoint(image.hotspot.x, image.hotspot.y);
  }
  return b.url();
}

/** srcset at 480/768/1200/1600/2400 when the asset is wider than 400 px. */
export function srcset(
  image: SanityImage | null | undefined,
  widths: number[] = DEFAULT_WIDTHS,
  opts: ImgOpts = {},
): string {
  if (!image?.asset) return '';
  const max = image.asset.metadata?.dimensions?.width ?? 0;
  if (max <= 400) return '';
  const list = widths.filter((w) => w <= max);
  const use = list.length ? list : [Math.min(widths[0] ?? 480, max)];
  return use.map((w) => `${img(image, w, opts)} ${w}w`).join(', ');
}
