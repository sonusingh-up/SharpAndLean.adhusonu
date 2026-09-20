import { communitySchema } from '@/lib/validation';
import { publicRequest, apiFailure } from '@/lib/public-api';
export async function POST(request: Request) {
  try {
    const { db, body } = await publicRequest(request, 'community');
    const { website: _, ...input } = communitySchema.parse(body);
    const { data: review } = await db
      .from('reviews')
      .select('id')
      .eq('id', input.review_id)
      .eq('is_published', true)
      .maybeSingle();
    if (!review) throw new Error('Invalid review.');
    const { error } = await db.from('community_reviews').insert({ ...input, is_approved: false });
    if (error) throw error;
    return Response.json({
      message: 'Thank you. Your experience has been submitted for moderation.',
    });
  } catch (error) {
    return apiFailure(error);
  }
}
