import React from 'react';

interface Props {
  notes: { id: string; title: string }[];
  selectedId: string | null;
  onSelect(id: string): void;
  onCreate(): void;
  onDelete(id: string): void;
}

export default function NoteList({ notes, selectedId, onSelect, onCreate, onDelete }: Props) {
  return (
    <div style={{ width: '200px', borderRight: '1px solid gray', padding: '1rem' }}>
      <button onClick={onCreate}>New Note</button>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {notes.map(n => (
          <li key={n.id} style={{ margin: '0.5rem 0' }}>
            <div
              style={{
                fontWeight: n.id === selectedId ? 'bold' : 'normal',
                cursor: 'pointer'
              }}
              onClick={() => onSelect(n.id)}
            >
              {n.title || 'Untitled'}
            </div>
            <button onClick={() => onDelete(n.id)}>🗑</button>
          </li>
        ))}
      </ul>
    </div>
  );
}