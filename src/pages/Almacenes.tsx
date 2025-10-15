'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Warehouse, Plus, Package, Users, Calendar, MapPin } from 'lucide-react';
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import AnimatedCard from '@/components/ui/animated-card';
import SplitText from '@/components/ui/split-text';
import { useAlmacenes } from '@/hooks/useAlmacenes';
import { useToast } from '@/hooks/use-toast';

export default function Almacenes() {
  const { toast } = useToast();
  const {
    almacenes,
    isLoading,
    createAlmacen,
    updateAlmacen,
    deleteAlmacen,
    getStats
  } = useAlmacenes();

  const stats = getStats();

  // Calculate warehouse metrics
  const totalWarehouses = almacenes.length;
  const totalProducts = 0; // TODO: Replace with actual product count from inventory

  // Form states for create/edit
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAlmacen, setEditingAlmacen] = useState<any>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    activo: true
  });

  // Delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [almacenToDelete, setAlmacenToDelete] = useState<number | null>(null);

  // CRUD Handlers
  const openEditDialog = (almacen: any) => {
    setEditingAlmacen(almacen);
    setFormData({
      nombre: almacen.nombre,
      activo: almacen.activo
    });
    setDialogOpen(true);
  };

  const openDeleteDialog = (almacenId: number) => {
    setAlmacenToDelete(almacenId);
    setDeleteDialogOpen(true);
  };

  const handleCreateOrUpdate = async () => {
    if (!formData.nombre.trim()) {
      toast({
        title: "Error",
        description: "El nombre del almacén es obligatorio",
        variant: "destructive",
        duration: 4000,
      });
      return;
    }

    const almacenData = {
      nombre: formData.nombre,
      activo: formData.activo
    };

    try {
      if (editingAlmacen) {
        await updateAlmacen(editingAlmacen.almacen_id, almacenData);
        toast({
          title: "Almacén actualizado",
          description: `El almacén "${formData.nombre}" se actualizó correctamente`,
          duration: 3000,
        });
      } else {
        await createAlmacen(almacenData);
        toast({
          title: "Almacén creado",
          description: `El almacén "${formData.nombre}" se creó correctamente`,
          duration: 3000,
        });
      }

      // Close dialog and reset form
      setDialogOpen(false);
      setEditingAlmacen(null);
      resetForm();
    } catch (error) {
      console.error('Error saving almacen:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar el almacén. Inténtalo de nuevo.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  const handleDelete = async () => {
    if (!almacenToDelete) return;

    try {
      await deleteAlmacen(almacenToDelete);
      toast({
        title: "Almacén eliminado",
        description: "El almacén se eliminó completamente de la base de datos",
        duration: 3000,
      });
      setDeleteDialogOpen(false);
      setAlmacenToDelete(null);
    } catch (error) {
      console.error('Error deleting almacen:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el almacén. Inténtalo de nuevo.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      activo: true
    });
  };

  // TODO: Replace with real inventory calculation
  const getWarehouseStats = (warehouseId: number) => {
    // TODO: Calculate from actual inventory data (lotes table)
    // Temporarily disabled mock data generation
    // const totalItems = Math.floor(Math.random() * 100) + 10; // Mock data
    // const totalQuantity = totalItems * 5; // Mock data
    // const lowStockItems = Math.floor(totalItems * 0.2); // Mock data
    return { totalItems: 0, totalQuantity: 0, lowStockItems: 0 };
  };

  const getWarehouseIcon = (type: string) => {
    // Since we don't have type field, use a default
    return <Package className="h-6 w-6 text-primary" />;
  };

  const getWarehouseColor = (type: string) => {
    // Since we don't have type field, use a default
    return 'bg-primary/10 border-primary/20';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <AnimatedCard>
        <div className="flex items-center justify-between">
          <div>
            <SplitText
              text="Gestión de Almacenes"
              className="text-3xl font-bold text-foreground"
              duration={0.8}
              stagger={0.05}
            />
            <p className="text-muted-foreground mt-2">
              Administración y control de los almacenes de la fundación
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Almacén
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingAlmacen ? 'Editar Almacén' : 'Agregar Nuevo Almacén'}
              </DialogTitle>
              <DialogDescription>
                {editingAlmacen ? 'Modifica los datos del almacén' : 'Ingresa los datos del nuevo almacén'}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="nombre">Nombre del Almacén</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  placeholder="Ej: Almacén Principal"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="activo"
                  checked={formData.activo}
                  onCheckedChange={(checked) => setFormData({...formData, activo: checked})}
                />
                <Label htmlFor="activo">Activo</Label>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={handleCreateOrUpdate}>
                {editingAlmacen ? 'Actualizar' : 'Crear'} Almacén
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        </div>
      </AnimatedCard>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AnimatedCard delay={0.1} direction="up">
          <Card className="border-l-4 border-l-primary shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Almacenes</CardTitle>
              <Warehouse className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {stats.total}
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-success">+5%</span> desde el mes pasado
              </p>
            </CardContent>
          </Card>
        </AnimatedCard>

        <AnimatedCard delay={0.2} direction="up">
          <Card className="border-l-4 border-l-success shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Productos</CardTitle>
              <Package className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">
                {totalProducts}
              </div>
              <p className="text-xs text-muted-foreground">
                Productos en inventario
              </p>
            </CardContent>
          </Card>
        </AnimatedCard>

        <AnimatedCard delay={0.3} direction="up">
          <Card className="border-l-4 border-l-warning shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Almacenes Activos</CardTitle>
              <Users className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">
                {stats.activos}
              </div>
              <p className="text-xs text-muted-foreground">
                En operación
              </p>
            </CardContent>
          </Card>
        </AnimatedCard>
      </div>

      {/* Warehouses Grid */}
      <AnimatedCard delay={0.2} direction="left">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {almacenes.map((almacen, index) => {
            const stats = getWarehouseStats(almacen.almacen_id);

            return (
              <Card key={almacen.almacen_id} className={`hover:shadow-lg transition-shadow duration-200 ${getWarehouseColor('default')} shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-white/50">
                        {getWarehouseIcon('default')}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{almacen.nombre}</CardTitle>
                        <CardDescription className="mt-1">
                          Almacén de la fundación {/* TODO: Add description field to almacenes table */}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant="outline" className={almacen.activo ? 'text-green-600 border-green-600' : 'text-gray-600 border-gray-600'}>
                      {almacen.activo ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-lg font-semibold text-foreground">{stats.totalItems}</p>
                        <p className="text-xs text-muted-foreground">Productos</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-semibold text-foreground">{stats.totalQuantity}</p>
                        <p className="text-xs text-muted-foreground">Unidades</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-semibold text-destructive">{stats.lowStockItems}</p>
                        <p className="text-xs text-muted-foreground">Stock Bajo</p>
                      </div>
                    </div>

                    {/* Warehouse Info */}
                    <div className="space-y-2 pt-3 border-t border-border">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-2" />
                        Creado: {new Date().toLocaleDateString()} {/* TODO: Use actual created_at date */}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-2" />
                        Tipo: General
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-3 border-t border-border">
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => openEditDialog(almacen)}>
                          Configurar
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => openDeleteDialog(almacen.almacen_id)}>
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </AnimatedCard>

      {/* Warehouse Summary */}
      <AnimatedCard delay={0.3} direction="right">
        <Card className="shadow-soft hover:shadow-medium transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Warehouse className="h-5 w-5 mr-2 text-primary" />
              Resumen de Almacenes
            </CardTitle>
            <CardDescription>
              Estado general de todos los almacenes de la fundación
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {almacenes.map((almacen) => {
                const stats = getWarehouseStats(almacen.almacen_id);

                return (
                  <div key={almacen.almacen_id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-all duration-300 hover:shadow-sm">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-white">
                        {getWarehouseIcon('default')}
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">{almacen.nombre}</h3>
                        <p className="text-sm text-muted-foreground">Almacén de la fundación {/* TODO: Add description field */}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <p className="text-sm font-medium text-foreground">{stats.totalItems}</p>
                        <p className="text-xs text-muted-foreground">Productos</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-foreground">{stats.totalQuantity}</p>
                        <p className="text-xs text-muted-foreground">Unidades</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-destructive">{stats.lowStockItems}</p>
                        <p className="text-xs text-muted-foreground">Stock Bajo</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(almacen)}>
                        Ver Detalles
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </AnimatedCard>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar Almacén Permanentemente?</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>Esta acción no se puede deshacer.</strong> El almacén será eliminado completamente
              de la base de datos junto con todos sus registros históricos. Esta acción puede afectar
              otros módulos del sistema.
              <br /><br />
              ¿Estás seguro que quieres eliminar este almacén permanentemente?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar Permanentemente
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
