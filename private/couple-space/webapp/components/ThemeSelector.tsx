'use client'

import { useState } from 'react'
import { useTheme } from './ThemeProvider'
import { Sun, Moon, Heart, Sparkles } from 'lucide-react'

const themes = [
  { key: 'light', label: 'Light', icon: Sun },
  { key: 'dark', label: 'Dark', icon: Moon },
  { key: 'rose-gold', label: 'Rose', icon: Heart },
  { key: 'glass', label: 'Glass', icon: Sparkles },
] as const

export default function ThemeSelector() {
  const { theme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
        title="Change theme"
      >
        {theme === 'light' && <Sun className="w-5 h-5" />}
        {theme === 'dark' && <Moon className="w-5 h-5" />}
        {theme === 'rose-gold' && <Heart className="w-5 h-5 text-rose-400" />}
        {theme === 'glass' && <Sparkles className="w-5 h-5 text-blue-400" />}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-40 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-200 dark:border-slate-700 overflow-hidden z-50">
          {themes.map((t) => {
            const Icon = t.icon
            return (
              <button
                key={t.key}
                onClick={() => {
                  setTheme(t.key)
                  setIsOpen(false)
                }}
                className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-slate-700 transition ${
                  theme === t.key ? 'bg-rose-50 dark:bg-rose-900/20 text-rose-600' : ''
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{t.label}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

