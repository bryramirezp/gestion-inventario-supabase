import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';
import { useAuth } from '@/hooks/useAuth';

// Interfaces basadas en el nuevo esquema con variantes
export interface Producto extends Tables<'productos'> {
  categoria?: Tables<'categoriasproductos'>;
  marca?: string;
  unidad_medida?: Tables<'unidadesmedida'>;
  precio_referencia?: number;
}

export interface VarianteProducto extends Tables<'variantes_producto'> {
  producto?: Producto;
  marca?: Tables<'marcas'>;
  unidad_medida?: Tables<'unidadesmedida'>;
  lote?: Tables<'lotes'>;
}

export interface Marca extends Tables<'marcas'> {}
export interface CategoriaProducto extends Tables<'categoriasproductos'> {}
export interface UnidadMedida extends Tables<'unidadesmedida'> {}
export interface Almacen extends Tables<'almacenes'> {}
export interface Lote extends Tables<'lotes'> {}

export interface ProductoInsert extends TablesInsert<'productos'> {}
export interface ProductoUpdate extends TablesUpdate<'productos'> {}
export interface VarianteInsert extends TablesInsert<'variantes_producto'> {}
export interface VarianteUpdate extends TablesUpdate<'variantes_producto'> {}

export const useProductos = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [variantes, setVariantes] = useState<VarianteProducto[]>([]);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [categorias, setCategorias] = useState<CategoriaProducto[]>([]);
  const [unidadesMedida, setUnidadesMedida] = useState<UnidadMedida[]>([]);
  const [almacenes, setAlmacenes] = useState<Almacen[]>([]);
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Transformación para incluir datos relacionados
  const transformProducto = (producto: Tables<'productos'>): Producto => ({
    ...producto,
    categoria: categorias.find(c => c.categoria_producto_id === producto.categoria_producto_id),
    marca: undefined, // Se obtendrá de variantes si es necesario
    unidad_medida: undefined, // Se obtendrá de variantes si es necesario
    precio_referencia: undefined, // Se obtendrá de variantes si es necesario
  });

  const transformVariante = (variante: Tables<'variantes_producto'>): VarianteProducto => ({
    ...variante,
    producto: productos.find(p => p.producto_id === variante.producto_id),
    marca: marcas.find(m => m.marca_id === variante.marca_id),
    unidad_medida: unidadesMedida.find(u => u.unidad_medida_id === variante.unidad_medida_id),
  });

  // Fetch Categorías
  const fetchCategorias = async () => {
    const { data, error } = await supabase
      .from('categoriasproductos')
      .select('*')
      .order('nombre');

    if (error) {
      console.error('Error fetching categorias:', error);
      return [];
    }
    return data || [];
  };

  // Fetch Unidades de Medida
  const fetchUnidadesMedida = async () => {
    const { data, error } = await supabase
      .from('unidadesmedida')
      .select('*')
      .order('nombre');

    if (error) {
      console.error('Error fetching unidades medida:', error);
      return [];
    }
    return data || [];
  };

  // Fetch Almacenes
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

  // Fetch Marcas
  const fetchMarcas = async () => {
    const { data, error } = await supabase
      .from('marcas')
      .select('*')
      .eq('activo', true)
      .order('nombre');

    if (error) {
      console.error('Error fetching marcas:', error);
      return [];
    }
    return data || [];
  };

  // Fetch Variantes
  const fetchVariantes = async () => {
    const { data, error } = await supabase
      .from('variantes_producto')
      .select(`
        *,
        productos!inner(*),
        marcas(*),
        unidadesmedida(*)
      `)
      .eq('activo', true)
      .order('productos.nombre');

    if (error) {
      console.error('Error fetching variantes:', error);
      return [];
    }
    return data || [];
  };

  // Fetch Lotes
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

  // Fetch Productos con datos relacionados
  const fetchProductos = async () => {
    setIsLoading(true);

    // Fetch datos relacionados primero
    const [cats, units, almacs, marcasData, variantesData, lotesData] = await Promise.all([
      fetchCategorias(),
      fetchUnidadesMedida(),
      fetchAlmacenes(),
      fetchMarcas(),
      fetchVariantes(),
      fetchLotes()
    ]);

    setCategorias(cats);
    setUnidadesMedida(units);
    setAlmacenes(almacs);
    setMarcas(marcasData);
    setLotes(lotesData);

    // Fetch productos
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .order('nombre');

    if (error) {
      console.error('Error fetching productos:', error);
      setProductos([]);
    } else {
      // Transformar productos con datos relacionados
      const productosTransformados = (data || []).map(transformProducto);
      setProductos(productosTransformados);
    }

    // Transformar variantes
    const variantesTransformadas = variantesData.map(transformVariante);
    setVariantes(variantesTransformadas);

    setIsLoading(false);
  };

  // Crear Producto
  const createProducto = async (payload: ProductoInsert) => {
    const { data, error } = await supabase
      .from('productos')
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
      .from('productos')
      .update(payload)
      .eq('producto_id', producto_id)
      .select()
      .single();

    if (error) {
      console.error('Error updating producto:', error);
      return { error };
    }

    if (data) {
      const productoActualizado = transformProducto(data);
      setProductos(prev => prev.map(p =>
        p.producto_id === producto_id ? productoActualizado : p
      ));
    }

    return { data };
  };

  // Eliminar Producto (desactivar)
  const deleteProducto = async (producto_id: number) => {
    const { error } = await supabase
      .from('productos')
      .update({ activo: false })
      .eq('producto_id', producto_id);

    if (error) {
      console.error('Error deleting producto:', error);
      return { error };
    }

    // Remover de estado local
    setProductos(prev => prev.filter(p => p.producto_id !== producto_id));
    return { success: true };
  };

  // Obtener stock de una variante en un almacén específico
  const getStockVariante = (variante_id: number, almacen_id: number): number => {
    const loteStock = lotes
      .filter(l => l.variante_id === variante_id && l.almacen_id === almacen_id && l.activo)
      .reduce((total, l) => total + l.cantidad_actual, 0);
    return loteStock;
  };

  // Obtener stock total de una variante en todos los almacenes
  const getStockTotalVariante = (variante_id: number): number => {
    return lotes
      .filter(l => l.variante_id === variante_id && l.activo)
      .reduce((total, l) => total + l.cantidad_actual, 0);
  };

  // Obtener stock de un producto genérico (suma de todas sus variantes)
  const getStockProducto = (producto_id: number, almacen_id: number): number => {
    const variantesProducto = variantes.filter(v => v.producto_id === producto_id);
    return variantesProducto.reduce((total, v) => total + getStockVariante(v.variante_id, almacen_id), 0);
  };

  // Obtener stock total de un producto genérico en todos los almacenes
  const getStockTotalProducto = (producto_id: number): number => {
    const variantesProducto = variantes.filter(v => v.producto_id === producto_id);
    return variantesProducto.reduce((total, v) => total + getStockTotalVariante(v.variante_id), 0);
  };

  useEffect(() => {
    // Only fetch products if user is authenticated and auth is not loading
    if (isAuthenticated && !authLoading) {
      fetchProductos();
    }
  }, [isAuthenticated, authLoading]);

  return {
    productos,
    variantes,
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
    getStockVariante,
    getStockTotalVariante,
  };
};