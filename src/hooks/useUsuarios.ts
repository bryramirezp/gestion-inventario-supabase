import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

export interface Usuario extends Tables<'perfiles'> {}

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

  // Fetch all users from perfiles table
  const fetchUsuarios = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('perfiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching usuarios:', error);
        setUsuarios([]);
      } else {
        setUsuarios(data || []);
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

      // Simulate success for now
      await fetchUsuarios();
      return { data: { ...usuarioData, id: 'temp-id', created_at: new Date().toISOString() } };
    } catch (error) {
      console.error('Error creating usuario:', error);
      return { error };
    }
  };

  // Update existing user
  const updateUsuario = async (id: string, usuarioData: UsuarioUpdate) => {
    try {
      const { data, error } = await supabase
        .from('perfiles')
        .update(usuarioData)
        .eq('id', id)
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