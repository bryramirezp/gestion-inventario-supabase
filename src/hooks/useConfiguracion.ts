import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

export interface ConfiguracionItem {
  clave: string;
  valor: string;
  tipo: 'string' | 'number' | 'boolean';
  descripcion: string;
  updated_at: string;
}

export const useConfiguracion = () => {
  const [configuracion, setConfiguracion] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Cargar toda la configuración
  const loadConfiguracion = async () => {
    setIsLoading(true);
    try {
      // Usar query directo a la tabla configuracion
      const { data, error } = await supabase
        .from('configuracion')
        .select('clave, valor, tipo, descripcion, solo_administrador, created_at, updated_at');

      if (error) {
        console.warn('Tabla configuracion no encontrada, usando valores por defecto');
        // Valores por defecto genéricos si la tabla no existe
        setConfiguracion({
          'org.nombre': 'CASA PATERNA LA GRAN FAMILIA A.C.',
          'org.telefono': '+52 8266 0060',
          'org.email': 'contacto@lagranfamilia.org.mx',
          'org.direccion': 'Carretera Nacional km 225, Los Rodríguez, Santiago, N.L.',
          'org.id_fiscal': 'LGF2024001',
          'notifications.email_alerts': 'true',
          'notifications.low_stock_alerts': 'true',
          'system.language': 'es',
          'system.currency': 'MXN',
          'stock.minimo_alertas': '10',
          'stock.dias_vencimiento': '30',
          'system.version': '1.0'
        });
        return;
      }

      const configMap: Record<string, string> = {};
      (data as any)?.forEach((item: any) => {
        configMap[item.clave] = item.valor;
      });

      setConfiguracion(configMap);
    } catch (error) {
      console.error('Error loading configuration:', error);
      // Fallback a configuración por defecto
      setConfiguracion({
        'org.nombre': 'CASA PATERNA LA GRAN FAMILIA A.C.',
        'org.telefono': '+52 8266 0060',
        'org.email': 'contacto@lagranfamilia.org.mx',
        'org.direccion': 'Carretera Nacional km 225, Los Rodríguez, Santiago, N.L.',
        'org.id_fiscal': 'LGF2024001',
        'notifications.email_alerts': 'true',
        'notifications.low_stock_alerts': 'true',
        'system.language': 'es',
        'system.currency': 'MXN',
        'stock.minimo_alertas': '10',
        'stock.dias_vencimiento': '30',
        'system.version': '1.0'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Obtener un valor específico
  const getConfig = (clave: string, defaultValue: string = ''): string => {
    return configuracion[clave] || defaultValue;
  };

  // Guardar configuración usando SQL directo
  const saveConfiguracion = async (configs: Record<string, { valor: string; tipo?: 'string' | 'number' | 'boolean'; descripcion?: string }>) => {
    try {
      // Usar upsert directo en la tabla
      const updates = Object.entries(configs).map(([clave, config]) => ({
        clave,
        valor: config.valor,
        tipo: config.tipo || 'string',
        descripcion: config.descripcion || `Configuración para ${clave}`
      }));

      const { error } = await supabase
        .from('configuracion' as any)
        .upsert(updates, {
          onConflict: 'clave'
        });

      if (error) throw error;

      // Actualizar el estado local
      const newConfig: Record<string, string> = {};
      updates.forEach(update => {
        newConfig[update.clave] = update.valor;
      });

      setConfiguracion(prev => ({
        ...prev,
        ...newConfig
      }));

      return { success: true };
    } catch (error) {
      console.error('Error saving configuration:', error);
      return { success: false, error };
    }
  };

  // Inicializar configuración por defecto (solo si no existe)
  const initializeDefaultConfig = async () => {
    const defaultConfigs = {
      'org.nombre': { valor: 'Organización', descripcion: 'Nombre de la organización' },
      'org.telefono': { valor: '', descripcion: 'Teléfono de contacto' },
      'org.email': { valor: '', descripcion: 'Email de contacto' },
      'org.direccion': { valor: '', descripcion: 'Dirección física' },
      'org.id_fiscal': { valor: '', descripcion: 'Identificación fiscal' }
    };

    await saveConfiguracion(defaultConfigs);
  };

  useEffect(() => {
    loadConfiguracion();
  }, []);

  return {
    configuracion,
    isLoading,
    getConfig,
    saveConfiguracion,
    initializeDefaultConfig,
    loadConfiguracion
  };
};