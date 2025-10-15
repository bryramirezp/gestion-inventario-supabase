// API utilities for Supabase integration
// This file contains the fetch functions that would connect to Supabase
// Replace with actual Supabase client configuration

const API_BASE_URL = '/api'; // Replace with your Supabase URL

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

// Mock API functions - Replace with real Supabase calls
export const api = {
  // Authentication
  async login(email: string, password: string): Promise<ApiResponse<{ token: string; user: any }>> {
    // Mock implementation - Replace with Supabase Auth
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUsers: Record<string, any> = {
      'admin@lagranfamilia.org': {
        usuario_id: 1,
        nombre: 'Administrador',
        email: 'admin@lagranfamilia.org',
        rol: 'admin'
      },
      'lorena@lagranfamilia.org': {
        usuario_id: 2,
        nombre: 'Lorena Martínez',
        email: 'lorena@lagranfamilia.org',
        rol: 'admin'
      }
    };

    if (email in mockUsers && password === '123456') {
      const user = mockUsers[email];
      const token = btoa(JSON.stringify({
        ...user,
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24),
        iat: Math.floor(Date.now() / 1000)
      }));

      return { success: true, data: { token, user } };
    }

    return { success: false, error: 'Credenciales incorrectas' };
  },

  // Productos
  async getProductos(filters?: { almacen?: string; categoria?: string }) {
    // Mock data - Replace with Supabase query
    return {
      success: true,
      data: [
        {
          producto_id: 1,
          nombre: 'Arroz Blanco',
          categoria: 'Granos',
          stock: 45.5,
          unidad_medida: 'kg',
          precio_referencia: 2.50,
          fecha_caducidad: '2024-12-15',
          activo: true
        }
        // Add more mock data as needed
      ]
    };
  },

  // Donativos
  async getDonativos(filters?: { fecha_inicio?: string; fecha_fin?: string }) {
    // Mock data - Replace with Supabase query
    return {
      success: true,
      data: [
        {
          donativo_id: 1,
          donador_id: 1,
          fecha: '2024-09-24',
          total: 2450.50,
          usuario_id: 2,
          observaciones: 'Donativo de empresa local'
        }
      ]
    };
  },

  // Movimientos de inventario
  async getMovimientosInventario(producto_id?: number) {
    // Mock data - Replace with Supabase query
    return {
      success: true,
      data: [
        {
          movimiento_inventario_id: 1,
          producto_id: 1,
          tipo_movimiento: 'entrada',
          cantidad: 50,
          fecha: '2024-09-24',
          usuario_id: 2,
          observaciones: 'Entrada por donativo'
        }
      ]
    };
  },

  // Consumos de cocina
  async getConsumosCocina(fecha?: string) {
    // Mock data - Replace with Supabase query
    return {
      success: true,
      data: [
        {
          consumo_cocina_id: 1,
          producto_id: 1,
          cantidad: 5.0,
          fecha: '2024-09-24',
          responsable_id: 3,
          firmado_por_id: 2,
          observaciones: 'Para preparar 200 raciones'
        }
      ]
    };
  },

  // Usuarios
  async getUsuarios() {
    // Mock data - Replace with Supabase query
    return {
      success: true,
      data: [
        {
          usuario_id: 1,
          nombre: 'Administrador',
          email: 'admin@lagranfamilia.org',
          rol: 'admin',
          activo: true
        },
        {
          usuario_id: 2,
          nombre: 'Lorena Martínez',
          email: 'lorena@lagranfamilia.org',
          rol: 'admin',
          activo: true
        }
      ]
    };
  },

  // Almacenes
  async getAlmacenes() {
    // Mock data - Replace with Supabase query
    return {
      success: true,
      data: [
        {
          almacen_id: 1,
          nombre: 'Almacén Principal',
          descripcion: 'Almacén principal para productos secos',
          activo: true
        },
        {
          almacen_id: 2,
          nombre: 'Almacén Refrigerados',
          descripcion: 'Para productos que requieren refrigeración',
          activo: true
        }
      ]
    };
  },

  // Generic fetch with auth
  async fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem('lagranfamilia_token');
    
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('API Error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
};