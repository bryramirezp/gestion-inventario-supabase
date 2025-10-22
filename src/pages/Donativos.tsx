import { useState, useEffect } from 'react';
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from '@/components/ui/card';
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
import { Textarea } from '@/components/ui/textarea';
import { Building2, Plus, Search, Receipt, TrendingUp, Users, DollarSign, Trash2, Settings, Edit, UserPlus, UserCheck, UserX } from 'lucide-react';
import AnimatedCard from '@/components/ui/animated-card';
import AnimatedCounter from '@/components/ui/animated-counter';
import SplitText from '@/components/ui/split-text';
import { useDonativos } from '@/hooks/useDonativos'; // tu hook
import { useAuth } from '@/hooks/useAuth';
import { useProductos } from '@/hooks/useProductos';
import { useAlmacenes } from '@/hooks/useAlmacenes';
import { supabase } from '@/integrations/supabase/client';
import { DonativoForm } from '@/components/donativos/DonativoForm';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from '@/components/ui/alert-dialog';

const Donativos = () => {
  const { user } = useAuth();
  const { almacenes } = useAlmacenes();
  const { variantes } = useProductos();
  const [unidadesMedida, setUnidadesMedida] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [donativoToDelete, setDonativoToDelete] = useState<number | null>(null);
  const [registrarDialogOpen, setRegistrarDialogOpen] = useState(false);
  const [donadorManagementOpen, setDonadorManagementOpen] = useState(false);

  // Estados para confirmaciones de donadores
  const [toggleStatusDialogOpen, setToggleStatusDialogOpen] = useState(false);
  const [deleteDonadorDialogOpen, setDeleteDonadorDialogOpen] = useState(false);
  const [donadorToToggle, setDonadorToToggle] = useState<any>(null);
  const [donadorToDelete, setDonadorToDelete] = useState<any>(null);
  const [createDonadorOpen, setCreateDonadorOpen] = useState(false);
  const [newDonadorData, setNewDonadorData] = useState({
    nombre_completo: '',
    tipo_donador_id: '',
    correo: '',
    telefono: '',
    direccion: '',
    nombre_contacto: ''
  });

  const { donativos, donadores, tiposDonadores, createDonador, createDonativo, updateDonativo, deleteDonativo, toggleDonadorStatus, deleteDonador: deleteDonadorHook, totalDonativos, totalConDescuento } = useDonativos();

  // Fetch unidades de medida
  useEffect(() => {
    const fetchUnidadesMedida = async () => {
      const { data, error } = await supabase
        .from('unidadesmedida')
        .select('*')
        .order('nombre');

      if (!error && data) {
        setUnidadesMedida(data);
      }
    };

    fetchUnidadesMedida();
  }, []);

  const filteredDonativos = donativos.filter(d =>
    donadores.find(don => don.donador_id === d.donador_id)?.nombre_completo
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const handleDelete = async () => {
    if (!donativoToDelete) return;

    const result = await deleteDonativo(donativoToDelete);
    if (result.error) {
      alert('Error al eliminar el donativo: ' + result.error.message);
    }

    setDeleteDialogOpen(false);
    setDonativoToDelete(null);
  };

  const openDeleteDialog = (donativoId: number) => {
    setDonativoToDelete(donativoId);
    setDeleteDialogOpen(true);
  };

  // Donador management handlers
  const handleEditDonador = (donador: any) => {
    // TODO: Implement edit functionality
    console.log('Edit donador:', donador);
  };

  const handleToggleDonadorStatus = async (donadorId: number) => {
    const result = await toggleDonadorStatus(donadorId);
    if (result.error) {
      alert('Error al cambiar el estado del donador: ' + result.error.message);
    }
    setToggleStatusDialogOpen(false);
    setDonadorToToggle(null);
  };

  const handleDeleteDonador = async () => {
    if (!donadorToDelete) return;

    const result = await deleteDonadorHook(donadorToDelete.donador_id);
    if (result.error) {
      alert('Error al eliminar el donador: ' + result.error.message);
    }
    setDeleteDonadorDialogOpen(false);
    setDonadorToDelete(null);
  };

  const openToggleStatusDialog = (donador: any) => {
    setDonadorToToggle(donador);
    setToggleStatusDialogOpen(true);
  };

  const openDeleteDonadorDialog = (donador: any) => {
    setDonadorToDelete(donador);
    setDeleteDonadorDialogOpen(true);
  };

  const handleCreateDonador = async () => {
    if (!newDonadorData.nombre_completo || !newDonadorData.tipo_donador_id) {
      alert('Por favor complete los campos requeridos: Nombre completo y Tipo de donador');
      return;
    }

    const result = await createDonador({
      nombre_completo: newDonadorData.nombre_completo,
      tipo_donador_id: parseInt(newDonadorData.tipo_donador_id),
      correo: newDonadorData.correo || null,
      telefono: newDonadorData.telefono || null,
      direccion: newDonadorData.direccion || null,
      nombre_contacto: newDonadorData.nombre_contacto || null
    });

    if (result.error) {
      alert('Error al crear el donador: ' + result.error.message);
    } else {
      // Reset form
      setNewDonadorData({
        nombre_completo: '',
        tipo_donador_id: '',
        correo: '',
        telefono: '',
        direccion: '',
        nombre_contacto: ''
      });
      setCreateDonadorOpen(false);
    }
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'recibido': return <Badge className="bg-success text-success-foreground">Recibido</Badge>;
      case 'procesado': return <Badge className="bg-primary text-primary-foreground">Procesado</Badge>;
      case 'distribuido': return <Badge className="bg-warning text-warning-foreground">Distribuido</Badge>;
      case 'archivado': return <Badge variant="secondary">Archivado</Badge>;
      default: return <Badge variant="secondary">{estado}</Badge>;
    }
  };

  const getTipoBadge = (tipo: string) => {
    const colors = {
      'Empresa': 'bg-blue-100 text-blue-800',
      'Individual': 'bg-green-100 text-green-800',
      'ONG': 'bg-purple-100 text-purple-800'
    };
    return <Badge className={colors[tipo as keyof typeof colors]}>{tipo}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <AnimatedCard>
        <div className="flex items-center justify-between">
          <div>
            <SplitText
              text="Donativos"
              className="text-3xl font-bold text-foreground"
              duration={0.8}
              stagger={0.05}
            />
            <p className="text-muted-foreground mt-2">
              Gestión de donaciones y registro de donadores
            </p>
          </div>

        <div className="flex items-center space-x-3">
          <Dialog open={registrarDialogOpen} onOpenChange={setRegistrarDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Registrar Donativo</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
              <DonativoForm
                donadores={donadores}
                tiposDonadores={tiposDonadores}
                almacenes={almacenes}
                variantes={variantes}
                unidadesMedida={unidadesMedida}
                onCreateDonador={createDonador}
                onSuccess={() => {
                  setRegistrarDialogOpen(false);
                  // Refresh data could be added here if needed
                }}
                onCancel={() => {
                  setRegistrarDialogOpen(false);
                }}
              />
            </DialogContent>
          </Dialog>

          <Button
            onClick={() => setDonadorManagementOpen(true)}
            className="flex items-center space-x-2"
          >
            <UserPlus className="h-4 w-4" />
            <span>Gestionar Donadores</span>
          </Button>
        </div>
        </div>
      </AnimatedCard>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AnimatedCard delay={0.1} direction="up">
          <Card className="border-l-4 border-l-primary shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Donativos</CardTitle>
              <Building2 className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                <AnimatedCounter value={donativos.length} delay={0.5} />
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-success">+12%</span> desde el mes pasado
              </p>
            </CardContent>
          </Card>
        </AnimatedCard>

        <AnimatedCard delay={0.2} direction="up">
          <Card className="border-l-4 border-l-success shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
              <DollarSign className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">
                $<AnimatedCounter value={totalDonativos} delay={0.7} />
              </div>
              <p className="text-xs text-muted-foreground">
                Donaciones valoradas
              </p>
            </CardContent>
          </Card>
        </AnimatedCard>

        <AnimatedCard delay={0.3} direction="up">
          <Card className="border-l-4 border-l-warning shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Donadores Activos</CardTitle>
              <Users className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">
                <AnimatedCounter value={donadores.length} delay={0.9} />
              </div>
              <p className="text-xs text-muted-foreground">
                Registrados activos
              </p>
            </CardContent>
          </Card>
        </AnimatedCard>

      </div>

      {/* Tabla de Donativos */}
      <AnimatedCard delay={0.2} direction="left">
        <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Receipt className="h-5 w-5 text-primary" />
            <span>Registro de Donativos</span>
          </CardTitle>
          <div className="flex items-center pt-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar donador..."
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
                  <TableHead>Donador</TableHead>
                  <TableHead>Valor Total</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDonativos.map(d => {
                  const donadorObj = donadores.find(don => don.donador_id === d.donador_id);
                  return (
                    <TableRow key={d.donativo_id}>
                      <TableCell>{donadorObj?.nombre_completo || 'Desconocido'}</TableCell>
                      <TableCell>${d.total.toLocaleString()}</TableCell>
                      <TableCell>{getEstadoBadge(d.estado)}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDeleteDialog(d.donativo_id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
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
            <AlertDialogTitle>¿Eliminar Donativo?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El donativo será eliminado permanentemente
              de la base de datos.
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

      {/* Donador Management Dialog */}
      <Dialog open={donadorManagementOpen} onOpenChange={setDonadorManagementOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Gestión de Donadores</DialogTitle>
            <DialogDescription>
              Administra los donadores registrados en el sistema
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Donadores Registrados</h3>
              <Button
                onClick={() => setCreateDonadorOpen(!createDonadorOpen)}
                className="flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Agregar Donador</span>
              </Button>
            </div>

            {/* Create Donador Form */}
            {createDonadorOpen && (
              <Card>
                <CardHeader>
                  <CardTitle>Nuevo Donador</CardTitle>
                  <CardDescription>
                    Complete los datos del nuevo donador
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nombre_completo">Nombre o Razón Social *</Label>
                      <Input
                        id="nombre_completo"
                        value={newDonadorData.nombre_completo}
                        onChange={(e) => setNewDonadorData(prev => ({ ...prev, nombre_completo: e.target.value }))}
                        placeholder="Ingrese el nombre o razón social"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nombre_contacto">Nombre de Contacto</Label>
                      <Input
                        id="nombre_contacto"
                        value={newDonadorData.nombre_contacto}
                        onChange={(e) => setNewDonadorData(prev => ({ ...prev, nombre_contacto: e.target.value }))}
                        placeholder="Persona de contacto"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tipo_donador">Tipo de Donador *</Label>
                      <Select
                        value={newDonadorData.tipo_donador_id}
                        onValueChange={(value) => setNewDonadorData(prev => ({ ...prev, tipo_donador_id: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione un tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          {tiposDonadores?.map((tipo) => (
                            <SelectItem key={tipo?.donor_type_id} value={tipo?.donor_type_id?.toString()}>
                              {tipo?.type_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="correo">Correo Electrónico</Label>
                      <Input
                        id="correo"
                        type="email"
                        value={newDonadorData.correo}
                        onChange={(e) => setNewDonadorData(prev => ({ ...prev, correo: e.target.value }))}
                        placeholder="correo@ejemplo.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telefono">Teléfono</Label>
                      <Input
                        id="telefono"
                        value={newDonadorData.telefono}
                        onChange={(e) => setNewDonadorData(prev => ({ ...prev, telefono: e.target.value }))}
                        placeholder="Número de teléfono"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="direccion">Dirección</Label>
                      <Input
                        id="direccion"
                        value={newDonadorData.direccion}
                        onChange={(e) => setNewDonadorData(prev => ({ ...prev, direccion: e.target.value }))}
                        placeholder="Dirección completa del donador"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setCreateDonadorOpen(false);
                        setNewDonadorData({
                          nombre_completo: '',
                          tipo_donador_id: '',
                          correo: '',
                          telefono: '',
                          direccion: '',
                          nombre_contacto: ''
                        });
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button onClick={handleCreateDonador}>
                      Crear Donador
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Donadores table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Contacto</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {donadores.map((donador) => {
                    const tipoDonador = tiposDonadores.find(t => t.tipo_donador_id === donador.tipo_donador_id);
                    return (
                      <TableRow key={donador.donador_id}>
                        <TableCell className="font-medium">{donador.nombre_completo}</TableCell>
                        <TableCell>{tipoDonador?.nombre || 'Sin tipo'}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {donador.correo && <div>{donador.correo}</div>}
                            {donador.telefono && <div>{donador.telefono}</div>}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={donador.activo ? "default" : "secondary"}>
                            {donador.activo ? 'Activo' : 'Inactivo'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditDonador(donador)}
                              title="Editar donador"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openToggleStatusDialog(donador)}
                              className={donador.activo ? "text-orange-600 hover:text-orange-600" : "text-green-600 hover:text-green-600"}
                              title={donador.activo ? "Desactivar donador" : "Activar donador"}
                            >
                              {donador.activo ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openDeleteDonadorDialog(donador)}
                              className="text-destructive hover:text-destructive"
                              title="Eliminar donador permanentemente"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDonadorManagementOpen(false)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Toggle Status Confirmation Dialog */}
      <AlertDialog open={toggleStatusDialogOpen} onOpenChange={setToggleStatusDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {donadorToToggle?.activo ? 'Desactivar Donador' : 'Activar Donador'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Vas a {donadorToToggle?.activo ? 'desactivar' : 'activar'} a {donadorToToggle?.nombre_completo}.
              {donadorToToggle?.activo
                ? ' El donador no podrá ser seleccionado en nuevos donativos, pero sus registros históricos se mantendrán.'
                : ' El donador podrá ser seleccionado nuevamente en donativos.'
              }
              <br /><br />
              ¿Estás seguro que quieres hacerlo?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => handleToggleDonadorStatus(donadorToToggle?.donador_id)}
              className={donadorToToggle?.activo ? "bg-orange-600 hover:bg-orange-700" : "bg-green-600 hover:bg-green-700"}
            >
              {donadorToToggle?.activo ? 'Desactivar' : 'Activar'}
            </AlertDialogAction>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Donador Confirmation Dialog */}
      <AlertDialog open={deleteDonadorDialogOpen} onOpenChange={setDeleteDonadorDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar Donador Permanentemente</AlertDialogTitle>
            <AlertDialogDescription>
              Vas a eliminar a {donadorToDelete?.nombre_completo}.
              <br /><br />
              <strong>Esta acción no se puede deshacer.</strong> El donador será eliminado completamente de la base de datos junto con todos sus registros históricos.
              <br /><br />
              ¿Estás seguro que quieres hacerlo?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={handleDeleteDonador}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar Permanentemente
            </AlertDialogAction>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Donativos;

