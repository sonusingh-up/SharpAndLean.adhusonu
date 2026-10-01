import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import {
  proteinLabResults,
  rankedProteins,
  percentOfClaim,
  proteinPerGram,
  cleanMetals,
  reportUrl,
} from '../lib/protein-lab-tests';

/*
 * Pins the Labdoor figures the protein guide quotes and the order its ranking
 * produces. If a figure changes here, the prose in
 * lib/editorials/best-protein-powders.ts and lib/protein-lab-tests.ts must
 * change with it.
 */

const byId = (id: string) => proteinLabResults.find((r) => r.id === id)!;

test('all nine Labdoor results are present', () => {
  assert.equal(proteinLabResults.length, 9);
});

test('every product met the FDA floor of 80 per cent of its protein claim', () => {
  for (const r of proteinLabResults) assert.ok(percentOfClaim(r) >= 80, r.id);
});

test('no product showed signs of amino-acid spiking', () => {
  for (const r of proteinLabResults) assert.equal(r.freeAminoAcids, '<0.01', r.id);
});

test('the ranking puts NOW and Naked Egg first and Klean last', () => {
  assert.deepEqual(
    rankedProteins().map((r) => r.id),
    [
      'now-sports-whey-isolate',
      'naked-egg',
      'bloom-whey-isolate',
      'optimum-gold-standard',
      'true-nutrition-isolate',
      'raw-grass-fed-whey',
      'myprotein-impact-isolate',
      'orgain-plant',
      'klean-isolate',
    ],
  );
});

test('the figures quoted in the guide match the reports', () => {
  assert.equal(proteinPerGram(byId('now-sports-whey-isolate')).toFixed(0), '89');
  assert.equal(proteinPerGram(byId('naked-egg')).toFixed(0), '82');
  assert.equal(proteinPerGram(byId('orgain-plant')).toFixed(0), '46');
  assert.equal(percentOfClaim(byId('raw-grass-fed-whey')).toFixed(0), '97');
  assert.equal(byId('klean-isolate').metals.cadmium, 1.74);
  assert.equal(proteinLabResults.filter(cleanMetals).length, 6);
});

test('every result has its full Labdoor report in public/lab-reports', () => {
  for (const r of proteinLabResults) assert.ok(existsSync(`public${reportUrl(r)}`), r.id);
});
