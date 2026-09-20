'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import Image from 'next/image';
import { browserClient } from '@/lib/supabase/client';
export function MediaLibrary({ preview }: { preview: boolean }) {
  const { getToken } = useAuth();
  const [files, setFiles] = useState<{ name: string; url: string }[]>([]);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [remove, setRemove] = useState<string | null>(null);
  async function load() {
    if (preview) return;
    const db = browserClient(getToken);
    const { data, error } = await db.storage
      .from('media')
      .list('', { limit: 200, sortBy: { column: 'created_at', order: 'desc' } });
    if (error) {
      setMessage('Could not load media.');
      return;
    }
    setFiles(
      (data || [])
        .filter((f) => f.id)
        .map((f) => ({
          name: f.name,
          url: db.storage.from('media').getPublicUrl(f.name).data.publicUrl,
        })),
    );
  }
  useEffect(() => {
    void load();
  }, []);
  return (
    <>
      <header className="admin-page-heading">
        <div>
          <h1>Media library</h1>
          <p>Product images and editorial photography.</p>
        </div>
        <label className={`button ${preview ? 'disabled' : ''}`}>
          {busy ? 'Uploading…' : 'Upload image'}
          <input
            className="sr-only"
            type="file"
            accept="image/png,image/jpeg,image/webp,image/avif"
            disabled={preview || busy}
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              if (
                file.size > 5242880 ||
                !['image/png', 'image/jpeg', 'image/webp', 'image/avif'].includes(file.type)
              ) {
                setMessage('Choose a JPG, PNG, WebP or AVIF image up to 5 MB.');
                return;
              }
              setBusy(true);
              const db = browserClient(getToken);
              const extension = file.type.split('/')[1];
              const { error } = await db.storage
                .from('media')
                .upload(`${crypto.randomUUID()}.${extension}`, file, {
                  contentType: file.type,
                  upsert: false,
                });
              setBusy(false);
              setMessage(error ? 'Upload failed. Please try again.' : 'Image uploaded.');
              if (!error) await load();
            }}
          />
        </label>
      </header>
      {message && (
        <p role="status" className="notice">
          {message}
        </p>
      )}
      <div className="media-grid">
        {files.map((file) => (
          <div className="media-card" key={file.name}>
            <Image src={file.url} alt={file.name} width={300} height={200} />
            <p>{file.name}</p>
            <button
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(file.url);
                  setMessage('Image URL copied.');
                } catch {
                  setMessage(file.url);
                }
              }}
            >
              Copy URL
            </button>
            <button className="danger-link" onClick={() => setRemove(file.name)}>
              Delete
            </button>
          </div>
        ))}
      </div>
      {!files.length && (
        <div className="empty">
          <h2>No uploaded images yet.</h2>
          <p>
            {preview
              ? 'Connect Supabase to upload your imagery.'
              : 'Upload your first image to get started.'}
          </p>
        </div>
      )}
      {remove && (
        <div className="modal-backdrop">
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-title"
            className="confirm-dialog"
          >
            <h2 id="delete-title">Delete this image?</h2>
            <p>Pages using this image URL will no longer display it. This cannot be undone.</p>
            <button className="button button-light" autoFocus onClick={() => setRemove(null)}>
              Cancel
            </button>
            <button
              className="button"
              onClick={async () => {
                const db = browserClient(getToken);
                const { error } = await db.storage.from('media').remove([remove]);
                setMessage(error ? 'Image could not be deleted.' : 'Image deleted.');
                setRemove(null);
                await load();
              }}
            >
              Delete image
            </button>
          </div>
        </div>
      )}
    </>
  );
}
