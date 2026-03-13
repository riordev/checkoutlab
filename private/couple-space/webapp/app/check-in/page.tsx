'use client'

import { useState } from 'react'
import { Sun, Moon, Heart, Sparkles } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function CheckInPage() {
  const [mood, setMood] = useState('')
  const [morningWord, setMorningWord] = useState('')
  const [rose, setRose] = useState('')
  const [thorn, setThorn] = useState('')
  const [bud, setBud] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (type: 'morning' | 'evening') => {
    setIsSubmitting(true)
    
    try {
      const { error } = await supabase
        .from('check_ins')
        .insert({ 
          mood, 
          morning_word: morningWord, 
          rose, 
          thorn, 
          bud, 
          type,
          partner: 'You'
        })
      
      if (error) {
        console.error('Error inserting data:', error)
        return
      }
      
      setSubmitted(true)
      setTimeout(() => {
        setSubmitted(false)
        setMood('')
        setMorningWord('')
        setRose('')
        setThorn('')
        setBud('')
      }, 3000)
    } catch (err) {
      console.error('Failed to submit:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const currentHour = new Date().getHours()
  const isMorning = currentHour < 17 // Before 5pm is considered morning check-in window

  const moodOptions = [
    { value: 'Great', emoji: '😊', color: 'bg-green-100 text-green-700 border-green-200' },
    { value: 'Okay', emoji: '😐', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
    { value: 'Not great', emoji: '😔', color: 'bg-rose-100 text-rose-700 border-rose-200' },
  ]

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center glass-card max-w-md w-full">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Check-in Submitted!</h2>
          <p className="text-[var(--text-secondary)]">Thanks for sharing with your partner 💕</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center py-6 mb-6">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-100 to-orange-100 px-6 py-3 rounded-full mb-4">
          {isMorning ? (
            <Sun className="w-5 h-5 text-amber-500" />
          ) : (
            <Moon className="w-5 h-5 text-indigo-500" />
          )}
          <span className="text-stone-600 font-medium">
            {isMorning ? 'Morning Check-In' : 'Evening Reflection'}
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-2">
          How are you feeling?
        </h1>
        <p className="text-[var(--text-secondary)]">
          {isMorning 
            ? 'Share your intention for the day with your partner' 
            : 'Reflect on your day together'}
        </p>
      </div>

      {isMorning ? (
        <div className="glass-card space-y-6">
          {/* Mood Selection */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3">
              How are you feeling this morning?
            </label>
            <div className="grid grid-cols-3 gap-3">
              {moodOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setMood(option.value)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    mood === option.value
                      ? option.color + ' border-current scale-[1.02]'
                      : 'bg-white border-transparent hover:border-[var(--border)]'
                  }`}
                >
                  <span className="text-2xl mb-1 block">{option.emoji}</span>
                  <span className="text-sm font-medium">{option.value}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Morning Word */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3">
              One word for today
            </label>
            <input
              type="text"
              placeholder="e.g., Productive, Calm, Adventure..."
              value={morningWord}
              onChange={(e) => setMorningWord(e.target.value)}
              className="input-cozy text-center text-lg"
            />
          </div>

          {/* Submit */}
          <button
            onClick={() => handleSubmit('morning')}
            disabled={!mood || isSubmitting}
            className="w-full btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Submitting...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Heart className="w-5 h-5" />
                Submit Morning Check-in
              </span>
            )}
          </button>
        </div>
      ) : (
        <div className="glass-card space-y-6">
          {/* Evening Reflection */}
          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-rose-600 mb-2">
                <span className="text-lg">🌹</span>
                Rose (Best part of your day)
              </label>
              <input
                type="text"
                placeholder="What went well today?"
                value={rose}
                onChange={(e) => setRose(e.target.value)}
                className="input-cozy"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-amber-600 mb-2">
                <span className="text-lg">🌵</span>
                Thorn (A challenge you faced)
              </label>
              <input
                type="text"
                placeholder="What was difficult?"
                value={thorn}
                onChange={(e) => setThorn(e.target.value)}
                className="input-cozy"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-green-600 mb-2">
                <span className="text-lg">🌱</span>
                Bud (What you're looking forward to)
              </label>
              <input
                type="text"
                placeholder="What's coming up?"
                value={bud}
                onChange={(e) => setBud(e.target.value)}
                className="input-cozy"
              />
            </div>
          </div>

          {/* Mood Selection for Evening */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3">
              Overall, how was your day?
            </label>
            <div className="flex gap-2">
              {moodOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setMood(option.value)}
                  className={`flex-1 p-3 rounded-xl border-2 transition-all ${
                    mood === option.value
                      ? option.color + ' border-current'
                      : 'bg-white border-transparent hover:border-[var(--border)]'
                  }`}
                >
                  <span className="text-xl mr-1">{option.emoji}</span>
                  <span className="text-sm font-medium">{option.value}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={() => handleSubmit('evening')}
            disabled={!rose || !mood || isSubmitting}
            className="w-full btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Submitting...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Heart className="w-5 h-5" />
                Submit Evening Reflection
              </span>
            )}
          </button>
        </div>
      )}
    </div>
  )
}
