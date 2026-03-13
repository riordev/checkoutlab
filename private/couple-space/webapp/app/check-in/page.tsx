'use client'

import { useState } from 'react'
import { Heart, Sparkles } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function CheckInPage() {
  const [mood, setMood] = useState('')
  const [oneWord, setOneWord] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async () => {
    if (!mood) return
    
    setIsSubmitting(true)
    
    try {
      const { error } = await supabase
        .from('check_ins')
        .insert({ 
          mood, 
          one_word: oneWord,
          created_at: new Date().toISOString()
        })
      
      if (error) {
        console.error('Error inserting data:', error)
        return
      }
      
      setSubmitted(true)
      setTimeout(() => {
        setSubmitted(false)
        setMood('')
        setOneWord('')
      }, 3000)
    } catch (err) {
      console.error('Failed to submit:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const moodOptions = [
    { value: 'Great', emoji: '😊', color: 'bg-green-100 text-green-700 border-green-200', desc: 'Feeling good!' },
    { value: 'Okay', emoji: '😐', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', desc: 'Just okay' },
    { value: 'Not great', emoji: '😔', color: 'bg-rose-100 text-rose-700 border-rose-200', desc: 'Having a tough day' },
  ]

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center glass-card max-w-md w-full p-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Check-in Shared!</h2>
          <p className="text-[var(--text-secondary)]">Your partner will see this 💕</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto">
      {/* Header */}
      <div className="text-center py-6 mb-6">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-100 to-pink-100 px-6 py-3 rounded-full mb-4">
          <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
          <span className="text-stone-600 font-medium">Daily Check-in</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-2">
          How are you?
        </h1>
        <p className="text-[var(--text-secondary)]">
          Share a quick update with your partner
        </p>
      </div>

      {/* Check-in Form */}
      <div className="glass-card space-y-8">
        {/* Mood Selection */}
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-4">
            How are you feeling?
          </label>
          <div className="grid grid-cols-3 gap-3">
            {moodOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setMood(option.value)}
                className={`p-4 rounded-xl border-2 transition-all text-center ${
                  mood === option.value
                    ? option.color + ' border-current scale-[1.02] shadow-md'
                    : 'bg-white/50 border-transparent hover:border-[var(--border)] hover:bg-white'
                }`}
              >
                <span className="text-3xl mb-2 block">{option.emoji}</span>
                <span className="text-sm font-semibold block">{option.value}</span>
                <span className="text-xs opacity-70 mt-1 block">{option.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* One Word */}
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3">
            One word for today
          </label>
          <input
            type="text"
            placeholder="e.g., Grateful, Tired, Excited, Peaceful..."
            value={oneWord}
            onChange={(e) => setOneWord(e.target.value)}
            className="input-cozy text-center text-lg"
            maxLength={20}
          />
          <p className="text-xs text-[var(--text-secondary)] mt-2 text-center">
            Optional — just a single word to capture your day
          </p>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!mood || isSubmitting}
          className="w-full py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2
            bg-[var(--accent)] text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed
            shadow-lg hover:shadow-xl"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Sharing...
            </>
          ) : (
            <>
              <Heart className="w-5 h-5" />
              Share with Partner
            </>
          )}
        </button>
      </div>

      {/* Tips */}
      <div className="mt-8 text-center">
        <p className="text-sm text-[var(--text-secondary)]">
          💡 Tip: Check in daily to stay connected, even when busy
        </p>
      </div>
    </div>
  )
}
