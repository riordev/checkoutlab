'use client'

import { useState } from 'react'
import { Heart, CalendarDays, ListTodo, ImagePlus, StickyNote, Plus, Camera } from 'lucide-react'
import EventCard from '@/components/EventCard'
import NoteCard from '@/components/NoteCard'

const upcomingEvents = [
  {
    id: '1',
    title: 'Dinner Date Night',
    date: new Date(Date.now() + 86400000 * 2),
    time: '19:00',
    type: 'shared' as const,
    location: 'That Italian Place',
  },
  {
    id: '2',
    title: 'Weekend Getaway',
    date: new Date(Date.now() + 86400000 * 5),
    time: '09:00',
    type: 'shared' as const,
    location: 'Mountain Cabin',
  },
  {
    id: '3',
    title: 'Movie Night',
    date: new Date(Date.now() + 86400000 * 1),
    time: '20:00',
    type: 'personal' as const,
  },
]

const recentNotes = [
  {
    id: '1',
    content: 'Remember to pick up flowers on the way home! 🌸',
    author: 'You',
    timestamp: new Date(Date.now() - 3600000),
    color: 'yellow' as const,
  },
  {
    id: '2',
    content: 'Had the best time with you today. Love you! ❤️',
    author: 'Partner',
    timestamp: new Date(Date.now() - 86400000),
    color: 'pink' as const,
  },
]

export default function HomePage() {
  const [noteText, setNoteText] = useState('')

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <section className="text-center py-8">
        <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-md border border-rose-100 mb-4">
          <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
          <span className="text-stone-600 font-medium">Welcome back, lovebirds!</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-stone-800 mb-2">
          This is <span className="text-rose-500">UsTime</span>
        </h1>
        <p className="text-stone-500 text-lg">Your shared space to plan, remember, and grow together</p>
      </section>

      {/* Quick Actions */}
      <section className="flex flex-wrap justify-center gap-3">
        <button className="btn-primary flex items-center gap-2">
          <CalendarDays className="w-5 h-5" />
          Add Event
        </button>
        <button className="btn-secondary flex items-center gap-2">
          <ListTodo className="w-5 h-5" />
          New List
        </button>
        <button className="btn-secondary flex items-center gap-2">
          <Camera className="w-5 h-5" />
          Upload Photo
        </button>
        <button className="btn-secondary flex items-center gap-2">
          <StickyNote className="w-5 h-5" />
          Leave Note
        </button>
      </section>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Photo Gallery Preview */}
        <section className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title mb-0">Our Memories</h2>
            <button className="text-rose-500 hover:text-rose-600 font-medium text-sm flex items-center gap-1">
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="aspect-square bg-gradient-to-br from-rose-100 to-amber-100 rounded-xl flex items-center justify-center cursor-pointer hover:scale-105 transition-transform border-2 border-dashed border-rose-200 hover:border-rose-400"
              >
                <ImagePlus className="w-8 h-8 text-rose-300" />
              </div>
            ))}
          </div>
        </section>

        {/* Leave a Note */}
        <section className="glass-card p-6">
          <h2 className="section-title">Leave a Note</h2>
          <div className="space-y-4">
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Write something sweet..."
              className="input-cozy resize-none h-24"
            />
            <button className="btn-primary w-full flex items-center justify-center gap-2">
              <Heart className="w-4 h-4" />
              Send Love Note
            </button>
          </div>
        </section>

        {/* Upcoming Events */}
        <section className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title mb-0 flex items-center gap-2">
              <CalendarDays className="w-6 h-6 text-rose-500" />
              Next 7 Days
            </h2>
            <a href="/calendar" className="text-rose-500 hover:text-rose-600 font-medium text-sm">
              View All →
            </a>
          </div>
          <div className="space-y-3">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} compact />
            ))}
            {upcomingEvents.length === 0 && (
              <p className="text-stone-400 text-center py-8">No events coming up. Plan something special!</p>
            )}
          </div>
        </section>

        {/* Recent Notes */}
        <section className="glass-card p-6">
          <h2 className="section-title flex items-center gap-2">
            <StickyNote className="w-6 h-6 text-amber-500" />
            Recent Notes
          </h2>
          <div className="space-y-3">
            {recentNotes.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
