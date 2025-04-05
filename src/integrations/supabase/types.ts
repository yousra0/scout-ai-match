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
      _prisma_migrations: {
        Row: {
          applied_steps_count: number
          checksum: string
          finished_at: string | null
          id: string
          logs: string | null
          migration_name: string
          rolled_back_at: string | null
          started_at: string
        }
        Insert: {
          applied_steps_count?: number
          checksum: string
          finished_at?: string | null
          id: string
          logs?: string | null
          migration_name: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Update: {
          applied_steps_count?: number
          checksum?: string
          finished_at?: string | null
          id?: string
          logs?: string | null
          migration_name?: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Relationships: []
      }
      Agent: {
        Row: {
          id: number
          nationality: string
          playerTypes: string
          specialization: string
          userId: number
          yearsExperience: number
        }
        Insert: {
          id?: number
          nationality: string
          playerTypes: string
          specialization: string
          userId: number
          yearsExperience: number
        }
        Update: {
          id?: number
          nationality?: string
          playerTypes?: string
          specialization?: string
          userId?: number
          yearsExperience?: number
        }
        Relationships: [
          {
            foreignKeyName: "Agent_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      Club: {
        Row: {
          budget: number
          country: string
          id: number
          playingStyle: string
          targetPlayers: string
          userId: number
          youthDevelopment: boolean
        }
        Insert: {
          budget: number
          country: string
          id?: number
          playingStyle: string
          targetPlayers: string
          userId: number
          youthDevelopment: boolean
        }
        Update: {
          budget?: number
          country?: string
          id?: number
          playingStyle?: string
          targetPlayers?: string
          userId?: number
          youthDevelopment?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "Club_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      Player: {
        Row: {
          age: number
          assistsPerMatch: number
          currentAgent: string
          email: string
          fullName: string
          goalsPerMatch: number
          id: number
          matchesPlayed: number
          nationality: string
          overall: number
          password: string
          pastInjuries: string
          physicalCondition: string
          playStyle: string
          position: string
          potential: number
          salary: number
          successfulTacklesPerMatch: number
          userId: number
          value: number
        }
        Insert: {
          age: number
          assistsPerMatch?: number
          currentAgent?: string
          email: string
          fullName: string
          goalsPerMatch?: number
          id?: number
          matchesPlayed?: number
          nationality: string
          overall?: number
          password: string
          pastInjuries?: string
          physicalCondition?: string
          playStyle?: string
          position: string
          potential?: number
          salary?: number
          successfulTacklesPerMatch?: number
          userId: number
          value?: number
        }
        Update: {
          age?: number
          assistsPerMatch?: number
          currentAgent?: string
          email?: string
          fullName?: string
          goalsPerMatch?: number
          id?: number
          matchesPlayed?: number
          nationality?: string
          overall?: number
          password?: string
          pastInjuries?: string
          physicalCondition?: string
          playStyle?: string
          position?: string
          potential?: number
          salary?: number
          successfulTacklesPerMatch?: number
          userId?: number
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "Player_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      PlayerMedia: {
        Row: {
          created_at: string
          description: string
          id: number
          player_id: number
          title: string
          type: string
          url: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: number
          player_id: number
          title: string
          type: string
          url: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: number
          player_id?: number
          title?: string
          type?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "PlayerMedia_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "Player"
            referencedColumns: ["id"]
          },
        ]
      }
      User: {
        Row: {
          email: string
          id: number
          password: string
          role: Database["public"]["Enums"]["UserRole"]
        }
        Insert: {
          email: string
          id?: number
          password: string
          role: Database["public"]["Enums"]["UserRole"]
        }
        Update: {
          email?: string
          id?: number
          password?: string
          role?: Database["public"]["Enums"]["UserRole"]
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      UserRole: "PLAYER" | "AGENT" | "CLUB"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
