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
      brands: {
        Row: {
          brand_id: number
          brand_name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          brand_id?: number
          brand_name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          brand_id?: number
          brand_name?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          category_id: number
          category_name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          category_id?: number
          category_name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          category_id?: number
          category_name?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      donor_types: {
        Row: {
          donor_type_id: number
          type_name: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          donor_type_id?: number
          type_name: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          donor_type_id?: number
          type_name?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      donors: {
        Row: {
          donor_id: number
          donor_name: string
          donor_type_id: number
          contact_person: string | null
          phone: string | null
          email: string | null
          address: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          donor_id?: number
          donor_name: string
          donor_type_id: number
          contact_person?: string | null
          phone?: string | null
          email?: string | null
          address?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          donor_id?: number
          donor_name?: string
          donor_type_id?: number
          contact_person?: string | null
          phone?: string | null
          email?: string | null
          address?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "donors_donor_type_id_fkey"
            columns: ["donor_type_id"]
            isOneToOne: false
            referencedRelation: "donor_types"
            referencedColumns: ["donor_type_id"]
          }
        ]
      }
      products: {
        Row: {
          product_id: number
          product_name: string
          sku: string | null
          description: string | null
          category_id: number
          brand_id: number | null
          official_unit_id: number
          low_stock_threshold: number
          created_at: string
          updated_at: string
        }
        Insert: {
          product_id?: number
          product_name: string
          sku?: string | null
          description?: string | null
          category_id: number
          brand_id?: number | null
          official_unit_id: number
          low_stock_threshold?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          product_id?: number
          product_name?: string
          sku?: string | null
          description?: string | null
          category_id?: number
          brand_id?: number | null
          official_unit_id?: number
          low_stock_threshold?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["category_id"]
          },
          {
            foreignKeyName: "products_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["brand_id"]
          },
          {
            foreignKeyName: "products_official_unit_id_fkey"
            columns: ["official_unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["unit_id"]
          }
        ]
      }
      roles: {
        Row: {
          role_id: number
          role_name: string
        }
        Insert: {
          role_id?: number
          role_name: string
        }
        Update: {
          role_id?: number
          role_name?: string
        }
        Relationships: []
      }
      stock_history: {
        Row: {
          history_id: number
          lot_id: number
          transaction_detail_id: number | null
          user_id: string
          changed_at: string
          old_quantity: number
          new_quantity: number
          change_reason: string | null
        }
        Insert: {
          history_id?: number
          lot_id: number
          transaction_detail_id?: number | null
          user_id: string
          changed_at?: string
          old_quantity: number
          new_quantity: number
          change_reason?: string | null
        }
        Update: {
          history_id?: number
          lot_id?: number
          transaction_detail_id?: number | null
          user_id?: string
          changed_at?: string
          old_quantity?: number
          new_quantity?: number
          change_reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stock_history_lot_id_fkey"
            columns: ["lot_id"]
            isOneToOne: false
            referencedRelation: "stock_lots"
            referencedColumns: ["lot_id"]
          },
          {
            foreignKeyName: "stock_history_transaction_detail_id_fkey"
            columns: ["transaction_detail_id"]
            isOneToOne: false
            referencedRelation: "transaction_details"
            referencedColumns: ["detail_id"]
          },
          {
            foreignKeyName: "stock_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          }
        ]
      }
      stock_lots: {
        Row: {
          lot_id: number
          product_id: number
          warehouse_id: number
          current_quantity: number
          received_date: string
          expiry_date: string | null
          unit_price: number
        }
        Insert: {
          lot_id?: number
          product_id: number
          warehouse_id: number
          current_quantity: number
          received_date?: string
          expiry_date?: string | null
          unit_price?: number
        }
        Update: {
          lot_id?: number
          product_id?: number
          warehouse_id?: number
          current_quantity?: number
          received_date?: string
          expiry_date?: string | null
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "stock_lots_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "stock_lots_warehouse_id_fkey"
            columns: ["warehouse_id"]
            isOneToOne: false
            referencedRelation: "warehouses"
            referencedColumns: ["warehouse_id"]
          }
        ]
      }
      transaction_details: {
        Row: {
          detail_id: number
          transaction_id: number
          product_id: number
          quantity: number
          unit_id: number
          source_lot_id: number | null
        }
        Insert: {
          detail_id?: number
          transaction_id: number
          product_id: number
          quantity: number
          unit_id: number
          source_lot_id?: number | null
        }
        Update: {
          detail_id?: number
          transaction_id?: number
          product_id?: number
          quantity?: number
          unit_id?: number
          source_lot_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "transaction_details_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["transaction_id"]
          },
          {
            foreignKeyName: "transaction_details_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "transaction_details_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["unit_id"]
          },
          {
            foreignKeyName: "transaction_details_source_lot_id_fkey"
            columns: ["source_lot_id"]
            isOneToOne: false
            referencedRelation: "stock_lots"
            referencedColumns: ["lot_id"]
          }
        ]
      }
      transaction_types: {
        Row: {
          type_id: number
          type_name: string
        }
        Insert: {
          type_id?: number
          type_name: string
        }
        Update: {
          type_id?: number
          type_name?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          transaction_id: number
          transaction_type_id: number
          user_id: string
          transaction_date: string
          notes: string | null
          signature_data: string | null
          donor_id: number | null
          source_warehouse_id: number | null
          destination_warehouse_id: number | null
        }
        Insert: {
          transaction_id?: number
          transaction_type_id: number
          user_id: string
          transaction_date?: string
          notes?: string | null
          signature_data?: string | null
          donor_id?: number | null
          source_warehouse_id?: number | null
          destination_warehouse_id?: number | null
        }
        Update: {
          transaction_id?: number
          transaction_type_id?: number
          user_id?: string
          transaction_date?: string
          notes?: string | null
          signature_data?: string | null
          donor_id?: number | null
          source_warehouse_id?: number | null
          destination_warehouse_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_transaction_type_id_fkey"
            columns: ["transaction_type_id"]
            isOneToOne: false
            referencedRelation: "transaction_types"
            referencedColumns: ["type_id"]
          },
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "transactions_donor_id_fkey"
            columns: ["donor_id"]
            isOneToOne: false
            referencedRelation: "donors"
            referencedColumns: ["donor_id"]
          },
          {
            foreignKeyName: "transactions_source_warehouse_id_fkey"
            columns: ["source_warehouse_id"]
            isOneToOne: false
            referencedRelation: "warehouses"
            referencedColumns: ["warehouse_id"]
          },
          {
            foreignKeyName: "transactions_destination_warehouse_id_fkey"
            columns: ["destination_warehouse_id"]
            isOneToOne: false
            referencedRelation: "warehouses"
            referencedColumns: ["warehouse_id"]
          }
        ]
      }
      units: {
        Row: {
          unit_id: number
          unit_name: string
          abbreviation: string
        }
        Insert: {
          unit_id?: number
          unit_name: string
          abbreviation: string
        }
        Update: {
          unit_id?: number
          unit_name?: string
          abbreviation?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          user_id: string
          full_name: string
          role_id: number | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          full_name: string
          role_id?: number | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          full_name?: string
          role_id?: number | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["role_id"]
          }
        ]
      }
      warehouses: {
        Row: {
          warehouse_id: number
          warehouse_name: string
          location_description: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          warehouse_id?: number
          warehouse_name: string
          location_description?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          warehouse_id?: number
          warehouse_name?: string
          location_description?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
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
      [_ in never]: never
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
    : never = never
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
    : never = never
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
    : never = never
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
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
