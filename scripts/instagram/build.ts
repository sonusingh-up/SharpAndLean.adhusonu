/*
 * Builds Instagram posts from the queue.
 *
 *   npx tsx scripts/instagram/build.ts            render every post in the queue
 *   npx tsx scripts/instagram/build.ts --sync     also queue (as drafts) any article not yet queued
 *   npx tsx scripts/instagram/build.ts --add <slug> [--hook "..."]
 *   npx tsx scripts/instagram/build.ts --approve <id>
 *   npx tsx scripts/instagram/build.ts --only <id> --force
 *
 * Output per post:
 *   public/ig/<id>/01.jpg …         slides, served at sharpandlean.com/ig/<id>/01.jpg
 *                                   (the Instagram API fetches them from there)
 *   social/instagram/posts/<id>.md  the caption — edit it freely; it is only
 *                                   written when missing, or with --force
 */
import { mkdirSync, existsSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { renderSlide } from './render';
import { buildPost, articles, type QueueEntry } from './content';

const ROOT = join(__dirname, '..', '..');
const QUEUE = join(ROOT, 'social', 'instagram', 'queue.json');
const POSTS = join(ROOT, 'social', 'instagram', 'posts');
const IMAGES = join(ROOT, 'public', 'ig');

export function readQueue(): { posts: QueueEntry[] } {
  return JSON.parse(readFileSync(QUEUE, 'utf8'));
}
export function writeQueue(q: { posts: QueueEntry[] }) {
  writeFileSync(QUEUE, JSON.stringify(q, null, 2) + '\n');
}

function arg(name: string) {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : undefined;
}
const has = (name: string) => process.argv.includes(name);

function nextId(q: { posts: QueueEntry[] }, slug: string) {
  const n = q.posts.length + 1;
  return `${String(n).padStart(3, '0')}-${slug.replace(/-review(-\d{4})?$/, '')}`;
}

async function main() {
  const q = readQueue();

  const approve = arg('--approve');
  if (approve) {
    const p = q.posts.find((x) => x.id === approve);
    if (!p) throw new Error(`No post ${approve}`);
    p.status = 'approved';
    writeQueue(q);
    console.log(`Approved ${approve}`);
    return;
  }

  const add = arg('--add');
  if (add) {
    if (!articles.some((a) => a.slug === add)) throw new Error(`No article with slug ${add}`);
    q.posts.push({ id: nextId(q, add), type: 'review', slug: add, hook: arg('--hook'), format: 'carousel', status: 'draft' });
  }

  if (has('--sync')) {
    const queued = new Set(q.posts.map((p) => p.slug).filter(Boolean));
    for (const a of articles) {
      if (queued.has(a.slug)) continue;
      q.posts.push({ id: nextId(q, a.slug), type: 'review', slug: a.slug, format: 'carousel', status: 'draft' });
      console.log(`Queued new article ${a.slug} as a draft`);
    }
  }
  writeQueue(q);

  const only = arg('--only');
  const force = has('--force');
  mkdirSync(POSTS, { recursive: true });

  for (const entry of q.posts) {
    if (only && entry.id !== only) continue;
    if (entry.status === 'published' && !force) continue;
    const dir = join(IMAGES, entry.id);
    if (existsSync(join(dir, '01.jpg')) && !force && !only) continue;

    const post = buildPost(entry);
    if (post.slides.length > 10) post.slides.splice(9, post.slides.length - 10);
    rmSync(dir, { recursive: true, force: true });
    mkdirSync(dir, { recursive: true });
    for (let i = 0; i < post.slides.length; i++) {
      await renderSlide(post.slides[i], i + 1, post.slides.length, join(dir, `${String(i + 1).padStart(2, '0')}.jpg`));
    }
    const captionFile = join(POSTS, `${entry.id}.md`);
    if (!existsSync(captionFile) || force) writeFileSync(captionFile, post.caption + '\n');
    console.log(`Built ${entry.id}: ${post.slides.length} slides`);
  }
}

if (require.main === module) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
