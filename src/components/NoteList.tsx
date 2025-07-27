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
    <div style={{ width: '20vw', minWidth: '200px', borderRight: '1px solid gray', padding: '1rem', height: '100vh' }}>
      <button id='newbtn' onClick={onCreate}>New Note</button>
      <ul style={{ listStyle: 'none', padding: 0, backgroundColor: '#1c2023ff', }}>
        {notes.map(n => (
          <li key={n.id} style={{
            margin: '0.5rem 0', padding: '6px', border: '1px solid gray', borderRadius: '6px',
            cursor: 'pointer',
          }}
            onClick={() => onSelect(n.id)}>
            <div
              style={{
                fontWeight: n.id === selectedId ? 'bold' : 'normal',
                maxWidth: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
              {n.title || 'Untitled'}
            </div>
            <button id='delbtn' onClick={() => onDelete(n.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <div id='copyrightText' style={{
        position: 'absolute', bottom: '1vh', left: '1vw', justifyContent: 'left', width: '100%', marginTop: '10px',
        color: 'gray', fontSize: '0.8rem'
      }}>
        Montanari Luca - v0.1
      </div>
    </div >
  );
}