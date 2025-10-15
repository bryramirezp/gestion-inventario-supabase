import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  Package,
  Users,
  ChefHat,
  ShoppingCart,
  BarChart3,
  Settings,
  LogOut,
  Home,
  Warehouse
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Permission } from '@/lib/permissions';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import SplitText from '@/components/ui/split-text';
import { cn } from '@/lib/utils';

const mainItems = [
  { title: 'Dashboard', path: '/dashboard', icon: Home },
  { title: 'Donativos', path: '/donativos', icon: Building2 },
  { title: 'Inventario', path: '/inventario', icon: Package },
  { title: 'Cocina', path: '/cocina', icon: ChefHat },
  { title: 'Bazar', path: '/bazar', icon: ShoppingCart },
  { title: 'Reportes', path: '/reportes', icon: BarChart3 },
  { title: 'KPIs', path: '/kpis', icon: BarChart3 },
  { title: 'Almacenes', path: '/almacenes', icon: Warehouse },
];

const adminItems = [
  { title: 'Usuarios', path: '/usuarios', icon: Users },
  { title: 'Configuración', path: '/configuracion', icon: Settings },
];

import logoLaGranFamilia from '@/assets/logo-lagranfamilia.png';

export function AppSidebar() {
  const { open } = useSidebar();
  const { profile, signOut, hasPermission } = useAuth();
  const location = useLocation();

  return (
    <Sidebar className={open ? 'w-64' : 'w-16'}>
      <SidebarHeader className="p-6 border-b border-border">
        <motion.div 
          className="flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {open && (
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.img 
                src={logoLaGranFamilia} 
                alt="La Gran Familia Logo" 
                className="h-10 w-10 rounded-full shadow-md"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              />
              <div className="flex flex-col">
                <SplitText 
                  text="La Gran Familia" 
                  className="text-lg font-bold text-primary"
                  delay={0.5}
                  duration={0.8}
                  stagger={0.03}
                />
                <p className="text-sm text-muted-foreground">Sistema de Inventario</p>
              </div>
            </motion.div>
          )}
          {!open && (
            <motion.img 
              src={logoLaGranFamilia} 
              alt="La Gran Familia Logo" 
              className="h-8 w-8 rounded-full shadow-md"
              whileHover={{ scale: 1.2, rotate: 10 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            />
          )}
        </motion.div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <AnimatePresence>
                {mainItems.map((item, index) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ 
                        duration: 0.3, 
                        delay: index * 0.1 + 0.3 
                      }}
                    >
                      <SidebarMenuItem>
                        <SidebarMenuButton 
                          asChild 
                          className={cn(
                            "transition-all duration-300 group relative overflow-hidden",
                            isActive 
                              ? "bg-primary text-primary-foreground font-medium shadow-md before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary-light/20 before:to-transparent" 
                              : "hover:bg-secondary hover:text-foreground hover:shadow-sm"
                          )}
                        >
                          <NavLink to={item.path} className="flex items-center gap-3 relative z-10">
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                              <item.icon className={cn(
                                "h-4 w-4 transition-colors",
                                isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                              )} />
                            </motion.div>
                            {open && <span className="transition-colors">{item.title}</span>}
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Solo mostrar sección de administración para Administradores (rol_id = 1) */}
        {profile?.rol_id === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <SidebarGroup>
              <SidebarGroupLabel>Administración</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <AnimatePresence>
                    {adminItems.map((item, index) => {
                      const isActive = location.pathname === item.path;
                      return (
                        <motion.div
                          key={item.title}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{
                            duration: 0.3,
                            delay: index * 0.1 + 1.0
                          }}
                        >
                          <SidebarMenuItem>
                            <SidebarMenuButton
                              asChild
                              className={cn(
                                "transition-all duration-300 group relative overflow-hidden",
                                isActive
                                  ? "bg-primary text-primary-foreground font-medium shadow-md before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary-light/20 before:to-transparent"
                                  : "hover:bg-secondary hover:text-foreground hover:shadow-sm"
                              )}
                            >
                              <NavLink to={item.path} className="flex items-center gap-3 relative z-10">
                                <motion.div
                                  whileHover={{ scale: 1.1 }}
                                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                >
                                  <item.icon className={cn(
                                    "h-4 w-4 transition-colors",
                                    isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                                  )} />
                                </motion.div>
                                {open && <span className="transition-colors">{item.title}</span>}
                              </NavLink>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </motion.div>
        )}
      </SidebarContent>

      {open && (
        <motion.div 
          className="p-4 border-t border-border mt-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 1.2 }}
        >
          <motion.div 
            className="mb-3"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <p className="text-sm font-medium text-foreground">{profile?.nombre || profile?.email || 'Usuario'}</p>
            <p className="text-xs text-muted-foreground capitalize">
              {profile?.rol_id === 1 ? 'Administrador' :
               profile?.rol_id === 3 ? 'Consulta' : 'Usuario'}
            </p>
            {profile?.rol_id && (
              <p className="text-xs text-muted-foreground mt-1 max-w-48 truncate">
                {profile?.rol_id === 1 ? 'Acceso total al sistema. Gestiona el inventario (entradas, salidas, correcciones), usuarios y configuraciones globales.' :
                 profile?.rol_id === 3 ? 'Permiso de solo lectura. Puede visualizar todos los datos del sistema (inventarios, reportes, etc.) pero no puede realizar modificaciones.' :
                 'Usuario sin rol asignado'}
              </p>
            )}
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              onClick={signOut}
              variant="outline"
              size="sm"
              className="w-full transition-all duration-300 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </Button>
          </motion.div>
        </motion.div>
      )}
    </Sidebar>
  );
}

export default AppSidebar;