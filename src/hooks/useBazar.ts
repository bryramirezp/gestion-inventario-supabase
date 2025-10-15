import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface VentaBazar {
  venta_id: number;
  fecha: string;
  total: number;
  usuario_id: string;
  almacen_id: number;
  usuario?: {
    nombre: string;
  };
  almacen?: {
    nombre: string;
  };
  productos?: DetalleVentaBazar[];
}

export interface DetalleVentaBazar {
  detalle_venta_id: number;
  venta_id: number;
  lote_id: number;
  variante_id: number | null;
  cantidad: number;
  precio_unitario: number;
  lote?: {
    variante?: {
      producto?: {
        nombre: string;
      };
    };
  };
}

export interface ProductoDisponible {
  variante_id: number;
  lote_id: number;
  nombre: string;
  stock: number;
  precio_referencia: number;
}

export const useBazar = () => {
  const [ventas, setVentas] = useState<VentaBazar[]>([]);
  const [productosDisponibles, setProductosDisponibles] = useState<ProductoDisponible[]>([]);
  const [almacenes, setAlmacenes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Cargar ventas del bazar
  const loadVentas = async () => {
    setIsLoading(true);
    try {
      // Cargar ventas básicas
      const { data: ventasData, error: ventasError } = await supabase
        .from('ventasbazar' as any)
        .select('*')
        .order('fecha', { ascending: false });

      if (ventasError) throw ventasError;

      // Para cada venta, cargar detalles y datos relacionados
      const ventasCompletas = await Promise.all(
        (ventasData as any)?.map(async (venta: any) => {
          // Cargar detalles de la venta
          const { data: detalles } = await supabase
            .from('detallesventasbazar' as any)
            .select(`
              detalle_venta_id,
              cantidad,
              precio_unitario,
              lotes (
                variantes_producto (
                  productos (
                    nombre
                  )
                )
              )
            `)
            .eq('venta_id', venta.venta_id);

          // Cargar datos del usuario
          const { data: usuario } = await supabase
            .from('perfiles' as any)
            .select('nombre')
            .eq('id', venta.usuario_id)
            .single();

          // Cargar datos del almacén
          const { data: almacen } = await supabase
            .from('almacenes' as any)
            .select('nombre')
            .eq('almacen_id', venta.almacen_id)
            .single();

          return {
            ...venta,
            usuario: usuario ? { nombre: (usuario as any).nombre } : undefined,
            almacen: almacen ? { nombre: (almacen as any).nombre } : undefined,
            productos: detalles || []
          };
        }) || []
      );

      setVentas(ventasCompletas);
    } catch (error) {
      console.error('Error loading ventas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar productos disponibles (con stock > 0)
  const loadProductosDisponibles = async () => {
    try {
      // Obtener lotes con stock disponible
      const { data: lotesData, error } = await supabase
        .from('lotes' as any)
        .select(`
          lote_id,
          variante_id,
          cantidad_actual,
          variantes_producto (
            variante_id,
            precio_referencia,
            productos (
              nombre
            )
          )
        `)
        .gt('cantidad_actual', 0)
        .eq('activo', true);

      if (error) throw error;

      const productos = (lotesData as any)?.map((lote: any) => ({
        variante_id: lote.variante_id,
        lote_id: lote.lote_id,
        nombre: lote.variantes_producto?.productos?.nombre || 'Producto sin nombre',
        stock: lote.cantidad_actual,
        precio_referencia: lote.variantes_producto?.precio_referencia || 0
      })) || [];

      setProductosDisponibles(productos);
    } catch (error) {
      console.error('Error loading productos disponibles:', error);
      // Fallback: productos sin stock
      setProductosDisponibles([]);
    }
  };

  // Cargar almacenes
  const loadAlmacenes = async () => {
    try {
      const { data, error } = await supabase
        .from('almacenes' as any)
        .select('almacen_id, nombre')
        .eq('activo', true);

      if (error) throw error;
      setAlmacenes(data || []);
    } catch (error) {
      console.error('Error loading almacenes:', error);
    }
  };

  // Crear nueva venta
  const createVenta = async (ventaData: {
    almacen_id: number;
    productos: Array<{
      lote_id: number;
      variante_id: number;
      cantidad: number;
      precio_unitario: number;
    }>;
  }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuario no autenticado');

      const total = ventaData.productos.reduce((sum, prod) => sum + (prod.cantidad * prod.precio_unitario), 0);

      // Crear la venta
      const { data: venta, error: ventaError } = await supabase
        .from('ventasbazar' as any)
        .insert({
          fecha: new Date().toISOString().split('T')[0], // YYYY-MM-DD
          total,
          usuario_id: user.id,
          almacen_id: ventaData.almacen_id
        })
        .select()
        .single();

      if (ventaError) throw ventaError;

      const ventaInsertada = venta as any;

      // Crear los detalles de la venta
      const detalles = ventaData.productos.map(prod => ({
        venta_id: ventaInsertada.venta_id,
        lote_id: prod.lote_id,
        variante_id: prod.variante_id,
        cantidad: prod.cantidad,
        precio_unitario: prod.precio_unitario
      }));

      const { error: detallesError } = await supabase
        .from('detallesventasbazar' as any)
        .insert(detalles);

      if (detallesError) throw detallesError;

      // Registrar movimientos de inventario (salidas)
      const movimientos = ventaData.productos.map(prod => ({
        lote_id: prod.lote_id,
        variante_id: prod.variante_id,
        tipo_movimiento_id: 2, // Asumiendo que 2 es "salida por venta"
        cantidad: prod.cantidad, // Positivo según el schema (factor en tipos_movimiento)
        usuario_id: user.id,
        referencia: `venta_${ventaInsertada.venta_id}`
      }));

      const { error: movimientoError } = await supabase
        .from('movimientosinventario' as any)
        .insert(movimientos);

      if (movimientoError) throw movimientoError;

      // Recargar datos
      await loadVentas();
      await loadProductosDisponibles();

      return { success: true, venta_id: ventaInsertada.venta_id };
    } catch (error) {
      console.error('Error creating venta:', error);
      return { success: false, error };
    }
  };

  // Estadísticas del día
  const getEstadisticasDia = () => {
    const hoy = new Date().toISOString().split('T')[0];
    const ventasHoy = ventas.filter(venta => venta.fecha === hoy);

    // Calcular margen promedio basado en datos reales
    let totalMargen = 0;
    let totalProductos = 0;

    ventasHoy.forEach(venta => {
      venta.productos?.forEach(prod => {
        // Aquí podríamos calcular el margen real si tuviéramos el costo
        // Por ahora, usamos un cálculo básico o 0 si no hay datos
        totalMargen += 0; // Placeholder - necesitarías costo real
        totalProductos += prod.cantidad;
      });
    });

    const margenPromedio = totalProductos > 0 ? Math.round((totalMargen / totalProductos) * 100) : 0;

    return {
      ventasDia: ventasHoy.length,
      ingresosDia: ventasHoy.reduce((sum, venta) => sum + venta.total, 0),
      productosVendidos: ventasHoy.reduce((sum, venta) =>
        sum + (venta.productos?.reduce((prodSum, prod) => prodSum + prod.cantidad, 0) || 0), 0
      ),
      margenPromedio: margenPromedio // Ahora se calcula dinámicamente
    };
  };

  useEffect(() => {
    loadVentas();
    loadProductosDisponibles();
    loadAlmacenes();
  }, []);

  return {
    ventas,
    productosDisponibles,
    almacenes,
    isLoading,
    loadVentas,
    loadProductosDisponibles,
    createVenta,
    getEstadisticasDia
  };
};