import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

// Interfaces basadas en el esquema actualizado
export interface Almacen extends Tables<'warehouses'> {}

export interface AlmacenInsert extends TablesInsert<'warehouses'> {}
export interface AlmacenUpdate extends TablesUpdate<'warehouses'> {}

export const useAlmacenes = () => {
  const [almacenes, setAlmacenes] = useState<Almacen[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch Almacenes
  const fetchAlmacenes = async () => {
    setIsLoading(true);

    const { data, error } = await supabase
      .from('warehouses')
      .select('*')
      .order('warehouse_name');

    if (error) {
      console.error('Error fetching almacenes:', error);
      setAlmacenes([]);
    } else {
      setAlmacenes(data || []);
    }

    setIsLoading(false);
  };

  // Crear Almacén
  const createAlmacen = async (payload: AlmacenInsert) => {
    const { data, error } = await supabase
      .from('warehouses')
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.error('Error creating almacen:', error);
      return { error };
    }

    if (data) {
      setAlmacenes(prev => [...prev, data]);
    }

    return { data };
  };

  // Actualizar Almacén
  const updateAlmacen = async (almacen_id: number, payload: AlmacenUpdate) => {
    const { data, error } = await supabase
      .from('warehouses')
      .update(payload)
      .eq('warehouse_id', almacen_id)
      .select()
      .single();

    if (error) {
      console.error('Error updating almacen:', error);
      return { error };
    }

    if (data) {
      setAlmacenes(prev => prev.map(a =>
        a.warehouse_id === almacen_id ? data : a
      ));
    }

    return { data };
  };

  // Eliminar Almacén completamente de la base de datos
  const deleteAlmacen = async (almacen_id: number) => {
    const { error } = await supabase
      .from('warehouses')
      .delete()
      .eq('warehouse_id', almacen_id);

    if (error) {
      console.error('Error deleting almacen:', error);
      return { error };
    }

    // Remover de estado local
    setAlmacenes(prev => prev.filter(a => a.warehouse_id !== almacen_id));
    return { success: true };
  };

  // Obtener estadísticas
  const getStats = () => {
    const total = almacenes.length;
    const activos = almacenes.filter(a => a.is_active).length;
    const inactivos = total - activos;

    return { total, activos, inactivos };
  };

  useEffect(() => {
    fetchAlmacenes();
  }, []);

  return {
    almacenes,
    isLoading,
    fetchAlmacenes,
    createAlmacen,
    updateAlmacen,
    deleteAlmacen,
    getStats,
  };
};