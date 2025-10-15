import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import AnimatedCard from '@/components/ui/animated-card';
import AnimatedCounter from '@/components/ui/animated-counter';
import SplitText from '@/components/ui/split-text';
import { FileText, TrendingUp, Target, AlertCircle } from 'lucide-react';
import { useCalculatedKPIs } from '@/hooks/useCalculatedKPIs';

const getKPIStatus = (value: number, target: number) => {
  const percentage = (value / target) * 100;
  if (percentage >= 100) return { status: 'excellent', color: 'text-success', bgColor: 'bg-green-50' };
  if (percentage >= 80) return { status: 'good', color: 'text-primary', bgColor: 'bg-blue-50' };
  if (percentage >= 60) return { status: 'warning', color: 'text-warning', bgColor: 'bg-yellow-50' };
  return { status: 'critical', color: 'text-destructive', bgColor: 'bg-red-50' };
};

const getKPIIcon = (category: string) => {
  switch (category) {
    case 'consumption':
      return <TrendingUp className="h-5 w-5" />;
    case 'waste':
      return <AlertCircle className="h-5 w-5" />;
    case 'efficiency':
      return <Target className="h-5 w-5" />;
    case 'cost':
      return <FileText className="h-5 w-5" />;
    default:
      return <FileText className="h-5 w-5" />;
  }
};

export default function KPIs() {
  const { calculatedKPIs, isLoading, getCalculatedKPIsStats } = useCalculatedKPIs();
  const stats = getCalculatedKPIsStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando KPIs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <AnimatedCard>
        <div className="flex items-center justify-between">
          <div>
            <SplitText 
              text="Indicadores de Rendimiento (KPIs)" 
              className="text-3xl font-bold text-foreground"
              duration={0.8}
              stagger={0.05}
            />
            <p className="text-muted-foreground mt-1">
              Métricas clave para evaluar el desempeño del sistema
            </p>
          </div>
          <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
            <FileText className="w-4 h-4 mr-2" />
            Configurar KPIs
          </Button>
        </div>
      </AnimatedCard>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <AnimatedCard delay={0.1} direction="up">
          <Card>
            <CardContent className="p-6">
              <p className="text-sm font-medium text-muted-foreground">Total KPIs</p>
              <p className="text-2xl font-bold text-foreground mt-1">
                <AnimatedCounter value={stats.totalKPIs} delay={0.3} />
              </p>
            </CardContent>
          </Card>
        </AnimatedCard>

        <AnimatedCard delay={0.2} direction="up">
          <Card>
            <CardContent className="p-6">
              <p className="text-sm font-medium text-muted-foreground">En Meta</p>
              <p className="text-2xl font-bold text-success mt-1">
                <AnimatedCounter value={stats.enMeta} delay={0.5} />
              </p>
            </CardContent>
          </Card>
        </AnimatedCard>

        <AnimatedCard delay={0.3} direction="up">
          <Card>
            <CardContent className="p-6">
              <p className="text-sm font-medium text-muted-foreground">Requieren Atención</p>
              <p className="text-2xl font-bold text-warning mt-1">
                <AnimatedCounter value={stats.requierenAtencion} delay={0.7} />
              </p>
            </CardContent>
          </Card>
        </AnimatedCard>

        <AnimatedCard delay={0.4} direction="up">
          <Card>
            <CardContent className="p-6">
              <p className="text-sm font-medium text-muted-foreground">Promedio General</p>
              <p className="text-2xl font-bold text-primary mt-1">
                {stats.promedioGeneral}%
              </p>
            </CardContent>
          </Card>
        </AnimatedCard>
      </div>

      {/* KPI Details */}
      <AnimatedCard delay={0.5} direction="left">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2 text-primary" />
              Indicadores Detallados
            </CardTitle>
            <CardDescription>
              Seguimiento detallado de todos los indicadores de rendimiento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {calculatedKPIs.map((kpi, index) => {
                const valorActual = kpi.valor_actual || 0;
                const valorMeta = kpi.valor_meta;
                const percentage = (valorActual / valorMeta) * 100;
                const status = getKPIStatus(valorActual, valorMeta);

                return (
                  <AnimatedCard key={kpi.id} delay={0.6 + index * 0.1} direction="up">
                    <div className="p-4 border border-border rounded-lg bg-background">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${status.bgColor}`}>
                            {getKPIIcon(kpi.categoria)}
                          </div>
                          <div>
                            <h3 className="font-medium text-foreground">{kpi.nombre}</h3>
                            <p className="text-sm text-muted-foreground capitalize">
                              {kpi.categoria} • {kpi.periodo || 'Sin período'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-foreground">
                            {valorActual}/{valorMeta}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {percentage.toFixed(1)}% de la meta
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Progreso hacia la meta</span>
                          <span className={`font-medium ${status.color}`}>
                            {percentage.toFixed(1)}%
                          </span>
                        </div>
                        <Progress value={Math.min(percentage, 100)} className="h-2" />
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <Badge className={status.bgColor}>
                          {status.status === 'excellent' && 'Excelente'}
                          {status.status === 'good' && 'Bueno'}
                          {status.status === 'warning' && 'Requiere Atención'}
                          {status.status === 'critical' && 'Crítico'}
                        </Badge>
                        <div className="text-xs text-muted-foreground">
                          Actualizado: {kpi.fecha_actualizacion ? new Date(kpi.fecha_actualizacion).toLocaleDateString() : 'Sin fecha'}
                        </div>
                      </div>
                    </div>
                  </AnimatedCard>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </AnimatedCard>
    </div>
  );
}
