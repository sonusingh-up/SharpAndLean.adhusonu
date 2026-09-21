'use client';
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main id="main" className="empty">
      <h1>This page didn&rsquo;t load.</h1>
      <p>
        Something failed on our side rather than yours. Trying again usually works; if it keeps
        happening, the site is having a bad day and the content is still there.
      </p>
      <button className="button" onClick={reset}>
        Try again
      </button>
    </main>
  );
}
