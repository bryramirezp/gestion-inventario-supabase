import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Settings,
  Building2,
  Database,
  Mail,
  Clock,
  Save
} from 'lucide-react';
import AnimatedCard from '@/components/ui/animated-card';
import SplitText from '@/components/ui/split-text';
import { useConfiguracion } from '@/hooks/useConfiguracion';
import { useToast } from '@/hooks/use-toast';

const Configuracion = () => {
  const { configuracion, saveConfiguracion, isLoading } = useConfiguracion();
  const { toast } = useToast();

  const [settings, setSettings] = useState({
    // Organización
    organization: {
      name: '',
      address: '',
      phone: '',
      email: '',
      taxId: ''
    },


    // Sistema
    system: {
      language: 'es',
      timezone: 'America/Monterrey',
      dateFormat: 'DD/MM/YYYY',
      currency: 'MXN',
      lowStockThreshold: 10,
      expiryWarningDays: 7
    },

  });

  // Cargar configuración desde la base de datos
  useEffect(() => {
    if (configuracion) {
      setSettings({
        organization: {
          name: configuracion['org.nombre'] || 'CASA PATERNA LA GRAN FAMILIA A.C.',
          address: configuracion['org.direccion'] || 'Carretera Nacional km 225, Los Rodríguez, Santiago, N.L.',
          phone: configuracion['org.telefono'] || '+52 8266 0060',
          email: configuracion['org.email'] || 'contacto@lagranfamilia.org.mx',
          taxId: configuracion['org.id_fiscal'] || 'LGF2024001'
        },
        system: {
          language: configuracion['system.language'] || 'es',
          timezone: configuracion['system.timezone'] || 'America/Monterrey',
          dateFormat: configuracion['system.date_format'] || 'DD/MM/YYYY',
          currency: configuracion['system.currency'] || 'MXN',
          lowStockThreshold: parseInt(configuracion['stock.minimo_alertas'] || '10'),
          expiryWarningDays: parseInt(configuracion['stock.dias_vencimiento'] || '30')
        },
      });
    }
  }, [configuracion]);

  const handleSave = async (section: string) => {
    try {
      let configToSave: Record<string, { valor: string; tipo?: 'string' | 'number' | 'boolean'; descripcion?: string }> = {};

      switch (section) {
        case 'organization':
          configToSave = {
            'org.nombre': { valor: settings.organization.name, descripcion: 'Nombre de la organización' },
            'org.direccion': { valor: settings.organization.address, descripcion: 'Dirección física' },
            'org.telefono': { valor: settings.organization.phone, descripcion: 'Teléfono de contacto' },
            'org.email': { valor: settings.organization.email, descripcion: 'Email de contacto' },
            'org.id_fiscal': { valor: settings.organization.taxId, descripcion: 'Identificación fiscal' }
          };
          break;


        case 'system':
          configToSave = {
            'system.language': { valor: settings.system.language, descripcion: 'Idioma del sistema' },
            'system.timezone': { valor: settings.system.timezone, descripcion: 'Zona horaria' },
            'system.date_format': { valor: settings.system.dateFormat, descripcion: 'Formato de fecha' },
            'system.currency': { valor: settings.system.currency, descripcion: 'Moneda' },
            'stock.minimo_alertas': { valor: settings.system.lowStockThreshold.toString(), tipo: 'number', descripcion: 'Stock mínimo para generar alertas' },
            'stock.dias_vencimiento': { valor: settings.system.expiryWarningDays.toString(), tipo: 'number', descripcion: 'Días antes del vencimiento para alertar' }
          };
          break;

      }

      const result = await saveConfiguracion(configToSave);

      if (result.success) {
        toast({
          title: "Configuración guardada",
          description: `La configuración de ${section} se guardó exitosamente en la base de datos`,
          duration: 3000,
        });
      } else {
        throw result.error;
      }
    } catch (error) {
      console.error('Error saving configuration:', error);
      alert(`Error al guardar ${section}: ${error}`);
    }
  };

  const updateSetting = (section: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [key]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <AnimatedCard>
        <div>
          <SplitText
            text="Configuración del Sistema"
            className="text-3xl font-bold text-foreground"
            duration={0.8}
            stagger={0.05}
          />
          <p className="text-muted-foreground mt-2">
            Gestión de parámetros y configuraciones del sistema
          </p>
        </div>
      </AnimatedCard>

      <AnimatedCard delay={0.1} direction="up">
        <Tabs defaultValue="organization" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="organization" className="flex items-center space-x-2">
            <Building2 className="h-4 w-4" />
            <span>Organización</span>
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Sistema</span>
          </TabsTrigger>
        </TabsList>

        {/* Organización */}
        <TabsContent value="organization">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building2 className="h-5 w-5" />
                <span>Información de la Organización</span>
              </CardTitle>
              <CardDescription>
                Datos generales de La Gran Familia
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="org-name">Nombre de la Organización</Label>
                  <Input
                    id="org-name"
                    value={settings.organization.name}
                    onChange={(e) => updateSetting('organization', 'name', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="org-phone">Teléfono</Label>
                  <Input
                    id="org-phone"
                    value={settings.organization.phone}
                    onChange={(e) => updateSetting('organization', 'phone', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="org-email">Correo Electrónico</Label>
                  <Input
                    id="org-email"
                    type="email"
                    value={settings.organization.email}
                    onChange={(e) => updateSetting('organization', 'email', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="org-taxId">ID Fiscal</Label>
                  <Input
                    id="org-taxId"
                    value={settings.organization.taxId}
                    onChange={(e) => updateSetting('organization', 'taxId', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="org-address">Dirección</Label>
                <Textarea
                  id="org-address"
                  value={settings.organization.address}
                  onChange={(e) => updateSetting('organization', 'address', e.target.value)}
                  rows={3}
                />
              </div>
              <Button onClick={() => handleSave('organization')} className="flex items-center space-x-2">
                <Save className="h-4 w-4" />
                <span>Guardar Cambios</span>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>


        {/* Sistema */}
        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Configuración del Sistema</span>
              </CardTitle>
              <CardDescription>
                Parámetros generales del sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="language">Idioma</Label>
                  <Select
                    value={settings.system.language}
                    onValueChange={(value) => updateSetting('system', 'language', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent side="bottom" align="start">
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="timezone">Zona Horaria</Label>
                  <Select
                    value={settings.system.timezone}
                    onValueChange={(value) => updateSetting('system', 'timezone', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent side="bottom" align="start">
                      <SelectItem value="America/Monterrey">America/Monterrey (GMT-6)</SelectItem>
                      <SelectItem value="America/Mexico_City">America/Mexico_City (GMT-6)</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="date-format">Formato de Fecha</Label>
                  <Select
                    value={settings.system.dateFormat}
                    onValueChange={(value) => updateSetting('system', 'dateFormat', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent side="bottom" align="start">
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="currency">Moneda</Label>
                  <Select
                    value={settings.system.currency}
                    onValueChange={(value) => updateSetting('system', 'currency', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent side="bottom" align="start">
                      <SelectItem value="MXN">MXN - Peso Mexicano</SelectItem>
                      <SelectItem value="USD">USD - Dólar Americano</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="low-stock-threshold">Umbral Stock Bajo</Label>
                  <Input
                    id="low-stock-threshold"
                    type="number"
                    value={settings.system.lowStockThreshold}
                    onChange={(e) => updateSetting('system', 'lowStockThreshold', parseInt(e.target.value))}
                  />
                </div>

                <div>
                  <Label htmlFor="expiry-warning-days">Días Aviso Vencimiento</Label>
                  <Input
                    id="expiry-warning-days"
                    type="number"
                    value={settings.system.expiryWarningDays}
                    onChange={(e) => updateSetting('system', 'expiryWarningDays', parseInt(e.target.value))}
                  />
                </div>
              </div>

              <Button onClick={() => handleSave('system')} className="flex items-center space-x-2">
                <Save className="h-4 w-4" />
                <span>Guardar Configuración</span>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        </Tabs>
      </AnimatedCard>
    </div>
  );
};

export default Configuracion;