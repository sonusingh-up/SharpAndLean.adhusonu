'use client';

import { useState } from 'react';
import { ArrowUpRight, Play } from 'lucide-react';
import type { SocialEmbed as SocialEmbedData } from '@/lib/types';
import { instagramEmbedSrc } from '@/lib/social-embed';
import s from './social-embed.module.css';

/**
 * A brand video, loaded only on request. Instagram's embed sets Meta cookies,
 * so until the reader clicks, the page shows a card with the caption and a
 * plain link, and makes no request to Instagram at all.
 */
export function SocialEmbed({ embed }: { embed: SocialEmbedData }) {
  const [loaded, setLoaded] = useState(false);
  const src = instagramEmbedSrc(embed.url);
  if (!src) return null;
  return (
    <figure className={s.embed}>
      <div className={s.head}>
        <span className={s.label}>From {embed.account} on Instagram</span>
        <h3>{embed.title}</h3>
        <p>{embed.note}</p>
      </div>
      {loaded ? (
        <iframe
          className={s.frame}
          src={src}
          title={`${embed.title} — Instagram video from ${embed.account}`}
          loading="lazy"
          allow="encrypted-media; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : (
        <div className={s.poster}>
          <button type="button" className={s.play} onClick={() => setLoaded(true)}>
            <Play size={18} /> Load the video
          </button>
          <p className={s.privacy}>
            Loading it connects to Instagram, which may set its own cookies.
          </p>
        </div>
      )}
      <figcaption className={s.caption}>
        Brand content, shown so you can see the product in use; it is marketing, not evidence.{' '}
        <a href={embed.url} target="_blank" rel="nofollow noopener noreferrer">
          Open on Instagram <ArrowUpRight size={13} />
        </a>
      </figcaption>
    </figure>
  );
}
