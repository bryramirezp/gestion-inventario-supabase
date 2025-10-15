import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface CalculatedKPI {
  id: string;
  nombre: string;
  categoria: string;
  valor_actual: number;
  valor_meta: number;
  periodo: string;
  descripcion: string;
  fecha_actualizacion: string;
}

// Hook para calcular KPIs en tiempo real desde la base de datos
export const useCalculatedKPIs = () => {
  const [calculatedKPIs, setCalculatedKPIs] = useState<CalculatedKPI[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Calcular KPIs en tiempo real
  const calculateKPIs = async () => {
    setIsLoading(true);

    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      // 1. Valor Total de Donaciones del Mes
      const { data: donativosData, error: donativosError } = await supabase
        .from('donativos')
        .select('total')
        .gte('fecha', startOfMonth.toISOString().split('T')[0]);

      if (donativosError) throw donativosError;

      const totalDonacionesMes = donativosData?.reduce((sum, d) => sum + (d.total || 0), 0) || 0;

      // 2. Valor Total del Inventario (estimación basada en productos activos)
      const { data: productosData, error: productosError } = await supabase
        .from('productos')
        .select('precio_referencia')
        .eq('activo', true);

      if (productosError) throw productosError;

      // Estimación: asumir stock promedio de 50 unidades por producto
      // En un sistema real, esto debería calcularse desde movimientos de inventario
      const valorTotalInventario = productosData?.reduce((sum, p) =>
        sum + (50 * (p.precio_referencia || 0)), 0) || 0;

      // 3. Ingresos Mensuales del Bazar
      const { data: ventasData, error: ventasError } = await supabase
        .from('ventasbazar')
        .select('total')
        .gte('fecha', startOfMonth.toISOString().split('T')[0]);

      if (ventasError) throw ventasError;

      const ingresosBazarMes = ventasData?.reduce((sum, v) => sum + (v.total || 0), 0) || 0;

      // 4. Productos Más Vendidos (Top 5 por cantidad)
      const { data: detallesVentasData, error: detallesError } = await supabase
        .from('detallesventasbazar')
        .select(`
          cantidad,
          productos (
            nombre
          )
        `);

      if (detallesError) throw detallesError;

      // Agrupar por producto y calcular totales
      const productosVendidos = detallesVentasData?.reduce((acc, detalle) => {
        const nombreProducto = detalle.productos?.nombre || 'Producto desconocido';
        acc[nombreProducto] = (acc[nombreProducto] || 0) + (detalle.cantidad || 0);
        return acc;
      }, {} as Record<string, number>) || {};

      // Obtener top 5 productos más vendidos
      const topProductos = Object.entries(productosVendidos)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5);

      const topProductosString = topProductos.length > 0
        ? topProductos.map(([nombre, cantidad]) => `${nombre}: ${cantidad}`).join(', ')
        : 'Sin ventas registradas';

      // Crear KPIs calculados
      const kpis: CalculatedKPI[] = [
        {
          id: 'donaciones_mensuales',
          nombre: 'Valor Total de Donaciones del Mes',
          categoria: 'donations',
          valor_actual: totalDonacionesMes,
          valor_meta: 50000, // $50,000
          periodo: 'Mensual',
          descripcion: 'Suma total de donaciones recibidas en el mes actual',
          fecha_actualizacion: new Date().toISOString()
        },
        {
          id: 'valor_inventario',
          nombre: 'Valor Total del Inventario',
          categoria: 'inventory',
          valor_actual: valorTotalInventario,
          valor_meta: 25000, // $25,000
          periodo: 'Actual',
          descripcion: 'Valor total de productos en inventario (stock × precio referencia)',
          fecha_actualizacion: new Date().toISOString()
        },
        {
          id: 'ingresos_bazar',
          nombre: 'Ingresos Mensuales del Bazar',
          categoria: 'sales',
          valor_actual: ingresosBazarMes,
          valor_meta: 15000, // $15,000
          periodo: 'Mensual',
          descripcion: 'Total de ingresos generados por ventas en el bazar',
          fecha_actualizacion: new Date().toISOString()
        },
        {
          id: 'productos_mas_vendidos',
          nombre: 'Productos Más Vendidos',
          categoria: 'products',
          valor_actual: topProductos.length, // Número de productos en el top
          valor_meta: 5, // Meta: tener top 5 identificado
          periodo: 'Acumulado',
          descripcion: `Top productos por cantidad vendida: ${topProductosString}`,
          fecha_actualizacion: new Date().toISOString()
        }
      ];

      setCalculatedKPIs(kpis);
    } catch (error) {
      console.error('Error calculating KPIs:', error);
      setCalculatedKPIs([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Calcular estadísticas de KPIs calculados
  const getCalculatedKPIsStats = () => {
    const totalKPIs = calculatedKPIs.length;
    const enMeta = calculatedKPIs.filter(kpi => kpi.valor_actual >= kpi.valor_meta).length;
    const requierenAtencion = calculatedKPIs.filter(kpi => {
      const porcentaje = (kpi.valor_actual / kpi.valor_meta) * 100;
      return porcentaje < 80;
    }).length;
    const promedioGeneral = calculatedKPIs.length > 0
      ? Math.round((calculatedKPIs.reduce((sum, kpi) => sum + (kpi.valor_actual / kpi.valor_meta), 0) / calculatedKPIs.length) * 100)
      : 0;

    return {
      totalKPIs,
      enMeta,
      requierenAtencion,
      promedioGeneral
    };
  };

  useEffect(() => {
    calculateKPIs();

    // Recalcular cada 5 minutos
    const interval = setInterval(calculateKPIs, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return {
    calculatedKPIs,
    isLoading,
    calculateKPIs,
    getCalculatedKPIsStats,
  };
};
