export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      agent_details: {
        Row: {
          agency: string | null
          clients_count: number | null
          created_at: string | null
          experience_years: number | null
          id: string
          languages: string | null
          license_number: string | null
          regions_of_operation: string | null
          specialization: string | null
          updated_at: string | null
        }
        Insert: {
          agency?: string | null
          clients_count?: number | null
          created_at?: string | null
          experience_years?: number | null
          id: string
          languages?: string | null
          license_number?: string | null
          regions_of_operation?: string | null
          specialization?: string | null
          updated_at?: string | null
        }
        Update: {
          agency?: string | null
          clients_count?: number | null
          created_at?: string | null
          experience_years?: number | null
          id?: string
          languages?: string | null
          license_number?: string | null
          regions_of_operation?: string | null
          specialization?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      club_details: {
        Row: {
          achievements: string | null
          city: string | null
          club_colors: string | null
          country: string | null
          created_at: string | null
          description: string | null
          founded_year: number | null
          id: string
          league: string | null
          stadium: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          achievements?: string | null
          city?: string | null
          club_colors?: string | null
          country?: string | null
          created_at?: string | null
          description?: string | null
          founded_year?: number | null
          id: string
          league?: string | null
          stadium?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          achievements?: string | null
          city?: string | null
          club_colors?: string | null
          country?: string | null
          created_at?: string | null
          description?: string | null
          founded_year?: number | null
          id?: string
          league?: string | null
          stadium?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      coach_details: {
        Row: {
          achievements: string | null
          certifications: string | null
          coaching_philosophy: string | null
          created_at: string | null
          current_club: string | null
          experience: string | null
          id: string
          specialization: string | null
          updated_at: string | null
        }
        Insert: {
          achievements?: string | null
          certifications?: string | null
          coaching_philosophy?: string | null
          created_at?: string | null
          current_club?: string | null
          experience?: string | null
          id: string
          specialization?: string | null
          updated_at?: string | null
        }
        Update: {
          achievements?: string | null
          certifications?: string | null
          coaching_philosophy?: string | null
          created_at?: string | null
          current_club?: string | null
          experience?: string | null
          id?: string
          specialization?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      equipment_supplier_details: {
        Row: {
          company: string | null
          created_at: string | null
          id: string
          products: string | null
          regions_served: string | null
          specialization: string | null
          updated_at: string | null
          website: string | null
          year_established: number | null
        }
        Insert: {
          company?: string | null
          created_at?: string | null
          id: string
          products?: string | null
          regions_served?: string | null
          specialization?: string | null
          updated_at?: string | null
          website?: string | null
          year_established?: number | null
        }
        Update: {
          company?: string | null
          created_at?: string | null
          id?: string
          products?: string | null
          regions_served?: string | null
          specialization?: string | null
          updated_at?: string | null
          website?: string | null
          year_established?: number | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          is_read: boolean
          receiver_id: string
          sender_id: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_read?: boolean
          receiver_id: string
          sender_id: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean
          receiver_id?: string
          sender_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          content: string
          created_at: string
          id: string
          is_read: boolean
          metadata: Json | null
          type: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_read?: boolean
          metadata?: Json | null
          type: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean
          metadata?: Json | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      player_details: {
        Row: {
          age: number | null
          club: string | null
          country: string | null
          description: string | null
          id: string
          position: string | null
        }
        Insert: {
          age?: number | null
          club?: string | null
          country?: string | null
          description?: string | null
          id: string
          position?: string | null
        }
        Update: {
          age?: number | null
          club?: string | null
          country?: string | null
          description?: string | null
          id?: string
          position?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "player_details_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      player_experience: {
        Row: {
          achievements: string | null
          club: string
          created_at: string
          end_date: string | null
          id: string
          is_current_role: boolean | null
          player_id: string
          role: string
          start_date: string
          updated_at: string
        }
        Insert: {
          achievements?: string | null
          club: string
          created_at?: string
          end_date?: string | null
          id?: string
          is_current_role?: boolean | null
          player_id: string
          role: string
          start_date: string
          updated_at?: string
        }
        Update: {
          achievements?: string | null
          club?: string
          created_at?: string
          end_date?: string | null
          id?: string
          is_current_role?: boolean | null
          player_id?: string
          role?: string
          start_date?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "player_experience_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      player_media: {
        Row: {
          created_at: string
          description: string | null
          id: string
          media_type: string
          media_url: string
          player_id: string | null
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          media_type: string
          media_url: string
          player_id?: string | null
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          media_type?: string
          media_url?: string
          player_id?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "player_media_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
          user_type: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          updated_at?: string
          user_type: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_type?: string
        }
        Relationships: []
      }
      sponsor_details: {
        Row: {
          budget_range: string | null
          company: string | null
          created_at: string | null
          id: string
          industry: string | null
          previous_sponsorships: string | null
          sponsorship_focus: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          budget_range?: string | null
          company?: string | null
          created_at?: string | null
          id: string
          industry?: string | null
          previous_sponsorships?: string | null
          sponsorship_focus?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          budget_range?: string | null
          company?: string | null
          created_at?: string | null
          id?: string
          industry?: string | null
          previous_sponsorships?: string | null
          sponsorship_focus?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_conversations: {
        Args: { input_user_id: string }
        Returns: {
          id: string
          other_user_id: string
          full_name: string
          avatar_url: string
          last_message: string
          last_message_time: string
          unread_count: number
        }[]
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
