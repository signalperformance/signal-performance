export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string
          email: string
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          booking_date: string
          created_at: string
          id: string
          schedule_entry_id: string
          user_id: string
        }
        Insert: {
          booking_date: string
          created_at?: string
          id?: string
          schedule_entry_id: string
          user_id: string
        }
        Update: {
          booking_date?: string
          created_at?: string
          id?: string
          schedule_entry_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_schedule_entry_id_fkey"
            columns: ["schedule_entry_id"]
            isOneToOne: false
            referencedRelation: "live_schedule_instances"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      live_schedule_instances: {
        Row: {
          class_date: string
          class_name: string
          created_at: string
          duration: number
          id: string
          is_cancelled: boolean
          max_participants: number
          period_id: string
          session_type: Database["public"]["Enums"]["session_type"]
          start_time: string
          template_entry_id: string | null
          updated_at: string
        }
        Insert: {
          class_date: string
          class_name: string
          created_at?: string
          duration: number
          id?: string
          is_cancelled?: boolean
          max_participants?: number
          period_id: string
          session_type: Database["public"]["Enums"]["session_type"]
          start_time: string
          template_entry_id?: string | null
          updated_at?: string
        }
        Update: {
          class_date?: string
          class_name?: string
          created_at?: string
          duration?: number
          id?: string
          is_cancelled?: boolean
          max_participants?: number
          period_id?: string
          session_type?: Database["public"]["Enums"]["session_type"]
          start_time?: string
          template_entry_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "live_schedule_instances_period_id_fkey"
            columns: ["period_id"]
            isOneToOne: false
            referencedRelation: "schedule_periods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "live_schedule_instances_template_entry_id_fkey"
            columns: ["template_entry_id"]
            isOneToOne: false
            referencedRelation: "schedule_template_entries"
            referencedColumns: ["id"]
          },
        ]
      }
      schedule_entries: {
        Row: {
          class_name: string
          created_at: string
          day_of_week: Database["public"]["Enums"]["day_of_week"]
          duration: number
          id: string
          is_active: boolean
          max_participants: number
          session_type: Database["public"]["Enums"]["session_type"]
          start_time: string
          updated_at: string
        }
        Insert: {
          class_name: string
          created_at?: string
          day_of_week: Database["public"]["Enums"]["day_of_week"]
          duration: number
          id?: string
          is_active?: boolean
          max_participants?: number
          session_type: Database["public"]["Enums"]["session_type"]
          start_time: string
          updated_at?: string
        }
        Update: {
          class_name?: string
          created_at?: string
          day_of_week?: Database["public"]["Enums"]["day_of_week"]
          duration?: number
          id?: string
          is_active?: boolean
          max_participants?: number
          session_type?: Database["public"]["Enums"]["session_type"]
          start_time?: string
          updated_at?: string
        }
        Relationships: []
      }
      schedule_periods: {
        Row: {
          created_at: string
          end_date: string
          id: string
          is_active: boolean
          start_date: string
          template_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          end_date: string
          id?: string
          is_active?: boolean
          start_date: string
          template_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          end_date?: string
          id?: string
          is_active?: boolean
          start_date?: string
          template_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "schedule_periods_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "schedule_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      schedule_template_entries: {
        Row: {
          class_name: string
          created_at: string
          day_of_week: Database["public"]["Enums"]["day_of_week"]
          duration: number
          id: string
          max_participants: number
          session_type: Database["public"]["Enums"]["session_type"]
          start_time: string
          template_id: string
          updated_at: string
        }
        Insert: {
          class_name: string
          created_at?: string
          day_of_week: Database["public"]["Enums"]["day_of_week"]
          duration: number
          id?: string
          max_participants?: number
          session_type: Database["public"]["Enums"]["session_type"]
          start_time: string
          template_id: string
          updated_at?: string
        }
        Update: {
          class_name?: string
          created_at?: string
          day_of_week?: Database["public"]["Enums"]["day_of_week"]
          duration?: number
          id?: string
          max_participants?: number
          session_type?: Database["public"]["Enums"]["session_type"]
          start_time?: string
          template_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "schedule_template_entries_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "schedule_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      schedule_templates: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_attendance: {
        Row: {
          attended: boolean | null
          booking_id: string
          created_at: string
          id: string
          live_schedule_instance_id: string
          marked_at: string | null
          marked_by_admin_id: string | null
          notes: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          attended?: boolean | null
          booking_id: string
          created_at?: string
          id?: string
          live_schedule_instance_id: string
          marked_at?: string | null
          marked_by_admin_id?: string | null
          notes?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          attended?: boolean | null
          booking_id?: string
          created_at?: string
          id?: string
          live_schedule_instance_id?: string
          marked_at?: string | null
          marked_by_admin_id?: string | null
          notes?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_payment_records: {
        Row: {
          created_at: string
          id: string
          is_paid: boolean
          notes: string | null
          paid_at: string | null
          payment_method: Database["public"]["Enums"]["payment_method"] | null
          period_month: string
          updated_at: string
          user_profile_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_paid?: boolean
          notes?: string | null
          paid_at?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          period_month: string
          updated_at?: string
          user_profile_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_paid?: boolean
          notes?: string | null
          paid_at?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          period_month?: string
          updated_at?: string
          user_profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_payment_records_user_profile_id_fkey"
            columns: ["user_profile_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          created_at: string
          email: string
          first_name: string
          id: string
          is_active: boolean
          last_name: string
          membership_plan: Database["public"]["Enums"]["membership_plan"]
          monthly_renewal_date: string | null
          notes: string | null
          phone: string | null
          player_type: Database["public"]["Enums"]["player_type"]
          profile_picture: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          first_name: string
          id?: string
          is_active?: boolean
          last_name: string
          membership_plan?: Database["public"]["Enums"]["membership_plan"]
          monthly_renewal_date?: string | null
          notes?: string | null
          phone?: string | null
          player_type?: Database["public"]["Enums"]["player_type"]
          profile_picture?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          is_active?: boolean
          last_name?: string
          membership_plan?: Database["public"]["Enums"]["membership_plan"]
          monthly_renewal_date?: string | null
          notes?: string | null
          phone?: string | null
          player_type?: Database["public"]["Enums"]["player_type"]
          profile_picture?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      class_type: "mobility" | "strength" | "conditioning" | "recovery"
      day_of_week:
        | "monday"
        | "tuesday"
        | "wednesday"
        | "thursday"
        | "friday"
        | "saturday"
        | "sunday"
      membership_plan: "basic" | "pro"
      membership_plan_type: "basic" | "pro"
      payment_method: "cash" | "card" | "bank_transfer" | "stripe" | "other"
      player_type: "amateur" | "pro"
      session_level: "pro" | "amateur"
      session_type: "pro" | "amateur"
      weekday:
        | "monday"
        | "tuesday"
        | "wednesday"
        | "thursday"
        | "friday"
        | "saturday"
        | "sunday"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
      class_type: ["mobility", "strength", "conditioning", "recovery"],
      day_of_week: [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ],
      membership_plan: ["basic", "pro"],
      membership_plan_type: ["basic", "pro"],
      payment_method: ["cash", "card", "bank_transfer", "stripe", "other"],
      player_type: ["amateur", "pro"],
      session_level: ["pro", "amateur"],
      session_type: ["pro", "amateur"],
      weekday: [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ],
    },
  },
} as const
