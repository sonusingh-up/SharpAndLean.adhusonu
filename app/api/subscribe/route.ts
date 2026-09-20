import { subscriberSchema } from '@/lib/validation';
import { publicRequest, apiFailure } from '@/lib/public-api';
export async function POST(request: Request) {
  try {
    const { db, body } = await publicRequest(request, 'subscribe');
    const input = subscriberSchema.parse(body);
    const { error } = await db
      .from('subscribers')
      .upsert(
        { email: input.email, source: 'website', consent_at: new Date().toISOString() },
        { onConflict: 'email', ignoreDuplicates: true },
      );
    if (error) throw error;
    return Response.json({ message: 'Thank you. Your subscription request has been saved.' });
  } catch (error) {
    return apiFailure(error);
  }
}
