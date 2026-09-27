import { contactSchema } from '@/lib/validation';
import { publicRequest, apiFailure } from '@/lib/public-api';
import { contactEmail } from '@/lib/email/server';

export async function POST(request: Request) {
  try {
    const { body } = await publicRequest(request, 'contact');
    const input = contactSchema.parse(body);
    const email = contactEmail();
    await email.client.sendContact(input, email.from, email.to);
    return Response.json({ message: 'Thank you. Your message has been sent to our editorial team.' });
  } catch (error) {
    return apiFailure(error);
  }
}
