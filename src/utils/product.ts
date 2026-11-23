import { Product, ProductMedia } from '@/types/product';

export function mediaUrl(media?: ProductMedia): string | null {
  if (!media) return null;
  if (typeof media === 'string') return media;
  return media.url ?? media.image_url ?? media.path ?? null;
}

export function productImage(product: Product): string | null {
  return mediaUrl(product.images?.[0]);
}

export function formatPrice(value: number): string {
  return `$ ${Number(value).toLocaleString('en-US')}`;
}