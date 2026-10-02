/*
 * Runs the whole Reel pipeline and writes the deliverables to
 * social/instagram/reels/:
 *
 *   npm run ig:reel:men
 *
 * build.mjs → capture.mjs → audio.mjs → ffmpeg encode (H.264 yuv420p + AAC,
 * 1080×1920, 30 fps, faststart) → cover frame.
 */
import { execFileSync } from 'node:child_process';
import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ffmpegPath } from './ffmpeg.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, '.out');
const dest = join(here, '..', '..', '..', 'social', 'instagram', 'reels');
const node = (file, ...args) => execFileSync(process.execPath, [join(here, file), ...args], { stdio: 'inherit' });

node('build.mjs');
node('capture.mjs');
node('audio.mjs');

const { end, scenes } = JSON.parse(readFileSync(join(out, 'timeline.json'), 'utf8'));
mkdirSync(dest, { recursive: true });
const mp4 = join(dest, 'get-in-shape-men-reel.mp4');
execFileSync(
  ffmpegPath(),
  [
    '-y', '-loglevel', 'error',
    '-framerate', '30', '-i', join(out, 'frames', '%04d.jpg'),
    '-i', join(out, 'audio.wav'),
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-r', '30',
    '-c:a', 'aac', '-b:a', '192k', '-ar', '44100',
    '-t', String(end), '-movflags', '+faststart',
    mp4,
  ],
  { stdio: 'inherit' },
);

// Cover: the hook once both lines have landed.
const coverFrame = String(Math.round((scenes.formula - 0.4) * 30)).padStart(4, '0');
copyFileSync(join(out, 'frames', `${coverFrame}.jpg`), join(dest, 'get-in-shape-men-cover.jpg'));
console.log(`Wrote ${mp4} and the cover frame`);
