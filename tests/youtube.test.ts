import { test } from 'node:test';
import assert from 'node:assert/strict';
import { clock, isoDuration, videoSchema, youtubeEmbedSrc, youtubeId } from '../lib/youtube';
import { editorialCollections as collections } from '../lib/products';

test('youtubeId accepts only an 11-character id', () => {
  assert.equal(youtubeId('9x8uNby-ols'), '9x8uNby-ols');
  assert.equal(youtubeId('https://youtu.be/9x8uNby-ols'), null);
  assert.equal(youtubeId('9x8uNby-ols"><script>'), null);
});

test('the player is privacy-enhanced and can start at a chapter', () => {
  assert.equal(
    youtubeEmbedSrc('9x8uNby-ols', 83),
    'https://www.youtube-nocookie.com/embed/9x8uNby-ols?autoplay=1&rel=0&modestbranding=1&start=83',
  );
  assert.ok(!youtubeEmbedSrc('9x8uNby-ols').includes('start='));
});

test('clock and isoDuration format lengths', () => {
  assert.equal(clock(363), '6:03');
  assert.equal(clock(3725), '1:02:05');
  assert.equal(isoDuration(363), 'PT6M3S');
  assert.equal(isoDuration(360), 'PT6M');
  assert.equal(isoDuration(0), 'PT0S');
});

test('every featured video has ordered chapters inside its length', () => {
  const withVideo = collections.filter((c) => c.video);
  assert.ok(withVideo.length > 0);
  for (const c of withVideo) {
    const v = c.video!;
    assert.ok(youtubeId(v.youtubeId), `${c.slug}: bad id`);
    assert.ok(!Number.isNaN(Date.parse(v.uploadDate)), `${c.slug}: bad uploadDate`);
    const starts = (v.chapters ?? []).map((ch) => ch.start);
    if (starts.length) assert.equal(starts[0], 0, `${c.slug}: first chapter must start at 0`);
    starts.forEach((s, i) => {
      assert.ok(s < v.durationSeconds, `${c.slug}: chapter past the end`);
      if (i) assert.ok(s > starts[i - 1], `${c.slug}: chapters out of order`);
    });
  }
});

test('the VideoObject has the fields Google requires, and clips that tile the video', () => {
  const guide = collections.find((c) => c.slug === 'ashwagandha-which-brand-is-the-best-to-buy-in-2026');
  const node = videoSchema(guide!.video!, 'https://sharpandlean.com/best/x', 'https://sharpandlean.com/#organization')!;
  for (const key of ['name', 'description', 'thumbnailUrl', 'uploadDate', 'duration', 'embedUrl']) {
    assert.ok(node[key as keyof typeof node], `missing ${key}`);
  }
  const clips = node.hasPart as { startOffset: number; endOffset: number }[];
  assert.equal(clips.length, 20);
  clips.forEach((c, i) => {
    assert.ok(c.endOffset > c.startOffset);
    if (i) assert.equal(c.startOffset, clips[i - 1].endOffset);
  });
  assert.equal(clips.at(-1)!.endOffset, 363);
});
