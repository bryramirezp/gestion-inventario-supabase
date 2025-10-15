import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
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
import {
  ChefHat,
  Calendar,
  Clock,
  AlertTriangle,
  Plus,
  Signature,
  Package2,
  Edit,
  Trash2
} from 'lucide-react';
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
import AnimatedCounter from '@/components/ui/animated-counter';
import SplitText from '@/components/ui/split-text';
import { useAuth } from '@/hooks/useAuth';
import { useConsumosCocina } from '@/hooks/useConsumosCocina';
import { useProductos } from '@/hooks/useProductos';

const Cocina = () => {
  const { profile } = useAuth();
  const {
    consumos,
    isLoading,
    createConsumo,
    updateConsumo,
    deleteConsumo
  } = useConsumosCocina();

  const {
    productos,
    getStockTotalProducto
  } = useProductos();

  const [selectedProduct, setSelectedProduct] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [consumoToDelete, setConsumoToDelete] = useState<number | null>(null);

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'firmado':
        return <Badge className="bg-success text-success-foreground">Firmado</Badge>;
      case 'pendiente':
        return <Badge className="bg-warning text-warning-foreground">Pendiente Firma</Badge>;
      default:
        return <Badge variant="secondary">{estado}</Badge>;
    }
  };

  const handleRegistrarConsumo = async () => {
    if (!selectedProduct || !cantidad) return alert('Completa todos los campos');

    try {
      await createConsumo({
        producto_id: parseInt(selectedProduct),
        almacen_id: 1, // Default almacen - should be configurable
        cantidad: parseFloat(cantidad),
        fecha: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
        responsable_id: profile?.id || '',
        firma_texto: observaciones || 'Registrado'
      });

      // Reset form
      setSelectedProduct('');
      setCantidad('');
      setObservaciones('');
    } catch (error) {
      console.error('Error creating consumo:', error);
      alert('Error al registrar consumo');
    }
  };

  const openDeleteDialog = (consumoId: number) => {
    setConsumoToDelete(consumoId);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!consumoToDelete) return;

    try {
      await deleteConsumo(consumoToDelete);
      setDeleteDialogOpen(false);
      setConsumoToDelete(null);
    } catch (error) {
      console.error('Error deleting consumo:', error);
      alert('Error al eliminar consumo');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <AnimatedCard>
        <div className="flex items-center justify-between">
          <div>
            <SplitText
              text="Módulo de Cocina"
              className="text-3xl font-bold text-foreground"
              duration={0.8}
              stagger={0.05}
            />
            <p className="text-muted-foreground mt-2">
              Control de consumos y fechas de caducidad
            </p>
          </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Registrar Consumo</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Nuevo Consumo de Cocina</DialogTitle>
              <DialogDescription>
                Registra los productos utilizados en la cocina
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="producto">Producto</Label>
                <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar producto..." />
                  </SelectTrigger>
                  <SelectContent>
                    {productos.map((producto) => (
                      <SelectItem key={producto.producto_id} value={producto.producto_id.toString()}>
                        {producto.nombre} - Stock: {getStockTotalProducto(producto.producto_id)} {producto.unidad_medida?.abreviatura || 'u'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="cantidad">Cantidad Utilizada</Label>
                <Input
                  id="cantidad"
                  placeholder="Ej: 5.0"
                  value={cantidad}
                  onChange={(e) => setCantidad(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="observaciones">Observaciones</Label>
                <Textarea
                  id="observaciones"
                  placeholder="Detalles del uso del producto..."
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button onClick={handleRegistrarConsumo} disabled={!selectedProduct || !cantidad}>
                Registrar Consumo
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
              <CardTitle className="text-sm font-medium">Productos Disponibles</CardTitle>
              <Package2 className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                <AnimatedCounter value={productos.length} delay={0.5} />
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-success">+8%</span> desde el mes pasado
              </p>
            </CardContent>
          </Card>
        </AnimatedCard>

        <AnimatedCard delay={0.2} direction="up">
          <Card className="border-l-4 border-l-warning shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Stock Bajo</CardTitle>
              <AlertTriangle className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">
                <AnimatedCounter value={productos.filter(p => getStockTotalProducto(p.producto_id) <= 10).length} delay={0.7} />
              </div>
              <p className="text-xs text-muted-foreground">
                ≤ 10 unidades
              </p>
            </CardContent>
          </Card>
        </AnimatedCard>

        <AnimatedCard delay={0.3} direction="up">
          <Card className="border-l-4 border-l-success shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Consumos Totales</CardTitle>
              <ChefHat className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">
                <AnimatedCounter value={consumos.length} delay={0.9} />
              </div>
              <p className="text-xs text-muted-foreground">
                Registros totales
              </p>
            </CardContent>
          </Card>
        </AnimatedCard>

        <AnimatedCard delay={0.4} direction="up">
          <Card className="border-l-4 border-l-destructive shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendientes Firma</CardTitle>
              <Signature className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                <AnimatedCounter value={consumos.filter(c => !c.aprobado_por).length} delay={1.1} />
              </div>
              <p className="text-xs text-muted-foreground">
                Requieren aprobación
              </p>
            </CardContent>
          </Card>
        </AnimatedCard>
      </div>

      {/* Available Products */}
      <AnimatedCard delay={0.2} direction="left">
        <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-primary" />
            <span>Productos Disponibles por Fecha de Caducidad</span>
          </CardTitle>
          <CardDescription>
            Productos ordenados por proximidad de vencimiento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead>Stock Disponible</TableHead>
                  <TableHead>Precio Referencia</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productos.map((producto) => (
                  <TableRow key={producto.producto_id}>
                    <TableCell className="font-medium">{producto.nombre}</TableCell>
                    <TableCell>{getStockTotalProducto(producto.producto_id)} {producto.unidad_medida?.abreviatura || 'u'}</TableCell>
                    <TableCell>${producto.precio_referencia?.toFixed(2) || '0.00'}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedProduct(producto.producto_id.toString());
                        }}
                      >
                        Seleccionar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        </Card>
      </AnimatedCard>

      {/* Recent Consumptions */}
      <AnimatedCard delay={0.3} direction="right">
        <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-primary" />
            <span>Consumos Recientes</span>
          </CardTitle>
          <CardDescription>
            Registro de productos utilizados en cocina - Requieren firma de Lorena
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead>Cantidad</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Responsable</TableHead>
                  <TableHead>Firmado Por</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Observaciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {consumos.slice(0, 10).map((consumo) => (
                  <TableRow key={consumo.consumo_cocina_id}>
                    <TableCell className="font-medium">{consumo.producto?.nombre || 'Producto desconocido'}</TableCell>
                    <TableCell>{consumo.cantidad} u</TableCell>
                    <TableCell>{new Date(consumo.fecha).toLocaleDateString()}</TableCell>
                    <TableCell>{consumo.responsable?.nombre || 'Desconocido'}</TableCell>
                    <TableCell>{consumo.aprobador?.nombre || '-'}</TableCell>
                    <TableCell>{getEstadoBadge(consumo.aprobado_por ? 'firmado' : 'pendiente')}</TableCell>
                    <TableCell className="max-w-xs truncate">{consumo.firma_texto || '-'}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {!consumo.aprobado_por && profile?.rol_id === 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              // Approve consumo
                              updateConsumo(consumo.consumo_cocina_id, {
                                aprobado_por: profile.id,
                                firma_texto: 'Aprobado por administrador'
                              });
                            }}
                          >
                            Aprobar
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDeleteDialog(consumo.consumo_cocina_id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar Consumo?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente el registro de consumo.
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Cocina;