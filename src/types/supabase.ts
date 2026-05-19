// Gerado via: npx supabase gen types typescript --project-id ubimupnddnpmitayfozo > src/types/supabase.ts
// Regenerar após cada migration (requer Docker): npx supabase gen types typescript --linked > src/types/supabase.ts

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
      activities: {
        Row: {
          author_id:    string
          created_at:   string
          description:  string | null
          extra_data:   Json | null
          id:           string
          lead_id:      string
          title:        string
          type:         Database['public']['Enums']['activity_type']
          workspace_id: string
        }
        Insert: {
          author_id:    string
          created_at?:  string
          description?: string | null
          extra_data?:  Json | null
          id?:          string
          lead_id:      string
          title:        string
          type:         Database['public']['Enums']['activity_type']
          workspace_id: string
        }
        Update: {
          author_id?:   string
          created_at?:  string
          description?: string | null
          extra_data?:  Json | null
          id?:          string
          lead_id?:     string
          title?:       string
          type?:        Database['public']['Enums']['activity_type']
          workspace_id?: string
        }
        Relationships: [
          { foreignKeyName: 'activities_author_id_fkey';    columns: ['author_id'];    referencedRelation: 'users';      referencedColumns: ['id'] },
          { foreignKeyName: 'activities_lead_id_fkey';      columns: ['lead_id'];      referencedRelation: 'leads';      referencedColumns: ['id'] },
          { foreignKeyName: 'activities_workspace_id_fkey'; columns: ['workspace_id']; referencedRelation: 'workspaces'; referencedColumns: ['id'] },
        ]
      }
      deals: {
        Row: {
          created_at:   string
          due_date:     string | null
          id:           string
          lead_id:      string | null
          notes:        string | null
          owner_id:     string | null
          stage:        Database['public']['Enums']['deal_stage']
          title:        string
          updated_at:   string
          value:        number | null
          workspace_id: string
        }
        Insert: {
          created_at?:  string
          due_date?:    string | null
          id?:          string
          lead_id?:     string | null
          notes?:       string | null
          owner_id?:    string | null
          stage?:       Database['public']['Enums']['deal_stage']
          title:        string
          updated_at?:  string
          value?:       number | null
          workspace_id: string
        }
        Update: {
          created_at?:  string
          due_date?:    string | null
          id?:          string
          lead_id?:     string | null
          notes?:       string | null
          owner_id?:    string | null
          stage?:       Database['public']['Enums']['deal_stage']
          title?:       string
          updated_at?:  string
          value?:       number | null
          workspace_id?: string
        }
        Relationships: [
          { foreignKeyName: 'deals_lead_id_fkey';      columns: ['lead_id'];      referencedRelation: 'leads';      referencedColumns: ['id'] },
          { foreignKeyName: 'deals_owner_id_fkey';     columns: ['owner_id'];     referencedRelation: 'users';      referencedColumns: ['id'] },
          { foreignKeyName: 'deals_workspace_id_fkey'; columns: ['workspace_id']; referencedRelation: 'workspaces'; referencedColumns: ['id'] },
        ]
      }
      leads: {
        Row: {
          company:         string | null
          created_at:      string
          email:           string
          estimated_value: number | null
          id:              string
          name:            string
          notes:           string | null
          owner_id:        string | null
          phone:           string | null
          position:        string | null
          status:          Database['public']['Enums']['lead_status']
          updated_at:      string
          workspace_id:    string
        }
        Insert: {
          company?:         string | null
          created_at?:      string
          email:            string
          estimated_value?: number | null
          id?:              string
          name:             string
          notes?:           string | null
          owner_id?:        string | null
          phone?:           string | null
          position?:        string | null
          status?:          Database['public']['Enums']['lead_status']
          updated_at?:      string
          workspace_id:     string
        }
        Update: {
          company?:         string | null
          created_at?:      string
          email?:           string
          estimated_value?: number | null
          id?:              string
          name?:            string
          notes?:           string | null
          owner_id?:        string | null
          phone?:           string | null
          position?:        string | null
          status?:          Database['public']['Enums']['lead_status']
          updated_at?:      string
          workspace_id?:    string
        }
        Relationships: [
          { foreignKeyName: 'leads_owner_id_fkey';     columns: ['owner_id'];     referencedRelation: 'users';      referencedColumns: ['id'] },
          { foreignKeyName: 'leads_workspace_id_fkey'; columns: ['workspace_id']; referencedRelation: 'workspaces'; referencedColumns: ['id'] },
        ]
      }
      subscriptions: {
        Row: {
          created_at:             string
          current_period_end:     string | null
          id:                     string
          plan:                   Database['public']['Enums']['plan']
          status:                 string
          stripe_customer_id:     string | null
          stripe_subscription_id: string | null
          updated_at:             string
          workspace_id:           string
        }
        Insert: {
          created_at?:             string
          current_period_end?:     string | null
          id?:                     string
          plan?:                   Database['public']['Enums']['plan']
          status?:                 string
          stripe_customer_id?:     string | null
          stripe_subscription_id?: string | null
          updated_at?:             string
          workspace_id:            string
        }
        Update: {
          created_at?:             string
          current_period_end?:     string | null
          id?:                     string
          plan?:                   Database['public']['Enums']['plan']
          status?:                 string
          stripe_customer_id?:     string | null
          stripe_subscription_id?: string | null
          updated_at?:             string
          workspace_id?:           string
        }
        Relationships: [
          { foreignKeyName: 'subscriptions_workspace_id_fkey'; columns: ['workspace_id']; referencedRelation: 'workspaces'; referencedColumns: ['id'] },
        ]
      }
      workspace_invites: {
        Row: {
          created_at:   string
          email:        string
          expires_at:   string
          id:           string
          role:         Database['public']['Enums']['member_role']
          token:        string
          workspace_id: string
        }
        Insert: {
          created_at?:  string
          email:        string
          expires_at:   string
          id?:          string
          role?:        Database['public']['Enums']['member_role']
          token:        string
          workspace_id: string
        }
        Update: {
          created_at?:  string
          email?:       string
          expires_at?:  string
          id?:          string
          role?:        Database['public']['Enums']['member_role']
          token?:       string
          workspace_id?: string
        }
        Relationships: [
          { foreignKeyName: 'workspace_invites_workspace_id_fkey'; columns: ['workspace_id']; referencedRelation: 'workspaces'; referencedColumns: ['id'] },
        ]
      }
      workspace_members: {
        Row: {
          joined_at:    string
          role:         Database['public']['Enums']['member_role']
          user_id:      string
          workspace_id: string
        }
        Insert: {
          joined_at?:   string
          role?:        Database['public']['Enums']['member_role']
          user_id:      string
          workspace_id: string
        }
        Update: {
          joined_at?:   string
          role?:        Database['public']['Enums']['member_role']
          user_id?:     string
          workspace_id?: string
        }
        Relationships: [
          { foreignKeyName: 'workspace_members_user_id_fkey';      columns: ['user_id'];      referencedRelation: 'users';      referencedColumns: ['id'] },
          { foreignKeyName: 'workspace_members_workspace_id_fkey'; columns: ['workspace_id']; referencedRelation: 'workspaces'; referencedColumns: ['id'] },
        ]
      }
      workspaces: {
        Row: {
          created_at: string
          id:         string
          name:       string
          plan:       Database['public']['Enums']['plan']
          slug:       string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?:         string
          name:        string
          plan?:       Database['public']['Enums']['plan']
          slug:        string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?:         string
          name?:       string
          plan?:       Database['public']['Enums']['plan']
          slug?:       string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          id:         string
          full_name:  string
          email:      string
          updated_at: string
        }
        Insert: {
          id:          string
          full_name?:  string
          email?:      string
          updated_at?: string
        }
        Update: {
          full_name?:  string
          email?:      string
          updated_at?: string
        }
        Relationships: [
          { foreignKeyName: 'profiles_id_fkey'; columns: ['id']; referencedRelation: 'users'; referencedColumns: ['id'] },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      accept_invite: {
        Args: { p_token: string }
        Returns: {
          workspace_id: string
          role?: string
          already_member?: boolean
        }
      }
      create_workspace: {
        Args: { p_name: string; p_slug: string }
        Returns: {
          id: string
          name: string
          slug: string
          plan: Database['public']['Enums']['plan']
        }
      }
      is_workspace_admin: {
        Args: { wid: string }
        Returns: boolean
      }
      is_workspace_member: {
        Args: { wid: string }
        Returns: boolean
      }
    }
    Enums: {
      activity_type: 'call' | 'email' | 'meeting' | 'note'
      deal_stage:    'novo' | 'contatado' | 'qualificado' | 'negociando' | 'convertido' | 'perdido'
      lead_status:   'novo' | 'contatado' | 'qualificado' | 'negociando' | 'convertido' | 'perdido'
      member_role:   'admin' | 'member'
      plan:          'free' | 'pro'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, 'public'>]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    ? (PublicSchema['Tables'] & PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never
