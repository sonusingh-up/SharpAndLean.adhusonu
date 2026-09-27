/**
 * Source of truth for the four Resend dashboard templates.
 *
 * `node scripts/resend-templates.mjs --check` validates local content and
 * reports remote status without writing. `--publish` updates and publishes
 * all four existing template IDs. The credential comes only from .env.local.
 * The website does not currently invoke these templates automatically.
 */
import nextEnv from '@next/env';
const { loadEnvConfig } = nextEnv;

const SITE = 'https://sharpandlean.com';
const FROM = 'SharpAndLean <website@sharpandlean.com>';

const colors = {
  canvas: '#ece6dc', paper: '#fbf9f5', pine: '#183b37', ink: '#1c2a28',
  soft: '#3d4c48', muted: '#5d6865', line: '#e8e1d5', peach: '#f3b596',
  teal: '#2f7c72', ochre: '#a9813c',
};

function logo() {
  return `<table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="padding-right:10px;vertical-align:middle"><table role="presentation" cellpadding="0" cellspacing="2"><tr><td width="8" height="8" bgcolor="${colors.pine}"></td><td width="8" height="8" bgcolor="${colors.teal}"></td></tr><tr><td width="8" height="8" bgcolor="${colors.peach}"></td><td width="8" height="8" bgcolor="${colors.pine}"></td></tr></table></td><td style="font-family:Arial,Helvetica,sans-serif;font-size:22px;letter-spacing:-1.2px;font-weight:700;color:${colors.pine}">Sharp<span style="color:${colors.teal}">&amp;</span>Lean</td></tr></table>`;
}

function button(label, url) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px 0 4px"><tr><td bgcolor="${colors.pine}" style="border-radius:9px"><a href="${url}" style="display:inline-block;padding:14px 22px;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:18px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#ffffff;text-decoration:none">${label}&nbsp; ↗</a></td></tr></table>`;
}

function paragraph(content) {
  return `<p style="margin:0 0 16px;color:${colors.soft};font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:26px">${content}</p>`;
}

function callout(content) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;border:1px solid ${colors.line};border-radius:12px;background:#f3efe7"><tr><td style="padding:20px 22px;color:${colors.soft};font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:23px">${content}</td></tr></table>`;
}

function field(label, value) {
  return `<tr><td style="padding:13px 0;border-bottom:1px solid ${colors.line};font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:18px;letter-spacing:1.5px;text-transform:uppercase;color:${colors.ochre};vertical-align:top;width:120px">${label}</td><td style="padding:13px 0;border-bottom:1px solid ${colors.line};font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:23px;color:${colors.ink};word-break:break-word">${value}</td></tr>`;
}

function layout({ title, preheader, eyebrow, headline, body, internal = false }) {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="x-apple-disable-message-reformatting"><meta name="format-detection" content="telephone=no,address=no,email=no"><title>${title}</title>
<!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
<style>@media only screen and (max-width:620px){.outer{padding:16px 10px!important}.card{width:100%!important}.pad{padding:28px 22px!important}.title{font-size:34px!important}.stack{display:block!important;width:100%!important}}</style></head>
<body style="margin:0;padding:0;background:${colors.canvas};color:${colors.ink};font-family:Arial,Helvetica,sans-serif">
<div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden">${preheader}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="${colors.canvas}"><tr><td class="outer" align="center" style="padding:36px 18px">
<table role="presentation" class="card" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:${colors.paper};border:1px solid ${colors.line};border-radius:18px;overflow:hidden">
<tr><td><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td width="33%" height="5" bgcolor="${colors.peach}"></td><td width="34%" bgcolor="${colors.ochre}"></td><td width="33%" bgcolor="${colors.teal}"></td></tr></table></td></tr>
<tr><td class="pad" style="padding:34px 42px 20px">${logo()}</td></tr>
<tr><td class="pad" style="padding:14px 42px 38px"><p style="margin:0 0 13px;color:${colors.ochre};font-size:11px;line-height:17px;font-weight:700;letter-spacing:2px;text-transform:uppercase">${eyebrow}</p><h1 class="title" style="margin:0 0 24px;color:${colors.ink};font-family:Arial,Helvetica,sans-serif;font-size:42px;line-height:1.12;font-weight:400;letter-spacing:-1.6px">${headline}</h1>${body}</td></tr>
<tr><td style="padding:25px 42px;background:${colors.pine};color:#e8eee9;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:21px"><strong style="font-size:14px;color:#ffffff">Sharp&amp;Lean</strong><br>A little more clarity. A more informed choice.<br><a href="${SITE}" style="color:#c1ded8;text-decoration:underline">sharpandlean.com</a> &nbsp;·&nbsp; <a href="${SITE}/privacy-policy" style="color:#c1ded8;text-decoration:underline">Privacy</a> &nbsp;·&nbsp; <a href="${SITE}/contact" style="color:#c1ded8;text-decoration:underline">Contact</a></td></tr>
</table>
<p style="max-width:600px;margin:16px auto 0;color:${colors.muted};font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:17px;text-align:center">${internal ? 'Internal editorial notification. Do not forward outside the team.' : 'SharpAndLean · Independent thinking. Informed choices.'}</p>
</td></tr></table></body></html>`;
}

export const templates = [
  {
    id: '0e2f8aa3-2990-40f6-8296-2dcd49a8a4aa', alias: 'subscriber-notification',
    name: 'Subscriber Notification', subject: 'New SharpAndLean newsletter sign-up',
    variables: [{ key: 'SUBSCRIBER_EMAIL', type: 'string', fallback_value: 'A new reader' }],
    html: layout({
      title: 'New newsletter sign-up | SharpAndLean', preheader: 'A reader joined the SharpAndLean newsletter.',
      eyebrow: 'Editorial desk · Subscriber alert', headline: 'One more reader<br><em style="font-family:Georgia,serif;font-weight:400">on the list.</em>', internal: true,
      body: `${paragraph('A new address was submitted through the website newsletter form.')}
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${field('Email', '{{{SUBSCRIBER_EMAIL}}}')}${field('Source', 'Website newsletter form')}</table>
      ${callout('Resend is the source of truth for delivery preferences and opt-outs. The Supabase subscribers table records consent; it is not a live mailing list.')}`,
    }),
    text: 'New SharpAndLean newsletter sign-up\n\nEmail: {{{SUBSCRIBER_EMAIL}}}\nSource: Website newsletter form\n\nManage delivery preferences in Resend. The Supabase subscribers table records consent, not current opt-in status.',
  },
  {
    id: '215d704a-388f-46ab-8078-b8b333e63893', alias: 'newsletter-welcome',
    name: 'Newsletter Welcome', subject: 'Welcome to SharpAndLean — a little more clarity', variables: [],
    html: layout({
      title: 'Welcome to SharpAndLean', preheader: 'Independent reviews, useful evidence and no miracle promises.',
      eyebrow: 'Welcome to SharpAndLean', headline: 'A little more clarity,<br><em style="font-family:Georgia,serif;font-weight:400">straight to your inbox.</em>',
      body: `${paragraph('Thanks for joining us. We look past the front of the label to ask what is in a product, what the evidence says and what you should know before deciding.')}
      ${callout('<strong style="color:#183b37">What to expect</strong><br>New reviews, ingredient explainers, practical guides and corrections when we get something wrong. Occasional updates, never miracle promises.')}
      ${paragraph('You can start with our current guides. Read at your own pace; nothing here is personal medical advice.')}
      ${button('Explore the guides', `${SITE}/guides`)}
      ${paragraph(`Questions? Reply to this email or <a href="${SITE}/contact" style="color:${colors.teal};text-decoration:underline">contact the editorial desk</a>. Every newsletter issue includes an unsubscribe link.`)}`,
    }),
    text: 'Welcome to SharpAndLean\n\nThanks for joining us. We look past the front of the label to ask what is in a product, what the evidence says and what you should know before deciding. Expect occasional reviews, ingredient explainers, practical guides and corrections — no miracle promises.\n\nExplore the guides: https://sharpandlean.com/guides\nContact: https://sharpandlean.com/contact\nEvery newsletter issue includes an unsubscribe link.',
  },
  {
    id: '9b0f564d-d139-4cbd-906c-4b9dc33c8ecd', alias: 'contact-confirmation',
    name: 'Contact Confirmation', subject: 'We received your message | SharpAndLean', variables: [],
    html: layout({
      title: 'We received your message | SharpAndLean', preheader: 'Your note has reached the SharpAndLean editorial desk.',
      eyebrow: 'Message received', headline: 'Thanks for<br><em style="font-family:Georgia,serif;font-weight:400">getting in touch.</em>',
      body: `${paragraph('Your message has reached our editorial desk. We read corrections, product suggestions, press questions and thoughtful feedback carefully.')}
      ${callout('General messages are normally reviewed within five business days. Evidence-heavy or legal questions can take longer. If your note concerns a correction, a page URL and primary source are especially helpful.')}
      ${paragraph('This inbox is not monitored for urgent health concerns. If you need immediate medical help, contact local emergency services.')}
      ${button('Our approach', `${SITE}/about`)}
      ${paragraph('This confirmation is about your message only. It does not subscribe you to marketing emails.')}`,
    }),
    text: 'We received your message | SharpAndLean\n\nYour message has reached our editorial desk. General messages are normally reviewed within five business days; evidence-heavy or legal questions can take longer. For a correction, include the page URL and a primary source. This inbox is not monitored for urgent health concerns.\n\nOur approach: https://sharpandlean.com/about\nThis confirmation does not subscribe you to marketing emails.',
  },
  {
    id: '4831a042-ab34-4bda-89e4-87e5d504a558', alias: 'contact-notification',
    name: 'Contact Notification', subject: 'New message for the SharpAndLean editorial desk',
    variables: [
      { key: 'SENDER_NAME', type: 'string', fallback_value: 'Website visitor' },
      { key: 'SENDER_EMAIL', type: 'string', fallback_value: 'Not supplied' },
      { key: 'MESSAGE_SUBJECT', type: 'string', fallback_value: 'Website enquiry' },
      { key: 'MESSAGE_BODY', type: 'string', fallback_value: 'No message supplied' },
    ],
    html: layout({
      title: 'New contact message | SharpAndLean', preheader: 'A new contact-form message needs editorial review.',
      eyebrow: 'Editorial desk · Contact alert', headline: 'A new note<br><em style="font-family:Georgia,serif;font-weight:400">for the desk.</em>', internal: true,
      body: `${paragraph('A visitor sent a message through the website contact form.')}
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${field('Name', '{{{SENDER_NAME}}}')}${field('Email', '{{{SENDER_EMAIL}}}')}${field('Subject', '{{{MESSAGE_SUBJECT}}}')}</table>
      <p style="margin:24px 0 8px;color:${colors.ochre};font-size:11px;line-height:17px;font-weight:700;letter-spacing:2px;text-transform:uppercase">Message</p>
      <div style="padding:20px 22px;border:1px solid ${colors.line};border-radius:12px;background:#f3efe7;color:${colors.ink};font-size:15px;line-height:24px;white-space:pre-wrap;word-break:break-word">{{{MESSAGE_BODY}}}</div>
      ${callout('Reply to the sender using the address above. Do not treat contact messages as newsletter sign-ups; keep any sensitive details within the editorial team.')}`,
    }),
    text: 'New SharpAndLean contact message\n\nName: {{{SENDER_NAME}}}\nEmail: {{{SENDER_EMAIL}}}\nSubject: {{{MESSAGE_SUBJECT}}}\n\n{{{MESSAGE_BODY}}}\n\nReply to the sender directly. Do not add contact-form senders to marketing lists.',
  },
];

async function api(path, key, method = 'GET', body) {
  const response = await fetch(`https://api.resend.com${path}`, {
    method, headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(`Resend ${method} ${path} failed (${response.status}): ${JSON.stringify(result)}`);
  return result;
}

function validate() {
  for (const item of templates) {
    if (/fitlabreviews|fitlab|48 hours|FSP-scored|unsubscribe_url/i.test(JSON.stringify(item))) {
      throw new Error(`Legacy copy remains in ${item.alias}`);
    }
    if (!item.html.includes(SITE) || !item.html.includes('Sharp&amp;Lean')) {
      throw new Error(`Brand or site link missing from ${item.alias}`);
    }
    const placeholders = [...new Set([...item.html.matchAll(/\{\{\{([A-Z_]+)\}\}\}/g)].map((match) => match[1]))];
    const declared = item.variables.map((variable) => variable.key);
    if (placeholders.sort().join(',') !== declared.sort().join(',')) {
      throw new Error(`Template variable mismatch in ${item.alias}`);
    }
  }
}

if (process.argv[1]?.endsWith('resend-templates.mjs')) {
  const mode = process.argv[2] || '--check';
  if (!['--check', '--publish'].includes(mode)) throw new Error('Use --check or --publish');
  validate();
  loadEnvConfig(process.cwd());
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('RESEND_API_KEY is missing');
  for (const item of templates) {
    const current = await api(`/templates/${item.id}`, key);
    if (current.alias !== item.alias) throw new Error(`Template ID/alias mismatch: ${item.alias}`);
    if (mode === '--publish') {
      await api(`/templates/${item.id}`, key, 'PATCH', {
        name: item.name, alias: item.alias, from: FROM, subject: item.subject,
        html: item.html, text: item.text, variables: item.variables,
      });
      await api(`/templates/${item.id}/publish`, key, 'POST');
    }
    const updated = await api(`/templates/${item.id}`, key);
    const matches = updated.html === item.html && updated.text === item.text &&
      updated.subject === item.subject && updated.from === FROM &&
      updated.variables?.map((variable) => variable.key).sort().join(',') ===
        item.variables.map((variable) => variable.key).sort().join(',');
    if (mode === '--publish' && (!matches || updated.status !== 'published')) {
      throw new Error(`Published template verification failed: ${item.alias}`);
    }
    console.log(JSON.stringify({
      template: item.alias, status: updated.status,
      matchesSource: matches,
      subject: updated.subject,
      variables: updated.variables?.map((variable) => variable.key),
    }));
  }
}
