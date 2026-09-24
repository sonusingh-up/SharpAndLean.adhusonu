'use client';

import * as React from 'react';
import * as HoverCard from '@radix-ui/react-hover-card';
import clsx from 'clsx';
import { isPaidLink, linkRel } from '@/lib/link-rel';

/*
 * Link previews: a card with the destination's title, description and image,
 * shown on hover or keyboard focus. Two ways in:
 *
 * - NotionMentionLink renders a Notion-style source chip (favicon + label).
 *   Adapted from the unlumen-ui component by Léo (https://x.com/leouiux).
 * - LinkPreview keeps an existing link exactly as written and only adds the
 *   card, for links inside prose.
 *
 * Differences from the original component, all deliberate:
 * - styled with this site's CSS classes and tokens instead of shadcn/Tailwind;
 * - `rel` defaults to linkRel(), so outbound links stay nofollow and affiliate
 *   links stay sponsored, as they are everywhere else on the site;
 * - affiliate links never fetch a preview, because the server request would
 *   register a click the reader never made;
 * - requests are shared per URL while in flight, instead of each mention
 *   aborting and restarting its own whenever the card opened mid-request;
 * - `label="domain"` shows a stable source chip that does not change width
 *   when the page title arrives.
 */

export type NotionMentionLinkMetadata = {
  url: string;
  title: string;
  description?: string;
  siteName: string;
  domain: string;
  /** Same-origin path from the preview endpoint. Absolute URLs are not rendered. */
  image?: string;
  /** Same-origin path from the preview endpoint. Absolute URLs are not rendered. */
  favicon?: string;
};

type Status = 'idle' | 'loading' | 'ready' | 'error' | 'invalid';

const DEFAULT_ENDPOINT = '/api/notion-mention-link';

const metadataCache = new Map<string, NotionMentionLinkMetadata>();
const pendingRequests = new Map<string, Promise<NotionMentionLinkMetadata>>();

function requestMetadata(endpoint: string, url: string) {
  const cached = metadataCache.get(url);
  if (cached) return Promise.resolve(cached);

  let request = pendingRequests.get(url);
  if (!request) {
    const separator = endpoint.includes('?') ? '&' : '?';
    request = fetch(`${endpoint}${separator}${new URLSearchParams({ url })}`)
      .then(async (response) => {
        if (!response.ok) throw new Error('Preview request failed');
        const data = (await response.json()) as NotionMentionLinkMetadata;
        metadataCache.set(url, data);
        return data;
      })
      .finally(() => pendingRequests.delete(url));
    pendingRequests.set(url, request);
  }
  return request;
}

function normalizeUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return '';
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

function isValidWebsiteUrl(value: string) {
  if (!value || /\s/.test(value)) return false;
  try {
    const parsed = new URL(value);
    const labels = parsed.hostname.split('.');
    return (
      ['http:', 'https:'].includes(parsed.protocol) &&
      labels.length >= 2 &&
      labels.every((label) => /^[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?$/i.test(label))
    );
  } catch {
    return false;
  }
}

function getDomain(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

function getFallbackMetadata(url: string): NotionMentionLinkMetadata {
  const domain = getDomain(url);
  return { url, title: domain, siteName: domain.split('.')[0] || domain, domain };
}

/* The endpoint returns images as signed same-origin proxy paths, so the reader's
   browser never contacts the third-party host. Anything else is left out
   rather than loaded directly. */
function assetSrc(value?: string) {
  return value?.startsWith('/') && !value.startsWith('//') ? value : undefined;
}

/** Loads and caches preview metadata for one URL. Shared by both link styles. */
function useLinkMetadata({
  url,
  endpoint,
  metadata: suppliedMetadata,
  prefetch,
}: {
  url: string;
  endpoint: string;
  metadata?: NotionMentionLinkMetadata;
  prefetch: 'mount' | 'hover';
}) {
  const normalizedUrl = React.useMemo(() => normalizeUrl(url), [url]);
  const isValidUrl = React.useMemo(() => isValidWebsiteUrl(normalizedUrl), [normalizedUrl]);
  const paid = isPaidLink(normalizedUrl);
  const fallback = React.useMemo(() => getFallbackMetadata(normalizedUrl), [normalizedUrl]);

  const initialStatus = (): Status =>
    !isValidUrl ? 'invalid' : suppliedMetadata || metadataCache.has(normalizedUrl) ? 'ready' : 'idle';

  const [loadedMetadata, setLoadedMetadata] = React.useState<NotionMentionLinkMetadata | undefined>(
    () => suppliedMetadata ?? metadataCache.get(normalizedUrl),
  );
  const [status, setStatus] = React.useState<Status>(initialStatus);
  // Mirrors `status` so loadMetadata can read it without being recreated, which
  // would re-run the mount effect on every status change.
  const statusRef = React.useRef<Status>(status);
  const activeUrlRef = React.useRef(normalizedUrl);

  const updateStatus = React.useCallback((next: Status) => {
    statusRef.current = next;
    setStatus(next);
  }, []);

  const loadMetadata = React.useCallback(() => {
    if (!isValidUrl || paid || suppliedMetadata) return;
    // An error is not retried in the same page view; a reload retries it.
    if (statusRef.current !== 'idle') return;

    const requestedUrl = normalizedUrl;
    updateStatus('loading');
    requestMetadata(endpoint, requestedUrl).then(
      (data) => {
        if (activeUrlRef.current !== requestedUrl) return;
        setLoadedMetadata(data);
        updateStatus('ready');
      },
      () => {
        if (activeUrlRef.current !== requestedUrl) return;
        updateStatus('error');
      },
    );
  }, [endpoint, isValidUrl, normalizedUrl, paid, suppliedMetadata, updateStatus]);

  React.useEffect(() => {
    activeUrlRef.current = normalizedUrl;
    setLoadedMetadata(suppliedMetadata ?? metadataCache.get(normalizedUrl));
    updateStatus(
      !isValidUrl ? 'invalid' : suppliedMetadata || metadataCache.has(normalizedUrl) ? 'ready' : 'idle',
    );
  }, [isValidUrl, normalizedUrl, suppliedMetadata, updateStatus]);

  React.useEffect(() => {
    if (prefetch === 'mount') loadMetadata();
  }, [loadMetadata, prefetch]);

  return {
    normalizedUrl,
    isValidUrl,
    paid,
    status,
    metadata: suppliedMetadata ?? loadedMetadata ?? fallback,
    loadMetadata,
  };
}

function SiteIcon({ src, label, large = false }: { src?: string; label: string; large?: boolean }) {
  const [failed, setFailed] = React.useState(false);
  React.useEffect(() => setFailed(false), [src]);

  const className = clsx('mention-icon', large && 'mention-icon-lg');
  if (!src || failed) {
    return (
      <span className={className} aria-hidden="true">
        {label.charAt(0)}
      </span>
    );
  }
  return (
    // Proxied and validated by the same-origin endpoint.
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="" className={className} onError={() => setFailed(true)} aria-hidden="true" />
  );
}

function PreviewSkeleton({ height }: { height: number }) {
  return (
    <span className="mention-card" aria-hidden="true">
      <span className="mention-skeleton" style={{ height, borderRadius: 0 }} />
      <span className="mention-card-body">
        <span className="mention-skeleton" style={{ height: 20, width: '80%' }} />
        <span className="mention-skeleton" style={{ height: 16 }} />
        <span className="mention-skeleton" style={{ height: 16, width: '66%' }} />
      </span>
    </span>
  );
}

function PreviewImage({ src, height }: { src: string; height: number }) {
  const [failed, setFailed] = React.useState(false);
  React.useEffect(() => setFailed(false), [src]);
  if (failed) return null;
  return (
    // Proxied and validated by the same-origin endpoint.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      className="mention-card-image"
      style={{ height }}
      onError={() => setFailed(true)}
      aria-hidden="true"
    />
  );
}

type CardOptions = {
  openDelay?: number;
  closeDelay?: number;
  previewWidth?: number;
  previewHeight?: number;
  align?: 'start' | 'end';
  previewClassName?: string;
};

/** Wraps a link element in the hover card. The trigger must be a single <a>. */
function PreviewHoverCard({
  trigger,
  status,
  metadata,
  onOpen,
  openDelay = 180,
  closeDelay = 120,
  previewWidth = 310,
  previewHeight = 140,
  align = 'start',
  previewClassName,
}: CardOptions & {
  trigger: React.ReactElement;
  status: Status;
  metadata: NotionMentionLinkMetadata;
  onOpen: () => void;
}) {
  const faviconSrc = assetSrc(metadata.favicon);
  const imageSrc = assetSrc(metadata.image);

  return (
    <HoverCard.Root
      openDelay={openDelay}
      closeDelay={closeDelay}
      onOpenChange={(open) => {
        if (open) onOpen();
      }}
    >
      <HoverCard.Trigger asChild>{trigger}</HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content
          side="bottom"
          align={align}
          sideOffset={8}
          collisionPadding={16}
          style={{ width: previewWidth }}
          className={clsx('mention-preview', previewClassName)}
        >
          {status === 'loading' || status === 'idle' ? (
            <PreviewSkeleton height={previewHeight} />
          ) : (
            <span className="mention-card">
              {imageSrc ? <PreviewImage src={imageSrc} height={previewHeight} /> : null}
              <span className="mention-card-body">
                <strong className="mention-card-title">{metadata.title}</strong>
                {status === 'error' ? (
                  <span className="mention-card-note">Preview unavailable — the link still opens normally.</span>
                ) : metadata.description ? (
                  <span className="mention-card-desc">{metadata.description}</span>
                ) : null}
                <span className="mention-card-meta">
                  <SiteIcon src={faviconSrc} label={metadata.siteName} large />
                  <span>{metadata.domain}</span>
                </span>
              </span>
            </span>
          )}
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
}

export type NotionMentionLinkProps = Omit<React.ComponentPropsWithRef<'a'>, 'children' | 'href'> &
  CardOptions & {
    url: string;
    endpoint?: string;
    metadata?: NotionMentionLinkMetadata;
    prefetch?: 'mount' | 'hover';
    showPreview?: boolean;
    invalidLabel?: string;
    /** What the chip shows: the page title (original behaviour) or just the domain. */
    label?: 'title' | 'domain';
  };

function NotionMentionLink({
  url,
  endpoint = DEFAULT_ENDPOINT,
  metadata: suppliedMetadata,
  prefetch = 'mount',
  openDelay,
  closeDelay,
  previewWidth,
  previewHeight,
  align,
  previewClassName,
  showPreview = true,
  invalidLabel = 'Enter a valid website URL.',
  label = 'title',
  className,
  target = '_blank',
  rel,
  onMouseEnter,
  onFocus,
  ref,
  ...props
}: NotionMentionLinkProps) {
  const preview = useLinkMetadata({ url, endpoint, metadata: suppliedMetadata, prefetch });
  const { normalizedUrl, isValidUrl, paid, status, metadata, loadMetadata } = preview;

  if (!isValidUrl || status === 'invalid') {
    return (
      <span role="status" className="mention-invalid">
        {invalidLabel}
      </span>
    );
  }

  const mention = (
    <a
      ref={ref}
      href={normalizedUrl}
      target={target}
      rel={rel ?? linkRel(normalizedUrl)}
      className={clsx('mention', className)}
      onMouseEnter={(event) => {
        loadMetadata();
        onMouseEnter?.(event);
      }}
      onFocus={(event) => {
        loadMetadata();
        onFocus?.(event);
      }}
      {...props}
    >
      <SiteIcon src={assetSrc(metadata.favicon)} label={metadata.siteName} />
      {label === 'domain' ? (
        <span className="mention-title">{metadata.domain}</span>
      ) : (
        <>
          <span className="mention-site">{metadata.siteName}</span>
          <span className="mention-title">{metadata.title}</span>
        </>
      )}
    </a>
  );

  if (!showPreview || paid) return mention;

  return (
    <PreviewHoverCard
      trigger={mention}
      status={status}
      metadata={metadata}
      onOpen={loadMetadata}
      openDelay={openDelay}
      closeDelay={closeDelay}
      previewWidth={previewWidth}
      previewHeight={previewHeight}
      align={align}
      previewClassName={previewClassName}
    />
  );
}

export type LinkPreviewProps = React.ComponentPropsWithRef<'a'> &
  CardOptions & {
    /**
     * Absolute URL to preview. Pass it for relative links, resolved against the
     * site's canonical origin on the server: the browser only knows the origin
     * it happens to be on, which is localhost in development.
     */
    previewUrl?: string;
    endpoint?: string;
  };

/**
 * An ordinary link that also opens a preview card. The link itself is rendered
 * exactly as given — text, href, rel, target and classes untouched — so it can
 * wrap links inside prose without changing a word of it. Metadata is fetched on
 * first hover or focus, never on mount, because an article can hold dozens.
 */
function LinkPreview({
  previewUrl,
  endpoint = DEFAULT_ENDPOINT,
  href,
  children,
  openDelay,
  closeDelay,
  previewWidth,
  previewHeight,
  align,
  previewClassName,
  onMouseEnter,
  onFocus,
  ref,
  ...props
}: LinkPreviewProps) {
  const target = previewUrl ?? href ?? '';
  const { isValidUrl, paid, status, metadata, loadMetadata } = useLinkMetadata({
    url: target,
    endpoint,
    prefetch: 'hover',
  });
  const previewable = Boolean(target) && /^https?:\/\//i.test(target) && isValidUrl && !paid;

  const link = (
    <a
      ref={ref}
      href={href}
      onMouseEnter={(event) => {
        if (previewable) loadMetadata();
        onMouseEnter?.(event);
      }}
      onFocus={(event) => {
        if (previewable) loadMetadata();
        onFocus?.(event);
      }}
      {...props}
    >
      {children}
    </a>
  );

  if (!previewable) return link;

  return (
    <PreviewHoverCard
      trigger={link}
      status={status}
      metadata={metadata}
      onOpen={loadMetadata}
      openDelay={openDelay}
      closeDelay={closeDelay}
      previewWidth={previewWidth}
      previewHeight={previewHeight}
      align={align}
      previewClassName={previewClassName}
    />
  );
}

export { NotionMentionLink, LinkPreview };
