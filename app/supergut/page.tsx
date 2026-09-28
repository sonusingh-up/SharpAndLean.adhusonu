import { permanentRedirect } from 'next/navigation';

/** The Supergut guide moved to /guides/supergut; keep the first address working. */
export default function SupergutRedirect() {
  permanentRedirect('/guides/supergut');
}
