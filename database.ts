export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      actions: {
        Row: {
          category_id: number
          client_id: number
          created_at: string
          date: string
          description: string | null
          id: string
          priority_id: string
          responsibles: string[] | null
          state_id: number
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category_id: number
          client_id: number
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          priority_id: string
          responsibles?: string[] | null
          state_id: number
          title: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          category_id?: number
          client_id?: number
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          priority_id?: string
          responsibles?: string[] | null
          state_id?: number
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "actions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "actions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "actions_priority_id_fkey"
            columns: ["priority_id"]
            isOneToOne: false
            referencedRelation: "priority"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "actions_state_id_fkey"
            columns: ["state_id"]
            isOneToOne: false
            referencedRelation: "states"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "actions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      categories: {
        Row: {
          created_at: string
          id: number
          priority: number
          slug: string
          title: string
        }
        Insert: {
          created_at?: string
          id?: number
          priority?: number
          slug: string
          title: string
        }
        Update: {
          created_at?: string
          id?: number
          priority?: number
          slug?: string
          title?: string
        }
        Relationships: []
      }
      celebration: {
        Row: {
          created_at: string
          date: string
          id: string
          is_holiday: boolean | null
          title: string
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          is_holiday?: boolean | null
          title: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          is_holiday?: boolean | null
          title?: string
        }
        Relationships: []
      }
      clients: {
        Row: {
          bgColor: string | null
          created_at: string
          fgColor: string | null
          id: number
          short: string
          slug: string
          title: string
        }
        Insert: {
          bgColor?: string | null
          created_at?: string
          fgColor?: string | null
          id?: number
          short: string
          slug: string
          title: string
        }
        Update: {
          bgColor?: string | null
          created_at?: string
          fgColor?: string | null
          id?: number
          short?: string
          slug?: string
          title?: string
        }
        Relationships: []
      }
      config: {
        Row: {
          created_at: string
          id: number
          title: string
          user_id: string
          value: string
        }
        Insert: {
          created_at?: string
          id?: number
          title: string
          user_id: string
          value: string
        }
        Update: {
          created_at?: string
          id?: number
          title?: string
          user_id?: string
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "config_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      people: {
        Row: {
          created_at: string
          email: string
          id: number
          image: string | null
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: number
          image?: string | null
          name: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: number
          image?: string | null
          name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "people_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      priority: {
        Row: {
          created_at: string
          id: string
          order: number
          slug: string
          title: string
        }
        Insert: {
          created_at?: string
          id?: string
          order: number
          slug: string
          title: string
        }
        Update: {
          created_at?: string
          id?: string
          order?: number
          slug?: string
          title?: string
        }
        Relationships: []
      }
      states: {
        Row: {
          created_at: string
          id: number
          order: number
          slug: string
          title: string
        }
        Insert: {
          created_at?: string
          id?: number
          order: number
          slug: string
          title: string
        }
        Update: {
          created_at?: string
          id?: number
          order?: number
          slug?: string
          title?: string
        }
        Relationships: []
      }
      topic: {
        Row: {
          client_id: number
          created_at: string
          id: string
          title: string
        }
        Insert: {
          client_id: number
          created_at?: string
          id?: string
          title: string
        }
        Update: {
          client_id?: number
          created_at?: string
          id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "topic_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      search_for_actions: {
        Args: {
          query: string
        }
        Returns: {
          category_id: number
          client_id: number
          created_at: string
          date: string
          description: string | null
          id: string
          priority_id: string
          responsibles: string[] | null
          state_id: number
          title: string
          updated_at: string
          user_id: string
        }[]
      }
      unaccent: {
        Args: {
          "": string
        }
        Returns: string
      }
      unaccent_init: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
