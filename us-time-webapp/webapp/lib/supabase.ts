import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types (to be expanded as needed)
export type Event = {
  id: string
  title: string
  date: string
  time: string
  type: 'work' | 'personal' | 'shared'
  location?: string
  description?: string
  user_id: string
  created_at: string
}

export type List = {
  id: string
  title: string
  icon: string
  color: string
  user_id: string
  created_at: string
}

export type ListItem = {
  id: string
  list_id: string
  text: string
  completed: boolean
  note?: string
  created_at: string
}

export type Note = {
  id: string
  content: string
  author_id: string
  color: 'yellow' | 'pink' | 'blue' | 'green'
  created_at: string
}

export type Photo = {
  id: string
  url: string
  caption?: string
  user_id: string
  created_at: string
}
