import React, { useState, useEffect } from 'react';
import NoteList from './components/NoteList';
import { invoke } from '@tauri-apps/api/core';
import { marked } from 'marked';
import './App.css';

interface Note { id: string; title: string; body: string; }

function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // load existing notes on mount
  useEffect(() => {
    (async () => {
      const loaded: Note[] = await invoke('load_notes');
      setNotes(loaded);
      if (loaded.length) setSelectedId(loaded[0].id);
    })();
  }, []);

  const selectNote = (id: string) => setSelectedId(id);

  const updateNote = async (updated: Note) => {
    await invoke('save_note', { note: updated });
    setNotes(nds => nds.map(n => (n.id === updated.id ? updated : n)));
  };

  const createNote = async () => {
    const newNote: Note = await invoke('new_note'); // returns fresh note
    setNotes(nds => [newNote, ...nds]);
    setSelectedId(newNote.id);
  };

  const deleteNote = async (id: string) => {
    await invoke('delete_note', { id });
    setNotes(prevNotes => {
      const updatedNotes = prevNotes.filter(n => n.id !== id);
      setSelectedId(updatedNotes[0]?.id || null);
      return updatedNotes;
    });
  };

  const selected = notes.find(n => n.id === selectedId) || null;

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <NoteList
        notes={notes}
        selectedId={selectedId}
        onSelect={selectNote}
        onCreate={createNote}
        onDelete={deleteNote}
      />
      {selected && (
        <div style={{ display: 'flex', flex: 1 }}>
          <div style={{ flex: 1, padding: '1rem', borderRight: '1px solid #ddd' }}>
            <input
              style={{ width: '100%', fontSize: '1.2rem', marginBottom: '0.5rem', padding: '0.5rem' }}
              value={selected.title}
              placeholder="Title"
              onChange={(e) => {
                const updated = { ...selected, title: e.target.value };
                updateNote(updated);
              }}
            />
            <textarea
              style={{ width: '100%', height: 'calc(100% - 3rem)', padding: '0.5rem', fontFamily: 'monospace' }}
              value={selected.body}
              placeholder="Write your markdown note here..."
              onChange={(e) => {
                const updated = { ...selected, body: e.target.value };
                updateNote(updated);
              }}
            />
          </div>
          <div
            style={{
              flex: 1,
              padding: '1rem',
              overflowY: 'auto',
              backgroundColor: '#fafafa',
              fontFamily: 'sans-serif',
            }}
            dangerouslySetInnerHTML={{ __html: marked.parse(selected.body || '') }}
          />
        </div>
      )}
    </div>
  );
}

export default App;