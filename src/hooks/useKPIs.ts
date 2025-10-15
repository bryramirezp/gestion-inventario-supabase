import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

// Interfaces basadas en el esquema actualizado
export interface KPI extends Tables<'kpis'> {}

export interface KPIInsert extends TablesInsert<'kpis'> {}
export interface KPIUpdate extends TablesUpdate<'kpis'> {}

export const useKPIs = () => {
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch KPIs
  const fetchKPIs = async () => {
    setIsLoading(true);

    const { data, error } = await supabase
      .from('kpis')
      .select('*')
      .eq('activo', true)
      .order('nombre');

    if (error) {
      console.error('Error fetching KPIs:', error);
      setKpis([]);
    } else {
      setKpis(data || []);
    }

    setIsLoading(false);
  };

  // Crear KPI
  const createKPI = async (payload: KPIInsert) => {
    const { data, error } = await supabase
      .from('kpis')
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.error('Error creating KPI:', error);
      return { error };
    }

    if (data) {
      setKpis(prev => [...prev, data]);
    }

    return { data };
  };

  // Actualizar KPI
  const updateKPI = async (kpi_id: number, payload: KPIUpdate) => {
    const { data, error } = await supabase
      .from('kpis')
      .update(payload)
      .eq('kpi_id', kpi_id)
      .select()
      .single();

    if (error) {
      console.error('Error updating KPI:', error);
      return { error };
    }

    if (data) {
      setKpis(prev => prev.map(kpi =>
        kpi.kpi_id === kpi_id ? data : kpi
      ));
    }

    return { data };
  };

  // Eliminar KPI (desactivar)
  const deleteKPI = async (kpi_id: number) => {
    const { error } = await supabase
      .from('kpis')
      .update({ activo: false })
      .eq('kpi_id', kpi_id);

    if (error) {
      console.error('Error deleting KPI:', error);
      return { error };
    }

    // Remover de estado local
    setKpis(prev => prev.filter(kpi => kpi.kpi_id !== kpi_id));
    return { success: true };
  };

  // Calcular estadísticas
  const getKPIsStats = () => {
    const totalKPIs = kpis.length;
    const enMeta = kpis.filter(kpi => (kpi.valor_actual || 0) >= kpi.valor_meta).length;
    const requierenAtencion = kpis.filter(kpi => {
      const porcentaje = ((kpi.valor_actual || 0) / kpi.valor_meta) * 100;
      return porcentaje < 80;
    }).length;
    const promedioGeneral = kpis.length > 0
      ? Math.round((kpis.reduce((sum, kpi) => sum + ((kpi.valor_actual || 0) / kpi.valor_meta), 0) / kpis.length) * 100)
      : 0;

    return {
      totalKPIs,
      enMeta,
      requierenAtencion,
      promedioGeneral
    };
  };

  useEffect(() => {
    fetchKPIs();
  }, []);

  return {
    kpis,
    isLoading,
    fetchKPIs,
    createKPI,
    updateKPI,
    deleteKPI,
    getKPIsStats,
  };
};