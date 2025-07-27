import React, { useState, useEffect } from 'react';

interface Note { id: string; title: string; body: string; }

interface Props {
  note: Note;
  onChange(note: Note): void;
}

export default function Editor({ note, onChange }: Props) {
  const [title, setTitle] = useState(note.title);
  const [body, setBody] = useState(note.body);

  // sync props into local state
  useEffect(() => {
    setTitle(note.title);
    setBody(note.body);
  }, [note.id]);

  const save = () => {
    onChange({ ...note, title, body });
  };

  return (
    <div style={{ flex: 1, padding: '1rem' }}>
      <input
        style={{ width: '100%', fontSize: '1.2rem', marginBottom: '0.5rem' }}
        value={title}
        placeholder="Title"
        onChange={e => setTitle(e.target.value)}
        onBlur={save}
      />
      <textarea
        style={{ width: '100%', height: 'calc(100% - 2rem)' }}
        value={body}
        onChange={e => setBody(e.target.value)}
        onBlur={save}
        placeholder='Write your note here...'
      />
    </div>
  );
}