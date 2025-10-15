import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface Notification {
  id: string;
  type: 'expiry' | 'stock' | 'movement' | 'system';
  message: string;
  priority: 'high' | 'medium' | 'low';
  timestamp: Date;
  relatedId?: number;
  relatedType?: string;
}

export const useNotifications = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Generate expiry alerts (products expiring soon)
  const generateExpiryAlerts = async (): Promise<Notification[]> => {
    try {
      // For now, we'll create mock expiry alerts based on stock data
      // In a real implementation, you'd have expiry dates in the products table
      const { data: stockData } = await supabase
        .from('stock_por_almacen')
        .select('*')
        .limit(10);

      const alerts: Notification[] = [];

      // Mock expiry logic - in reality you'd check actual expiry dates
      stockData?.forEach((stock, index) => {
        if (index < 3) { // Create a few expiry alerts
          const daysToExpiry = Math.floor(Math.random() * 7) + 1;
          alerts.push({
            id: `expiry-${stock.producto_id}`,
            type: 'expiry',
            message: `${stock.nombre_producto} vence en ${daysToExpiry} días`,
            priority: daysToExpiry <= 3 ? 'high' : 'medium',
            timestamp: new Date(),
            relatedId: stock.producto_id,
            relatedType: 'producto'
          });
        }
      });

      return alerts;
    } catch (error) {
      console.error('Error generating expiry alerts:', error);
      return [];
    }
  };

  // Generate low stock alerts
  const generateStockAlerts = async (): Promise<Notification[]> => {
    try {
      const { data: stockData } = await supabase
        .from('stock_por_almacen')
        .select('*')
        .lt('stock_actual', 10); // Stock below 10 units

      const alerts: Notification[] = stockData?.map(stock => ({
        id: `stock-${stock.producto_id}-${stock.almacen_id}`,
        type: 'stock',
        message: `${stock.nombre_producto} con stock bajo (${stock.stock_actual} ${stock.nombre_almacen})`,
        priority: stock.stock_actual <= 5 ? 'high' : 'medium',
        timestamp: new Date(),
        relatedId: stock.producto_id,
        relatedType: 'producto'
      })) || [];

      return alerts;
    } catch (error) {
      console.error('Error generating stock alerts:', error);
      return [];
    }
  };

  // Generate movement alerts (unusual movements)
  const generateMovementAlerts = async (): Promise<Notification[]> => {
    try {
      // Get recent movements (last 24 hours)
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const { data: movements } = await supabase
        .from('movimientosinventario')
        .select(`
          *,
          productos (nombre),
          almacenes (nombre)
        `)
        .gte('fecha', yesterday.toISOString())
        .order('fecha', { ascending: false })
        .limit(5);

      const alerts: Notification[] = [];

      movements?.forEach(movement => {
        // Flag large movements as unusual
        if (Math.abs(movement.cantidad) > 50) {
          alerts.push({
            id: `movement-${movement.movimiento_inventario_id}`,
            type: 'movement',
            message: `Movimiento grande: ${Math.abs(movement.cantidad)} ${movement.productos?.nombre} en ${movement.almacenes?.nombre}`,
            priority: 'low',
            timestamp: new Date(movement.fecha),
            relatedId: movement.movimiento_inventario_id,
            relatedType: 'movimiento'
          });
        }
      });

      return alerts;
    } catch (error) {
      console.error('Error generating movement alerts:', error);
      return [];
    }
  };

  // Generate system alerts
  const generateSystemAlerts = (): Notification[] => {
    // System-level alerts (maintenance, backups, etc.)
    return [
      {
        id: 'system-backup',
        type: 'system',
        message: 'Recordatorio: Realizar backup semanal del sistema',
        priority: 'low',
        timestamp: new Date(),
      }
    ];
  };

  // Load all notifications
  const loadNotifications = async () => {
    setIsLoading(true);

    try {
      const [expiryAlerts, stockAlerts, movementAlerts] = await Promise.all([
        generateExpiryAlerts(),
        generateStockAlerts(),
        generateMovementAlerts()
      ]);

      const systemAlerts = generateSystemAlerts();

      const allNotifications = [
        ...expiryAlerts,
        ...stockAlerts,
        ...movementAlerts,
        ...systemAlerts
      ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

      setNotifications(allNotifications);
    } catch (error) {
      console.error('Error loading notifications:', error);
      setNotifications([]);
    }

    setIsLoading(false);
  };

  // Mark notification as read (could be implemented later)
  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId
          ? { ...notif, priority: 'low' as const } // Mark as read by lowering priority
          : notif
      )
    );
  };

  // Get unread count
  const unreadCount = notifications.filter(n => n.priority === 'high').length;

  useEffect(() => {
    // Only load notifications if user is authenticated and auth is not loading
    if (isAuthenticated && !authLoading) {
      loadNotifications();

      // Refresh notifications every 5 minutes
      const interval = setInterval(loadNotifications, 5 * 60 * 1000);

      return () => clearInterval(interval);
    }
  }, [isAuthenticated, authLoading]);

  return {
    notifications,
    isLoading,
    unreadCount,
    loadNotifications,
    markAsRead
  };
};