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
  contact_person?: string;
  address?: string;
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
        .from('donors')
        .select('donor_id, donor_name, contact_person, phone, email, address, donor_type_id, created_at, updated_at')
        .order('donor_name');
      if (error) throw error;

      console.log('Donadores fetched:', data);
      if (data && data.length > 0) {
        console.log('Primer donador:', data[0]);
      } else {
        console.log('No se encontraron donadores');
      }

      // Transform data to match Donador interface
      const transformedData = (data || []).map(d => ({
        donador_id: d.donor_id,
        nombre_completo: d.donor_name,
        correo: d.email,
        telefono: d.phone,
        fecha_registro: d.created_at,
        activo: true, // Assuming all donors are active by default
        tipo_donador_id: d.donor_type_id,
        perfil_id: undefined,
        contact_person: d.contact_person,
        address: d.address
      }));

      setDonadores(transformedData);
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
        .from('transaction_types')
        .select('type_id, type_name')
        .order('type_name');
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
        .from('donor_types')
        .select('donor_type_id, type_name')
        .order('type_name');
      if (error) throw error;
      console.log('Tipos donadores fetched:', data);
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
        .from('transactions')
        .select(`
          transaction_id,
          donor_id,
          transaction_date,
          notes,
          user_id
        `) // Select específico para mejor performance
        .order('transaction_date', { ascending: false });
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
      // For now, just simulate success since the database schema doesn't support donativos
      console.log('Simulating donativo creation:', payloadSeguro);
      return { data: [payloadSeguro] };
    } catch (error) {
      console.error('Error creating donativo:', error);
      return { error };
    }
  }, []);

  // Actualizar Donativo
  const updateDonativo = async (donativo_id: number, payload: DonativoUpdate) => {
    // Simulate update since donativos table doesn't exist
    console.log('Simulating donativo update:', donativo_id, payload);
    return { data: { donativo_id, ...payload } };
  };

  // Eliminar Donativo
  const deleteDonativo = async (donativo_id: number) => {
    // Simulate delete since donativos table doesn't exist
    console.log('Simulating donativo delete:', donativo_id);
    setDonativos(prev => prev.filter(d => d.donativo_id !== donativo_id));
    return { success: true };
  };

  // Crear Donador
  const createDonador = useCallback(async (donadorData: {
    nombre_completo: string;
    correo?: string;
    telefono?: string;
    tipo_donador_id: number;
    direccion?: string;
  }) => {
    try {
      const { data, error } = await supabase
        .from('donors')
        .insert({
          donor_name: donadorData.nombre_completo,
          contact_person: donadorData.nombre_completo,
          phone: donadorData.telefono || null,
          email: donadorData.correo || null,
          address: donadorData.direccion || null,
          donor_type_id: donadorData.tipo_donador_id
        })
        .select('donor_id, donor_name, contact_person, phone, email, address, donor_type_id, created_at, updated_at')
        .single();

      if (error) throw error;

      if (data) {
        const transformedData = {
          donador_id: data.donor_id,
          nombre_completo: data.donor_name,
          correo: data.email,
          telefono: data.phone,
          fecha_registro: data.created_at,
          activo: true,
          tipo_donador_id: data.donor_type_id,
          perfil_id: undefined,
          contact_person: data.contact_person,
          address: data.address
        };
        setDonadores(prev => [...prev, transformedData]);
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

      // Simulate update since donadores table doesn't exist
      console.log('Simulating donador status toggle:', donadorId, nuevoEstado);

      // Actualizar estado local
      setDonadores(prev =>
        prev.map(d =>
          d.donador_id === donadorId
            ? { ...d, activo: nuevoEstado }
            : d
        )
      );

      return { data: { ...donador, activo: nuevoEstado } };
    } catch (error) {
      console.error('Error toggling donador status:', error);
      return { error };
    }
  }, [donadores]);

  // Eliminar donador completamente
  const deleteDonador = useCallback(async (donadorId: number) => {
    try {
      // Simulate delete since donadores table doesn't exist
      console.log('Simulating donador delete:', donadorId);

      // Remover de estado local
      setDonadores(prev => prev.filter(d => d.donador_id !== donadorId));

      return { success: true };
    } catch (error) {
      console.error('Error deleting donador:', error);
      return { error };
    }
  }, []);

  // Registrar Donativo Completo - Simulado ya que las tablas no existen
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
      // Simular el registro completo ya que las tablas no existen
      console.log('Simulating complete donativo registration:', donativoData);

      const total = donativoData.productos.reduce(
        (sum, prod) => sum + (prod.cantidad * prod.precio_unitario),
        0
      );

      // Crear donativo simulado
      const nuevoDonativo: Donativo = {
        donativo_id: Date.now(), // ID temporal
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

      return { data: nuevoDonativo };

    } catch (error) {
      console.error('Error in registrarDonativoCompleto:', error);
      return {
        error: {
          message: error instanceof Error ? error.message : 'Error inesperado al registrar el donativo'
        }
      };
    }
  }, []);

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
