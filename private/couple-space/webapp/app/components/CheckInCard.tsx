'use client'

import { Heart, MessageCircle } from 'lucide-react'

interface CheckIn {
  id: string
  partner: string
  type: 'morning' | 'evening'
  mood: string
  morning_word: string | null
  rose: string | null
  thorn: string | null
  bud: string | null
  created_at: string
}

interface CheckInCardProps {
  checkIn: CheckIn
  onReact: (reaction: string) => void
}

export default function CheckInCard({ checkIn, onReact }: CheckInCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  return (
    <div className="glass-card hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {checkIn.partner.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-[var(--text-primary)]">
              {checkIn.partner}&apos;s Check-In
            </h3>
            <span className="text-xs text-[var(--text-secondary)]">
              {formatDate(checkIn.created_at)} • {checkIn.type === 'morning' ? 'Morning' : 'Evening'}
            </span>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-[var(--accent-light)] text-[var(--accent)]">
          {checkIn.mood}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        {checkIn.type === 'morning' && checkIn.morning_word && (
          <div className="flex items-center gap-2 text-[var(--text-secondary)]">
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm">
              One word for today: <strong className="text-[var(--text-primary)]">{checkIn.morning_word}</strong>
            </span>
          </div>
        )}
        
        {checkIn.type === 'evening' && (
          <>
            {checkIn.rose && (
              <div className="text-sm">
                <span className="text-rose-500 font-medium">🌹 Rose:</span>
                <span className="text-[var(--text-secondary)] ml-2">{checkIn.rose}</span>
              </div>
            )}
            {checkIn.thorn && (
              <div className="text-sm">
                <span className="text-amber-600 font-medium">🌵 Thorn:</span>
                <span className="text-[var(--text-secondary)] ml-2">{checkIn.thorn}</span>
              </div>
            )}
            {checkIn.bud && (
              <div className="text-sm">
                <span className="text-green-600 font-medium">🌱 Bud:</span>
                <span className="text-[var(--text-secondary)] ml-2">{checkIn.bud}</span>
              </div>
            )}
          </>
        )}
      </div>

      <div className="flex items-center gap-2 pt-3 border-t border-[var(--border)]">
        <button
          onClick={() => onReact('heart')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm hover:bg-rose-100 hover:text-rose-600 transition-colors text-[var(--text-secondary)]"
        >
          <Heart className="w-4 h-4" />
          <span>❤️</span>
        </button>
        <button
          onClick={() => onReact('hug')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm hover:bg-amber-100 hover:text-amber-600 transition-colors text-[var(--text-secondary)]"
        >
          <span>🤗</span>
          <span className="text-xs">Hug</span>
        </button>
      </div>
    </div>
  )
}
