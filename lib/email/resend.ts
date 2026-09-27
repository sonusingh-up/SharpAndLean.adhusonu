import { createHash } from 'node:crypto';

export class ResendError extends Error {
  constructor(public readonly status: number) {
    // Never expose provider response bodies, recipient addresses or credentials.
    super(`Email provider request failed (${status}).`);
  }
}

type Contact = { id: string; unsubscribed: boolean };
export type ContactMessage = { name: string; email: string; subject: string; message: string };

/** Credentials are supplied only by the server wrapper; fetch is injectable for tests. */
export class ResendClient {
  constructor(private readonly apiKey: string, private readonly transport: typeof fetch = fetch) {}

  private async request(path: string, method = 'GET', body?: unknown, idempotencyKey?: string) {
    let response: Response;
    try {
      response = await this.transport(`https://api.resend.com${path}`, {
        method,
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          ...(idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {}),
        },
        body: body === undefined ? undefined : JSON.stringify(body),
        cache: 'no-store',
        signal: AbortSignal.timeout(10000),
      });
    } catch {
      throw new ResendError(0);
    }
    if (!response.ok) throw new ResendError(response.status);
    try {
      return await response.json() as Record<string, unknown>;
    } catch {
      throw new ResendError(502);
    }
  }

  private async findContact(email: string): Promise<Contact | null> {
    try {
      const contact = await this.request(`/contacts/${encodeURIComponent(email)}`);
      if (typeof contact.id !== 'string' || typeof contact.unsubscribed !== 'boolean') {
        throw new ResendError(502);
      }
      return { id: contact.id, unsubscribed: contact.unsubscribed };
    } catch (error) {
      if (error instanceof ResendError && error.status === 404) return null;
      throw error;
    }
  }

  /** Returns true only when this request newly joins the newsletter segment. */
  async subscribe(email: string, segmentId: string): Promise<boolean> {
    const existing = await this.findContact(email);
    // A public form cannot prove ownership of an address. Never undo an opt-out.
    if (existing?.unsubscribed) return false;
    if (existing) {
      const memberships = await this.request(`/contacts/${encodeURIComponent(existing.id)}/segments`);
      if (!Array.isArray(memberships.data)) throw new ResendError(502);
      const alreadyJoined = memberships.data.some((row) =>
        typeof row === 'object' && row !== null && (row as { id?: unknown }).id === segmentId,
      );
      if (alreadyJoined) return false;
      await this.request(`/contacts/${encodeURIComponent(existing.id)}/segments/${encodeURIComponent(segmentId)}`, 'POST');
      // If the response is paginated, membership might be beyond this page.
      // Join safely, but do not risk a duplicate welcome.
      return memberships.has_more !== true;
    }
    // Omitting unsubscribed also avoids resetting an opt-out if a contact is
    // created concurrently. Resend subscribes newly created contacts by default.
    const result = await this.request('/contacts', 'POST', {
      email,
      segments: [{ id: segmentId }],
    });
    if (typeof result.id !== 'string') throw new ResendError(502);
    return true;
  }

  async sendWelcome(email: string, from: string): Promise<void> {
    const payload = { from, to: [email], template: { id: 'newsletter-welcome' } };
    const key = createHash('sha256').update(email.toLowerCase()).digest('hex');
    const result = await this.request('/emails', 'POST', payload, `welcome/${key}`);
    if (typeof result.id !== 'string') throw new ResendError(502);
  }

  async sendWeeklyDigest(input: {
    name: string; from: string; segmentId: string; subject: string; html: string; text: string;
  }): Promise<boolean> {
    const listing = await this.request('/broadcasts?limit=100');
    if (!Array.isArray(listing.data)) throw new ResendError(502);
    if (listing.data.some((row) =>
      typeof row === 'object' && row !== null &&
      (row as { name?: unknown; segment_id?: unknown }).name === input.name &&
      (row as { segment_id?: unknown }).segment_id === input.segmentId,
    )) return false;
    const result = await this.request('/broadcasts', 'POST', {
      name: input.name,
      from: input.from,
      segment_id: input.segmentId,
      subject: input.subject,
      html: input.html,
      text: input.text,
      send: true,
    });
    if (typeof result.id !== 'string') throw new ResendError(502);
    return true;
  }

  async sendContact(input: ContactMessage, from: string, to: string): Promise<void> {
    const payload = {
      from,
      to: [to],
      reply_to: input.email,
      template: {
        id: 'contact-notification',
        variables: {
          SENDER_NAME: input.name,
          SENDER_EMAIL: input.email,
          MESSAGE_SUBJECT: input.subject,
          MESSAGE_BODY: input.message,
        },
      },
    };
    const key = createHash('sha256').update(JSON.stringify(payload)).digest('hex');
    const result = await this.request('/emails', 'POST', payload, `contact/${key}`);
    if (typeof result.id !== 'string') throw new ResendError(502);
  }
}
