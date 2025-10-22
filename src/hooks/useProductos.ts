import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';
import { useAuth } from '@/hooks/useAuth';

// Interfaces basadas en el esquema actual de Supabase
export interface Producto extends Tables<'products'> {
  categoria?: Tables<'categories'>;
  marca?: string;
  unidad_medida?: Tables<'units'>;
  precio_referencia?: number;
}

export interface Marca extends Tables<'brands'> {}
export interface CategoriaProducto extends Tables<'categories'> {}
export interface UnidadMedida extends Tables<'units'> {}
export interface Almacen extends Tables<'warehouses'> {}
export interface Lote extends Tables<'stock_lots'> {}

export interface ProductoInsert extends TablesInsert<'products'> {}
export interface ProductoUpdate extends TablesUpdate<'products'> {}

export const useProductos = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [categorias, setCategorias] = useState<CategoriaProducto[]>([]);
  const [unidadesMedida, setUnidadesMedida] = useState<UnidadMedida[]>([]);
  const [almacenes, setAlmacenes] = useState<Almacen[]>([]);
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Transformación para incluir datos relacionados
  const transformProducto = (producto: Tables<'products'>): Producto => ({
    ...producto,
    categoria: categorias.find(c => c.category_id === producto.category_id),
    marca: undefined, // Se obtendrá de variantes si es necesario
    unidad_medida: unidadesMedida.find(u => u.unit_id === producto.official_unit_id),
    precio_referencia: undefined, // Se obtendrá de variantes si es necesario
  });

  // Fetch Categorías
  const fetchCategorias = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('category_name');

    if (error) {
      console.error('Error fetching categorias:', error);
      return [];
    }
    return data || [];
  };

  // Fetch Unidades de Medida
  const fetchUnidadesMedida = async () => {
    const { data, error } = await supabase
      .from('units')
      .select('*')
      .order('unit_name');

    if (error) {
      console.error('Error fetching unidades medida:', error);
      return [];
    }
    return data || [];
  };

  // Fetch Almacenes
  const fetchAlmacenes = async () => {
    const { data, error } = await supabase
      .from('warehouses')
      .select('*')
      .eq('is_active', true)
      .order('warehouse_name');

    if (error) {
      console.error('Error fetching almacenes:', error);
      return [];
    }
    return data || [];
  };

  // Fetch Marcas
  const fetchMarcas = async () => {
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .order('brand_name');

    if (error) {
      console.error('Error fetching marcas:', error);
      return [];
    }
    return data || [];
  };

  // Fetch Productos con datos relacionados
  const fetchProductosConRelaciones = async () => {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories(*),
        brands(*),
        units(*)
      `)
      .order('product_name');

    if (error) {
      console.error('Error fetching productos con relaciones:', error);
      return [];
    }
    return data || [];
  };

  // Fetch Lotes
  const fetchLotes = async () => {
    const { data, error } = await supabase
      .from('stock_lots')
      .select('*')
      .order('received_date', { ascending: false });

    if (error) {
      console.error('Error fetching lotes:', error);
      return [];
    }
    return data || [];
  };

  // Fetch Productos con datos relacionados
  const fetchProductos = async () => {
    setIsLoading(true);

    // Fetch datos relacionados primero
    const [cats, units, almacs, marcasData, lotesData] = await Promise.all([
      fetchCategorias(),
      fetchUnidadesMedida(),
      fetchAlmacenes(),
      fetchMarcas(),
      fetchLotes()
    ]);

    setCategorias(cats);
    setUnidadesMedida(units);
    setAlmacenes(almacs);
    setMarcas(marcasData);
    setLotes(lotesData);

    // Fetch productos con datos relacionados
    const productosData = await fetchProductosConRelaciones();

    if (productosData.length === 0) {
      setProductos([]);
    } else {
      // Transformar productos con datos relacionados
      const productosTransformados = productosData.map(transformProducto);
      setProductos(productosTransformados);
    }

    setIsLoading(false);
  };

  // Crear Producto
  const createProducto = async (payload: ProductoInsert) => {
    const { data, error } = await supabase
      .from('products')
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.error('Error creating producto:', error);
      return { error };
    }

    if (data) {
      const nuevoProducto = transformProducto(data);
      setProductos(prev => [...prev, nuevoProducto]);
    }

    return { data };
  };

  // Actualizar Producto
  const updateProducto = async (producto_id: number, payload: ProductoUpdate) => {
    const { data, error } = await supabase
      .from('products')
      .update(payload)
      .eq('product_id', producto_id)
      .select()
      .single();

    if (error) {
      console.error('Error updating producto:', error);
      return { error };
    }

    if (data) {
      const productoActualizado = transformProducto(data);
      setProductos(prev => prev.map(p =>
        p.product_id === producto_id ? productoActualizado : p
      ));
    }

    return { data };
  };

  // Eliminar Producto (desactivar)
  const deleteProducto = async (producto_id: number) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('product_id', producto_id);

    if (error) {
      console.error('Error deleting producto:', error);
      return { error };
    }

    // Remover de estado local
    setProductos(prev => prev.filter(p => p.product_id !== producto_id));
    return { success: true };
  };

  // Obtener stock de un producto (simplificado - usa stock_lots)
  const getStockProducto = (producto_id: number, almacen_id: number): number => {
    const loteStock = lotes
      .filter(l => l.product_id === producto_id && l.warehouse_id === almacen_id)
      .reduce((total, l) => total + l.current_quantity, 0);
    return loteStock;
  };

  // Obtener stock total de un producto en todos los almacenes
  const getStockTotalProducto = (producto_id: number): number => {
    return lotes
      .filter(l => l.product_id === producto_id)
      .reduce((total, l) => total + l.current_quantity, 0);
  };

  useEffect(() => {
    // Only fetch products if user is authenticated and auth is not loading
    if (isAuthenticated && !authLoading) {
      fetchProductos();
    }
  }, [isAuthenticated, authLoading]);

  return {
    productos,
    marcas,
    categorias,
    unidadesMedida,
    almacenes,
    lotes,
    isLoading,
    fetchProductos,
    createProducto,
    updateProducto,
    deleteProducto,
    getStockProducto,
    getStockTotalProducto,
  };
};