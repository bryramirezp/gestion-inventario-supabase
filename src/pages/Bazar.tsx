import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ShoppingCart, Plus, Search, DollarSign, Package, TrendingUp } from 'lucide-react';
import AnimatedCard from '@/components/ui/animated-card';
import AnimatedCounter from '@/components/ui/animated-counter';
import SplitText from '@/components/ui/split-text';
import { useBazar } from '@/hooks/useBazar';
import { useToast } from '@/hooks/use-toast';

const Bazar = () => {
  const {
    ventas,
    productosDisponibles,
    almacenes,
    createVenta,
    getEstadisticasDia
  } = useBazar();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAlmacen, setSelectedAlmacen] = useState('');
  const [selectedProducto, setSelectedProducto] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [precioUnitario, setPrecioUnitario] = useState('');
  const [productosVenta, setProductosVenta] = useState<any[]>([]);

  const estadisticas = getEstadisticasDia();

  const filteredVentas = ventas.filter(venta =>
    venta.usuario?.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    venta.almacen?.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const agregarProducto = () => {
    if (!selectedProducto || !cantidad || !precioUnitario) return;

    const producto = productosDisponibles.find(p => p.nombre === selectedProducto);
    if (!producto) return;

    const nuevoProducto = {
      ...producto,
      cantidad: Number(cantidad),
      precio_unitario: Number(precioUnitario),
      subtotal: Number(cantidad) * Number(precioUnitario)
    };

    setProductosVenta([...productosVenta, nuevoProducto]);
    setSelectedProducto('');
    setCantidad('');
    setPrecioUnitario('');
  };

  const quitarProducto = (index: number) => {
    setProductosVenta(productosVenta.filter((_, i) => i !== index));
  };

  const calcularTotal = () => {
    return productosVenta.reduce((total, p) => total + p.subtotal, 0);
  };

  const registrarVenta = async () => {
    if (productosVenta.length === 0 || !selectedAlmacen) {
      toast({
        title: "Error",
        description: "Completa todos los campos de la venta",
        variant: "destructive",
        duration: 4000,
      });
      return;
    }

    const almacenSeleccionado = almacenes.find(a => a.nombre === selectedAlmacen);
    if (!almacenSeleccionado) {
      toast({
        title: "Error",
        description: "Almacén no válido",
        variant: "destructive",
        duration: 4000,
      });
      return;
    }

    const productosParaVenta = productosVenta.map(p => ({
      producto_id: p.producto_id,
      cantidad: p.cantidad,
      precio_unitario: p.precio_unitario
    }));

    const result = await createVenta({
      almacen_id: almacenSeleccionado.almacen_id,
      productos: productosParaVenta
    });

    if (result.success) {
      toast({
        title: "Venta registrada",
        description: "La venta se registró exitosamente en el sistema",
        duration: 3000,
      });
      // Reset form
      setSelectedAlmacen('');
      setProductosVenta([]);
    } else {
      toast({
        title: "Error",
        description: "No se pudo registrar la venta. Inténtalo de nuevo.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <AnimatedCard>
        <div>
          <SplitText
            text="Módulo de Bazar"
            className="text-3xl font-bold text-foreground"
            duration={0.8}
            stagger={0.05}
          />
          <p className="text-muted-foreground mt-2">
            Gestión de ventas del bazar y artículos donados
          </p>
        </div>
      </AnimatedCard>


      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <AnimatedCard delay={0.1} direction="up">
          <Card className="border-l-4 border-l-primary shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ventas del Día</CardTitle>
              <ShoppingCart className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                <AnimatedCounter value={estadisticas.ventasDia} delay={0.5} />
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-success">+15%</span> vs ayer
              </p>
            </CardContent>
          </Card>
        </AnimatedCard>

        <AnimatedCard delay={0.2} direction="up">
          <Card className="border-l-4 border-l-success shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ingresos del Día</CardTitle>
              <DollarSign className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">
                $<AnimatedCounter value={estadisticas.ingresosDia} delay={0.7} />
              </div>
              <p className="text-xs text-muted-foreground">
                Total generado
              </p>
            </CardContent>
          </Card>
        </AnimatedCard>

        <AnimatedCard delay={0.3} direction="up">
          <Card className="border-l-4 border-l-warning shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Productos Vendidos</CardTitle>
              <Package className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">
                <AnimatedCounter value={estadisticas.productosVendidos} delay={0.9} />
              </div>
              <p className="text-xs text-muted-foreground">
                Unidades totales
              </p>
            </CardContent>
          </Card>
        </AnimatedCard>

        <AnimatedCard delay={0.4} direction="up">
          <Card className="border-l-4 border-l-destructive shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ventas Totales</CardTitle>
              <TrendingUp className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                <AnimatedCounter value={ventas.length} delay={1.1} />
              </div>
              <p className="text-xs text-muted-foreground">
                Histórico completo
              </p>
            </CardContent>
          </Card>
        </AnimatedCard>
      </div>

      {/* Tabla de Ventas */}
      <AnimatedCard delay={0.5} direction="left">
        <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            <span>Registro de movimiento a bazar</span>
          </CardTitle>
          <div className="flex items-center pt-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por usuario o almacén..."
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
                  <TableHead>Fecha</TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Almacen Origen</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Productos</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVentas.map(venta => (
                  <TableRow key={venta.venta_id}>
                    <TableCell>{new Date(venta.fecha).toLocaleDateString()}</TableCell>
                    <TableCell>{venta.usuario?.nombre || 'N/A'}</TableCell>
                    <TableCell>{venta.almacen?.nombre || 'N/A'}</TableCell>
                    <TableCell>${venta.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {venta.productos?.map((prod, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {prod.producto?.nombre || 'Producto'} x{prod.cantidad}
                          </Badge>
                        )) || []}
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

export default Bazar;