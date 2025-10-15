import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import AnimatedCard from '@/components/ui/animated-card';
import AnimatedCounter from '@/components/ui/animated-counter';
import SplitText from '@/components/ui/split-text';
import {
  Package,
  TrendingUp,
  AlertTriangle,
  Users,
  DollarSign,
  Clock,
  Building2,
  ChefHat
} from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { useProductos } from '@/hooks/useProductos';

const Dashboard = () => {
  const { notifications } = useNotifications();
  const { productos, getStockTotalProducto } = useProductos();

  // Calculate real stats from database
  const stats = {
    totalProducts: productos.length,
    totalValue: productos.reduce((total, p) => total + (getStockTotalProducto(p.producto_id) * (p.precio_referencia || 0)), 0),
    lowStock: productos.filter(p => getStockTotalProducto(p.producto_id) <= 10).length,
    expiringSoon: 0, // TODO: Implement when expiry dates are added
    activeUsers: 0, // TODO: Implement when user tracking is added
    monthlyDonations: 0, // TODO: Implement when donation tracking is added
    kitchenConsumption: 0, // TODO: Implement when consumption tracking is added
    bazarSales: 0 // TODO: Implement when sales tracking is added
  };

  // Use real notifications from the hook
  const recentAlerts = notifications.slice(0, 5).map(notification => ({
    id: notification.id,
    type: notification.type,
    message: notification.message,
    priority: notification.priority
  }));

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <AnimatedCard>
        <div>
          <SplitText 
            text="Dashboard" 
            className="text-3xl font-bold text-foreground"
            duration={0.8}
            stagger={0.05}
          />
          <p className="text-muted-foreground mt-2">
            Resumen general del sistema de inventario de La Gran Familia
          </p>
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
                <AnimatedCounter value={stats.totalProducts} delay={0.5} />
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
                $<AnimatedCounter value={stats.totalValue} delay={0.7} />
              </div>
              <p className="text-xs text-muted-foreground">
                Inventario valorado
              </p>
            </CardContent>
          </Card>
        </AnimatedCard>

        <AnimatedCard delay={0.3} direction="up">
          <Card className="border-l-4 border-l-warning shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Stock Bajo</CardTitle>
              <AlertTriangle className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">
                <AnimatedCounter value={stats.lowStock} delay={0.9} />
              </div>
              <p className="text-xs text-muted-foreground">
                Productos requieren atención
              </p>
            </CardContent>
          </Card>
        </AnimatedCard>

        <AnimatedCard delay={0.4} direction="up">
          <Card className="border-l-4 border-l-destructive shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Por Vencer</CardTitle>
              <Clock className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                <AnimatedCounter value={stats.expiringSoon} delay={1.1} />
              </div>
              <p className="text-xs text-muted-foreground">
                Próximos 7 días
              </p>
            </CardContent>
          </Card>
        </AnimatedCard>
      </div>

      {/* Activity Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatedCard delay={0.5} direction="left">
          <Card className="shadow-soft hover:shadow-medium transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span>Actividad Mensual</span>
              </CardTitle>
              <CardDescription>Métricas clave del mes actual</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <AnimatedCard delay={0.7} direction="right">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Building2 className="h-4 w-4 text-primary" />
                      <span className="text-sm">Donativos Recibidos</span>
                    </div>
                    <span className="font-semibold">
                      <AnimatedCounter value={stats.monthlyDonations} delay={1.0} />
                    </span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
              </AnimatedCard>

              <AnimatedCard delay={0.8} direction="right">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <ChefHat className="h-4 w-4 text-success" />
                      <span className="text-sm">Consumo Cocina (kg)</span>
                    </div>
                    <span className="font-semibold">
                      <AnimatedCounter value={stats.kitchenConsumption} delay={1.2} />
                    </span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
              </AnimatedCard>

              <AnimatedCard delay={0.9} direction="right">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-warning" />
                      <span className="text-sm">Ventas Bazar ($)</span>
                    </div>
                    <span className="font-semibold">
                      $<AnimatedCounter value={stats.bazarSales} delay={1.4} />
                    </span>
                  </div>
                  <Progress value={45} className="h-2" />
                </div>
              </AnimatedCard>

              <AnimatedCard delay={1.0} direction="right">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-destructive" />
                      <span className="text-sm">Usuarios Activos</span>
                    </div>
                    <span className="font-semibold">
                      <AnimatedCounter value={stats.activeUsers} delay={1.6} />
                    </span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
              </AnimatedCard>
            </CardContent>
          </Card>
        </AnimatedCard>

        <AnimatedCard delay={0.6} direction="right">
          <Card className="shadow-soft hover:shadow-medium transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                <span>Alertas Recientes</span>
              </CardTitle>
              <CardDescription>Notificaciones que requieren atención</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentAlerts.map((alert, index) => (
                  <AnimatedCard key={alert.id} delay={0.8 + index * 0.1} direction="up">
                    <div className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-all duration-300 hover:shadow-sm">
                      <div className={`h-2 w-2 rounded-full mt-2 animate-pulse ${
                        alert.priority === 'high' ? 'bg-destructive' :
                        alert.priority === 'medium' ? 'bg-warning' : 'bg-primary'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{alert.message}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant={getPriorityColor(alert.priority) as any} className="text-xs">
                            {alert.priority === 'high' ? 'Alta' : 
                             alert.priority === 'medium' ? 'Media' : 'Baja'}
                          </Badge>
                          <span className="text-xs text-muted-foreground">Hace 2 horas</span>
                        </div>
                      </div>
                    </div>
                  </AnimatedCard>
                ))}
              </div>
            </CardContent>
          </Card>
        </AnimatedCard>
      </div>
    </div>
  );
};

export default Dashboard;