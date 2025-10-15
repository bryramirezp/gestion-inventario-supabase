import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

// Interfaces basadas en el esquema actualizado con lotes y variantes
export interface ConsumoCocina extends Tables<'consumoscocina'> {
  lote?: Partial<Tables<'lotes'>>;
  variante?: Partial<Tables<'variantes_producto'>>;
  responsable?: Partial<Tables<'perfiles'>>;
  aprobador?: Partial<Tables<'perfiles'>>;
}

export interface ConsumoCocinaInsert extends TablesInsert<'consumoscocina'> {}
export interface ConsumoCocinaUpdate extends TablesUpdate<'consumoscocina'> {}

export const useConsumosCocina = () => {
  const [consumos, setConsumos] = useState<ConsumoCocina[]>([]);
  const [lotes, setLotes] = useState<Tables<'lotes'>[]>([]);
  const [variantes, setVariantes] = useState<Tables<'variantes_producto'>[]>([]);
  const [usuarios, setUsuarios] = useState<Tables<'perfiles'>[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Transformación para incluir datos relacionados
  const transformConsumo = (consumo: Tables<'consumoscocina'>): ConsumoCocina => ({
    ...consumo,
    lote: lotes.find(l => l.lote_id === consumo.lote_id),
    variante: variantes.find(v => v.variante_id === consumo.variante_id),
    responsable: usuarios.find(u => u.id === consumo.responsable_id),
    aprobador: consumo.aprobado_por ? usuarios.find(u => u.id === consumo.aprobado_por) : undefined,
  });

  // Fetch Lotes activos
  const fetchLotes = async () => {
    const { data, error } = await supabase
      .from('lotes')
      .select('*')
      .eq('activo', true)
      .order('fecha_entrada', { ascending: false });

    if (error) {
      console.error('Error fetching lotes:', error);
      return [];
    }
    return data || [];
  };

  // Fetch Variantes activas
  const fetchVariantes = async () => {
    const { data, error } = await supabase
      .from('variantes_producto')
      .select('*')
      .eq('activo', true)
      .order('productos.nombre');

    if (error) {
      console.error('Error fetching variantes:', error);
      return [];
    }
    return data || [];
  };

  // Fetch Usuarios activos
  const fetchUsuarios = async () => {
    const { data, error } = await supabase
      .from('perfiles')
      .select('*')
      .eq('activo', true)
      .order('nombre');

    if (error) {
      console.error('Error fetching usuarios:', error);
      return [];
    }
    return data || [];
  };

  // Fetch Consumos de Cocina
  const fetchConsumos = async () => {
    setIsLoading(true);

    // Fetch datos relacionados
    const [lotesData, variantesData, users] = await Promise.all([
      fetchLotes(),
      fetchVariantes(),
      fetchUsuarios()
    ]);

    setLotes(lotesData);
    setVariantes(variantesData);
    setUsuarios(users);

    // Fetch consumos básicos primero
    const { data, error } = await supabase
      .from('consumoscocina')
      .select('*')
      .order('fecha', { ascending: false })
      .order('consumo_cocina_id', { ascending: false });

    if (error) {
      console.error('Error fetching consumos:', error);
      setConsumos([]);
    } else {
      // Transformar datos con lookups locales
      const consumosTransformados = (data || []).map(transformConsumo);
      setConsumos(consumosTransformados);
    }

    setIsLoading(false);
  };

  // Crear Consumo de Cocina
  const createConsumo = async (payload: ConsumoCocinaInsert) => {
    const { data, error } = await supabase
      .from('consumoscocina')
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.error('Error creating consumo:', error);
      return { error };
    }

    if (data) {
      const nuevoConsumo = transformConsumo(data);
      setConsumos(prev => [nuevoConsumo, ...prev]);
    }

    return { data };
  };

  // Actualizar Consumo
  const updateConsumo = async (consumo_cocina_id: number, payload: ConsumoCocinaUpdate) => {
    const { data, error } = await supabase
      .from('consumoscocina')
      .update(payload)
      .eq('consumo_cocina_id', consumo_cocina_id)
      .select()
      .single();

    if (error) {
      console.error('Error updating consumo:', error);
      return { error };
    }

    if (data) {
      const consumoActualizado = transformConsumo(data);
      setConsumos(prev => prev.map(c =>
        c.consumo_cocina_id === consumo_cocina_id ? consumoActualizado : c
      ));
    }

    return { data };
  };

  // Aprobar Consumo
  const aprobarConsumo = async (consumo_cocina_id: number, aprobado_por: string, firma_texto?: string) => {
    return updateConsumo(consumo_cocina_id, {
      aprobado_por,
      firma_texto: firma_texto || 'Aprobado'
    });
  };

  // Eliminar Consumo
  const deleteConsumo = async (consumo_cocina_id: number) => {
    const { error } = await supabase
      .from('consumoscocina')
      .delete()
      .eq('consumo_cocina_id', consumo_cocina_id);

    if (error) {
      console.error('Error deleting consumo:', error);
      return { error };
    }

    setConsumos(prev => prev.filter(c => c.consumo_cocina_id !== consumo_cocina_id));
    return { success: true };
  };

  // Obtener consumos por fecha
  const getConsumosByFecha = (fecha: string): ConsumoCocina[] => {
    return consumos.filter(c => c.fecha === fecha);
  };

  // Obtener consumos pendientes de aprobación
  const getConsumosPendientes = (): ConsumoCocina[] => {
    return consumos.filter(c => !c.aprobado_por);
  };

  // Obtener consumos por responsable
  const getConsumosByResponsable = (responsable_id: string): ConsumoCocina[] => {
    return consumos.filter(c => c.responsable_id === responsable_id);
  };

  // Calcular total de consumo por variante en un período
  const getTotalConsumoVariante = (
    variante_id: number,
    fechaInicio: string,
    fechaFin: string
  ): number => {
    return consumos
      .filter(c =>
        c.variante_id === variante_id &&
        c.fecha >= fechaInicio &&
        c.fecha <= fechaFin &&
        c.aprobado_por // Solo consumos aprobados
      )
      .reduce((total, c) => total + c.cantidad, 0);
  };

  useEffect(() => {
    fetchConsumos();
  }, []);

  return {
    consumos,
    lotes,
    variantes,
    usuarios,
    isLoading,
    fetchConsumos,
    createConsumo,
    updateConsumo,
    aprobarConsumo,
    deleteConsumo,
    getConsumosByFecha,
    getConsumosPendientes,
    getConsumosByResponsable,
    getTotalConsumoVariante,
  };
};