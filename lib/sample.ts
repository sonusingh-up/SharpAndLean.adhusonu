import type { Review } from './types';
export const categories = [
  {slug: 'fat-burners', name: 'Fat Burners', description: 'Weight-management supplements and fibre: read the evidence before the promise.', label: 'Weight management'},
  {slug: 'nootropics', name: 'Nootropics', description: 'Focus and relaxation products examined through their labels and evidence.', label: 'Mind & focus'},
  {slug: 'wellness', name: 'Wellness', description: 'Everyday supplements, clearly explained.', label: 'Everyday wellbeing'},
] as const;
export const sampleReviews: Review[] = [];
