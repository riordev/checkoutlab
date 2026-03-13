import { formatDistanceToNow } from 'date-fns'

interface Note {
  id: string
  content: string
  author: string
  timestamp: Date
  color: 'yellow' | 'pink' | 'blue' | 'green'
}

interface NoteCardProps {
  note: Note
}

const noteColors = {
  yellow: 'bg-amber-50 border-amber-200',
  pink: 'bg-rose-50 border-rose-200',
  blue: 'bg-blue-50 border-blue-200',
  green: 'bg-green-50 border-green-200',
}

const notePinColors = {
  yellow: 'bg-amber-400',
  pink: 'bg-rose-400',
  blue: 'bg-blue-400',
  green: 'bg-green-400',
}

export default function NoteCard({ note }: NoteCardProps) {
  return (
    <div className={`relative p-4 rounded-xl border ${noteColors[note.color]} shadow-sm transform rotate-[-1deg] hover:rotate-0 transition-transform`}>
      {/* Push pin */}
      <div className={`absolute -top-1.5 left-6 w-3 h-3 rounded-full ${notePinColors[note.color]} shadow-md`} />
      
      <p className="text-stone-700 text-sm leading-relaxed mb-3">{note.content}</p>
      
      <div className="flex items-center justify-between text-xs text-stone-400">
        <span className="font-medium">— {note.author}</span>
        <span>{formatDistanceToNow(note.timestamp, { addSuffix: true })}</span>
      </div>
    </div>
  )
}
