'use client';
import { useEffect, useState } from 'react';
import Script from 'next/script';

const STORAGE_KEY = 'snl-analytics-consent';
type Decision = 'granted' | 'denied';

// Nothing is loaded until a decision exists, so no analytics cookie is written
// before it is allowed. Suppressing a tag that has already loaded would be the
// weaker promise, and a harder one to state honestly in the privacy policy.
function readStored(): Decision | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === 'granted' || value === 'denied' ? value : null;
  } catch {
    return null;
  }
}

function writeStored(decision: Decision) {
  try {
    localStorage.setItem(STORAGE_KEY, decision);
  } catch {
    // Private browsing or blocked storage: the choice holds for this page view
    // and is asked again next time, which is the harmless direction.
  }
}

export function Consent({ gaId }: { gaId: string }) {
  const [decision, setDecision] = useState<Decision | null>(null);
  const [asking, setAsking] = useState(false);

  useEffect(() => {
    if (!gaId) return;
    const stored = readStored();
    if (stored) {
      setDecision(stored);
      return;
    }
    let cancelled = false;
    fetch('/api/region', { cache: 'no-store' })
      .then((response) => (response.ok ? response.json() : { consentRequired: true }))
      .then((region: { consentRequired?: boolean }) => {
        if (cancelled) return;
        if (region.consentRequired) {
          setAsking(true);
          return;
        }
        // Outside the consent regimes the choice is implied, so the page is
        // never interrupted; recording it avoids repeating the lookup.
        writeStored('granted');
        setDecision('granted');
      })
      .catch(() => {
        if (!cancelled) setAsking(true);
      });
    return () => {
      cancelled = true;
    };
  }, [gaId]);

  const choose = (next: Decision) => {
    writeStored(next);
    setDecision(next);
    setAsking(false);
  };

  return (
    <>
      {decision === 'granted' && gaId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="ga-config" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaId}', { allow_google_signals: false, allow_ad_personalization_signals: false });`}
          </Script>
        </>
      )}
      {asking && (
        <section className="cookie-consent" role="region" aria-label="Analytics cookies">
          <div className="cookie-consent-inner">
            <p className="cookie-consent-text">
              <strong>Analytics cookies.</strong> We would like to count page views with Google
              Analytics, which stores two cookies on this device. Nothing is set unless you agree,
              and refusing changes nothing about how the site works. No advertising or cross-site
              tracking is used either way.
            </p>
            <div className="cookie-consent-actions">
              <button type="button" className="button" onClick={() => choose('granted')}>
                Accept
              </button>
              <button type="button" className="cookie-consent-reject" onClick={() => choose('denied')}>
                Reject
              </button>
              <a href="/privacy-policy">How we handle data</a>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
