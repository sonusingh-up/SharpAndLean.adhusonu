/**
 * The embed address for an Instagram reel or post, or null for anything else.
 * Only instagram.com reel and post addresses pass, so an article cannot point
 * the iframe anywhere else.
 */
export function instagramEmbedSrc(url: string): string | null {
  const m = /^https:\/\/www\.instagram\.com\/(?:[\w.]+\/)?(reel|p)\/([\w-]+)\/?$/.exec(url);
  return m ? `https://www.instagram.com/${m[1]}/${m[2]}/embed/` : null;
}
