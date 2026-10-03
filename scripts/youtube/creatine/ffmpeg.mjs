/*
 * Finds ffmpeg: FFMPEG_PATH, then ffmpeg on PATH, then the optional
 * ffmpeg-static package (npm i -D ffmpeg-static) for machines without one.
 */
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';

export function ffmpegPath() {
  if (process.env.FFMPEG_PATH) return process.env.FFMPEG_PATH;
  if (spawnSync('ffmpeg', ['-version'], { stdio: 'ignore' }).status === 0) return 'ffmpeg';
  try {
    const p = createRequire(import.meta.url)('ffmpeg-static');
    if (p) return p;
  } catch {}
  throw new Error('ffmpeg not found. Install ffmpeg, set FFMPEG_PATH, or run: npm i -D ffmpeg-static');
}
