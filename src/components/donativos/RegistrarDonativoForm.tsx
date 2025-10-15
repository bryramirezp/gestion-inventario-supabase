import { useState, useEffect, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Plus, Trash2, Package } from 'lucide-react';
import { useAlmacenes } from '@/hooks/useAlmacenes';
import { useProductos } from '@/hooks/useProductos';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface ProductoDetalle {
  variante_id: number;
  nombre: string;
  cantidad: number;
  precio_unitario: number;
  total: number;
}

interface DonativoFormData {
  donador_id: string;
  almacen_id: string;
  fecha: string;
  observaciones: string;
  productos: ProductoDetalle[];
}

interface RegistrarDonativoFormProps {
  donadores: any[];
  tiposDonadores: any[];
  onRegistrarDonativo: (data: {
    donador_id: number;
    almacen_id: number;
    fecha: string;
    observaciones?: string;
    usuario_id: string;
    productos: Array<{
      variante_id: number;
      cantidad: number;
      precio_unitario: number;
    }>;
  }) => Promise<any>;
  onCreateDonador: (data: any) => Promise<any>;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const RegistrarDonativoForm = ({ donadores, tiposDonadores, onRegistrarDonativo, onCreateDonador, onSuccess, onCancel }: RegistrarDonativoFormProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { almacenes } = useAlmacenes();
  const { productos, variantes } = useProductos();

  const [formData, setFormData] = useState<DonativoFormData>({
    donador_id: '',
    almacen_id: '',
    fecha: new Date().toISOString().split('T')[0],
    observaciones: '',
    productos: []
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNuevoDonadorDialog, setShowNuevoDonadorDialog] = useState(false);
  const [nuevoDonadorData, setNuevoDonadorData] = useState({
    nombre_completo: '',
    correo: '',
    telefono: '',
    tipo_donador_id: ''
  });

  // Calculate total - Optimizado con useMemo
  const total = useMemo(() =>
    formData.productos.reduce((sum, prod) => sum + prod.total, 0),
    [formData.productos]
  );

  // Filter almacenes and productos - Optimizados con useMemo
  const almacenesActivos = useMemo(() =>
    almacenes.filter(a => a.activo),
    [almacenes]
  );

  const variantesActivas = useMemo(() =>
    variantes.filter(v => v.activo),
    [variantes]
  );

  // Add product row - Optimizado con useCallback
  const addProducto = useCallback(() => {
    const newProducto: ProductoDetalle = {
      variante_id: 0,
      nombre: '',
      cantidad: 1,
      precio_unitario: 0,
      total: 0
    };
    setFormData(prev => ({
      ...prev,
      productos: [...prev.productos, newProducto]
    }));
  }, []);

  // Remove product row - Optimizado con useCallback
  const removeProducto = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      productos: prev.productos.filter((_, i) => i !== index)
    }));
  }, []);

  // Update product in row - Optimizado con useCallback
  const updateProducto = useCallback((index: number, field: keyof ProductoDetalle, value: any) => {
    setFormData(prev => {
      const newProductos = [...prev.productos];
      const producto = { ...newProductos[index] };

      if (field === 'variante_id') {
        const selectedVariant = variantesActivas.find(v => v.variante_id === parseInt(value));
        if (selectedVariant) {
          producto.variante_id = selectedVariant.variante_id;
          producto.nombre = `${selectedVariant.producto?.nombre || 'Producto'} - ${selectedVariant.marca?.nombre || 'Sin marca'} ${selectedVariant.presentacion || ''}`.trim();
          producto.precio_unitario = selectedVariant.precio_referencia || 0;
        }
      } else if (field === 'cantidad' || field === 'precio_unitario') {
        producto[field] = parseFloat(value) || 0;
      } else {
        (producto as any)[field] = value;
      }

      // Recalculate total
      producto.total = producto.cantidad * producto.precio_unitario;

      newProductos[index] = producto;
      return { ...prev, productos: newProductos };
    });
  }, [variantesActivas]);

  // Validate form - Optimizado con useCallback
  const validateForm = useCallback((): boolean => {
    if (!formData.donador_id) {
      toast({
        title: "Error de validación",
        description: "Debe seleccionar un donador",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.almacen_id) {
      toast({
        title: "Error de validación",
        description: "Debe seleccionar un almacén receptor",
        variant: "destructive",
      });
      return false;
    }

    if (formData.productos.length === 0) {
      toast({
        title: "Error de validación",
        description: "Debe agregar al menos un producto",
        variant: "destructive",
      });
      return false;
    }

    // Validate each product
    for (let i = 0; i < formData.productos.length; i++) {
      const prod = formData.productos[i];
      if (!prod.variante_id || prod.variante_id === 0) {
        toast({
          title: "Error de validación",
          description: `Producto ${i + 1}: Debe seleccionar una variante de producto`,
          variant: "destructive",
        });
        return false;
      }
      if (prod.cantidad <= 0) {
        toast({
          title: "Error de validación",
          description: `Producto ${i + 1}: La cantidad debe ser mayor a 0`,
          variant: "destructive",
        });
        return false;
      }
      if (prod.precio_unitario < 0) {
        toast({
          title: "Error de validación",
          description: `Producto ${i + 1}: El precio unitario no puede ser negativo`,
          variant: "destructive",
        });
        return false;
      }
    }

    return true;
  }, [formData, toast]);

  // Submit form
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const donativoData = {
        donador_id: parseInt(formData.donador_id),
        almacen_id: parseInt(formData.almacen_id),
        fecha: formData.fecha,
        observaciones: formData.observaciones || undefined,
        usuario_id: user?.id || '',
        productos: formData.productos.map(p => ({
          variante_id: p.variante_id,
          cantidad: p.cantidad,
          precio_unitario: p.precio_unitario
        }))
      };

      const result = await onRegistrarDonativo(donativoData);

      if (result.error) {
        toast({
          title: "Error al registrar donativo",
          description: result.error.message || "Ocurrió un error inesperado",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Donativo registrado exitosamente",
          description: "El donativo se registró correctamente y se agregó al inventario",
        });

        // Reset form
        setFormData({
          donador_id: '',
          almacen_id: '',
          fecha: new Date().toISOString().split('T')[0],
          observaciones: '',
          productos: []
        });

        onSuccess?.();
      }
    } catch (error) {
      console.error('Error submitting donativo:', error);
      toast({
        title: "Error inesperado",
        description: "Ocurrió un error al procesar el donativo",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  // Handle create donador
  const handleCreateDonador = async () => {
    if (!nuevoDonadorData.nombre_completo.trim()) {
      toast({
        title: "Error de validación",
        description: "El nombre completo es obligatorio",
        variant: "destructive",
      });
      return;
    }

    if (!nuevoDonadorData.tipo_donador_id) {
      toast({
        title: "Error de validación",
        description: "Debe seleccionar un tipo de donador",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await onCreateDonador({
        nombre_completo: nuevoDonadorData.nombre_completo,
        correo: nuevoDonadorData.correo || undefined,
        telefono: nuevoDonadorData.telefono || undefined,
        tipo_donador_id: parseInt(nuevoDonadorData.tipo_donador_id)
      });

      if (result.error) {
        toast({
          title: "Error al crear donador",
          description: result.error.message || "Ocurrió un error inesperado",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Donador creado",
          description: "El donador se creó correctamente",
        });

        // Reset form and close dialog
        setNuevoDonadorData({
          nombre_completo: '',
          correo: '',
          telefono: '',
          tipo_donador_id: ''
        });
        setShowNuevoDonadorDialog(false);
      }
    } catch (error) {
      console.error('Error creating donador:', error);
      toast({
        title: "Error inesperado",
        description: "Ocurrió un error al crear el donador",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 max-h-[80vh] overflow-y-auto">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Registrar Nuevo Donativo</h2>
        <p className="text-muted-foreground">Complete la información del donativo en especie</p>
      </div>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Información General</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="donador" className="text-sm font-medium text-foreground mb-2 block">
                Donador *
              </Label>
              <p className="text-xs text-muted-foreground mb-2">Selecciona un donador existente o crea uno nuevo</p>
              <div className="relative">
                <Select
                  value={formData.donador_id}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, donador_id: value }))}
                >
                  <SelectTrigger className="pr-12">
                    <SelectValue placeholder="Seleccionar donador..." />
                  </SelectTrigger>
                  <SelectContent>
                    {donadores.map(donador => {
                      const tipoDonador = tiposDonadores.find(t => t.tipo_donador_id === donador.tipo_donador_id);
                      return (
                        <SelectItem key={donador.donador_id} value={donador.donador_id.toString()}>
                          {donador.nombre_completo} ({tipoDonador?.nombre || 'Sin tipo'})
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>

                {/* Botón integrado estéticamente */}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNuevoDonadorDialog(true)}
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted/50 rounded-md"
                  title="Agregar nuevo donador"
                >
                  <Plus className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="almacen">Almacén Receptor *</Label>
              <Select
                value={formData.almacen_id}
                onValueChange={(value) => setFormData(prev => ({ ...prev, almacen_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar almacén..." />
                </SelectTrigger>
                <SelectContent>
                  {almacenesActivos.map(almacen => (
                    <SelectItem key={almacen.almacen_id} value={almacen.almacen_id.toString()}>
                      {almacen.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="fecha">Fecha</Label>
            <Input
              id="fecha"
              type="date"
              value={formData.fecha}
              onChange={(e) => setFormData(prev => ({ ...prev, fecha: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="observaciones">Observaciones</Label>
            <Textarea
              id="observaciones"
              placeholder="Detalles adicionales del donativo..."
              value={formData.observaciones}
              onChange={(e) => setFormData(prev => ({ ...prev, observaciones: e.target.value }))}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Products Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Productos del Donativo</CardTitle>
            <Button onClick={addProducto} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Agregar Producto
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {formData.productos.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hay productos agregados</p>
              <p className="text-sm">Haga clic en "Agregar Producto" para comenzar</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Producto</TableHead>
                      <TableHead className="w-24">Cantidad</TableHead>
                      <TableHead className="w-32">Precio Unit.</TableHead>
                      <TableHead className="w-24">Total</TableHead>
                      <TableHead className="w-16"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {formData.productos.map((producto, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Select
                            value={producto.variante_id.toString()}
                            onValueChange={(value) => updateProducto(index, 'variante_id', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar..." />
                            </SelectTrigger>
                            <SelectContent>
                              {variantesActivas.map(variante => (
                                <SelectItem key={variante.variante_id} value={variante.variante_id.toString()}>
                                  {variante.producto?.nombre || 'Producto'} - {variante.marca?.nombre || 'Sin marca'} {variante.presentacion || ''}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={producto.cantidad}
                            onChange={(e) => updateProducto(index, 'cantidad', e.target.value)}
                            className="w-full"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={producto.precio_unitario}
                            onChange={(e) => updateProducto(index, 'precio_unitario', e.target.value)}
                            className="w-full"
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          ${producto.total.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeProducto(index)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Total */}
              <div className="flex justify-end">
                <div className="bg-muted p-4 rounded-lg">
                  <div className="text-lg font-semibold">
                    Total: ${total.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Registrando...' : 'Registrar Donativo'}
        </Button>
      </div>

      {/* Nuevo Donador Dialog */}
      <Dialog open={showNuevoDonadorDialog} onOpenChange={setShowNuevoDonadorDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Nuevo Donador</DialogTitle>
            <DialogDescription>
              Ingresa la información del nuevo donador
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="nombre_completo">Nombre Completo *</Label>
              <Input
                id="nombre_completo"
                value={nuevoDonadorData.nombre_completo}
                onChange={(e) => setNuevoDonadorData(prev => ({ ...prev, nombre_completo: e.target.value }))}
                placeholder="Ej: Juan Pérez García"
              />
            </div>

            <div>
              <Label htmlFor="correo">Correo Electrónico</Label>
              <Input
                id="correo"
                type="email"
                value={nuevoDonadorData.correo}
                onChange={(e) => setNuevoDonadorData(prev => ({ ...prev, correo: e.target.value }))}
                placeholder="Ej: juan@email.com"
              />
            </div>

            <div>
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                value={nuevoDonadorData.telefono}
                onChange={(e) => setNuevoDonadorData(prev => ({ ...prev, telefono: e.target.value }))}
                placeholder="Ej: +52 55 1234 5678"
              />
            </div>

            <div>
              <Label htmlFor="tipo_donador">Tipo de Donador *</Label>
              <Select
                value={nuevoDonadorData.tipo_donador_id}
                onValueChange={(value) => setNuevoDonadorData(prev => ({ ...prev, tipo_donador_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo..." />
                </SelectTrigger>
                <SelectContent>
                  {tiposDonadores.map(tipo => (
                    <SelectItem key={tipo.tipo_donador_id} value={tipo.tipo_donador_id.toString()}>
                      {tipo.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowNuevoDonadorDialog(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleCreateDonador}>
              Crear Donador
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};