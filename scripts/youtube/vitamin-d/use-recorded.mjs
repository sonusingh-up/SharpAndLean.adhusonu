/*
 * Uses narration recorded elsewhere (here: ElevenLabs, voice "Megan") instead
 * of the draft voice. Expects one file per line, named <id>.mp3, in the folder
 * given (default social/youtube/vitamin-d-audio/vo). Converts each to .out/vo/<id>.wav
 * and writes .out/vo.json with its length, so build.mjs times the scenes to it.
 *
 *   node use-recorded.mjs [folder]
 */
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ffmpegPath } from './ffmpeg.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const src = resolve(process.argv[2] || join(here, '..', '..', '..', 'social', 'youtube', 'vitamin-d-audio', 'vo'));
const out = join(here, '.out', 'vo');
mkdirSync(out, { recursive: true });
const ff = ffmpegPath();
const { lines } = JSON.parse(readFileSync(join(here, 'narration.json'), 'utf8'));

const missing = lines.filter((l) => !existsSync(join(src, `${l.id}.mp3`))).map((l) => l.id);
if (missing.length) throw new Error(`Missing narration files in ${src}: ${missing.join(', ')}`);

const durations = {};
for (const l of lines) {
  const wav = join(out, `${l.id}.wav`);
  // Trim leading and trailing silence so every line starts on the voice, and even out loudness.
  execFileSync(ff, ['-y', '-loglevel', 'error', '-i', join(src, `${l.id}.mp3`), '-af',
    'silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.05,areverse,silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.12,areverse,loudnorm=I=-18:TP=-2:LRA=9',
    '-ar', '44100', '-ac', '1', wav]);
  const r = spawnSync(ff, ['-hide_banner', '-i', wav, '-f', 'null', '-'], { encoding: 'utf8' });
  const m = /Duration: (\d+):(\d+):([\d.]+)/.exec(r.stderr);
  durations[l.id] = +(+m[1] * 3600 + +m[2] * 60 + +m[3]).toFixed(3);
  console.log(`${l.id}: ${durations[l.id]} s`);
}
writeFileSync(join(here, '.out', 'vo.json'), JSON.stringify(durations, null, 2));
console.log(`total ${Object.values(durations).reduce((a, b) => a + b, 0).toFixed(1)} s of narration`);
