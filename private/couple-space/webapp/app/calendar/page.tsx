'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin, Plus } from 'lucide-react'
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns'

interface Event {
  id: string
  title: string
  date: Date
  time: string
  type: 'work' | 'personal' | 'shared'
  location?: string
  description?: string
}

const sampleEvents: Event[] = [
  { id: '1', title: 'Team Meeting', date: new Date(), time: '10:00', type: 'work', location: 'Office' },
  { id: '2', title: 'Dinner Date', date: new Date(Date.now() + 86400000), time: '19:00', type: 'shared', location: 'Italian Restaurant' },
  { id: '3', title: 'Gym', date: new Date(Date.now() + 86400000 * 2), time: '18:00', type: 'personal' },
  { id: '4', title: 'Weekend Trip', date: new Date(Date.now() + 86400000 * 5), time: '09:00', type: 'shared', location: 'Beach House' },
]

const eventColors = {
  work: 'bg-blue-100 text-blue-700 border-blue-200',
  personal: 'bg-amber-100 text-amber-700 border-amber-200',
  shared: 'bg-rose-100 text-rose-700 border-rose-200',
}

const eventDotColors = {
  work: 'bg-blue-500',
  personal: 'bg-amber-500',
  shared: 'bg-rose-500',
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<'month' | 'week'>('month')
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newEvent, setNewEvent] = useState({ title: '', time: '', type: 'shared' as const, location: '' })

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(monthStart)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)

  const days: Date[] = []
  let day = calendarStart
  while (day <= calendarEnd) {
    days.push(day)
    day = addDays(day, 1)
  }

  const getEventsForDate = (date: Date) => {
    return sampleEvents.filter((event) => isSameDay(event.date, date))
  }

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1))
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1))

  const selectedEvents = selectedDate ? getEventsForDate(selectedDate) : []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-stone-800">Our Calendar</h1>
          <p className="text-stone-500 mt-1">Plan our time together</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white rounded-full p-1 shadow-md border border-rose-100 flex">
            <button
              onClick={() => setView('month')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                view === 'month' ? 'bg-rose-500 text-white' : 'text-stone-600 hover:bg-rose-50'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setView('week')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                view === 'week' ? 'bg-rose-500 text-white' : 'text-stone-600 hover:bg-rose-50'
              }`}
            >
              Week
            </button>
          </div>
          <button onClick={() => setShowAddModal(true)} className="btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add Event
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-rose-500"></div>
          <span className="text-stone-600">Shared</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-stone-600">Work</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500"></div>
          <span className="text-stone-600">Personal</span>
        </div>
      </div>

      {/* Calendar */}
      <div className="glass-card p-6">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={prevMonth}
            className="p-2 hover:bg-rose-50 rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-stone-600" />
          </button>
          <h2 className="text-xl font-bold text-stone-800">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-rose-50 rounded-full transition-colors"
          >
            <ChevronRight className="w-6 h-6 text-stone-600" />
          </button>
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((weekday) => (
            <div key={weekday} className="text-center text-sm font-medium text-stone-400 py-2">
              {weekday}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((date, idx) => {
            const isCurrentMonth = isSameMonth(date, currentDate)
            const isToday = isSameDay(date, new Date())
            const isSelected = selectedDate && isSameDay(date, selectedDate)
            const dayEvents = getEventsForDate(date)

            return (
              <button
                key={idx}
                onClick={() => setSelectedDate(date)}
                className={`
                  aspect-square p-2 rounded-xl transition-all flex flex-col items-start gap-1
                  ${isCurrentMonth ? 'bg-white hover:bg-rose-50' : 'bg-stone-50 text-stone-300'}
                  ${isToday ? 'ring-2 ring-rose-500 bg-rose-50' : ''}
                  ${isSelected ? 'ring-2 ring-rose-400' : ''}
                `}
              >
                <span className={`text-sm font-medium ${isCurrentMonth ? 'text-stone-700' : 'text-stone-300'}`}>
                  {format(date, 'd')}
                </span>
                <div className="flex gap-0.5 flex-wrap">
                  {dayEvents.slice(0, 3).map((event, i) => (
                    <div key={i} className={`w-1.5 h-1.5 rounded-full ${eventDotColors[event.type]}`} />
                  ))}
                  {dayEvents.length > 3 && (
                    <span className="text-[8px] text-stone-400">+</span>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Selected Date Events */}
      {selectedDate && (
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold text-stone-800 mb-4">
            {format(selectedDate, 'EEEE, MMMM do')}
          </h3>
          {selectedEvents.length > 0 ? (
            <div className="space-y-3">
              {selectedEvents.map((event) => (
                <div
                  key={event.id}
                  className={`p-4 rounded-xl border ${eventColors[event.type]} flex items-start gap-3`}
                >
                  <div className={`w-2 h-2 rounded-full mt-2 ${eventDotColors[event.type]}`} />
                  <div className="flex-1">
                    <h4 className="font-semibold">{event.title}</h4>
                    <div className="flex flex-wrap items-center gap-4 mt-1 text-sm">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {event.time}
                      </span>
                      {event.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {event.location}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-stone-400 text-center py-4">No events for this day</p>
          )}
        </div>
      )}

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass-card max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Add New Event</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-stone-600 mb-1">Event Title</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  className="input-cozy"
                  placeholder="e.g., Dinner Date"
                />
              </div>
              <div>
                <label className="block text-sm text-stone-600 mb-1">Time</label>
                <input
                  type="time"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                  className="input-cozy"
                />
              </div>
              <div>
                <label className="block text-sm text-stone-600 mb-1">Location</label>
                <input
                  type="text"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                  className="input-cozy"
                  placeholder="e.g., Home"
                />
              </div>
              <div>
                <label className="block text-sm text-stone-600 mb-1">Type</label>
                <select
                  value={newEvent.type}
                  onChange={(e) => setNewEvent({...newEvent, type: e.target.value as 'work' | 'personal' | 'shared'})}
                  className="input-cozy"
                >
                  <option value="shared">Shared</option>
                  <option value="work">Work</option>
                  <option value="personal">Personal</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2 rounded-xl border border-stone-300 text-stone-600 hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (newEvent.title) {
                    alert('Event added! (Save to database coming soon)')
                    setShowAddModal(false)
                    setNewEvent({ title: '', time: '', type: 'shared', location: '' })
                  }
                }}
                className="flex-1 py-2 rounded-xl bg-rose-500 text-white hover:bg-rose-600"
              >
                Add Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
