import { NextResponse } from 'next/server';

// Prior consent for non-essential cookies is required by the ePrivacy Directive
// across the EEA, by UK PECR, and by the revised Swiss FADP in practice.
const CONSENT_REQUIRED = new Set([
  // EU
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU',
  'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE',
  // Remaining EEA, plus the UK and Switzerland
  'IS', 'LI', 'NO', 'GB', 'CH',
]);

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const country = (request.headers.get('x-vercel-ip-country') || '').toUpperCase();
  // An unknown country is treated as requiring consent. Asking someone who did
  // not need to be asked costs a banner; the other mistake sets cookies on a
  // visitor entitled to refuse them first.
  return NextResponse.json(
    { country, consentRequired: !country || CONSENT_REQUIRED.has(country) },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
