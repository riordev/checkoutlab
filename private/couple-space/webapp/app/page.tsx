'use client'

import { useState, useEffect } from 'react'
import { Heart, MessageCircle, Sparkles, ArrowRight } from 'lucide-react'
import { supabase } from './lib/supabase'
import CheckInCard from './components/CheckInCard'
import PresenceIndicator from './components/PresenceIndicator'

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

const quickLinks = [
  { href: '/check-in', label: 'Daily Check-in', icon: MessageCircle, color: 'bg-blue-500' },
  { href: '/date-night', label: 'Date Night', icon: Sparkles, color: 'bg-purple-500' },
  { href: '/wishlist', label: 'Wishlist', icon: Heart, color: 'bg-rose-500' },
]

export default function HomePage() {
  const [checkIns, setCheckIns] = useState<CheckIn[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [partnerId, setPartnerId] = useState<string | undefined>(undefined)

  useEffect(() => {
    const fetchCheckIns = async () => {
      try {
        const { data, error } = await supabase
          .from('check_ins')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5)
        
        if (error) {
          console.error('Error fetching check-ins:', error)
          return
        }
        
        setCheckIns(data || [])
      } catch (err) {
        console.error('Failed to fetch check-ins:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCheckIns()

    // Subscribe to new check-ins
    const channel = supabase
      .channel('check_ins')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'check_ins',
        },
        (payload) => {
          if (payload.new) {
            setCheckIns(prev => [payload.new as CheckIn, ...prev].slice(0, 5))
          }
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [])

  const handleReact = async (checkInId: string, reaction: string) => {
    // In a real app, you'd save reactions to the database
    console.log(`Reacted with ${reaction} to check-in ${checkInId}`)
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="text-center py-6">
        <div className="inline-flex items-center gap-2 mb-4">
          <PresenceIndicator 
            userId={partnerId} 
            partnerName="Partner" 
          />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-2">
          Welcome Back
        </h1>
        <p className="text-[var(--text-secondary)]">
          Here's what's happening with your relationship today
        </p>
      </div>

      {/* Quick Actions */}
      <section>
        <h2 className="section-title">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {quickLinks.map((link) => {
            const Icon = link.icon
            return (
              <a
                key={link.href}
                href={link.href}
                className="group flex items-center gap-4 p-4 rounded-2xl bg-white border border-[var(--border)] hover:shadow-lg transition-all hover:scale-[1.02]"
              >
                <div className={`w-12 h-12 ${link.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-[var(--text-primary)]">{link.label}</h3>
                </div>
                <ArrowRight className="w-5 h-5 text-[var(--text-secondary)] group-hover:translate-x-1 transition-transform" />
              </a>
            )
          })}
        </div>
      </section>

      {/* Recent Check-ins */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title mb-0">Recent Check-ins</h2>
          <a 
            href="/check-in" 
            className="text-sm text-[var(--accent)] hover:underline flex items-center gap-1"
          >
            Add New
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
        
        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : checkIns.length === 0 ? (
          <div className="text-center py-12 glass-card">
            <MessageCircle className="w-12 h-12 text-[var(--text-secondary)] mx-auto mb-3 opacity-50" />
            <p className="text-[var(--text-secondary)]">No check-ins yet</p>
            <a 
              href="/check-in" 
              className="inline-block mt-4 px-6 py-2 bg-[var(--accent)] text-white rounded-full hover:opacity-90 transition-opacity"
            >
              Start your first check-in
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {checkIns.map((checkIn) => (
              <CheckInCard 
                key={checkIn.id} 
                checkIn={checkIn} 
                onReact={(reaction) => handleReact(checkIn.id, reaction)} 
              />
            ))}
          </div>
        )}
      </section>

      {/* Stats Summary */}
      <section>
        <h2 className="section-title">This Week</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="glass-card text-center p-4">
            <div className="text-3xl font-bold text-[var(--accent)]">{checkIns.length}</div>
            <div className="text-sm text-[var(--text-secondary)]">Check-ins</div>
          </div>
          <div className="glass-card text-center p-4">
            <div className="text-3xl font-bold text-green-500">0</div>
            <div className="text-sm text-[var(--text-secondary)]">Date Ideas</div>
          </div>
          <div className="glass-card text-center p-4">
            <div className="text-3xl font-bold text-purple-500">0</div>
            <div className="text-sm text-[var(--text-secondary)]">Recipes</div>
          </div>
        </div>
      </section>
    </div>
  )
}
