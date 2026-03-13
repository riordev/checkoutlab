'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

interface PresenceIndicatorProps {
  userId?: string
  partnerName?: string
}

export default function PresenceIndicator({ userId, partnerName = 'Partner' }: PresenceIndicatorProps) {
  const [isOnline, setIsOnline] = useState(false)
  const [lastSeen, setLastSeen] = useState<string | null>(null)

  const updatePresence = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          last_seen: new Date().toISOString(),
          status: 'online'
        })
    }
  }, [])

  useEffect(() => {
    // Update presence immediately
    updatePresence()

    // Set up interval to update presence every 30 seconds
    const interval = setInterval(updatePresence, 30000)

    // Subscribe to partner's presence
    const channel = supabase
      .channel('presence')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
        },
        (payload) => {
          if (payload.new && typeof payload.new === 'object') {
            const profile = payload.new as { id?: string; status?: 'online' | 'offline'; last_seen?: string }
            if (userId && profile.id === userId) {
              setIsOnline(profile.status === 'online')
              setLastSeen(profile.last_seen || null)
            }
          }
        }
      )
      .subscribe()

    // Fetch initial partner status
    const fetchPartnerStatus = async () => {
      if (userId) {
        const { data } = await supabase
          .from('profiles')
          .select('status, last_seen')
          .eq('id', userId)
          .single()
        
        if (data) {
          setIsOnline(data.status === 'online')
          setLastSeen(data.last_seen)
        }
      }
    }
    fetchPartnerStatus()

    // Set status to offline on unload
    const handleBeforeUnload = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            status: 'offline',
            last_seen: new Date().toISOString()
          })
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      clearInterval(interval)
      channel.unsubscribe()
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [userId, updatePresence])

  const formatLastSeen = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffMinutes < 1) return 'just now'
    if (diffMinutes < 60) return `${diffMinutes}m ago`
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`
    return `${Math.floor(diffMinutes / 1440)}d ago`
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 dark:bg-slate-800/80 border border-[var(--border)] shadow-sm">
      <span className="text-sm font-medium text-[var(--text-secondary)]">
        {partnerName}
      </span>
      <div className="flex items-center gap-1.5">
        <span 
          className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
            isOnline 
              ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' 
              : 'bg-gray-400'
          }`}
        />
        <span className={`text-xs ${isOnline ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
          {isOnline ? 'online' : lastSeen ? `seen ${formatLastSeen(lastSeen)}` : 'offline'}
        </span>
      </div>
    </div>
  )
}
