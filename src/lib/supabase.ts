import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qijknkuzcuybiudqbqzc.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpamtua3V6Y3V5Yml1ZHFicXpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4Nzg4NDQsImV4cCI6MjA3MDQ1NDg0NH0.5sTAekASD8B8ENxXu4ODpIt-HCz_SWt85JWxzuakjfE'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          display_name: string | null
          age_group: string | null
          preferences: string[] | null
          triggers: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          display_name?: string | null
          age_group?: string | null
          preferences?: string[] | null
          triggers?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          display_name?: string | null
          age_group?: string | null
          preferences?: string[] | null
          triggers?: string[] | null
          updated_at?: string
        }
      }
      user_favorites: {
        Row: {
          id: string
          user_id: string
          activity_type: string
          activity_data: any
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          activity_type: string
          activity_data: any
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          activity_type?: string
          activity_data?: any
        }
      }
      activity_sessions: {
        Row: {
          id: string
          user_id: string
          activity_type: string
          duration_seconds: number
          metadata: any
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          activity_type: string
          duration_seconds: number
          metadata?: any
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          activity_type?: string
          duration_seconds?: number
          metadata?: any
        }
      }
    }
  }
}
