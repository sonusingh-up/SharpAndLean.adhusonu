'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { Editor } from './editor';
import { saveContent } from '@/app/admin/actions';
const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
import type { FAQ, Ingredient } from '@/lib/types';
type Option = { id: string; name?: string; title?: string };
type FormRecord = Record<string, unknown>;
export function ContentForm({
  kind,
  initial,
  categories,
  authors,
  reviews,
  preview,
}: {
  kind: string;
  initial?: FormRecord;
  categories: Option[];
  authors: Option[];
  reviews: Option[];
  preview: boolean;
}) {
  const router = useRouter();
  const [record, setRecord] = useState<FormRecord>({
    title: '',
    slug: '',
    product_name: '',
    category_id: categories[0]?.id || '',
    author_id: authors[0]?.id || '',
    score: null,
    verdict: '',
    summary: '',
    body: '',
    pros: [],
    cons: [],
    ingredients: [],
    faqs: [],
    items: [],
    affiliate_url: '',
    affiliate_network: '',
    product_price: '',
    price_amount: null,
    currency: 'USD',
    third_party_tested: false,
    money_back_guarantee: '',
    featured_image_url: '',
    og_image_url: '',
    seo_title: '',
    seo_desc: '',
    is_published: false,
    who_for: '',
    who_avoid: '',
    score_breakdown: {},
    ...initial,
  });
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [manualSlug, setManualSlug] = useState(!!initial);
  const [scoreJson, setScoreJson] = useState(JSON.stringify(record.score_breakdown || {}, null, 2));
  const update = (key: string, value: unknown) => setRecord((prev) => ({ ...prev, [key]: value }));
  const str = (key: string) => String(record[key] ?? '');
  const input = (key: string, label: string, type = 'text') => (
    <label className="field" key={key}>
      {label}
      <input
        type={type}
        value={str(key)}
        maxLength={key === 'seo_desc' ? 160 : 2000}
        onChange={(e) => update(key, e.target.value)}
      />
    </label>
  );
  const area = (key: string, label: string) => (
    <label className="field" key={key}>
      {label}
      <textarea value={str(key)} onChange={(e) => update(key, e.target.value)} />
    </label>
  );
  const faqs = record.faqs as FAQ[];
  const ingredients = record.ingredients as Ingredient[];
  const items = record.items as { review_id: string; rank: number; why_it_made_the_list: string }[];
  const reorder = (key: string, index: number, delta: number) => {
    const values = [...(record[key] as unknown[])];
    const other = index + delta;
    if (other < 0 || other >= values.length) return;
    [values[index], values[other]] = [values[other], values[index]];
    update(key, values);
  };
  return (
    <form
      className="admin-form"
      onSubmit={async (e) => {
        e.preventDefault();
        setMessage('');
        if (preview) {
          setMessage('This is a preview. Connect Supabase to save your work.');
          return;
        }
        setBusy(true);
        try {
          const payload = {
            ...record,
            score_breakdown: JSON.parse(scoreJson),
            items: items.map((item, i) => ({ ...item, rank: i + 1 })),
          };
          const result = await saveContent(kind, payload);
          if (result.error) setMessage(result.error);
          else {
            setMessage('Saved successfully.');
            if (result.id) update('id', result.id);
            router.refresh();
          }
        } catch {
          setMessage('Check that the score breakdown is valid JSON.');
        } finally {
          setBusy(false);
        }
      }}
    >
      <div className="admin-editor-heading">
        <h1>
          {initial ? 'Edit' : 'New'}{' '}
          {kind === 'reviews'
            ? 'review'
            : kind === 'best_lists'
              ? 'best-of list'
              : kind === 'comparisons'
                ? 'comparison'
                : 'article'}
        </h1>
        <div>
          <label className="publish-toggle">
            <input
              type="checkbox"
              checked={!!record.is_published}
              onChange={(e) => update('is_published', e.target.checked)}
            />{' '}
            Published
          </label>
          <button className="button" disabled={busy || preview}>
            {busy ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </div>
      {message && (
        <p className="notice" role="status">
          {message}
        </p>
      )}
      <div className="editor-columns">
        <div className="editor-main">
          <section className="admin-panel">
            <label className="field">
              Title
              <input
                required
                value={str('title')}
                onChange={(e) => {
                  const value = e.target.value;
                  setRecord((prev) => ({
                    ...prev,
                    title: value,
                    ...(!manualSlug ? { slug: slugify(value) } : {}),
                    ...(!prev.product_name || prev.product_name === prev.title
                      ? { product_name: value }
                      : {}),
                  }));
                }}
              />
            </label>
            <label className="field">
              Slug
              <input
                required
                value={str('slug')}
                onChange={(e) => {
                  setManualSlug(true);
                  update('slug', e.target.value);
                }}
                pattern="[a-z0-9]+(-[a-z0-9]+)*"
              />
            </label>
            {area('summary', 'Summary')}
            <label className="field">Body</label>
            <Editor value={str('body')} onChange={(v) => update('body', v)} />
          </section>
          {kind === 'reviews' && (
            <>
              <section className="admin-panel">
                <h2>Product details</h2>
                {input('product_name', 'Product name')}
                <div className="field-row">
                  {input('verdict', 'Verdict')}
                  <label className="field">
                    Score / 10
                    <input
                      type="number"
                      min={0}
                      max={10}
                      step={0.1}
                      value={record.score === null ? '' : String(record.score)}
                      onChange={(e) =>
                        update('score', e.target.value === '' ? null : Number(e.target.value))
                      }
                    />
                  </label>
                </div>
                <div className="field-row">
                  {area('who_for', 'Who it may suit')}
                  {area('who_avoid', 'Who should avoid it')}
                </div>
                {(['pros', 'cons'] as const).map((key) => (
                  <div className="list-editor" key={key}>
                    <h3>{key === 'pros' ? 'Pros' : 'Cons'}</h3>
                    {(record[key] as string[]).map((v, i) => (
                      <div className="dynamic-row" key={i}>
                        <input
                          aria-label={`${key} ${i + 1}`}
                          value={v}
                          onChange={(e) =>
                            update(
                              key,
                              (record[key] as string[]).map((s, n) =>
                                n === i ? e.target.value : s,
                              ),
                            )
                          }
                        />
                        <button
                          type="button"
                          aria-label={`Remove ${key} ${i + 1}`}
                          onClick={() =>
                            update(
                              key,
                              (record[key] as string[]).filter((_, n) => n !== i),
                            )
                          }
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="add-button"
                      onClick={() => update(key, [...(record[key] as string[]), ''])}
                    >
                      <Plus size={14} /> Add {key === 'pros' ? 'pro' : 'con'}
                    </button>
                  </div>
                ))}
                <label className="field">
                  Score breakdown (JSON: criterion and score)
                  <textarea
                    value={scoreJson}
                    onChange={(e) => setScoreJson(e.target.value)}
                    placeholder={'{"Ingredients": 8.5}'}
                  />
                </label>
              </section>
              <section className="admin-panel">
                <h2>Ingredients</h2>
                {ingredients.map((v, i) => (
                  <div className="repeat-card" key={i}>
                    <div className="repeat-actions">
                      <span>Ingredient {i + 1}</span>
                      <button
                        type="button"
                        aria-label="Move ingredient up"
                        onClick={() => reorder('ingredients', i, -1)}
                      >
                        <ArrowUp size={15} />
                      </button>
                      <button
                        type="button"
                        aria-label="Move ingredient down"
                        onClick={() => reorder('ingredients', i, 1)}
                      >
                        <ArrowDown size={15} />
                      </button>
                      <button
                        type="button"
                        aria-label="Remove ingredient"
                        onClick={() =>
                          update(
                            'ingredients',
                            ingredients.filter((_, n) => n !== i),
                          )
                        }
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                    {(['name', 'dose', 'note'] as const).map((key) => (
                      <label className="field" key={key}>
                        {key}
                        <input
                          value={v[key]}
                          onChange={(e) =>
                            update(
                              'ingredients',
                              ingredients.map((item, n) =>
                                n === i ? { ...item, [key]: e.target.value } : item,
                              ),
                            )
                          }
                        />
                      </label>
                    ))}
                    <label className="field">
                      Evidence
                      <select
                        value={v.evidence_rating}
                        onChange={(e) =>
                          update(
                            'ingredients',
                            ingredients.map((item, n) =>
                              n === i ? { ...item, evidence_rating: e.target.value } : item,
                            ),
                          )
                        }
                      >
                        {['strong', 'moderate', 'weak', 'none'].map((value) => (
                          <option key={value}>{value}</option>
                        ))}
                      </select>
                    </label>
                  </div>
                ))}
                <button
                  type="button"
                  className="add-button"
                  onClick={() =>
                    update('ingredients', [
                      ...ingredients,
                      { name: '', dose: '', note: '', evidence_rating: 'none' },
                    ])
                  }
                >
                  <Plus size={14} /> Add ingredient
                </button>
              </section>
            </>
          )}
          {kind === 'comparisons' && (
            <section className="admin-panel">
              <h2>Products to compare</h2>
              {['product_a_id', 'product_b_id'].map((key, i) => (
                <label className="field" key={key}>
                  Product {i === 0 ? 'A' : 'B'}
                  <select required value={str(key)} onChange={(e) => update(key, e.target.value)}>
                    <option value="">Choose a product</option>
                    {reviews.map((r) => (
                      <option value={r.id} key={r.id}>
                        {r.title}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
              {area('verdict', 'Quick verdict')}
            </section>
          )}
          {kind === 'best_lists' && (
            <section className="admin-panel">
              <h2>Shortlist picks</h2>
              {items.map((item, i) => (
                <div className="repeat-card" key={i}>
                  <div className="repeat-actions">
                    <span>Pick {i + 1}</span>
                    <button
                      type="button"
                      aria-label="Move pick up"
                      onClick={() => reorder('items', i, -1)}
                    >
                      <ArrowUp size={15} />
                    </button>
                    <button
                      type="button"
                      aria-label="Move pick down"
                      onClick={() => reorder('items', i, 1)}
                    >
                      <ArrowDown size={15} />
                    </button>
                    <button
                      type="button"
                      aria-label="Remove pick"
                      onClick={() =>
                        update(
                          'items',
                          items.filter((_, n) => n !== i),
                        )
                      }
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                  <label className="field">
                    Product
                    <select
                      required
                      value={item.review_id}
                      onChange={(e) =>
                        update(
                          'items',
                          items.map((v, n) => (n === i ? { ...v, review_id: e.target.value } : v)),
                        )
                      }
                    >
                      <option value="">Choose a product</option>
                      {reviews.map((r) => (
                        <option value={r.id} key={r.id}>
                          {r.title}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="field">
                    Why it made the list
                    <textarea
                      value={item.why_it_made_the_list}
                      onChange={(e) =>
                        update(
                          'items',
                          items.map((v, n) =>
                            n === i ? { ...v, why_it_made_the_list: e.target.value } : v,
                          ),
                        )
                      }
                    />
                  </label>
                </div>
              ))}
              <button
                className="add-button"
                type="button"
                onClick={() =>
                  update('items', [
                    ...items,
                    { review_id: '', rank: items.length + 1, why_it_made_the_list: '' },
                  ])
                }
              >
                <Plus size={14} /> Add pick
              </button>
            </section>
          )}
          {['reviews', 'best_lists'].includes(kind) && (
            <section className="admin-panel">
              <h2>Questions & answers</h2>
              {faqs.map((faq, i) => (
                <div className="repeat-card" key={i}>
                  <div className="repeat-actions">
                    <span>FAQ {i + 1}</span>
                    <button
                      type="button"
                      aria-label="Remove FAQ"
                      onClick={() =>
                        update(
                          'faqs',
                          faqs.filter((_, n) => n !== i),
                        )
                      }
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                  {(['question', 'answer'] as const).map((key) => (
                    <label className="field" key={key}>
                      {key}
                      <textarea
                        value={faq[key]}
                        onChange={(e) =>
                          update(
                            'faqs',
                            faqs.map((v, n) => (n === i ? { ...v, [key]: e.target.value } : v)),
                          )
                        }
                      />
                    </label>
                  ))}
                </div>
              ))}
              <button
                type="button"
                className="add-button"
                onClick={() => update('faqs', [...faqs, { question: '', answer: '' }])}
              >
                <Plus size={14} /> Add question
              </button>
            </section>
          )}
        </div>
        <aside className="editor-aside">
          <section className="admin-panel">
            <h2>Publishing</h2>
            <label className="field">
              Category
              <select
                value={str('category_id')}
                onChange={(e) => update('category_id', e.target.value)}
              >
                {categories.map((c) => (
                  <option value={c.id} key={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
            {kind === 'reviews' && (
              <label className="field">
                Author
                <select
                  value={str('author_id')}
                  onChange={(e) => update('author_id', e.target.value)}
                >
                  {authors.map((a) => (
                    <option value={a.id} key={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </label>
            )}
            <p className="muted">
              The first publication date is set automatically. Uncheck Published to return content
              to draft.
            </p>
          </section>
          {kind === 'reviews' && (
            <>
              <section className="admin-panel">
                <h2>Purchase details</h2>
                {input('affiliate_url', 'Affiliate URL', 'url')}
                <label className="field">
                  Network
                  <select
                    value={str('affiliate_network')}
                    onChange={(e) => update('affiliate_network', e.target.value)}
                  >
                    {['', 'Amazon', 'Clickbank', 'Awin', 'Gurumedia'].map((n) => (
                      <option value={n} key={n}>
                        {n || 'Choose network'}
                      </option>
                    ))}
                  </select>
                </label>
                {input('product_price', 'Display price (e.g. $69.99)')}
                <label className="field">
                  Numeric price (for sorting)
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={record.price_amount === null ? '' : String(record.price_amount)}
                    onChange={(e) =>
                      update('price_amount', e.target.value === '' ? null : Number(e.target.value))
                    }
                  />
                </label>
                {input('currency', 'Currency code')}
                {input('money_back_guarantee', 'Money-back guarantee')}
                <label className="publish-toggle">
                  <input
                    type="checkbox"
                    checked={!!record.third_party_tested}
                    onChange={(e) => update('third_party_tested', e.target.checked)}
                  />{' '}
                  Third-party tested
                </label>
              </section>
              <section className="admin-panel">
                <h2>Images</h2>
                <p className="muted">Upload in the Media library, then copy the URL here.</p>
                {input('featured_image_url', 'Featured image URL', 'url')}
                {input('og_image_url', 'Social image URL', 'url')}
              </section>
            </>
          )}
          <section className="admin-panel">
            <h2>Search appearance</h2>
            {input('seo_title', 'SEO title')}
            {area('seo_desc', 'SEO description')}
            <span className="muted">{str('seo_desc').length} / 160 characters</span>
            <button
              type="button"
              className="add-button"
              onClick={() => {
                update('seo_title', str('title'));
                update('seo_desc', str('summary').slice(0, 160));
              }}
            >
              Use title and summary
            </button>
          </section>
        </aside>
      </div>
    </form>
  );
}
