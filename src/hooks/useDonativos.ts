import { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Interfaz principal de Donativo
export interface Donativo {
  donativo_id: number;
  donador_id: number | null;
  fecha: string;
  fecha_recepcion: string | null;
  usuario_id: string;  // Changed to string (UUID)
  porcentaje_descuento?: number;
  total: number | null;
  total_con_descuento?: number;
  observaciones?: string;
  recibido_por?: string;
  estado?: 'recibido' | 'procesado' | 'distribuido' | 'archivado';
  numero_factura?: string;
  metodo_entrega?: 'presencial' | 'delivery' | 'pickup';
}

// Interfaz para insertar un donativo
export interface DonativoInsert {
  donador_id?: number | null;
  usuario_id: string;  // Changed to string (UUID)
  total?: number | null;
  total_con_descuento?: number;
  porcentaje_descuento?: number;
  fecha: string;  // Made required to match DB schema
  fecha_recepcion?: string | null;
  observaciones?: string;
  recibido_por?: string;
  estado?: 'recibido' | 'procesado' | 'distribuido' | 'archivado';
  numero_factura?: string;
  metodo_entrega?: 'presencial' | 'delivery' | 'pickup';
}

// Interfaz para actualizar un donativo (todos opcionales)
export type DonativoUpdate = Partial<Omit<Donativo, 'donativo_id'>>;

// Interfaz de Donador
export interface Donador {
  donador_id: number;
  nombre_completo: string;
  correo?: string;
  telefono?: string;
  fecha_registro?: string;
  activo: boolean;
  tipo_donador_id: number;
  perfil_id?: string;
}

export const useDonativos = () => {
  const [donativos, setDonativos] = useState<Donativo[]>([]);
  const [donadores, setDonadores] = useState<Donador[]>([]);
  const [tiposMovimiento, setTiposMovimiento] = useState<any[]>([]);
  const [tiposDonadores, setTiposDonadores] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Transformación segura de los datos de Supabase - Memoizada
  const transformDonativo = useCallback((d: any): Donativo => ({
    donativo_id: d.donativo_id,
    donador_id: d.donador_id,
    fecha: d.fecha,
    fecha_recepcion: d.fecha_recepcion ?? null,
    usuario_id: d.usuario_id,
    porcentaje_descuento: d.porcentaje_descuento ?? 0,
    total: d.total ?? 0,
    total_con_descuento: d.total_con_descuento ?? 0,
    observaciones: d.observaciones ?? undefined,
    recibido_por: d.recibido_por ?? undefined,
    estado: d.estado || 'recibido',
    numero_factura: d.numero_factura ?? undefined,
    metodo_entrega: d.metodo_entrega ?? undefined,
  }), []);

  // Fetch Donadores - Optimizado con useCallback
  const fetchDonadores = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('donadores')
        .select('donador_id, nombre_completo, correo, telefono, tipo_donador_id, activo') // Select específico
        .eq('activo', true)
        .order('nombre_completo');
      if (error) throw error;
      setDonadores(data || []);
    } catch (error) {
      console.error('Error fetching donadores:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch Tipos Movimiento - Optimizado
  const fetchTiposMovimiento = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('tipos_movimiento')
        .select('tipo_movimiento_id, nombre, factor')
        .order('nombre');
      if (error) throw error;
      setTiposMovimiento(data || []);
    } catch (error) {
      console.error('Error fetching tipos movimiento:', error);
    }
  }, []);

  // Fetch Tipos Donadores - Optimizado
  const fetchTiposDonadores = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('tiposdonadores')
        .select('tipo_donador_id, nombre')
        .order('nombre');
      if (error) throw error;
      setTiposDonadores(data || []);
    } catch (error) {
      console.error('Error fetching tipos donadores:', error);
    }
  }, []);

  // Fetch Donativos - Optimizado
  const fetchDonativos = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('donativos')
        .select(`
          donativo_id,
          donador_id,
          fecha,
          total,
          observaciones,
          usuario_id,
          estado
        `) // Select específico para mejor performance
        .order('fecha', { ascending: false });
      if (error) throw error;
      setDonativos((data || []).map(transformDonativo));
    } catch (error) {
      console.error('Error fetching donativos:', error);
    } finally {
      setIsLoading(false);
    }
  }, [transformDonativo]);

  // Crear Donativo - Optimizado con useCallback
  const createDonativo = useCallback(async (payload: DonativoInsert) => {
    const payloadSeguro: DonativoInsert = {
      estado: 'recibido',
      porcentaje_descuento: 0,
      ...payload,
    };

    try {
      const { data, error } = await supabase.from('donativos').insert(payloadSeguro).select();
      if (error) throw error;

      const nuevosDonativos = (data || []).map(transformDonativo);
      setDonativos(prev => [...prev, ...nuevosDonativos]);
      return { data: nuevosDonativos };
    } catch (error) {
      console.error('Error creating donativo:', error);
      return { error };
    }
  }, [transformDonativo]);

  // Actualizar Donativo
  const updateDonativo = async (donativo_id: number, payload: DonativoUpdate) => {
    const { data, error } = await supabase
      .from('donativos')
      .update(payload)
      .eq('donativo_id', donativo_id)
      .select();

    if (error) return { error };
    if (!data || !data[0]) return { error: 'Donativo no encontrado' };

    const donativoActualizado = transformDonativo(data[0]);
    setDonativos(prev => prev.map(d => (d.donativo_id === donativo_id ? donativoActualizado : d)));
    return { data: donativoActualizado };
  };

  // Eliminar Donativo
  const deleteDonativo = async (donativo_id: number) => {
    const { error } = await supabase.from('donativos').delete().eq('donativo_id', donativo_id);
    if (!error) setDonativos(prev => prev.filter(d => d.donativo_id !== donativo_id));
    return { error };
  };

  // Crear Donador
  const createDonador = useCallback(async (donadorData: {
    nombre_completo: string;
    correo?: string;
    telefono?: string;
    tipo_donador_id: number;
  }) => {
    try {
      const { data, error } = await supabase
        .from('donadores')
        .insert({
          nombre_completo: donadorData.nombre_completo,
          correo: donadorData.correo || null,
          telefono: donadorData.telefono || null,
          tipo_donador_id: donadorData.tipo_donador_id,
          activo: true
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setDonadores(prev => [...prev, data]);
      }

      return { data };
    } catch (error) {
      console.error('Error creating donador:', error);
      return { error };
    }
  }, []);

  // Cambiar estado activo/inactivo de donador
  const toggleDonadorStatus = useCallback(async (donadorId: number) => {
    try {
      // Primero obtener el estado actual
      const donador = donadores.find(d => d.donador_id === donadorId);
      if (!donador) {
        return { error: { message: 'Donador no encontrado' } };
      }

      const nuevoEstado = !donador.activo;

      const { data, error } = await supabase
        .from('donadores')
        .update({ activo: nuevoEstado })
        .eq('donador_id', donadorId)
        .select()
        .single();

      if (error) throw error;

      // Actualizar estado local
      setDonadores(prev =>
        prev.map(d =>
          d.donador_id === donadorId
            ? { ...d, activo: nuevoEstado }
            : d
        )
      );

      return { data };
    } catch (error) {
      console.error('Error toggling donador status:', error);
      return { error };
    }
  }, [donadores]);

  // Eliminar donador completamente
  const deleteDonador = useCallback(async (donadorId: number) => {
    try {
      const { error } = await supabase
        .from('donadores')
        .delete()
        .eq('donador_id', donadorId);

      if (error) throw error;

      // Remover de estado local
      setDonadores(prev => prev.filter(d => d.donador_id !== donadorId));

      return { success: true };
    } catch (error) {
      console.error('Error deleting donador:', error);
      return { error };
    }
  }, []);

  // Registrar Donativo Completo - Adaptado al nuevo esquema con lotes
  const registrarDonativoCompleto = useCallback(async (donativoData: {
    donador_id: number;
    almacen_id: number;
    fecha: string;
    observaciones?: string;
    usuario_id: string;
    productos: Array<{
      variante_id: number;
      cantidad: number;
      precio_unitario: number;
    }>;
  }) => {
    // Validación inicial
    if (!donativoData.productos.length) {
      return { error: { message: 'Debe incluir al menos un producto' } };
    }

    try {
      // 1. Calcular el total
      const total = donativoData.productos.reduce(
        (sum, prod) => sum + (prod.cantidad * prod.precio_unitario),
        0
      );

      // 2. Insertar el donativo
      const { data: donativo, error: donativoError } = await supabase
        .from('donativos')
        .insert({
          donador_id: donativoData.donador_id,
          fecha: donativoData.fecha,
          total: total,
          observaciones: donativoData.observaciones,
          usuario_id: donativoData.usuario_id
        })
        .select('donativo_id, donador_id, fecha, total, usuario_id')
        .single();

      if (donativoError) throw donativoError;

      // 3. Crear lotes para cada variante
      const lotesPromises = donativoData.productos.map(async (prod) => {
        const { data: lote, error: loteError } = await supabase
          .from('lotes')
          .insert({
            variante_id: prod.variante_id,
            numero_lote: `DON-${donativo.donativo_id}-${prod.variante_id}`,
            fecha_entrada: donativoData.fecha,
            donativo_id: donativo.donativo_id,
            costo_unitario: prod.precio_unitario,
            cantidad_original: prod.cantidad,
            cantidad_actual: prod.cantidad,
            almacen_id: donativoData.almacen_id
          })
          .select('lote_id')
          .single();

        if (loteError) throw loteError;
        return { ...prod, lote_id: lote.lote_id };
      });

      const lotesConIds = await Promise.all(lotesPromises);

      // 4. Insertar detalles del donativo
      const detalles = lotesConIds.map(prod => ({
        donativo_id: donativo.donativo_id,
        variante_id: prod.variante_id,
        lote_id: prod.lote_id,
        cantidad: prod.cantidad,
        precio_unitario: prod.precio_unitario
      }));

      const { error: detallesError } = await supabase
        .from('detallesdonativos')
        .insert(detalles);

      if (detallesError) throw detallesError;

      // 5. Buscar tipo de movimiento "Entrada Donativo"
      let tipoMovimientoId = tiposMovimiento.find(tm => tm.nombre === 'Entrada Donativo')?.tipo_movimiento_id;

      if (!tipoMovimientoId) {
        const { data: tipoMovimiento, error: tipoError } = await supabase
          .from('tipos_movimiento')
          .select('tipo_movimiento_id')
          .eq('nombre', 'Entrada Donativo')
          .single();

        if (tipoError || !tipoMovimiento) {
          throw new Error('Tipo de movimiento "Entrada Donativo" no encontrado');
        }
        tipoMovimientoId = tipoMovimiento.tipo_movimiento_id;
      }

      // 6. Insertar movimientos de inventario
      const movimientos = lotesConIds.map(prod => ({
        lote_id: prod.lote_id,
        variante_id: prod.variante_id,
        tipo_movimiento_id: tipoMovimientoId,
        cantidad: prod.cantidad,
        fecha: new Date().toISOString(),
        usuario_id: donativoData.usuario_id,
        referencia: `DONATIVO-${donativo.donativo_id}`
      }));

      const { error: movimientosError } = await supabase
        .from('movimientosinventario')
        .insert(movimientos);

      if (movimientosError) throw movimientosError;

      // 7. Actualizar estado local
      const nuevoDonativo: Donativo = {
        donativo_id: donativo.donativo_id,
        donador_id: donativoData.donador_id,
        fecha: donativoData.fecha,
        fecha_recepcion: null,
        usuario_id: donativoData.usuario_id,
        porcentaje_descuento: 0,
        total: total,
        total_con_descuento: total,
        observaciones: donativoData.observaciones,
        estado: 'recibido'
      };

      setDonativos(prev => [nuevoDonativo, ...prev]);

      return { data: donativo };

    } catch (error) {
      console.error('Error in registrarDonativoCompleto:', error);
      return {
        error: {
          message: error instanceof Error ? error.message : 'Error inesperado al registrar el donativo'
        }
      };
    }
  }, [tiposMovimiento]);

  // Totales - Optimizados con useMemo
  const totalDonativos = useMemo(() =>
    donativos.reduce((acc, d) => acc + (d.total || 0), 0),
    [donativos]
  );

  const totalConDescuento = useMemo(() =>
    donativos.reduce((acc, d) => acc + (d.total_con_descuento || 0), 0),
    [donativos]
  );

  useEffect(() => {
    fetchDonadores();
    fetchDonativos();
    fetchTiposMovimiento();
    fetchTiposDonadores();
  }, []);

  return {
    donativos,
    donadores,
    tiposMovimiento,
    tiposDonadores,
    isLoading,
    fetchDonativos,
    fetchTiposMovimiento,
    fetchTiposDonadores,
    createDonativo,
    createDonador,
    updateDonativo,
    deleteDonativo,
    registrarDonativoCompleto,
    toggleDonadorStatus,
    deleteDonador,
    totalDonativos,
    totalConDescuento,
  };
};
