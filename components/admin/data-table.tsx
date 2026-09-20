'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpDown } from 'lucide-react';
export function DataTable({ rows, section }: { rows: Record<string, unknown>[]; section: string }) {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'title' | 'updated_at'>('updated_at');
  const [descending, setDescending] = useState(true);
  const sorted = rows
    .filter((r) =>
      String(r.title || r.email || r.reviewer_name || '')
        .toLowerCase()
        .includes(search.toLowerCase()),
    )
    .sort((a, b) => {
      const result = String(a[sort] || '').localeCompare(String(b[sort] || ''));
      return descending ? -result : result;
    });
  return (
    <div className="data-table">
      <label className="field table-search">
        Find {section}
        <input placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)} />
      </label>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>
                <button
                  onClick={() => {
                    setSort('title');
                    setDescending(!descending);
                  }}
                >
                  Title <ArrowUpDown size={13} />
                </button>
              </th>
              <th>Status</th>
              <th>Score</th>
              <th>
                <button
                  onClick={() => {
                    setSort('updated_at');
                    setDescending(!descending);
                  }}
                >
                  Updated <ArrowUpDown size={13} />
                </button>
              </th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => (
              <tr key={String(r.id)}>
                <td>{String(r.title)}</td>
                <td>
                  <span className={`status-pill ${r.is_published ? 'published' : ''}`}>
                    {r.is_published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td>{r.score === null || r.score === undefined ? '—' : String(r.score)}</td>
                <td>
                  {r.updated_at ? new Date(String(r.updated_at)).toLocaleDateString('en-GB') : '—'}
                </td>
                <td>
                  <Link href={`/admin/${section}/${r.id}`}>Edit →</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!sorted.length && <p className="table-empty">No matching content yet.</p>}
    </div>
  );
}
