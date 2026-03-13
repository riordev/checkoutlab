'use client'

import { useState } from 'react'
import { StickyNote, Plus, Trash2, Heart } from 'lucide-react'

interface Note {
  id: string
  content: string
  author: string
  createdAt: string
  color: 'yellow' | 'pink' | 'blue' | 'green' | 'purple'
}

const colorOptions = {
  yellow: 'bg-yellow-100 border-yellow-300 text-yellow-900',
  pink: 'bg-pink-100 border-pink-300 text-pink-900',
  blue: 'bg-blue-100 border-blue-300 text-blue-900',
  green: 'bg-green-100 border-green-300 text-green-900',
  purple: 'bg-purple-100 border-purple-300 text-purple-900',
}

const initialNotes: Note[] = [
  {
    id: '1',
    content: 'Had the best time at dinner last night 💕',
    author: 'Tom',
    createdAt: '2026-03-12',
    color: 'pink'
  },
  {
    id: '2',
    content: 'Don\'t forget to pick up milk on the way home!',
    author: 'Jennifer',
    createdAt: '2026-03-11',
    color: 'yellow'
  },
]

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>(initialNotes)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newNote, setNewNote] = useState({ content: '', color: 'yellow' as const })

  const addNote = () => {
    if (!newNote.content.trim()) return
    
    const note: Note = {
      id: Date.now().toString(),
      content: newNote.content,
      author: 'You',
      createdAt: new Date().toISOString().split('T')[0],
      color: newNote.color
    }
    
    setNotes([note, ...notes])
    setNewNote({ content: '', color: 'yellow' })
    setShowAddModal(false)
  }

  const deleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id))
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center py-6 mb-6">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-100 to-amber-100 px-6 py-3 rounded-full mb-4">
          <StickyNote className="w-5 h-5 text-amber-600" />
          <span className="text-stone-600 font-medium">Our Notes</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-2" style={{ fontFamily: 'var(--font-cozy)' }}>
          little notes for each other
        </h1>
        <p className="text-[var(--text-secondary)]">
          leave sweet messages, reminders, or whatever 💌
        </p>
      </div>

      {/* Add Note Button */}
      <div className="flex justify-center mb-8">
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center gap-2 px-6 py-3 text-lg"
        >
          <Plus className="w-5 h-5" />
          Leave a Note
        </button>
      </div>

      {/* Notes Grid */}
      {notes.length === 0 ? (
        <div className="text-center py-12 glass-card">
          <StickyNote className="w-12 h-12 text-[var(--text-secondary)] mx-auto mb-3 opacity-50" />
          <p className="text-[var(--text-secondary)]">No notes yet</p>
          <p className="text-sm text-[var(--text-secondary)] mt-2">Be the first to leave one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {notes.map((note) => (
            <div
              key={note.id}
              className={`p-5 rounded-2xl border-2 shadow-sm hover:shadow-md transition-shadow ${colorOptions[note.color]}`}
            >
              <p className="text-lg mb-4 whitespace-pre-wrap">{note.content}</p>
              <div className="flex items-center justify-between text-sm opacity-70">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  <span>{note.author}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span>{note.createdAt}</span>
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="p-1 hover:bg-black/10 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Note Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass-card max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Leave a Note</h3>
            <textarea
              value={newNote.content}
              onChange={(e) => setNewNote({...newNote, content: e.target.value})}
              className="input-cozy min-h-[120px] mb-4 resize-none"
              placeholder="Write something sweet..."
            />
            <div className="mb-4">
              <label className="block text-sm text-[var(--text-secondary)] mb-2">Color</label>
              <div className="flex gap-2">
                {Object.keys(colorOptions).map((color) => (
                  <button
                    key={color}
                    onClick={() => setNewNote({...newNote, color: color as any})}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      newNote.color === color ? 'border-stone-800 scale-110' : 'border-transparent'
                    } ${colorOptions[color as keyof typeof colorOptions].split(' ')[0]}`}
                  />
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2 rounded-xl border border-[var(--border)] text-[var(--text-secondary)] hover:bg-white/50"
              >
                Cancel
              </button>
              <button
                onClick={addNote}
                disabled={!newNote.content.trim()}
                className="flex-1 py-2 rounded-xl bg-[var(--accent)] text-white hover:opacity-90 disabled:opacity-50"
              >
                Post Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
