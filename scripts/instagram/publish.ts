/*
 * Publishes the next approved carousel in social/instagram/queue.json through
 * the Instagram Graph API, then marks it published in the queue.
 *
 *   npx tsx scripts/instagram/publish.ts              publish the next approved post
 *   npx tsx scripts/instagram/publish.ts --dry-run    show what would be published
 *   npx tsx scripts/instagram/publish.ts --id <id>    publish a specific approved post
 *   npx tsx scripts/instagram/publish.ts --refresh-token   print a refreshed long-lived token
 *
 * Environment:
 *   IG_USER_ID        the Instagram professional account id
 *   IG_ACCESS_TOKEN   a long-lived token with instagram_business_content_publish
 *                     (Instagram Login) or instagram_content_publish (Facebook Login)
 *   IG_GRAPH_HOST     graph.instagram.com (default, Instagram Login)
 *                     or graph.facebook.com (Facebook Login via a Page)
 *   IG_GRAPH_VERSION  default v23.0
 *   IG_SITE_URL       where public/ig/ is served, default https://sharpandlean.com
 *
 * Instagram fetches each slide from IG_SITE_URL/ig/<id>/NN.jpg, so the images
 * must be deployed before a post can go out. A post whose first slide is not
 * live yet is skipped, not failed, and goes out on a later run.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { readQueue, writeQueue } from './build';

const ROOT = join(__dirname, '..', '..');
const HOST = process.env.IG_GRAPH_HOST || 'graph.instagram.com';
const VERSION = process.env.IG_GRAPH_VERSION || 'v23.0';
const SITE = (process.env.IG_SITE_URL || 'https://sharpandlean.com').replace(/\/+$/, '');
const USER = process.env.IG_USER_ID;
const TOKEN = process.env.IG_ACCESS_TOKEN;

const has = (f: string) => process.argv.includes(f);
const arg = (f: string) => {
  const i = process.argv.indexOf(f);
  return i >= 0 ? process.argv[i + 1] : undefined;
};

async function api(path: string, params: Record<string, string>, method: 'GET' | 'POST' = 'POST') {
  const url = new URL(`https://${HOST}/${VERSION}/${path}`);
  const body = new URLSearchParams({ ...params, access_token: TOKEN! });
  const res =
    method === 'GET'
      ? await fetch(`${url}?${body}`)
      : await fetch(url, { method: 'POST', body });
  const data = (await res.json()) as any;
  if (!res.ok || data.error) {
    throw new Error(`${method} ${path} failed: ${JSON.stringify(data.error ?? data)}`);
  }
  return data;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function waitUntilReady(containerId: string) {
  for (let i = 0; i < 30; i++) {
    const { status_code } = await api(containerId, { fields: 'status_code' }, 'GET');
    if (status_code === 'FINISHED') return;
    if (status_code === 'ERROR' || status_code === 'EXPIRED') {
      throw new Error(`Container ${containerId} ended in ${status_code}`);
    }
    await sleep(5000);
  }
  throw new Error(`Container ${containerId} was not ready after 150 s`);
}

function validateCaption(caption: string) {
  if (caption.length > 2200) throw new Error(`Caption is ${caption.length} characters; Instagram allows 2,200`);
  const tags = caption.match(/#\w+/g) ?? [];
  if (tags.length > 30) throw new Error(`Caption has ${tags.length} hashtags; Instagram allows 30`);
}

async function main() {
  if (has('--refresh-token')) {
    const res = await fetch(
      `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${TOKEN}`,
    );
    console.log(await res.json());
    return;
  }

  const dry = has('--dry-run');
  if (!dry && (!USER || !TOKEN)) throw new Error('Set IG_USER_ID and IG_ACCESS_TOKEN');

  const queue = readQueue();
  const wanted = arg('--id');
  const candidates = queue.posts.filter(
    (p) => p.status === 'approved' && p.format === 'carousel' && (!wanted || p.id === wanted),
  );
  if (!candidates.length) {
    console.log('Nothing approved to publish.');
    return;
  }

  for (const entry of candidates) {
    const dir = join(ROOT, 'public', 'ig', entry.id);
    const captionFile = join(ROOT, 'social', 'instagram', 'posts', `${entry.id}.md`);
    if (!existsSync(dir) || !existsSync(captionFile)) {
      console.log(`Skipping ${entry.id}: run the build first.`);
      continue;
    }
    const slides = readdirSync(dir).filter((f) => f.endsWith('.jpg')).sort().slice(0, 10);
    const urls = slides.map((f) => `${SITE}/ig/${entry.id}/${f}`);
    const caption = readFileSync(captionFile, 'utf8').trim();
    validateCaption(caption);

    const live = await fetch(urls[0], { method: 'HEAD' }).then((r) => r.ok, () => false);
    if (!live) {
      console.log(`Skipping ${entry.id}: ${urls[0]} is not live yet (deploy pending?).`);
      continue;
    }

    if (dry) {
      console.log(`Would publish ${entry.id} (${urls.length} slides)\n---\n${caption}\n---`);
      return;
    }

    console.log(`Publishing ${entry.id} (${urls.length} slides)…`);
    const children: string[] = [];
    for (const image_url of urls) {
      const { id } = await api(`${USER}/media`, { image_url, is_carousel_item: 'true' });
      children.push(id);
    }
    for (const id of children) await waitUntilReady(id);

    const { id: carousel } = await api(`${USER}/media`, {
      media_type: 'CAROUSEL',
      children: children.join(','),
      caption,
    });
    await waitUntilReady(carousel);
    const { id: mediaId } = await api(`${USER}/media_publish`, { creation_id: carousel });
    const { permalink } = await api(mediaId, { fields: 'permalink' }, 'GET').catch(() => ({ permalink: undefined }));

    entry.status = 'published';
    entry.publishedAt = new Date().toISOString();
    entry.mediaId = mediaId;
    if (permalink) entry.permalink = permalink;
    writeQueue(queue);
    console.log(`Published ${entry.id}: ${permalink ?? mediaId}`);
    return; // one post per run
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
