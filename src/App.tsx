import { useState, useEffect } from 'react';
import NoteList from './components/NoteList';
import { invoke } from '@tauri-apps/api/core';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
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

  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
    onUpdate: ({ editor }) => {
      if (selected) {
        const updated: Note = { ...selected, body: editor.getHTML() };
        updateNote(updated);
      }
    },
  });

  useEffect(() => {
    if (editor && selected && editor.getHTML() !== selected.body) {
      editor.commands.setContent(selected.body);
    }
  }, [selected?.id]);

  return (
    <div style={{ display: 'flex', height: '100vh' }} tabIndex={0}>
      <NoteList
        notes={notes}
        selectedId={selectedId}
        onSelect={selectNote}
        onCreate={createNote}
        onDelete={deleteNote}
      />
      {selected && (
        <div style={{ display: 'flex', flex: 1, height: '100%' }}>
          <div style={{ flex: 1, padding: '1rem', borderRight: '1px solid gray' }}>
            <input
              style={{ color: 'white', width: '100%', fontSize: '1.2rem', marginBottom: '0.5rem', padding: '0.5rem' }}
              value={selected.title}
              placeholder="Title"
              onChange={(e) => {
                const updated = { ...selected, title: e.target.value };
                updateNote(updated);
              }}
            />
            {editor && (
              <div
                style={{ height: 'calc(100vh - 5rem)', display: 'flex', flexDirection: 'column' }}
                onKeyDown={(e) => {
                  if (e.key === 'Tab') {
                    e.preventDefault();
                    const { state, dispatch } = editor.view;
                    const { $from } = state.selection;
                    const lineStart = $from.start($from.depth);
                    dispatch(
                      state.tr.insertText('\t', lineStart)
                    );
                  }
                }}
              >
                <EditorContent
                  editor={editor}
                  style={{
                    flex: 1,
                    width: '100%',
                    padding: '10px',
                    overflowY: 'auto',
                    fontFamily: 'sans-serif',
                    borderRadius: '6px',
                    background: '#212529',
                  }}
                />

                <div id='statusBar' style={{ display: 'flex', justifyContent: 'right', width: '100%', marginTop: '10px' }}>
                  <div id='wordCount'>
                    Words: {editor ? editor.getText().trim().split(/\s+/).filter(Boolean).length : 0}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;