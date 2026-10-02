/*
 * Builds .out/audio.wav entirely with ffmpeg's own synthesiser (lavfi/aevalsrc):
 * a 104 BPM bed (kick, bass, pad, hi-hat) plus sound effects placed on the
 * times in .out/timeline.json: a whoosh on each scene change, a pop when
 * icons and cards appear, a tick per counter step and a chime on the CTA.
 * Nothing is downloaded and no recorded music is used.
 */
import { execFileSync, spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ffmpegPath } from './ffmpeg.mjs';

const out = join(dirname(fileURLToPath(import.meta.url)), '.out');
const tl = JSON.parse(readFileSync(join(out, 'timeline.json'), 'utf8'));
const D = tl.end;
const ff = ffmpegPath();
const run = (args) => execFileSync(ff, ['-y', '-loglevel', 'error', ...args], { stdio: 'inherit' });
const synth = (file, expr, dur, filter) =>
  run(['-f', 'lavfi', '-i', `aevalsrc='${expr}':s=44100:d=${dur}`, ...(filter ? ['-af', filter] : []), join(out, file)]);

const BEAT = 60 / 104;
const b = BEAT.toFixed(5);
const bar4 = (BEAT * 16).toFixed(5); // four bars: one bass note per bar
const q = (BEAT * 4).toFixed(5);

/* ---------- bed ---------- */
// Kick: a sine that drops in pitch, once per beat.
synth('kick.wav', `0.5*sin(2*PI*(46*mod(t,${b})+3.4*(1-exp(-26*mod(t,${b})))))*exp(-8*mod(t,${b}))`, D);
// Bass: A, F, C, G, one per bar, pulsing on the half-beat.
synth(
  'bass.wav',
  `0.2*sin(2*PI*t*(110*lt(mod(t,${bar4}),${q})+87.31*gte(mod(t,${bar4}),${q})*lt(mod(t,${bar4}),2*${q})+130.81*gte(mod(t,${bar4}),2*${q})*lt(mod(t,${bar4}),3*${q})+98*gte(mod(t,${bar4}),3*${q})))*(0.6+0.4*exp(-5*mod(t,${b}/2)))`,
  D,
  'lowpass=f=420',
);
// Pad: a soft A-minor-seventh chord with a slow swell.
synth(
  'pad.wav',
  `0.06*(sin(2*PI*220*t)+sin(2*PI*261.63*t)+sin(2*PI*329.63*t)+0.7*sin(2*PI*392*t))*(0.75+0.25*sin(2*PI*0.4*t))`,
  D,
  'lowpass=f=1800',
);
// Hi-hat: filtered noise on the off-beat.
synth('hat.wav', `0.09*(random(0)*2-1)*exp(-70*mod(t+${b}/2,${b}))`, D, 'highpass=f=6500');

/* ---------- effects ---------- */
// Whoosh: noise swelling and fading, swept by a moving band-pass.
synth('whoosh.wav', `0.5*(random(1)*2-1)*pow(sin(PI*t/0.36),2)`, 0.36, 'bandpass=f=1400:w=1800,highpass=f=500');
// Pop: a short sine that rises in pitch.
synth('pop.wav', `0.5*sin(2*PI*(520*t+900*t*t))*exp(-34*t)`, 0.16);
// Tick: a very short high click.
synth('tick.wav', `0.28*sin(2*PI*2100*t)*exp(-190*t)`, 0.04);
// Chime: a major triad with a long decay.
synth('chime.wav', `0.3*(sin(2*PI*880*t)*exp(-3.2*t)+0.7*sin(2*PI*1108.73*t)*exp(-3.8*t)*gte(t,0.07)+0.6*sin(2*PI*1318.51*t)*exp(-4.2*t)*gte(t,0.14))`, 1.6);

/* ---------- mix ---------- */
const events = [
  ...tl.whoosh.map((t) => ['whoosh.wav', t - 0.14]),
  ...tl.pop.map((t) => ['pop.wav', t]),
  ...tl.tick.map((t) => ['tick.wav', t]),
  ['chime.wav', tl.chime],
];
const inputs = ['kick.wav', 'bass.wav', 'pad.wav', 'hat.wav'].flatMap((f) => ['-i', join(out, f)]);
const sfx = ['whoosh.wav', 'pop.wav', 'tick.wav', 'chime.wav'];
sfx.forEach((f) => inputs.push('-i', join(out, f)));

const graph = [];
const labels = ['[0]', '[1]', '[2]', '[3]'];
sfx.forEach((f, si) => {
  const mine = events.filter((e) => e[0] === f);
  if (!mine.length) return;
  const split = mine.map((_, i) => `[s${si}_${i}]`);
  graph.push(`[${4 + si}]asplit=${mine.length}${split.join('')}`);
  mine.forEach(([, t], i) => {
    const ms = Math.max(0, Math.round(t * 1000));
    graph.push(`${split[i]}adelay=${ms}:all=1[d${si}_${i}]`);
    labels.push(`[d${si}_${i}]`);
  });
});

const mix = (gain) =>
  `${graph.join(';')};${labels.join('')}amix=inputs=${labels.length}:normalize=0:duration=first,volume=${gain}dB,` +
  `afade=t=in:d=0.4,afade=t=out:st=${D - 1}:d=1,alimiter=limit=0.84:level=disabled,atrim=0:${D}[a]`;
const render = (gain) => run([...inputs, '-filter_complex', mix(gain), '-map', '[a]', join(out, 'audio.wav')]);
// Two passes: measure the mix, then set the gain so the mean lands near -14 dB.
// The limiter keeps peaks under -1 dB whatever the gain.
render(0);
const detect = () => {
  const r = spawnSync(ff, ['-hide_banner', '-i', join(out, 'audio.wav'), '-af', 'volumedetect', '-f', 'null', '-'], { encoding: 'utf8' });
  const mean = +(/mean_volume: (-?[\d.]+) dB/.exec(r.stderr) || [])[1];
  const max = +(/max_volume: (-?[\d.]+) dB/.exec(r.stderr) || [])[1];
  return { mean, max };
};
let level = detect();
const gain = Math.max(-12, Math.min(12, -14 - level.mean));
render(gain.toFixed(2));
level = detect();
console.log(`audio.wav written: mean ${level.mean} dB, peak ${level.max} dB (gain ${gain.toFixed(2)} dB)`);
