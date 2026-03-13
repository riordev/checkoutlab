import { format, isToday, isTomorrow } from 'date-fns'
import { Calendar, Clock, MapPin } from 'lucide-react'

interface Event {
  id: string
  title: string
  date: Date
  time: string
  type: 'work' | 'personal' | 'shared'
  location?: string
}

interface EventCardProps {
  event: Event
  compact?: boolean
}

const eventColors = {
  work: 'bg-blue-50 border-blue-100',
  personal: 'bg-amber-50 border-amber-100',
  shared: 'bg-rose-50 border-rose-100',
}

const eventDotColors = {
  work: 'bg-blue-500',
  personal: 'bg-amber-500',
  shared: 'bg-rose-500',
}

export default function EventCard({ event, compact = false }: EventCardProps) {
  const dateLabel = isToday(event.date)
    ? 'Today'
    : isTomorrow(event.date)
    ? 'Tomorrow'
    : format(event.date, 'EEE, MMM d')

  if (compact) {
    return (
      <div className={`flex items-center gap-3 p-3 rounded-xl border ${eventColors[event.type]} hover:shadow-md transition-shadow`}>
        <div className={`w-2 h-2 rounded-full ${eventDotColors[event.type]}`} />
        <div className="flex-1 min-w-0">
          <p className="font-medium text-stone-800 truncate">{event.title}</p>
          <p className="text-xs text-stone-500 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {dateLabel} at {event.time}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`p-4 rounded-xl border ${eventColors[event.type]} hover:shadow-md transition-shadow`}>
      <div className="flex items-start gap-3">
        <div className={`w-3 h-3 rounded-full mt-1.5 ${eventDotColors[event.type]}`} />
        <div className="flex-1">
          <h4 className="font-semibold text-stone-800">{event.title}</h4>
          <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-stone-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {dateLabel}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {event.time}
            </span>
            {event.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {event.location}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
