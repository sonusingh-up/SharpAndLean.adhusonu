/*
 * Runs the whole pilot: narration → page → frames → sound mix → MP4.
 *
 *   npm run yt:colonbroom-pilot              (add -- --skip-tts to reuse the narration)
 *
 * Output: social/youtube/colonbroom-glp1-pilot.mp4 (1920×1080, 30 fps, H.264 + AAC)
 * and colonbroom-glp1-pilot-thumbnail.jpg.
 */
import { execFileSync, spawnSync } from 'node:child_process';
import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ffmpegPath } from './ffmpeg.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, '.out');
const dest = join(here, '..', '..', '..', 'social', 'youtube');
const ff = ffmpegPath();
const node = (file, ...args) => execFileSync(process.execPath, [join(here, file), ...args], { stdio: 'inherit' });
const run = (args) => execFileSync(ff, ['-y', '-loglevel', 'error', ...args], { stdio: 'inherit' });

if (!process.argv.includes('--skip-tts')) execFileSync(process.env.PYTHON || 'python3', [join(here, 'tts.py')], { stdio: 'inherit' });
node('build.mjs');
node('capture.mjs');

const tl = JSON.parse(readFileSync(join(out, 'timeline.json'), 'utf8'));
const D = tl.end;

/* ---------- sound: narration in front, a quiet synthesised bed behind ---------- */
const BEAT = (60 / 92).toFixed(5);
const synth = (file, expr, dur, filter) =>
  run(['-f', 'lavfi', '-i', `aevalsrc='${expr}':s=44100:d=${dur}`, ...(filter ? ['-af', filter] : []), join(out, file)]);
synth('pad.wav', `0.05*(sin(2*PI*220*t)+sin(2*PI*261.63*t)+sin(2*PI*329.63*t)+0.6*sin(2*PI*392*t))*(0.7+0.3*sin(2*PI*0.2*t))`, D, 'lowpass=f=1400');
synth('pulse.wav', `0.10*sin(2*PI*110*t)*exp(-6*mod(t,${BEAT}))`, D, 'lowpass=f=300');
synth('whoosh.wav', `0.4*(random(1)*2-1)*pow(sin(PI*t/0.4),2)`, 0.4, 'bandpass=f=1200:w=1600,highpass=f=400');

const inputs = ['-i', join(out, 'pad.wav'), '-i', join(out, 'pulse.wav'), '-i', join(out, 'whoosh.wav')];
tl.order.forEach((id) => inputs.push('-i', join(out, 'vo', `${id}.wav`)));
const graph = [];
const voLabels = [];
tl.order.forEach((id, i) => {
  graph.push(`[${3 + i}]aresample=44100,adelay=${Math.round(tl.scenes[id].vo * 1000)}:all=1[v${i}]`);
  voLabels.push(`[v${i}]`);
});
const cuts = tl.order.slice(1).map((id) => tl.scenes[id].s);
graph.push(`[2]asplit=${cuts.length}${cuts.map((_, i) => `[w${i}]`).join('')}`);
const wLabels = cuts.map((t, i) => {
  graph.push(`[w${i}]adelay=${Math.max(0, Math.round((t - 0.18) * 1000))}:all=1[x${i}]`);
  return `[x${i}]`;
});
const mix = (gain) =>
  `${graph.join(';')};` +
  `${voLabels.join('')}amix=inputs=${voLabels.length}:normalize=0:duration=longest,volume=${gain}dB[vo];` +
  `[0][1]${wLabels.join('')}amix=inputs=${2 + wLabels.length}:normalize=0:duration=first,volume=-9dB[bed];` +
  `[bed][vo]amix=inputs=2:normalize=0:duration=first,afade=t=in:d=0.4,afade=t=out:st=${(D - 1.2).toFixed(2)}:d=1.2,alimiter=limit=0.84:level=disabled,atrim=0:${D}[a]`;
const renderAudio = (gain) => run([...inputs, '-filter_complex', mix(gain), '-map', '[a]', join(out, 'audio.wav')]);
const level = () => {
  const r = spawnSync(ff, ['-hide_banner', '-i', join(out, 'audio.wav'), '-af', 'volumedetect', '-f', 'null', '-'], { encoding: 'utf8' });
  return { mean: +(/mean_volume: (-?[\d.]+)/.exec(r.stderr) || [])[1], max: +(/max_volume: (-?[\d.]+)/.exec(r.stderr) || [])[1] };
};
// Two passes: measure, then set the narration gain so the mix sits near -18 dB mean.
renderAudio(0);
const gain = Math.max(-6, Math.min(14, -18 - level().mean));
renderAudio(gain.toFixed(2));
const lv = level();
console.log(`audio: mean ${lv.mean} dB, peak ${lv.max} dB`);

/* ---------- encode ---------- */
mkdirSync(dest, { recursive: true });
const mp4 = join(dest, 'colonbroom-glp1-pilot.mp4');
run([
  '-framerate', '30', '-i', join(out, 'frames', '%04d.jpg'), '-i', join(out, 'audio.wav'),
  '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-r', '30',
  '-c:a', 'aac', '-b:a', '192k', '-ar', '44100', '-t', String(D), '-movflags', '+faststart', mp4,
]);
const thumb = String(Math.round((tl.scenes.hook.e - 0.6) * 30)).padStart(4, '0');
copyFileSync(join(out, 'frames', `${thumb}.jpg`), join(dest, 'colonbroom-glp1-pilot-thumbnail.jpg'));
console.log(`Wrote ${mp4}`);
