import React from 'react';
import { Permission } from '@/lib/permissions';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedModuleProps {
  module: 'dashboard' | 'inventario' | 'donativos' | 'cocina' | 'bazar' | 'reportes' | 'configuracion' | 'usuarios';
  action: 'read' | 'write' | 'delete' | 'approve' | 'export';
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const ProtectedModule: React.FC<ProtectedModuleProps> = ({
  module,
  action,
  children,
  fallback = null
}) => {
  const { hasPermission } = useAuth();
  const requiredPermission = `${module}:${action}` as Permission;

  if (!hasPermission(requiredPermission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

interface ProtectedRouteProps {
  requiredPermissions?: Permission[];
  requireAll?: boolean; // Si true, requiere TODOS los permisos; si false, requiere AL MENOS uno
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  requiredPermissions = [],
  requireAll = false,
  children,
  fallback = null
}) => {
  const { hasAnyPermission, hasAllPermissions, profile } = useAuth();

  // Primero verificar que el usuario tenga un perfil válido y esté activo
  if (!profile?.activo) {
    return <>{fallback}</>;
  }

  // Si no se requieren permisos específicos, solo verificar que esté activo
  if (requiredPermissions.length === 0) {
    return <>{children}</>;
  }

  // Verificar permisos
  const hasAccess = requireAll
    ? hasAllPermissions(requiredPermissions)
    : hasAnyPermission(requiredPermissions);

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};