/*
 * Runs the whole video: narration → page → frames → sound mix → MP4.
 *
 *   npm run yt:b12            (add -- --skip-frames to redo only the sound and the encode)
 *
 * Narration, sound effects and music are recorded files in
 * social/youtube/b12-audio (ElevenLabs, Starter plan). Sound
 * effects are placed on the cues build.mjs writes to .out/timeline.json, and
 * the music dips whenever the voice is speaking.
 *
 * Output: social/youtube/b12-deficiency.mp4 (1920×1080, 30 fps, H.264 + AAC)
 */
import { execFileSync, spawn, spawnSync } from 'node:child_process';
import { mkdirSync, readFileSync, rmSync } from 'node:fs';
import { cpus } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ffmpegPath } from './ffmpeg.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, '.out');
const dest = join(here, '..', '..', '..', 'social', 'youtube');
const audio = join(dest, 'b12-audio');
const ff = ffmpegPath();
const node = (file, ...args) => execFileSync(process.execPath, [join(here, file), ...args], { stdio: 'inherit' });
const run = (args) => execFileSync(ff, ['-y', '-loglevel', 'error', ...args], { stdio: 'inherit' });

node('use-recorded.mjs');
node('build.mjs');

if (!process.argv.includes('--skip-frames')) {
  rmSync(join(out, 'frames'), { recursive: true, force: true });
  const n = Math.max(1, Math.min(4, cpus().length));
  await Promise.all(Array.from({ length: n }, (_, i) => new Promise((resolve, reject) => {
    const p = spawn(process.execPath, [join(here, 'capture.mjs'), `--part=${i}/${n}`], { stdio: 'inherit' });
    p.on('exit', (code) => (code ? reject(new Error(`capture part ${i} failed`)) : resolve()));
  })));
}

const tl = JSON.parse(readFileSync(join(out, 'timeline.json'), 'utf8'));
const D = tl.end;

/* ---------- sound ---------- */
const names = [...new Set(tl.sfx.map((c) => c.name))];
const inputs = ['-stream_loop', '-1', '-i', join(audio, 'sfx', 'music.mp3')];
names.forEach((n) => inputs.push('-i', join(audio, 'sfx', `${n}.mp3`)));
tl.order.forEach((id) => inputs.push('-i', join(out, 'vo', `${id}.wav`)));

const graph = [];
// narration
const voLabels = tl.order.map((id, i) => {
  graph.push(`[${1 + names.length + i}]aresample=44100,adelay=${Math.round(tl.scenes[id].vo * 1000)}:all=1[v${i}]`);
  return `[v${i}]`;
});
graph.push(`${voLabels.join('')}amix=inputs=${voLabels.length}:normalize=0:duration=longest,apad=whole_dur=${D},asplit=2[vo][key]`);
// music: level it, loop it, dip it under the voice
graph.push(`[0]aresample=44100,aformat=channel_layouts=stereo,atrim=0:${D},dynaudnorm=f=500:g=31,volume=-16dB[mraw]`);
graph.push(`[mraw][key]sidechaincompress=threshold=0.02:ratio=6:attack=40:release=700:makeup=1[music]`);
// sound effects: one copy of each file per cue
const fxLabels = [];
names.forEach((n, ni) => {
  const cues = tl.sfx.filter((c) => c.name === n);
  graph.push(`[${1 + ni}]aresample=44100,aformat=channel_layouts=stereo,silenceremove=start_periods=1:start_threshold=-50dB,dynaudnorm=f=150:g=15:p=0.7,afade=t=out:st=${n === 'swell' || n === 'clock' ? 0.8 : 1.6}:d=0.25,asplit=${cues.length}${cues.map((_, i) => `[s${ni}_${i}]`).join('')}`);
  cues.forEach((c, i) => {
    graph.push(`[s${ni}_${i}]volume=${(0.3 * c.vol).toFixed(3)},adelay=${Math.max(0, Math.round(c.t * 1000))}:all=1[f${ni}_${i}]`);
    fxLabels.push(`[f${ni}_${i}]`);
  });
});
graph.push(`${fxLabels.join('')}amix=inputs=${fxLabels.length}:normalize=0:duration=longest[fx]`);
const mix = (gain) =>
  `${graph.join(';')};[vo]aformat=channel_layouts=stereo,volume=${gain}dB[voice];` +
  `[music][fx][voice]amix=inputs=3:normalize=0:duration=first,afade=t=in:d=0.6,afade=t=out:st=${(D - 2.5).toFixed(2)}:d=2.5,alimiter=limit=0.84:level=disabled,atrim=0:${D}[a]`;
const renderAudio = (gain) => run([...inputs, '-filter_complex', mix(gain), '-map', '[a]', '-ar', '44100', join(out, 'audio.wav')]);
const level = () => {
  const r = spawnSync(ff, ['-hide_banner', '-i', join(out, 'audio.wav'), '-af', 'volumedetect', '-f', 'null', '-'], { encoding: 'utf8' });
  return { mean: +(/mean_volume: (-?[\d.]+)/.exec(r.stderr) || [])[1], max: +(/max_volume: (-?[\d.]+)/.exec(r.stderr) || [])[1] };
};
// Two passes: measure, then set the narration gain so the mix sits near -18 dB mean.
renderAudio(0);
const gain = Math.max(-6, Math.min(12, -18 - level().mean));
renderAudio(gain.toFixed(2));
const lv = level();
console.log(`audio: mean ${lv.mean} dB, peak ${lv.max} dB, ${tl.sfx.length} cues`);

/* ---------- encode ---------- */
mkdirSync(dest, { recursive: true });
const mp4 = join(dest, 'b12-deficiency.mp4');
run([
  '-framerate', '30', '-i', join(out, 'frames', '%05d.jpg'), '-i', join(out, 'audio.wav'),
  '-c:v', 'libx264', '-preset', 'slow', '-crf', '19', '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-r', '30',
  '-c:a', 'aac', '-b:a', '192k', '-ar', '44100', '-t', String(D), '-movflags', '+faststart', mp4,
]);
console.log(`Wrote ${mp4}`);
