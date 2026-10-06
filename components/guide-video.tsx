'use client';

import Image from 'next/image';
import { useState } from 'react';
import { ArrowUpRight, Play } from 'lucide-react';
import type { GuideVideo as GuideVideoData } from '@/lib/types';
import { clock, youtubeEmbedSrc, youtubeId, youtubeThumb, youtubeWatchUrl } from '@/lib/youtube';
import s from './guide-video.module.css';

/**
 * Our own video, featured beside the guide it summarises. Until the reader
 * presses play the page shows a poster through our own image optimiser, so no
 * request reaches YouTube; the player then loads from youtube-nocookie.com.
 * A chapter starts the player at that point.
 */
export function GuideVideo({ video }: { video: GuideVideoData }) {
  const [start, setStart] = useState<number | null>(null);
  const id = youtubeId(video.youtubeId);
  if (!id) return null;
  const length = clock(video.durationSeconds);

  return (
    <section className={s.video} id="video" aria-labelledby="video-title">
      <div className={s.text}>
        <span className={s.kicker}>
          <Play size={13} aria-hidden="true" /> Watch · {length}
        </span>
        <h2 id="video-title">{video.heading}</h2>
        <p className={s.lede}>{video.lede}</p>
        <p className={s.meta}>
          <span>From our YouTube channel</span>
          <a href={youtubeWatchUrl(id)} target="_blank" rel="noopener">
            Watch on YouTube <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        </p>
      </div>

      <div className={s.player}>
        {start === null ? (
          <button
            type="button"
            className={s.poster}
            onClick={() => setStart(0)}
            aria-label={`Play the video: ${video.title} (${length})`}
          >
            <Image
              src={youtubeThumb(id)}
              alt=""
              fill
              sizes="(max-width: 900px) 100vw, 640px"
              className={s.thumb}
            />
            <span className={s.play} aria-hidden="true">
              <Play size={26} fill="currentColor" />
            </span>
            <span className={s.length} aria-hidden="true">
              {length}
            </span>
          </button>
        ) : (
          <iframe
            key={start}
            className={s.frame}
            src={youtubeEmbedSrc(id, start)}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        )}
        <p className={s.privacy}>
          Plays from YouTube in privacy-enhanced mode, which loads nothing until you press play.
        </p>
      </div>

      {video.chapters?.length ? (
        <nav className={s.chapters} aria-label="Video chapters">
          <span className={s.chaptersHead}>
            Jump to <span>{video.chapters.length} chapters</span>
          </span>
          <ol>
            {video.chapters.map((c) => (
              <li key={c.start}>
                <button
                  type="button"
                  className={start === c.start ? s.chapterOn : undefined}
                  onClick={() => setStart(c.start)}
                >
                  <time>{clock(c.start)}</time>
                  {c.title}
                </button>
              </li>
            ))}
          </ol>
        </nav>
      ) : null}
    </section>
  );
}
