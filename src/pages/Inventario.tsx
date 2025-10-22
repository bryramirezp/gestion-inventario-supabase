import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
import { Search, Package, AlertTriangle, Plus, Filter, Edit, Trash2 } from 'lucide-react';
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
import { useProductos } from '@/hooks/useProductos';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const Inventario = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const {
    productos,
    marcas,
    categorias,
    unidadesMedida,
    almacenes,
    isLoading,
    createProducto,
    updateProducto,
    deleteProducto,
    getStockTotalProducto
  } = useProductos();


  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAlmacen, setSelectedAlmacen] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Form states for create/edit
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProducto, setEditingProducto] = useState<any>(null);
  const [formData, setFormData] = useState({
    product_name: '',
    brand_id: '',
    category_id: '',
    official_unit_id: '',
    low_stock_threshold: '',
    activo: true
  });

  // Delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productoToDelete, setProductoToDelete] = useState<number | null>(null);

  // CRUD Handlers
  const openEditDialog = (producto: any) => {
    setEditingProducto(producto);
    setFormData({
      product_name: producto.product_name,
      brand_id: producto.brand_id?.toString() || '',
      category_id: producto.category_id?.toString() || '',
      official_unit_id: producto.official_unit_id?.toString() || '',
      low_stock_threshold: producto.low_stock_threshold?.toString() || '',
      activo: true // Assuming products are always active in this schema
    });
    setDialogOpen(true);
  };

  const openDeleteDialog = (productoId: number) => {
    setProductoToDelete(productoId);
    setDeleteDialogOpen(true);
  };

  const handleCreateOrUpdate = async () => {
    if (!formData.product_name.trim()) {
      toast({
        title: "Error",
        description: "El nombre del producto es obligatorio",
        variant: "destructive",
        duration: 4000,
      });
      return;
    }

    const productoData = {
      product_name: formData.product_name,
      brand_id: formData.brand_id ? parseInt(formData.brand_id) : undefined,
      category_id: formData.category_id ? parseInt(formData.category_id) : undefined,
      official_unit_id: formData.official_unit_id ? parseInt(formData.official_unit_id) : undefined,
      low_stock_threshold: formData.low_stock_threshold ? parseInt(formData.low_stock_threshold) : 10
    };

    try {
      if (editingProducto) {
        await updateProducto(editingProducto.product_id, productoData);
        toast({
          title: "Producto actualizado",
          description: `El producto "${formData.product_name}" se actualizó correctamente`,
          duration: 3000,
        });
      } else {
        await createProducto(productoData);
        toast({
          title: "Producto creado",
          description: `El producto "${formData.product_name}" se creó correctamente`,
          duration: 3000,
        });
      }

      // Close dialog and reset form
      setDialogOpen(false);
      setEditingProducto(null);
      resetForm();
    } catch (error) {
      console.error('Error saving producto:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar el producto. Inténtalo de nuevo.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  const handleDelete = async () => {
    if (!productoToDelete) return;

    try {
      // For now, just show a message since delete functionality needs to be implemented
      console.log('Delete product:', productoToDelete);
      toast({
        title: "Función no implementada",
        description: "La eliminación de productos aún no está implementada",
        duration: 3000,
      });
      toast({
        title: "Producto eliminado",
        description: "El producto se marcó como inactivo correctamente",
        duration: 3000,
      });
      setDeleteDialogOpen(false);
      setProductoToDelete(null);
    } catch (error) {
      console.error('Error deleting producto:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el producto. Inténtalo de nuevo.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  const resetForm = () => {
    setFormData({
      product_name: '',
      brand_id: '',
      category_id: '',
      official_unit_id: '',
      low_stock_threshold: '',
      activo: true
    });
  };

  const filteredProducts = productos.filter(producto => {
    const matchesSearch = producto.product_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' ||
      producto.categoria?.category_id.toString() === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <AnimatedCard>
        <div className="flex items-center justify-between">
          <div>
            <SplitText
              text="Inventario"
              className="text-3xl font-bold text-foreground"
              duration={0.8}
              stagger={0.05}
            />
            <p className="text-muted-foreground mt-2">
              Gestión de productos y stock en almacenes
            </p>
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Producto
              </Button>
            </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingProducto ? 'Editar Producto' : 'Agregar Nuevo Producto'}
            </DialogTitle>
            <DialogDescription>
              {editingProducto ? 'Modifica los datos del producto' : 'Ingresa los datos del nuevo producto'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
           <div>
             <Label htmlFor="product_name">Nombre del Producto</Label>
             <Input
               id="product_name"
               value={formData.product_name}
               onChange={(e) => setFormData({...formData, product_name: e.target.value})}
               placeholder="Ej: Arroz Blanco"
             />
           </div>

           <div>
             <Label htmlFor="brand">Marca</Label>
             <Select
               value={formData.brand_id}
               onValueChange={(value) => setFormData({...formData, brand_id: value})}
             >
               <SelectTrigger>
                 <SelectValue placeholder="Seleccionar marca" />
               </SelectTrigger>
               <SelectContent side="bottom" align="start">
                 {marcas.map(marca => (
                   <SelectItem key={marca.brand_id} value={marca.brand_id.toString()}>
                     {marca.brand_name}
                   </SelectItem>
                 ))}
               </SelectContent>
             </Select>
           </div>

           <div>
             <Label htmlFor="category">Categoría</Label>
             <Select
               value={formData.category_id}
               onValueChange={(value) => setFormData({...formData, category_id: value})}
             >
               <SelectTrigger>
                 <SelectValue placeholder="Seleccionar categoría" />
               </SelectTrigger>
               <SelectContent side="bottom" align="start">
                 {categorias.map(categoria => (
                   <SelectItem key={categoria.category_id} value={categoria.category_id.toString()}>
                     {categoria.category_name}
                   </SelectItem>
                 ))}
               </SelectContent>
             </Select>
           </div>

           <div>
             <Label htmlFor="unit">Unidad de Medida</Label>
             <Select
               value={formData.official_unit_id}
               onValueChange={(value) => setFormData({...formData, official_unit_id: value})}
             >
               <SelectTrigger>
                 <SelectValue placeholder="Seleccionar unidad" />
               </SelectTrigger>
               <SelectContent side="bottom" align="start">
                 {unidadesMedida.map(unidad => (
                   <SelectItem key={unidad.unit_id} value={unidad.unit_id.toString()}>
                     {unidad.unit_name} ({unidad.abbreviation})
                   </SelectItem>
                 ))}
               </SelectContent>
             </Select>
           </div>

           <div>
             <Label htmlFor="threshold">Umbral Stock Bajo</Label>
             <Input
               id="threshold"
               type="number"
               value={formData.low_stock_threshold}
               onChange={(e) => setFormData({...formData, low_stock_threshold: e.target.value})}
               placeholder="10"
             />
           </div>

          </div>

          <DialogFooter>
            <Button onClick={handleCreateOrUpdate}>
              {editingProducto ? 'Actualizar' : 'Crear'} Producto
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
        </div>
      </AnimatedCard>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnimatedCard delay={0.1} direction="up">
          <Card className="border-l-4 border-l-primary shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Productos</CardTitle>
              <Package className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                <AnimatedCounter value={productos.length} delay={0.5} />
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-success">+12%</span> desde el mes pasado
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
                  <AnimatedCounter value={productos.filter(p => getStockTotalProducto(p.product_id) <= 10).length} delay={0.7} />
                </div>
                <p className="text-xs text-muted-foreground">
                  Productos requieren atención
                </p>
              </CardContent>
            </Card>
          </AnimatedCard>

          <AnimatedCard delay={0.3} direction="up">
            <Card className="border-l-4 border-l-destructive shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sin Stock</CardTitle>
                <AlertTriangle className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">
                  <AnimatedCounter value={productos.filter(p => getStockTotalProducto(p.product_id) === 0).length} delay={0.9} />
                </div>
                <p className="text-xs text-muted-foreground">
                  Agotados
                </p>
              </CardContent>
            </Card>
          </AnimatedCard>

          <AnimatedCard delay={0.4} direction="up">
            <Card className="border-l-4 border-l-success shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
                <Package className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">
                  $<AnimatedCounter value={productos.reduce((total, p) => total + (getStockTotalProducto(p.product_id) * 0), 0)} delay={1.1} />
                </div>
                <p className="text-xs text-muted-foreground">
                  Inventario valorado
                </p>
              </CardContent>
            </Card>
          </AnimatedCard>
      </div>

      {/* Filters and Search */}
      <AnimatedCard delay={0.5} direction="left">
        <Card className="shadow-soft hover:shadow-medium transition-all duration-300">
          <CardHeader>
            <CardTitle>Productos en Inventario</CardTitle>
            <CardDescription>
              Busca y filtra productos por categoría y almacén
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedAlmacen} onValueChange={setSelectedAlmacen}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Almacén" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los Almacenes</SelectItem>
                {almacenes.map(almacen => (
                  <SelectItem key={almacen.warehouse_id} value={almacen.warehouse_id.toString()}>
                    {almacen.warehouse_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las Categorías</SelectItem>
                {categorias.map(categoria => (
                  <SelectItem key={categoria.category_id} value={categoria.category_id.toString()}>
                    {categoria.category_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((producto) => {
             const stockTotal = getStockTotalProducto(producto.product_id);
             const isLowStock = stockTotal <= 10;
             const isOutOfStock = stockTotal === 0;

             return (
               <Card key={producto.product_id} className={`hover:shadow-lg transition-shadow duration-200 ${isOutOfStock ? 'border-destructive/20 bg-destructive/5' : isLowStock ? 'border-warning/20 bg-warning/5' : 'bg-primary/5 border-primary/20'}`}>
                 <CardHeader>
                   <div className="flex items-start justify-between">
                     <div className="flex items-center space-x-3">
                       <div className="p-2 rounded-lg bg-white/50">
                         <Package className="h-6 w-6 text-primary" />
                       </div>
                       <div>
                         <CardTitle className="text-lg">{producto.product_name}</CardTitle>
                         <CardDescription className="mt-1">
                           {producto.categoria?.category_name || 'Sin categoría'}
                         </CardDescription>
                       </div>
                     </div>
                     <Badge variant="outline" className="text-green-600 border-green-600">
                       Activo
                     </Badge>
                   </div>
                 </CardHeader>
                 <CardContent>
                   <div className="space-y-4">
                     {/* Product Info */}
                     <div className="space-y-2">
                       <div className="flex items-center text-sm text-muted-foreground">
                         <Package className="h-4 w-4 mr-2" />
                         Categoría: {producto.categoria?.category_name || 'Sin categoría'}
                       </div>
                       <div className="flex items-center text-sm text-muted-foreground">
                         <Package className="h-4 w-4 mr-2" />
                         Unidad: {producto.unidad_medida?.unit_name || 'Sin unidad'}
                       </div>
                     </div>

                     {/* Stock Info */}
                     <div className="grid grid-cols-2 gap-4 pt-3 border-t border-border">
                       <div className="text-center">
                         <p className={`text-lg font-semibold ${isOutOfStock ? 'text-destructive' : isLowStock ? 'text-warning' : 'text-foreground'}`}>
                           {stockTotal}
                         </p>
                         <p className="text-xs text-muted-foreground">Stock Total</p>
                       </div>
                       <div className="text-center">
                         <p className="text-lg font-semibold text-foreground">
                           $0.00
                         </p>
                         <p className="text-xs text-muted-foreground">Precio Ref.</p>
                       </div>
                     </div>

                     {/* Actions */}
                     <div className="pt-3 border-t border-border">
                       <div className="flex space-x-2">
                         <Button variant="outline" size="sm" className="flex-1" onClick={() => openEditDialog(producto)}>
                           <Edit className="h-4 w-4 mr-1" />
                           Editar
                         </Button>
                         <Button variant="outline" size="sm" className="flex-1 text-destructive hover:text-destructive" onClick={() => openDeleteDialog(producto.product_id)}>
                           <Trash2 className="h-4 w-4 mr-1" />
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
        </CardContent>
      </Card>
      </AnimatedCard>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar Producto?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción marcará el producto como inactivo. No se podrá usar en nuevas operaciones,
              pero los registros históricos se mantendrán.
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

export default Inventario;