import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cqyfuzpkcsjgpucdshxj.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_L_KOJLptOMOZ5iE6Mjq_3w_6BnvtQmH'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          full_name: string | null
          avatar_url: string | null
          updated_at: string | null
          last_seen: string | null
          status: 'online' | 'offline' | null
        }
        Insert: {
          id: string
          username?: string
          full_name?: string | null
          avatar_url?: string | null
          updated_at?: string | null
          last_seen?: string | null
          status?: 'online' | 'offline' | null
        }
        Update: {
          id?: string
          username?: string
          full_name?: string | null
          avatar_url?: string | null
          updated_at?: string | null
          last_seen?: string | null
          status?: 'online' | 'offline' | null
        }
      }
      check_ins: {
        Row: {
          id: string
          user_id: string
          partner: string
          type: 'morning' | 'evening'
          mood: string
          morning_word: string | null
          rose: string | null
          thorn: string | null
          bud: string | null
          created_at: string
        }
      }
    }
  }
}
