import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import ProtectedRoute from "./components/ProtectedRoute";
import { ProtectedRoute as PermissionProtectedRoute } from "./components/ui/ProtectedModule";
import MainLayout from "./components/layout/MainLayout";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Inventario from "./pages/Inventario";
import Almacenes from "./pages/Almacenes";
import Donativos from "./pages/Donativos";
import Cocina from "./pages/Cocina";
import Bazar from "./pages/Bazar";
import Unauthorized from "./pages/Unauthorized";
import Empleados from "./pages/Empleados";
import Usuarios from "./pages/Usuarios";
import Configuracion from "./pages/Configuracion";
import Kpis from "./pages/Kpis";
import Reportes from "./pages/Reportes";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="inventario" element={<Inventario />} />
              <Route path="almacenes" element={<Almacenes />} />
              <Route path="donativos" element={<Donativos />} />
              <Route path="cocina" element={<Cocina />} />
              <Route path="bazar" element={<Bazar />} />
              <Route path="reportes" element={<Reportes />} />
              <Route path="kpis" element={<Kpis />} />
              
              {/* Admin routes - Solo para Administradores (rol_id = 1) */}
              <Route path="empleados" element={
                <PermissionProtectedRoute requiredPermissions={['usuarios:read']}>
                  <Empleados />
                </PermissionProtectedRoute>
              } />
              <Route path="usuarios" element={
                <PermissionProtectedRoute requiredPermissions={['usuarios:read']}>
                  <Usuarios />
                </PermissionProtectedRoute>
              } />
              <Route path="configuracion" element={
                <PermissionProtectedRoute requiredPermissions={['configuracion:read']}>
                  <Configuracion />
                </PermissionProtectedRoute>
              } />
            </Route>
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
