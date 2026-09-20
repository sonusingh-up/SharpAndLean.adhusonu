'use client';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ImageExtension from '@tiptap/extension-image';
import { TableKit } from '@tiptap/extension-table';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import { useState } from 'react';
export function Editor({ value, onChange }: { value: string; onChange: (html: string) => void }) {
  const [link, setLink] = useState('');
  const [image, setImage] = useState('');
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        link: { openOnClick: false, HTMLAttributes: { rel: 'noopener noreferrer' } },
      }),
      ImageExtension,
      TableKit,
      Placeholder.configure({ placeholder: 'Write a considered, evidence-led review…' }),
      CharacterCount,
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: { class: 'tiptap prose', 'aria-label': 'Article body', role: 'textbox' },
    },
  });
  if (!editor) return <div className="editor-loading">Loading editor…</div>;
  return (
    <div className="rich-editor">
      <div className="editor-toolbar" role="toolbar" aria-label="Text formatting">
        {[
          ['Bold', () => editor.chain().focus().toggleBold().run()],
          ['Italic', () => editor.chain().focus().toggleItalic().run()],
          ['H2', () => editor.chain().focus().toggleHeading({ level: 2 }).run()],
          ['H3', () => editor.chain().focus().toggleHeading({ level: 3 }).run()],
          ['Bullets', () => editor.chain().focus().toggleBulletList().run()],
          ['Numbered', () => editor.chain().focus().toggleOrderedList().run()],
          ['Quote', () => editor.chain().focus().toggleBlockquote().run()],
          [
            'Table',
            () =>
              editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
          ],
          ['Rule', () => editor.chain().focus().setHorizontalRule().run()],
          ['Clear', () => editor.chain().focus().clearNodes().unsetAllMarks().run()],
        ].map(([name, action]) => (
          <button type="button" key={String(name)} onClick={action as () => void}>
            {String(name)}
          </button>
        ))}
      </div>
      <EditorContent editor={editor} />
      <div className="editor-inserts">
        <label>
          Link URL
          <input
            type="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://…"
          />
        </label>
        <button
          type="button"
          onClick={() => {
            if (/^https?:\/\//.test(link))
              editor.chain().focus().extendMarkRange('link').setLink({ href: link }).run();
          }}
        >
          Apply link
        </button>
        <label>
          Image URL
          <input
            type="url"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="Copy URL from Media library"
          />
        </label>
        <button
          type="button"
          onClick={() => {
            if (/^https:\/\/[^/]+\.supabase\.co\//.test(image))
              editor.chain().focus().setImage({ src: image, alt: '' }).run();
          }}
        >
          Add image
        </button>
      </div>
      <div className="editor-count">{editor.storage.characterCount.characters()} characters</div>
    </div>
  );
}
