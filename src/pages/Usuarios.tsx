import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Users, Plus, Edit, Trash2, Shield, Mail, UserCheck, UserX } from 'lucide-react';
import AnimatedCard from '@/components/ui/animated-card';
import AnimatedCounter from '@/components/ui/animated-counter';
import SplitText from '@/components/ui/split-text';
import { useUsuarios } from '@/hooks/useUsuarios';
import { useAuth } from '@/hooks/useAuth';

const Usuarios = () => {
  const { user: currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    rol_id: '',
    activo: true
  });

  const {
    usuarios,
    isLoading,
    createUsuario,
    updateUsuario,
    toggleUsuarioStatus,
    getRoleName,
    getRoleBadgeColor,
    getStats
  } = useUsuarios();

  const stats = getStats();

  const roles = [
    { id: 1, nombre: 'Super Admin', descripcion: 'Acceso completo al sistema' },
    { id: 2, nombre: 'Admin', descripcion: 'Gestión de operaciones' },
    { id: 3, nombre: 'Inventario', descripcion: 'Control de productos y stock' },
    { id: 4, nombre: 'Contabilidad', descripcion: 'Reportes y finanzas' },
    { id: 5, nombre: 'Recepción', descripcion: 'Registro de donativos' }
  ];

  const filteredUsers = usuarios.filter(user =>
    user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openEditDialog = (user: any) => {
    setEditingUser(user);
    setFormData({
      nombre: user.nombre,
      email: user.email,
      rol_id: user.rol_id.toString(),
      activo: user.activo
    });
    setDialogOpen(true);
  };

  const handleCreateOrUpdate = async () => {
    if (!formData.nombre.trim() || !formData.email.trim()) {
      alert('Nombre y email son obligatorios');
      return;
    }

    try {
      const userData = {
        nombre: formData.nombre,
        email: formData.email,
        rol_id: parseInt(formData.rol_id),
        activo: formData.activo
      };

      if (editingUser) {
        await updateUsuario(editingUser.id, userData);
      } else {
        await createUsuario(userData);
      }

      setDialogOpen(false);
      setEditingUser(null);
      resetForm();
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Error al guardar el usuario');
    }
  };

  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    // Prevent self-deactivation
    if (userId === currentUser?.id) {
      alert('No puedes desactivar tu propia cuenta. Contacta a otro administrador.');
      return;
    }

    try {
      await toggleUsuarioStatus(userId, currentStatus);
    } catch (error) {
      console.error('Error toggling user status:', error);
      alert('Error al cambiar el estado del usuario');
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      email: '',
      rol_id: '',
      activo: true
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <AnimatedCard>
        <div className="flex items-center justify-between">
          <div>
            <SplitText
              text="Gestión de Usuarios"
              className="text-3xl font-bold text-foreground"
              duration={0.8}
              stagger={0.05}
            />
            <p className="text-muted-foreground mt-2">
              Administración de usuarios y permisos del sistema
            </p>
          </div>

        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) {
            setEditingUser(null);
            resetForm();
          }
        }}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Agregar Usuario</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingUser ? 'Editar Usuario' : 'Agregar Nuevo Usuario'}
              </DialogTitle>
              <DialogDescription>
                {editingUser ? 'Modifica los datos del usuario' : 'Ingresa los datos del nuevo usuario'}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="nombre">Nombre Completo</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  placeholder="Ej: María González"
                />
              </div>

              <div>
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="usuario@lagranfamilia.org.mx"
                />
              </div>

              <div>
                <Label htmlFor="rol">Rol</Label>
                <Select
                  value={formData.rol_id}
                  onValueChange={(value) => setFormData({...formData, rol_id: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar rol" />
                  </SelectTrigger>
                  <SelectContent side="bottom" align="start">
                    {roles.map(rol => (
                      <SelectItem key={rol.id} value={rol.id.toString()}>
                        {rol.nombre} - {rol.descripcion}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={handleCreateOrUpdate}>
                {editingUser ? 'Actualizar' : 'Crear'} Usuario
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        </div>
      </AnimatedCard>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <AnimatedCard delay={0.1} direction="up">
          <Card className="border-l-4 border-l-primary shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                <AnimatedCounter value={stats.total} delay={0.5} />
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-success">+2</span> desde el mes pasado
              </p>
            </CardContent>
          </Card>
        </AnimatedCard>

        <AnimatedCard delay={0.2} direction="up">
          <Card className="border-l-4 border-l-success shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuarios Activos</CardTitle>
              <UserCheck className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">
                <AnimatedCounter value={stats.activos} delay={0.7} />
              </div>
              <p className="text-xs text-muted-foreground">
                Con acceso al sistema
              </p>
            </CardContent>
          </Card>
        </AnimatedCard>

        <AnimatedCard delay={0.3} direction="up">
          <Card className="border-l-4 border-l-warning shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Administradores</CardTitle>
              <Shield className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">
                <AnimatedCounter value={stats.admins} delay={0.9} />
              </div>
              <p className="text-xs text-muted-foreground">
                Super Admin + Admin
              </p>
            </CardContent>
          </Card>
        </AnimatedCard>

        <AnimatedCard delay={0.4} direction="up">
          <Card className="border-l-4 border-l-destructive shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inactivos</CardTitle>
              <UserX className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                <AnimatedCounter value={stats.inactivos} delay={1.1} />
              </div>
              <p className="text-xs text-muted-foreground">
                Acceso suspendido
              </p>
            </CardContent>
          </Card>
        </AnimatedCard>
      </div>

      {/* Users Table */}
      <AnimatedCard delay={0.2} direction="left">
        <Card>
        <CardHeader>
          <CardTitle>Lista de Usuarios</CardTitle>
          <CardDescription>
            Gestión completa de usuarios del sistema
          </CardDescription>
          <div className="flex items-center pt-4">
            <div className="relative flex-1 max-w-sm">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{user.nombre}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getRoleBadgeColor(user.rol_id)}>
                        {getRoleName(user.rol_id)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.activo ? "default" : "secondary"}>
                        {user.activo ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(user)}
                          disabled={user.id === currentUser?.id}
                          title={
                            user.id === currentUser?.id
                              ? "No puedes editar tu propia cuenta"
                              : "Editar usuario"
                          }
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleStatus(user.id, user.activo)}
                          disabled={user.id === currentUser?.id}
                          className={
                            user.id === currentUser?.id
                              ? "text-muted-foreground cursor-not-allowed"
                              : user.activo
                                ? "text-destructive"
                                : "text-success"
                          }
                          title={
                            user.id === currentUser?.id
                              ? "No puedes desactivar tu propia cuenta"
                              : user.activo
                                ? "Desactivar usuario"
                                : "Activar usuario"
                          }
                        >
                          {user.activo ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        </Card>
      </AnimatedCard>
    </div>
  );
};

export default Usuarios;