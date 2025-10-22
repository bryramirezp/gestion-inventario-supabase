import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol_id: number;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface UsuarioInsert {
  nombre: string;
  email: string;
  rol_id: number;
  activo?: boolean;
}

export interface UsuarioUpdate {
  nombre?: string;
  email?: string;
  rol_id?: number;
  activo?: boolean;
}

export const useUsuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all users from users table (as per current database schema)
  const fetchUsuarios = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching usuarios:', error);
        setUsuarios([]);
      } else {
        // Transform data to match expected interface
        const transformedData = (data || []).map(user => ({
          id: user.user_id,
          nombre: user.full_name,
          email: '', // Email not stored in users table, comes from auth.users
          rol_id: user.role_id || 3,
          activo: user.is_active,
          created_at: user.created_at,
          updated_at: user.updated_at
        }));
        setUsuarios(transformedData);
      }
    } catch (error) {
      console.error('Error fetching usuarios:', error);
      setUsuarios([]);
    }
    setIsLoading(false);
  };

  // Create new user (Note: In real implementation, this would need to create auth user first)
  const createUsuario = async (usuarioData: UsuarioInsert) => {
    try {
      // For now, we'll simulate creating a user
      // In real implementation, you'd need to:
      // 1. Create auth user with Supabase Auth
      // 2. Then create profile record
      console.log('Creating usuario:', usuarioData);

      // Insert into users table
      const { data, error } = await supabase
        .from('users')
        .insert({
          user_id: `temp-${Date.now()}`, // This should be the actual auth user ID
          full_name: usuarioData.nombre,
          role_id: usuarioData.rol_id,
          is_active: usuarioData.activo ?? true
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating usuario:', error);
        return { error };
      }

      await fetchUsuarios();
      return { data };
    } catch (error) {
      console.error('Error creating usuario:', error);
      return { error };
    }
  };

  // Update existing user
  const updateUsuario = async (id: string, usuarioData: UsuarioUpdate) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          full_name: usuarioData.nombre,
          role_id: usuarioData.rol_id,
          is_active: usuarioData.activo
        })
        .eq('user_id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating usuario:', error);
        return { error };
      }

      // Update local state
      setUsuarios(prev =>
        prev.map(user =>
          user.id === id ? { ...user, ...usuarioData } : user
        )
      );
      return { data };
    } catch (error) {
      console.error('Error updating usuario:', error);
      return { error };
    }
  };

  // Toggle user active status
  const toggleUsuarioStatus = async (id: string, currentStatus: boolean) => {
    return updateUsuario(id, { activo: !currentStatus });
  };

  // Delete user (soft delete by setting activo = false)
  const deleteUsuario = async (id: string) => {
    return updateUsuario(id, { activo: false });
  };

  // Get role name from rol_id (based on roles_usuario table)
  const getRoleName = (rolId: number): string => {
    switch (rolId) {
      case 1: return 'Administrador'; // Based on the schema, rol_id=1 is "Administrador"
      case 2: return 'Super Admin';
      case 3: return 'Inventario';
      case 4: return 'Contabilidad';
      case 5: return 'Recepción';
      default: return 'Desconocido';
    }
  };

  // Get role badge color
  const getRoleBadgeColor = (rolId: number): string => {
    switch (rolId) {
      case 1: return 'bg-red-100 text-red-800';
      case 2: return 'bg-blue-100 text-blue-800';
      case 3: return 'bg-green-100 text-green-800';
      case 4: return 'bg-yellow-100 text-yellow-800';
      case 5: return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get statistics
  const getStats = () => {
    const total = usuarios.length;
    const activos = usuarios.filter(u => u.activo).length;
    const admins = usuarios.filter(u => u.rol_id <= 2).length;
    const inactivos = total - activos;

    return { total, activos, admins, inactivos };
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  return {
    usuarios,
    isLoading,
    fetchUsuarios,
    createUsuario,
    updateUsuario,
    toggleUsuarioStatus,
    deleteUsuario,
    getRoleName,
    getRoleBadgeColor,
    getStats
  };
};