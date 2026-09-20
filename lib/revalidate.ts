import { revalidatePath, revalidateTag } from 'next/cache';
export function refreshContent() {
  revalidateTag('content', { expire: 0 });
  revalidatePath('/', 'layout');
  revalidatePath('/sitemap.xml');
}
