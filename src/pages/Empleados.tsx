// src/pages/Empleados.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users as UsersIcon, Plus, Shield, Mail, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';

// Simulación de usuario autenticado
const mockUser = { name: 'Admin Demo', role: 'admin' };

// Mock empleados
const empleados = [
  { id: '1', name: 'Lorena', email: 'lorena@fundacion.org', role: 'admin', createdAt: new Date('2024-01-01'), lastLogin: new Date('2024-01-20'), status: 'active' },
  { id: '2', name: 'Lilith', email: 'lilith@fundacion.org', role: 'admin', createdAt: new Date('2024-01-01'), lastLogin: new Date('2024-01-19'), status: 'active' },
  { id: '3', name: 'Empleado Demo', email: 'empleado@fundacion.org', role: 'employee', createdAt: new Date('2024-01-15'), lastLogin: new Date('2024-01-18'), status: 'active' },
];

const getRoleBadge = (role: string) => {
  switch (role) {
    case 'admin': return <Badge className="bg-blue-100 text-blue-800">Admin</Badge>;
    case 'employee': return <Badge className="bg-green-100 text-green-800">Empleado</Badge>;
    default: return <Badge variant="outline">{role}</Badge>;
  }
};

const getStatusBadge = (status: string) => {
  return status === 'active'
    ? <Badge className="bg-green-100 text-green-800">Activo</Badge>
    : <Badge className="bg-gray-100 text-gray-800">Inactivo</Badge>;
};

export default function Empleados() {
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);

  useEffect(() => { setUser(mockUser); }, []);

  if (!user) return <p>Cargando...</p>;
  if (user.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card>
          <CardContent className="p-12 text-center">
            <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Acceso Restringido</h3>
            <p className="text-gray-600">Solo los administradores pueden acceder a esta sección.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Empleados</h1>
          <p className="text-gray-600 mt-1">Administración de empleados del sistema</p>
        </div>
        <Button className="bg-gradient-to-r from-foundation-orange to-foundation-gold">
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Empleado
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Empleados</p>
              <p className="text-2xl font-bold">{empleados.length}</p>
            </div>
            <UsersIcon className="h-6 w-6 text-foundation-orange" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Administradores</p>
              <p className="text-2xl font-bold text-red-600">
                {empleados.filter(e => e.role === 'admin').length}
              </p>
            </div>
            <Shield className="h-6 w-6 text-red-600" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Empleados</p>
              <p className="text-2xl font-bold text-green-600">
                {empleados.filter(e => e.role === 'employee').length}
              </p>
            </div>
            <UsersIcon className="h-6 w-6 text-green-600" />
          </CardContent>
        </Card>
      </div>

      {/* Lista de Empleados */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Empleados</CardTitle>
          <CardDescription>Gestión completa de empleados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {empleados.map((emp) => (
              <div key={emp.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1 flex items-center space-x-4">
                  <div className="w-10 h-10 bg-foundation-bronze rounded-full flex items-center justify-center text-white font-semibold">
                    {emp.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-medium">{emp.name}</h3>
                    <p className="text-sm text-gray-500">{emp.email}</p>
                    <div className="flex space-x-2 mt-1">
                      {getRoleBadge(emp.role)}
                      {getStatusBadge(emp.status)}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">Editar</Button>
                  <Button variant="outline" size="sm" className="text-red-600">Desactivar</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}