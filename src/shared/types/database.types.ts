export type BacklogStatus = 'backlog' | 'playing' | 'completed' | 'dropped' | 'on_hold'

export interface Profile {
  id: string
  username: string
  display_name: string | null
  bio: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface Game {
  id: string
  user_id: string
  rawg_id: number
  name: string
  cover: string
  released: string | null
  genres: string[]
  platforms: string[]
  description: string
  user_rating: number
  status: BacklogStatus
  notes: string
  estimated_hours: number
  added_at: string
  updated_at: string
}

export interface RawgGame {
  id: number
  name: string
  background_image: string | null
  released: string | null
  genres: { id: number; name: string }[]
  platforms: { platform: { id: number; name: string } }[]
  rating: number
}

export interface RawgGameDetail extends RawgGame {
  description_raw: string
}

export interface RawgSearchResponse {
  count: number
  results: RawgGame[]
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'created_at' | 'updated_at'>
        Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>
      }
      games: {
        Row: Game
        Insert: Omit<Game, 'id' | 'added_at' | 'updated_at'>
        Update: Partial<Omit<Game, 'id' | 'user_id' | 'added_at' | 'updated_at'>>
      }
    }
    Enums: {
      backlog_status: BacklogStatus
    }
  }
}
