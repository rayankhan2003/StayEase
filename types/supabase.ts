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
      bookings: {
        Row: {
          branch_id: string
          check_in: string
          check_out: string
          created_at: string | null
          guest_id: string
          id: string
          notes: string | null
          payment_method: string | null
          payment_status: string
          room_id: string
          status: string
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          branch_id: string
          check_in: string
          check_out: string
          created_at?: string | null
          guest_id: string
          id?: string
          notes?: string | null
          payment_method?: string | null
          payment_status?: string
          room_id: string
          status?: string
          total_amount: number
          updated_at?: string | null
        }
        Update: {
          branch_id?: string
          check_in?: string
          check_out?: string
          created_at?: string | null
          guest_id?: string
          id?: string
          notes?: string | null
          payment_method?: string | null
          payment_status?: string
          room_id?: string
          status?: string
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_guest_id_fkey"
            columns: ["guest_id"]
            isOneToOne: false
            referencedRelation: "guests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      branches: {
        Row: {
          created_at: string | null
          id: string
          location: string
          manager: string
          name: string
          occupancy_rate: number
          revenue: number
          rooms_count: number
          staff_count: number
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          location: string
          manager: string
          name: string
          occupancy_rate?: number
          revenue?: number
          rooms_count?: number
          staff_count?: number
          status?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          location?: string
          manager?: string
          name?: string
          occupancy_rate?: number
          revenue?: number
          rooms_count?: number
          staff_count?: number
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      employees: {
        Row: {
          branch_id: string
          created_at: string | null
          email: string
          id: string
          name: string
          phone: string
          role: string
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          branch_id: string
          created_at?: string | null
          email: string
          id?: string
          name: string
          phone: string
          role: string
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          branch_id?: string
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          phone?: string
          role?: string
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "employees_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
        ]
      }
      guests: {
        Row: {
          branch_id: string | null
          created_at: string | null
          email: string
          id: string
          last_visit: string | null
          name: string
          phone: string
          preferences: string[] | null
          status: string
          total_spent: number
          updated_at: string | null
          visits: number
        }
        Insert: {
          branch_id?: string | null
          created_at?: string | null
          email: string
          id?: string
          last_visit?: string | null
          name: string
          phone: string
          preferences?: string[] | null
          status?: string
          total_spent?: number
          updated_at?: string | null
          visits?: number
        }
        Update: {
          branch_id?: string | null
          created_at?: string | null
          email?: string
          id?: string
          last_visit?: string | null
          name?: string
          phone?: string
          preferences?: string[] | null
          status?: string
          total_spent?: number
          updated_at?: string | null
          visits?: number
        }
        Relationships: [
          {
            foreignKeyName: "guests_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          branch_id: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          role: string | null
        }
        Insert: {
          branch_id?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          role?: string | null
        }
        Update: {
          branch_id?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
        ]
      }
      rooms: {
        Row: {
          amenities: string[] | null
          branch_id: string
          created_at: string | null
          id: string
          max_guests: number
          number: string
          price: number
          status: string
          type: string
          updated_at: string | null
        }
        Insert: {
          amenities?: string[] | null
          branch_id: string
          created_at?: string | null
          id?: string
          max_guests?: number
          number: string
          price: number
          status?: string
          type: string
          updated_at?: string | null
        }
        Update: {
          amenities?: string[] | null
          branch_id?: string
          created_at?: string | null
          id?: string
          max_guests?: number
          number?: string
          price?: number
          status?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_rooms_branch"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
        ]
      }
      settings: {
        Row: {
          allow_early_check_in: boolean
          allow_late_check_out: boolean
          branch_id: string | null
          breakfast_price: number
          check_in_time: string
          check_out_time: string
          dinner_price: number
          hotel_name: string
          id: string
          lunch_price: number
          max_guests_per_booking: number
          max_nights: number
          min_nights: number
          require_credit_card: boolean
          send_confirmation_email: boolean
          updated_at: string | null
        }
        Insert: {
          allow_early_check_in?: boolean
          allow_late_check_out?: boolean
          branch_id?: string | null
          breakfast_price?: number
          check_in_time: string
          check_out_time: string
          dinner_price?: number
          hotel_name: string
          id?: string
          lunch_price?: number
          max_guests_per_booking?: number
          max_nights?: number
          min_nights?: number
          require_credit_card?: boolean
          send_confirmation_email?: boolean
          updated_at?: string | null
        }
        Update: {
          allow_early_check_in?: boolean
          allow_late_check_out?: boolean
          branch_id?: string | null
          breakfast_price?: number
          check_in_time?: string
          check_out_time?: string
          dinner_price?: number
          hotel_name?: string
          id?: string
          lunch_price?: number
          max_guests_per_booking?: number
          max_nights?: number
          min_nights?: number
          require_credit_card?: boolean
          send_confirmation_email?: boolean
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "settings_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      custom_access_token_hook: {
        Args: { event: Json }
        Returns: Json
      }
      uuid_generate_v1: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      uuid_generate_v1mc: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      uuid_generate_v3: {
        Args: { namespace: string; name: string }
        Returns: string
      }
      uuid_generate_v4: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      uuid_generate_v5: {
        Args: { namespace: string; name: string }
        Returns: string
      }
      uuid_nil: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      uuid_ns_dns: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      uuid_ns_oid: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      uuid_ns_url: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      uuid_ns_x500: {
        Args: Record<PropertyKey, never>
        Returns: string
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
