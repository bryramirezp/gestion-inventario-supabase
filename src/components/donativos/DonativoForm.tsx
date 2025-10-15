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
import { Plus, Trash2, Package, Edit, User, Calendar, Building2, FileText, UserPlus, Search, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ArticuloDonativo {
  producto_id?: number;
  variante_id?: number;
  nombre: string;
  cantidad: number;
  precio_unitario: number;
  fecha_vencimiento?: string;
  almacen_id: number;
  unidad_medida_id: number;
  total: number;
}

interface DonativoFormProps {
  donadores: any[];
  tiposDonadores: any[];
  almacenes: any[];
  variantes: any[];
  unidadesMedida: any[];
  onCreateDonador: (data: any) => Promise<any>;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const DonativoForm = ({
  donadores,
  tiposDonadores,
  almacenes,
  variantes,
  unidadesMedida,
  onCreateDonador,
  onSuccess,
  onCancel
}: DonativoFormProps) => {
  const { toast } = useToast();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    donador_id: '',
    fecha: new Date().toISOString().split('T')[0],
    observaciones: '',
    articulos: [] as ArticuloDonativo[]
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNuevoDonadorDialog, setShowNuevoDonadorDialog] = useState(false);
  const [nuevoDonadorData, setNuevoDonadorData] = useState({
    nombre_completo: '',
    correo: '',
    telefono: '',
    tipo_donador_id: ''
  });

  // Calculate total
  const total = useMemo(() =>
    formData.articulos.reduce((sum, art) => sum + art.total, 0),
    [formData.articulos]
  );

  // Filter active warehouses and variants
  const almacenesActivos = useMemo(() =>
    almacenes.filter(a => a.activo),
    [almacenes]
  );

  const variantesActivas = useMemo(() =>
    variantes.filter(v => v.activo),
    [variantes]
  );

  // Add article row
  const addArticulo = useCallback(() => {
    const newArticulo: ArticuloDonativo = {
      variante_id: 0,
      nombre: '',
      cantidad: 1,
      precio_unitario: 0,
      almacen_id: almacenesActivos?.[0]?.almacen_id || 0,
      unidad_medida_id: unidadesMedida?.[0]?.unidad_medida_id || 0,
      total: 0
    };
    setFormData(prev => ({
      ...prev,
      articulos: [...prev.articulos, newArticulo]
    }));
  }, [almacenesActivos, unidadesMedida]);

  // Remove article row
  const removeArticulo = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      articulos: prev.articulos.filter((_, i) => i !== index)
    }));
  }, []);

  // Update article in row
  const updateArticulo = useCallback((index: number, field: keyof ArticuloDonativo, value: any) => {
    setFormData(prev => {
      const newArticulos = [...prev.articulos];
      const articulo = { ...newArticulos[index] };

      if (field === 'cantidad' || field === 'precio_unitario') {
        articulo[field] = parseFloat(value) || 0;
      } else {
        (articulo as any)[field] = value;
      }

      // Recalculate total
      articulo.total = articulo.cantidad * articulo.precio_unitario;

      newArticulos[index] = articulo;
      return { ...prev, articulos: newArticulos };
    });
  }, [variantesActivas]);


  // Validate form
  const validateForm = useCallback((): boolean => {
    if (!formData.donador_id) {
      toast({
        title: "Error de validación",
        description: "Debe seleccionar un donador",
        variant: "destructive",
      });
      return false;
    }

    if (formData.articulos.length === 0) {
      toast({
        title: "Error de validación",
        description: "Debe agregar al menos un artículo",
        variant: "destructive",
      });
      return false;
    }

    // Validate each article
    for (let i = 0; i < formData.articulos.length; i++) {
      const art = formData.articulos[i];
      if (!art.nombre.trim()) {
        toast({
          title: "Error de validación",
          description: `Artículo ${i + 1}: Debe ingresar el nombre del producto`,
          variant: "destructive",
        });
        return false;
      }
      if (art.cantidad <= 0) {
        toast({
          title: "Error de validación",
          description: `Artículo ${i + 1}: La cantidad debe ser mayor a 0`,
          variant: "destructive",
        });
        return false;
      }
      if (art.precio_unitario < 0) {
        toast({
          title: "Error de validación",
          description: `Artículo ${i + 1}: El precio unitario no puede ser negativo`,
          variant: "destructive",
        });
        return false;
      }
      if (!art.almacen_id) {
        toast({
          title: "Error de validación",
          description: `Artículo ${i + 1}: Debe seleccionar un almacén`,
          variant: "destructive",
        });
        return false;
      }
      if (!art.unidad_medida_id || art.unidad_medida_id === 0) {
        toast({
          title: "Error de validación",
          description: `Artículo ${i + 1}: Debe seleccionar una unidad de medida`,
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
      // 1. Create the donativo record
      const { data: donativoData, error: donativoError } = await supabase
        .from('donativos')
        .insert({
          donador_id: parseInt(formData.donador_id),
          fecha: formData.fecha,
          observaciones: formData.observaciones || null,
          usuario_id: user?.id
        })
        .select()
        .single();

      if (donativoError) throw donativoError;

      // 2. Create lote records and inventory movements for each article
      for (const articulo of formData.articulos) {
        // Create lote record
        const { data: loteData, error: loteError } = await supabase
          .from('lotes')
          .insert({
            variante_id: articulo.variante_id || 1, // Default to first variant if not selected
            almacen_id: articulo.almacen_id,
            cantidad_original: articulo.cantidad,
            cantidad_actual: articulo.cantidad,
            costo_unitario: articulo.precio_unitario,
            fecha_vencimiento: articulo.fecha_vencimiento || null,
            donativo_id: donativoData.donativo_id,
            numero_lote_externo: null,
            observaciones: null,
            unidad_medida_id: articulo.unidad_medida_id
          })
          .select()
          .single();

        if (loteError) throw loteError;

        // Create inventory movement record (Entrada por Donativo)
        const { error: movimientoError } = await supabase
          .from('movimientosinventario')
          .insert({
            lote_id: loteData.lote_id,
            tipo_movimiento_id: 1, // Assuming 1 is "Entrada por Donativo"
            cantidad: articulo.cantidad,
            usuario_id: user?.id,
            observaciones: `Entrada por donativo ${donativoData.donativo_id}`
          });

        if (movimientoError) throw movimientoError;
      }

      toast({
        title: "Donativo registrado exitosamente",
        description: `Se registraron ${formData.articulos.length} artículos en el inventario`,
      });

      // Reset form
      setFormData({
        donador_id: '',
        fecha: new Date().toISOString().split('T')[0],
        observaciones: '',
        articulos: []
      });

      onSuccess?.();
    } catch (error) {
      console.error('Error submitting donativo:', error);
      toast({
        title: "Error al registrar donativo",
        description: error instanceof Error ? error.message : "Ocurrió un error inesperado",
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

      {/* Información General del Donativo */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Información General del Donativo
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Esta sección contiene la información general del donativo, que corresponde principalmente a la tabla donativos.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Donador */}
            <div>
              <Label htmlFor="donador" className="text-sm font-medium text-foreground mb-2 block flex items-center gap-2">
                <User className="h-4 w-4" />
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

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNuevoDonadorDialog(true)}
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted/50 rounded-md"
                  title="Agregar nuevo donador"
                >
                  <UserPlus className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                </Button>
              </div>
            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Fecha del Donativo */}
            <div>
              <Label htmlFor="fecha" className="text-sm font-medium text-foreground mb-2 block flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Fecha del Donativo *
              </Label>
              <Input
                id="fecha"
                type="date"
                value={formData.fecha}
                onChange={(e) => setFormData(prev => ({ ...prev, fecha: e.target.value }))}
              />
            </div>

            {/* Registrado por */}
            <div>
              <Label className="text-sm font-medium text-foreground mb-2 block">
                Registrado por
              </Label>
              <Input
                value={user?.email || 'Usuario no identificado'}
                disabled
                className="bg-muted"
              />
            </div>
          </div>

          {/* Observaciones Generales */}
          <div>
            <Label htmlFor="observaciones" className="text-sm font-medium text-foreground mb-2 block">
              Observaciones Generales
            </Label>
            <Textarea
              id="observaciones"
              placeholder="Detalles adicionales del donativo en general..."
              value={formData.observaciones}
              onChange={(e) => setFormData(prev => ({ ...prev, observaciones: e.target.value }))}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Detalles de los Artículos Donados */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Package className="h-5 w-5" />
                Detalles de los Artículos Donados
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Aquí puedes agregar los artículos donados. Cada fila representa un lote que se creará en el inventario con su información específica.
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={addArticulo} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Añadir Artículo
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {formData.articulos.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hay artículos agregados</p>
              <p className="text-sm">Haga clic en "Añadir Artículo" para comenzar</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Producto</TableHead>
                      <TableHead className="w-24">Unidad</TableHead>
                      <TableHead className="w-24">Cantidad</TableHead>
                      <TableHead className="w-32">Valor Unitario</TableHead>
                      <TableHead className="w-32">Fecha Vencimiento</TableHead>
                      <TableHead className="w-32">Almacén Destino</TableHead>
                      <TableHead className="w-24">Subtotal</TableHead>
                      <TableHead className="w-16">Acción</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {formData.articulos.map((articulo, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Input
                            type="text"
                            value={articulo.nombre}
                            onChange={(e) => updateArticulo(index, 'nombre', e.target.value)}
                            placeholder="Descripción completa del producto..."
                            className="w-full"
                          />
                        </TableCell>
                        <TableCell>
                          <Select
                            value={articulo.unidad_medida_id.toString()}
                            onValueChange={(value) => updateArticulo(index, 'unidad_medida_id', parseInt(value))}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {unidadesMedida?.map(unidad => (
                                <SelectItem key={unidad.unidad_medida_id} value={unidad.unidad_medida_id.toString()}>
                                  {unidad.nombre} ({unidad.abreviatura})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="1"
                            step="1"
                            value={articulo.cantidad}
                            onChange={(e) => updateArticulo(index, 'cantidad', e.target.value)}
                            className="w-full"
                            placeholder="Ej: 10"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            step="1"
                            value={articulo.precio_unitario}
                            onChange={(e) => updateArticulo(index, 'precio_unitario', e.target.value)}
                            className="w-full"
                            placeholder="Ej: 50"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="date"
                            value={articulo.fecha_vencimiento || ''}
                            onChange={(e) => updateArticulo(index, 'fecha_vencimiento', e.target.value)}
                            className="w-full"
                          />
                        </TableCell>
                        <TableCell>
                          <Select
                            value={articulo.almacen_id.toString()}
                            onValueChange={(value) => updateArticulo(index, 'almacen_id', parseInt(value))}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {almacenesActivos.map(almacen => (
                                <SelectItem key={almacen.almacen_id} value={almacen.almacen_id.toString()}>
                                  {almacen.nombre}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="font-medium">
                          ${articulo.total.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeArticulo(index)}
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