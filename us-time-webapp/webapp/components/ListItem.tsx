import { CheckCircle2, Circle, Trash2 } from 'lucide-react'

interface ListItemProps {
  item: {
    id: string
    text: string
    completed: boolean
    note?: string
  }
  onToggle: () => void
  onDelete: () => void
}

export default function ListItem({ item, onToggle, onDelete }: ListItemProps) {
  return (
    <div
      className={`group flex items-start gap-3 p-3 rounded-xl transition-all ${
        item.completed ? 'bg-stone-50' : 'bg-white border border-rose-100'
      }`}
    >
      <button onClick={onToggle} className="mt-0.5">
        {item.completed ? (
          <CheckCircle2 className="w-5 h-5 text-rose-500" />
        ) : (
          <Circle className="w-5 h-5 text-stone-300 hover:text-rose-400 transition-colors" />
        )}
      </button>
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm ${
            item.completed ? 'line-through text-stone-400' : 'text-stone-700'
          }`}
        >
          {item.text}
        </p>
        {item.note && (
          <p className="text-xs text-stone-400 mt-1">{item.note}</p>
        )}
      </div>
      <button
        onClick={onDelete}
        className="text-stone-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  )
}
