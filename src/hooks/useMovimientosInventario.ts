import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

// Interfaces basadas en el esquema actualizado con lotes y variantes
export interface MovimientoInventario extends Tables<'movimientosinventario'> {
  lote?: Tables<'lotes'>;
  variante?: Tables<'variantes_producto'>;
  tipo_movimiento?: Tables<'tipos_movimiento'>;
  almacen?: Tables<'almacenes'>;
  usuario?: Tables<'perfiles'>;
}

export interface TipoMovimiento extends Tables<'tipos_movimiento'> {}

export interface MovimientoInventarioInsert extends TablesInsert<'movimientosinventario'> {}
export interface MovimientoInventarioUpdate extends TablesUpdate<'movimientosinventario'> {}

export const useMovimientosInventario = () => {
  const [movimientos, setMovimientos] = useState<MovimientoInventario[]>([]);
  const [lotes, setLotes] = useState<Tables<'lotes'>[]>([]);
  const [variantes, setVariantes] = useState<Tables<'variantes_producto'>[]>([]);
  const [tiposMovimiento, setTiposMovimiento] = useState<TipoMovimiento[]>([]);
  const [almacenes, setAlmacenes] = useState<Tables<'almacenes'>[]>([]);
  const [usuarios, setUsuarios] = useState<Tables<'perfiles'>[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Transformación para incluir datos relacionados
  const transformMovimiento = (movimiento: Tables<'movimientosinventario'>): MovimientoInventario => ({
    ...movimiento,
    lote: lotes.find(l => l.lote_id === movimiento.lote_id),
    variante: variantes.find(v => v.variante_id === movimiento.variante_id),
    tipo_movimiento: tiposMovimiento.find(t => t.tipo_movimiento_id === movimiento.tipo_movimiento_id),
    almacen: almacenes.find(a => a.almacen_id === movimiento.lote_id ? lotes.find(l => l.lote_id === movimiento.lote_id)?.almacen_id : undefined),
    usuario: usuarios.find(u => u.id === movimiento.usuario_id),
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

  // Fetch Tipos de Movimiento
  const fetchTiposMovimiento = async () => {
    const { data, error } = await supabase
      .from('tipos_movimiento')
      .select('*')
      .order('nombre');

    if (error) {
      console.error('Error fetching tipos movimiento:', error);
      return [];
    }
    return data || [];
  };

  // Fetch Almacenes activos
  const fetchAlmacenes = async () => {
    const { data, error } = await supabase
      .from('almacenes')
      .select('*')
      .eq('activo', true)
      .order('nombre');

    if (error) {
      console.error('Error fetching almacenes:', error);
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

  // Fetch Movimientos de Inventario
  const fetchMovimientos = async (filtros?: {
    variante_id?: number;
    lote_id?: number;
    almacen_id?: number;
    tipo_movimiento_id?: number;
    fecha_desde?: string;
    fecha_hasta?: string;
  }) => {
    setIsLoading(true);

    // Fetch datos relacionados
    const [lotesData, variantesData, tipos, alms, users] = await Promise.all([
      fetchLotes(),
      fetchVariantes(),
      fetchTiposMovimiento(),
      fetchAlmacenes(),
      fetchUsuarios()
    ]);

    setLotes(lotesData);
    setVariantes(variantesData);
    setTiposMovimiento(tipos);
    setAlmacenes(alms);
    setUsuarios(users);

    // Construir query con filtros
    let query = supabase
      .from('movimientosinventario')
      .select('*')
      .order('fecha', { ascending: false })
      .order('movimiento_inventario_id', { ascending: false });

    if (filtros?.variante_id) {
      query = query.eq('variante_id', filtros.variante_id);
    }
    if (filtros?.lote_id) {
      query = query.eq('lote_id', filtros.lote_id);
    }
    if (filtros?.tipo_movimiento_id) {
      query = query.eq('tipo_movimiento_id', filtros.tipo_movimiento_id);
    }
    if (filtros?.fecha_desde) {
      query = query.gte('fecha', filtros.fecha_desde);
    }
    if (filtros?.fecha_hasta) {
      query = query.lte('fecha', filtros.fecha_hasta);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching movimientos:', error);
      setMovimientos([]);
    } else {
      const movimientosTransformados = (data || []).map(transformMovimiento);
      setMovimientos(movimientosTransformados);
    }

    setIsLoading(false);
  };

  // Crear Movimiento de Inventario
  const createMovimiento = async (payload: MovimientoInventarioInsert) => {
    const { data, error } = await supabase
      .from('movimientosinventario')
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.error('Error creating movimiento:', error);
      return { error };
    }

    if (data) {
      const nuevoMovimiento = transformMovimiento(data);
      setMovimientos(prev => [nuevoMovimiento, ...prev]);
    }

    return { data };
  };

  // Actualizar Movimiento
  const updateMovimiento = async (
    movimiento_inventario_id: number,
    payload: MovimientoInventarioUpdate
  ) => {
    const { data, error } = await supabase
      .from('movimientosinventario')
      .update(payload)
      .eq('movimiento_inventario_id', movimiento_inventario_id)
      .select()
      .single();

    if (error) {
      console.error('Error updating movimiento:', error);
      return { error };
    }

    if (data) {
      const movimientoActualizado = transformMovimiento(data);
      setMovimientos(prev => prev.map(m =>
        m.movimiento_inventario_id === movimiento_inventario_id ? movimientoActualizado : m
      ));
    }

    return { data };
  };

  // Eliminar Movimiento
  const deleteMovimiento = async (movimiento_inventario_id: number) => {
    const { error } = await supabase
      .from('movimientosinventario')
      .delete()
      .eq('movimiento_inventario_id', movimiento_inventario_id);

    if (error) {
      console.error('Error deleting movimiento:', error);
      return { error };
    }

    setMovimientos(prev => prev.filter(m => m.movimiento_inventario_id !== movimiento_inventario_id));
    return { success: true };
  };

  // Crear movimiento de entrada (factor = 1)
  const crearEntrada = async (
    lote_id: number,
    variante_id: number,
    cantidad: number,
    usuario_id: string,
    referencia?: string
  ) => {
    // Buscar tipo de movimiento de entrada (factor = 1)
    const tipoEntrada = tiposMovimiento.find(t => t.factor === 1);
    if (!tipoEntrada) {
      return { error: 'Tipo de movimiento de entrada no encontrado' };
    }

    return createMovimiento({
      lote_id,
      variante_id,
      tipo_movimiento_id: tipoEntrada.tipo_movimiento_id,
      cantidad,
      usuario_id,
      referencia
    });
  };

  // Crear movimiento de salida (factor = -1)
  const crearSalida = async (
    lote_id: number,
    variante_id: number,
    cantidad: number,
    usuario_id: string,
    referencia?: string
  ) => {
    // Buscar tipo de movimiento de salida (factor = -1)
    const tipoSalida = tiposMovimiento.find(t => t.factor === -1);
    if (!tipoSalida) {
      return { error: 'Tipo de movimiento de salida no encontrado' };
    }

    return createMovimiento({
      lote_id,
      variante_id,
      tipo_movimiento_id: tipoSalida.tipo_movimiento_id,
      cantidad,
      usuario_id,
      referencia
    });
  };

  // Obtener movimientos por variante
  const getMovimientosByVariante = (variante_id: number): MovimientoInventario[] => {
    return movimientos.filter(m => m.variante_id === variante_id);
  };

  // Obtener movimientos por lote
  const getMovimientosByLote = (lote_id: number): MovimientoInventario[] => {
    return movimientos.filter(m => m.lote_id === lote_id);
  };

  // Calcular stock actual de una variante en un lote
  const calcularStockActual = (lote_id: number): number => {
    return movimientos
      .filter(m => m.lote_id === lote_id)
      .reduce((stock, m) => {
        const factor = tiposMovimiento.find(t => t.tipo_movimiento_id === m.tipo_movimiento_id)?.factor || 0;
        return stock + (m.cantidad * factor);
      }, 0);
  };

  // Obtener resumen de movimientos por período
  const getResumenMovimientos = (
    fechaInicio: string,
    fechaFin: string
  ): { entradas: number; salidas: number; neto: number } => {
    const movimientosPeriodo = movimientos.filter(m =>
      m.fecha >= fechaInicio && m.fecha <= fechaFin
    );

    let entradas = 0;
    let salidas = 0;

    movimientosPeriodo.forEach(m => {
      const factor = tiposMovimiento.find(t => t.tipo_movimiento_id === m.tipo_movimiento_id)?.factor || 0;
      if (factor > 0) {
        entradas += m.cantidad;
      } else if (factor < 0) {
        salidas += Math.abs(m.cantidad * factor);
      }
    });

    return {
      entradas,
      salidas,
      neto: entradas - salidas
    };
  };

  useEffect(() => {
    fetchMovimientos();
  }, []);

  return {
    movimientos,
    lotes,
    variantes,
    tiposMovimiento,
    almacenes,
    usuarios,
    isLoading,
    fetchMovimientos,
    createMovimiento,
    updateMovimiento,
    deleteMovimiento,
    crearEntrada,
    crearSalida,
    getMovimientosByVariante,
    getMovimientosByLote,
    calcularStockActual,
    getResumenMovimientos,
  };
};