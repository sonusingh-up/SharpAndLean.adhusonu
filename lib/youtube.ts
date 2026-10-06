import type { GuideVideo } from './types';

/*
 * One of our own YouTube videos, featured on a page. The player loads from
 * youtube-nocookie.com, and only after the reader asks for it; until then the
 * page shows a poster served through our own image optimiser, so an unplayed
 * video makes no request to Google at all.
 */

const ID = /^[\w-]{11}$/;

/** The 11-character video id, or null for anything that is not one. */
export function youtubeId(id: string): string | null {
  return ID.test(id) ? id : null;
}

export function youtubeWatchUrl(id: string, start = 0) {
  return `https://www.youtube.com/watch?v=${id}${start > 0 ? `&t=${start}s` : ''}`;
}

export function youtubeEmbedSrc(id: string, start = 0) {
  const params = new URLSearchParams({ autoplay: '1', rel: '0', modestbranding: '1' });
  if (start > 0) params.set('start', String(start));
  return `https://www.youtube-nocookie.com/embed/${id}?${params}`;
}

export function youtubeThumb(id: string) {
  return `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
}

/** 363 → "6:03"; 3725 → "1:02:05". */
export function clock(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = String(seconds % 60).padStart(2, '0');
  return h ? `${h}:${String(m).padStart(2, '0')}:${s}` : `${m}:${s}`;
}

/** 363 → "PT6M3S", the ISO 8601 duration schema.org expects. */
export function isoDuration(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `PT${h ? `${h}H` : ''}${m ? `${m}M` : ''}${s || (!h && !m) ? `${s}S` : ''}`;
}

/**
 * A VideoObject for the page's JSON-LD. Chapters become Clips, which is what
 * lets Google show "key moments" for the video; each clip ends where the next
 * begins, and the last at the end of the video.
 */
export function videoSchema(video: GuideVideo, pageUrl: string, publisherId: string) {
  const id = youtubeId(video.youtubeId);
  if (!id) return null;
  const chapters = video.chapters ?? [];
  return {
    '@type': 'VideoObject',
    '@id': `${pageUrl}#video`,
    name: video.title,
    description: video.description,
    thumbnailUrl: [youtubeThumb(id), `https://i.ytimg.com/vi/${id}/hqdefault.jpg`],
    uploadDate: video.uploadDate,
    duration: isoDuration(video.durationSeconds),
    embedUrl: `https://www.youtube-nocookie.com/embed/${id}`,
    url: youtubeWatchUrl(id),
    inLanguage: 'en-US',
    isFamilyFriendly: true,
    publisher: { '@id': publisherId },
    ...(chapters.length
      ? {
          hasPart: chapters.map((c, i) => ({
            '@type': 'Clip',
            name: c.title,
            startOffset: c.start,
            endOffset: chapters[i + 1]?.start ?? video.durationSeconds,
            url: youtubeWatchUrl(id, c.start),
          })),
        }
      : {}),
  };
}
