import { subscriberSchema } from '@/lib/validation';
import { publicRequest, apiFailure } from '@/lib/public-api';
import { newsletterEmail } from '@/lib/email/server';
export async function POST(request: Request) {
  try {
    const { db, body } = await publicRequest(request, 'subscribe');
    const input = subscriberSchema.parse(body);
    const email = newsletterEmail();
    const { error } = await db
      .from('subscribers')
      .upsert(
        { email: input.email, source: 'website', consent_at: new Date().toISOString() },
        { onConflict: 'email', ignoreDuplicates: true },
      );
    if (error) throw error;
    // Always retry the Resend sync, even when consent was previously saved.
    await email.client.subscribe(input.email, email.segment);
    return Response.json({ message: 'Thank you. Your request has been processed. If you previously unsubscribed, contact us to rejoin.' });
  } catch (error) {
    return apiFailure(error);
  }
}
