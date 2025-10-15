// Sistema de Permisos para La Gran Familia
// Control de acceso basado en roles específicos de la ONG

export type Permission =
  // Dashboard
  | 'dashboard:read' | 'dashboard:write'

  // Inventario
  | 'inventario:read' | 'inventario:write' | 'inventario:delete' | 'inventario:export'

  // Donativos
  | 'donativos:read' | 'donativos:write' | 'donativos:delete' | 'donativos:approve' | 'donativos:export'

  // Cocina
  | 'cocina:read' | 'cocina:write' | 'cocina:delete' | 'cocina:approve' | 'cocina:export'

  // Bazar
  | 'bazar:read' | 'bazar:write' | 'bazar:delete' | 'bazar:export'

  // Reportes
  | 'reportes:read' | 'reportes:write' | 'reportes:export'

  // Configuración
  | 'configuracion:read' | 'configuracion:write'

  // Usuarios
  | 'usuarios:read' | 'usuarios:write' | 'usuarios:delete';

export type RoleId = 1 | 3;

export const ROLE_NAMES: Record<RoleId, string> = {
  1: 'Administrador',
  3: 'Consulta'
};

export const ROLE_DESCRIPTIONS: Record<RoleId, string> = {
  1: 'Acceso total al sistema. Gestiona el inventario (entradas, salidas, correcciones), usuarios y configuraciones globales.',
  3: 'Permiso de solo lectura. Puede visualizar todos los datos del sistema (inventarios, reportes, etc.) pero no puede realizar modificaciones.'
};

// Permisos por rol - Solo dos roles principales
export const ROLE_PERMISSIONS: Record<RoleId, Permission[]> = {
  1: [ // Administrador - Acceso total al sistema
    'dashboard:read', 'dashboard:write',
    'inventario:read', 'inventario:write', 'inventario:delete', 'inventario:export',
    'donativos:read', 'donativos:write', 'donativos:delete', 'donativos:approve', 'donativos:export',
    'cocina:read', 'cocina:write', 'cocina:delete', 'cocina:approve', 'cocina:export',
    'bazar:read', 'bazar:write', 'bazar:delete', 'bazar:export',
    'reportes:read', 'reportes:write', 'reportes:export',
    'configuracion:read', 'configuracion:write',
    'usuarios:read', 'usuarios:write', 'usuarios:delete'
  ],
  3: [ // Consulta - Permiso de solo lectura
    'dashboard:read',
    'inventario:read',
    'donativos:read',
    'cocina:read', 'bazar:read',
    'reportes:read', 'reportes:export'
  ]
};

// Funciones de utilidad para verificar permisos
export const hasPermission = (userPermissions: Permission[], permission: Permission): boolean => {
  return userPermissions.includes(permission);
};

export const hasAnyPermission = (userPermissions: Permission[], permissions: Permission[]): boolean => {
  return permissions.some(perm => userPermissions.includes(perm));
};

export const hasAllPermissions = (userPermissions: Permission[], permissions: Permission[]): boolean => {
  return permissions.every(perm => userPermissions.includes(perm));
};

// Obtener permisos por rol
export const getPermissionsForRole = (rolId: RoleId): Permission[] => {
  return ROLE_PERMISSIONS[rolId] || [];
};

// Verificar si un rol tiene acceso administrativo
export const isAdminRole = (rolId: RoleId): boolean => {
  return rolId === 1; // Solo Administrador General
};

// Verificar si un rol puede gestionar usuarios
export const canManageUsers = (rolId: RoleId): boolean => {
  return rolId === 1; // Solo Administrador General
};

// Verificar si un rol puede gestionar configuración
export const canManageConfig = (rolId: RoleId): boolean => {
  return rolId === 1; // Solo Administrador General
};