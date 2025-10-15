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
      almacenes: {
        Row: {
          activo: boolean | null
          almacen_id: number
          nombre: string
        }
        Insert: {
          activo?: boolean | null
          almacen_id?: number
          nombre: string
        }
        Update: {
          activo?: boolean | null
          almacen_id?: number
          nombre?: string
        }
        Relationships: []
      }
      categoriasproductos: {
        Row: {
          categoria_producto_id: number
          nombre: string
        }
        Insert: {
          categoria_producto_id?: number
          nombre: string
        }
        Update: {
          categoria_producto_id?: number
          nombre?: string
        }
        Relationships: []
      }
      configuracion: {
        Row: {
          clave: string
          valor: string | null
          tipo: string | null
          descripcion: string | null
          creado_por: string | null
          actualizado_por: string | null
          solo_administrador: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          clave: string
          valor?: string | null
          tipo?: string | null
          descripcion?: string | null
          creado_por?: string | null
          actualizado_por?: string | null
          solo_administrador?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          clave?: string
          valor?: string | null
          tipo?: string | null
          descripcion?: string | null
          creado_por?: string | null
          actualizado_por?: string | null
          solo_administrador?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "configuracion_creado_por_fkey"
            columns: ["creado_por"]
            isOneToOne: false
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "configuracion_actualizado_por_fkey"
            columns: ["actualizado_por"]
            isOneToOne: false
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
        ]
      }
      consumoscocina: {
        Row: {
          consumo_cocina_id: number
          lote_id: number
          variante_id: number | null
          cantidad: number
          fecha: string
          firma_texto: string | null
          responsable_id: string
          aprobado_por: string | null
        }
        Insert: {
          consumo_cocina_id?: number
          lote_id: number
          variante_id?: number | null
          cantidad: number
          fecha: string
          firma_texto?: string | null
          responsable_id: string
          aprobado_por?: string | null
        }
        Update: {
          consumo_cocina_id?: number
          lote_id?: number
          variante_id?: number | null
          cantidad?: number
          fecha?: string
          firma_texto?: string | null
          responsable_id?: string
          aprobado_por?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "consumoscocina_lote_id_fkey"
            columns: ["lote_id"]
            isOneToOne: false
            referencedRelation: "lotes"
            referencedColumns: ["lote_id"]
          },
          {
            foreignKeyName: "consumoscocina_variante_id_fkey"
            columns: ["variante_id"]
            isOneToOne: false
            referencedRelation: "variantes_producto"
            referencedColumns: ["variante_id"]
          },
          {
            foreignKeyName: "consumoscocina_responsable_id_fkey"
            columns: ["responsable_id"]
            isOneToOne: false
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consumoscocina_aprobado_por_fkey"
            columns: ["aprobado_por"]
            isOneToOne: false
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
        ]
      }
      detallesdonativos: {
        Row: {
          detalle_donativo_id: number
          donativo_id: number
          variante_id: number | null
          lote_id: number | null
          cantidad: number
          precio_unitario: number | null
        }
        Insert: {
          detalle_donativo_id?: number
          donativo_id: number
          variante_id?: number | null
          lote_id?: number | null
          cantidad: number
          precio_unitario?: number | null
        }
        Update: {
          detalle_donativo_id?: number
          donativo_id?: number
          variante_id?: number | null
          lote_id?: number | null
          cantidad?: number
          precio_unitario?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "detallesdonativos_donativo_id_fkey"
            columns: ["donativo_id"]
            isOneToOne: false
            referencedRelation: "donativos"
            referencedColumns: ["donativo_id"]
          },
          {
            foreignKeyName: "detallesdonativos_variante_id_fkey"
            columns: ["variante_id"]
            isOneToOne: false
            referencedRelation: "variantes_producto"
            referencedColumns: ["variante_id"]
          },
          {
            foreignKeyName: "detallesdonativos_lote_id_fkey"
            columns: ["lote_id"]
            isOneToOne: false
            referencedRelation: "lotes"
            referencedColumns: ["lote_id"]
          },
        ]
      }
      detallesventasbazar: {
        Row: {
          detalle_venta_id: number
          venta_id: number
          lote_id: number
          variante_id: number | null
          cantidad: number
          precio_unitario: number
        }
        Insert: {
          detalle_venta_id?: number
          venta_id: number
          lote_id: number
          variante_id?: number | null
          cantidad: number
          precio_unitario: number
        }
        Update: {
          detalle_venta_id?: number
          venta_id?: number
          lote_id?: number
          variante_id?: number | null
          cantidad?: number
          precio_unitario?: number
        }
        Relationships: [
          {
            foreignKeyName: "detallesventasbazar_venta_id_fkey"
            columns: ["venta_id"]
            isOneToOne: false
            referencedRelation: "ventasbazar"
            referencedColumns: ["venta_id"]
          },
          {
            foreignKeyName: "detallesventasbazar_lote_id_fkey"
            columns: ["lote_id"]
            isOneToOne: false
            referencedRelation: "lotes"
            referencedColumns: ["lote_id"]
          },
          {
            foreignKeyName: "detallesventasbazar_variante_id_fkey"
            columns: ["variante_id"]
            isOneToOne: false
            referencedRelation: "variantes_producto"
            referencedColumns: ["variante_id"]
          },
        ]
      }
      donadores: {
        Row: {
          donador_id: number
          nombre_completo: string
          correo: string | null
          telefono: string | null
          fecha_registro: string | null
          activo: boolean | null
          tipo_donador_id: number | null
          perfil_id: string | null
        }
        Insert: {
          donador_id?: number
          nombre_completo: string
          correo?: string | null
          telefono?: string | null
          fecha_registro?: string | null
          activo?: boolean | null
          tipo_donador_id?: number | null
          perfil_id?: string | null
        }
        Update: {
          donador_id?: number
          nombre_completo?: string
          correo?: string | null
          telefono?: string | null
          fecha_registro?: string | null
          activo?: boolean | null
          tipo_donador_id?: number | null
          perfil_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "donadores_tipo_donador_id_fkey"
            columns: ["tipo_donador_id"]
            isOneToOne: false
            referencedRelation: "tiposdonadores"
            referencedColumns: ["tipo_donador_id"]
          },
          {
            foreignKeyName: "donadores_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
        ]
      }
      donativos: {
        Row: {
          donativo_id: number
          donador_id: number | null
          fecha: string
          total: number | null
          observaciones: string | null
          usuario_id: string
        }
        Insert: {
          donativo_id?: number
          donador_id?: number | null
          fecha: string
          total?: number | null
          observaciones?: string | null
          usuario_id: string
        }
        Update: {
          donativo_id?: number
          donador_id?: number | null
          fecha?: string
          total?: number | null
          observaciones?: string | null
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "donativos_donador_id_fkey"
            columns: ["donador_id"]
            isOneToOne: false
            referencedRelation: "donadores"
            referencedColumns: ["donador_id"]
          },
          {
            foreignKeyName: "donativos_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lotes: {
        Row: {
          lote_id: number
          variante_id: number
          numero_lote: string | null
          fecha_vencimiento: string | null
          fecha_entrada: string
          donativo_id: number | null
          costo_unitario: number | null
          cantidad_original: number
          cantidad_actual: number
          almacen_id: number
          activo: boolean | null
          observaciones: string | null
        }
        Insert: {
          lote_id?: number
          variante_id: number
          numero_lote?: string | null
          fecha_vencimiento?: string | null
          fecha_entrada?: string
          donativo_id?: number | null
          costo_unitario?: number | null
          cantidad_original: number
          cantidad_actual: number
          almacen_id: number
          activo?: boolean | null
          observaciones?: string | null
        }
        Update: {
          lote_id?: number
          variante_id?: number
          numero_lote?: string | null
          fecha_vencimiento?: string | null
          fecha_entrada?: string
          donativo_id?: number | null
          costo_unitario?: number | null
          cantidad_original?: number
          cantidad_actual?: number
          almacen_id?: number
          activo?: boolean | null
          observaciones?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lotes_variante_id_fkey"
            columns: ["variante_id"]
            isOneToOne: false
            referencedRelation: "variantes_producto"
            referencedColumns: ["variante_id"]
          },
          {
            foreignKeyName: "lotes_donativo_id_fkey"
            columns: ["donativo_id"]
            isOneToOne: false
            referencedRelation: "donativos"
            referencedColumns: ["donativo_id"]
          },
          {
            foreignKeyName: "lotes_almacen_id_fkey"
            columns: ["almacen_id"]
            isOneToOne: false
            referencedRelation: "almacenes"
            referencedColumns: ["almacen_id"]
          },
        ]
      }
      marcas: {
        Row: {
          marca_id: number
          nombre: string
          descripcion: string | null
          activo: boolean | null
        }
        Insert: {
          marca_id?: number
          nombre: string
          descripcion?: string | null
          activo?: boolean | null
        }
        Update: {
          marca_id?: number
          nombre?: string
          descripcion?: string | null
          activo?: boolean | null
        }
        Relationships: []
      }
      movimientosinventario: {
        Row: {
          movimiento_inventario_id: number
          lote_id: number
          variante_id: number | null
          tipo_movimiento_id: number
          cantidad: number
          fecha: string
          usuario_id: string
          referencia: string | null
        }
        Insert: {
          movimiento_inventario_id?: number
          lote_id: number
          variante_id?: number | null
          tipo_movimiento_id: number
          cantidad: number
          fecha?: string
          usuario_id: string
          referencia?: string | null
        }
        Update: {
          movimiento_inventario_id?: number
          lote_id?: number
          variante_id?: number | null
          tipo_movimiento_id?: number
          cantidad?: number
          fecha?: string
          usuario_id?: string
          referencia?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "movimientosinventario_lote_id_fkey"
            columns: ["lote_id"]
            isOneToOne: false
            referencedRelation: "lotes"
            referencedColumns: ["lote_id"]
          },
          {
            foreignKeyName: "movimientosinventario_variante_id_fkey"
            columns: ["variante_id"]
            isOneToOne: false
            referencedRelation: "variantes_producto"
            referencedColumns: ["variante_id"]
          },
          {
            foreignKeyName: "movimientosinventario_tipo_movimiento_id_fkey"
            columns: ["tipo_movimiento_id"]
            isOneToOne: false
            referencedRelation: "tipos_movimiento"
            referencedColumns: ["tipo_movimiento_id"]
          },
          {
            foreignKeyName: "movimientosinventario_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
        ]
      }
      perfiles: {
        Row: {
          id: string
          nombre: string
          email: string
          rol_id: number
          activo: boolean | null
          telefono: string | null
          direccion: string | null
          fecha_registro: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          nombre: string
          email: string
          rol_id: number
          activo?: boolean | null
          telefono?: string | null
          direccion?: string | null
          fecha_registro?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          nombre?: string
          email?: string
          rol_id?: number
          activo?: boolean | null
          telefono?: string | null
          direccion?: string | null
          fecha_registro?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "perfiles_rol_id_fkey"
            columns: ["rol_id"]
            isOneToOne: false
            referencedRelation: "roles_usuario"
            referencedColumns: ["rol_id"]
          },
        ]
      }
      usuarios: {
        Row: {
          id: string
          nombre: string
          email: string
          rol_id: number
          activo: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          nombre: string
          email: string
          rol_id: number
          activo?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          nombre?: string
          email?: string
          rol_id?: number
          activo?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "usuarios_rol_id_fkey"
            columns: ["rol_id"]
            isOneToOne: false
            referencedRelation: "roles_usuario"
            referencedColumns: ["rol_id"]
          },
        ]
      }
      productos: {
        Row: {
          producto_id: number
          nombre: string
          categoria_producto_id: number
          descripcion: string | null
          activo: boolean | null
        }
        Insert: {
          producto_id?: number
          nombre: string
          categoria_producto_id: number
          descripcion?: string | null
          activo?: boolean | null
        }
        Update: {
          producto_id?: number
          nombre?: string
          categoria_producto_id?: number
          descripcion?: string | null
          activo?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "productos_categoria_producto_id_fkey"
            columns: ["categoria_producto_id"]
            isOneToOne: false
            referencedRelation: "categoriasproductos"
            referencedColumns: ["categoria_producto_id"]
          },
        ]
      }
      roles_usuario: {
        Row: {
          rol_id: number
          nombre: string
        }
        Insert: {
          rol_id?: number
          nombre: string
        }
        Update: {
          rol_id?: number
          nombre?: string
        }
        Relationships: []
      }
      tipos_movimiento: {
        Row: {
          tipo_movimiento_id: number
          nombre: string
          factor: number
        }
        Insert: {
          tipo_movimiento_id?: number
          nombre: string
          factor: number
        }
        Update: {
          tipo_movimiento_id?: number
          nombre?: string
          factor?: number
        }
        Relationships: []
      }
      tiposdonadores: {
        Row: {
          tipo_donador_id: number
          nombre: string
        }
        Insert: {
          tipo_donador_id?: number
          nombre: string
        }
        Update: {
          tipo_donador_id?: number
          nombre?: string
        }
        Relationships: []
      }
      unidadesmedida: {
        Row: {
          unidad_medida_id: number
          nombre: string
          abreviatura: string
        }
        Insert: {
          unidad_medida_id?: number
          nombre: string
          abreviatura: string
        }
        Update: {
          unidad_medida_id?: number
          nombre?: string
          abreviatura?: string
        }
        Relationships: []
      }
      variantes_producto: {
        Row: {
          variante_id: number
          producto_id: number
          marca_id: number | null
          presentacion: string | null
          codigo_barras: string | null
          unidad_medida_id: number
          precio_referencia: number | null
          activo: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          variante_id?: number
          producto_id: number
          marca_id?: number | null
          presentacion?: string | null
          codigo_barras?: string | null
          unidad_medida_id: number
          precio_referencia?: number | null
          activo?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          variante_id?: number
          producto_id?: number
          marca_id?: number | null
          presentacion?: string | null
          codigo_barras?: string | null
          unidad_medida_id?: number
          precio_referencia?: number | null
          activo?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "variantes_producto_producto_id_fkey"
            columns: ["producto_id"]
            isOneToOne: false
            referencedRelation: "productos"
            referencedColumns: ["producto_id"]
          },
          {
            foreignKeyName: "variantes_producto_marca_id_fkey"
            columns: ["marca_id"]
            isOneToOne: false
            referencedRelation: "marcas"
            referencedColumns: ["marca_id"]
          },
          {
            foreignKeyName: "variantes_producto_unidad_medida_id_fkey"
            columns: ["unidad_medida_id"]
            isOneToOne: false
            referencedRelation: "unidadesmedida"
            referencedColumns: ["unidad_medida_id"]
          },
        ]
      }
      ventasbazar: {
        Row: {
          venta_id: number
          fecha: string
          total: number
          usuario_id: string
          almacen_id: number
        }
        Insert: {
          venta_id?: number
          fecha: string
          total: number
          usuario_id: string
          almacen_id: number
        }
        Update: {
          venta_id?: number
          fecha?: string
          total?: number
          usuario_id?: string
          almacen_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "ventasbazar_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ventasbazar_almacen_id_fkey"
            columns: ["almacen_id"]
            isOneToOne: false
            referencedRelation: "almacenes"
            referencedColumns: ["almacen_id"]
          },
        ]
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
