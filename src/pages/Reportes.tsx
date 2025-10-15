import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  BarChart3,
  PieChart,
  FileText
} from "lucide-react";
import AnimatedCard from "@/components/ui/animated-card";
import AnimatedCounter from "@/components/ui/animated-counter";
import SplitText from "@/components/ui/split-text";

const Reports = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <AnimatedCard>
        <div className="flex items-center justify-between">
          <div>
            <SplitText
              text="Reportes y Análisis"
              className="text-3xl font-bold text-foreground"
              duration={0.8}
              stagger={0.05}
            />
            <p className="text-muted-foreground mt-2">
              Análisis detallado del rendimiento del sistema
            </p>
          </div>
          <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
            <FileText className="w-4 h-4 mr-2" />
            Generar Reporte
          </Button>
        </div>
      </AnimatedCard>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <AnimatedCard delay={0.1} direction="up">
          <Card className="border-l-4 border-l-primary shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reportes Generados</CardTitle>
              <FileText className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                <AnimatedCounter value={24} delay={0.5} />
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-success">+3</span> este mes
              </p>
            </CardContent>
          </Card>
        </AnimatedCard>

        <AnimatedCard delay={0.2} direction="up">
          <Card className="border-l-4 border-l-success shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Datos Analizados</CardTitle>
              <BarChart3 className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">
                <AnimatedCounter value={1250} delay={0.7} />
              </div>
              <p className="text-xs text-muted-foreground">
                Registros procesados
              </p>
            </CardContent>
          </Card>
        </AnimatedCard>

        <AnimatedCard delay={0.3} direction="up">
          <Card className="border-l-4 border-l-warning shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alertas Activas</CardTitle>
              <TrendingUp className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">
                <AnimatedCounter value={7} delay={0.9} />
              </div>
              <p className="text-xs text-muted-foreground">
                Requieren atención
              </p>
            </CardContent>
          </Card>
        </AnimatedCard>

        <AnimatedCard delay={0.4} direction="up">
          <Card className="border-l-4 border-l-destructive shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Eficiencia Global</CardTitle>
              <PieChart className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                <AnimatedCounter value={87} delay={1.1} suffix="%" />
              </div>
              <p className="text-xs text-muted-foreground">
                Índice de rendimiento
              </p>
            </CardContent>
          </Card>
        </AnimatedCard>
      </div>

      {/* Report Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnimatedCard delay={0.5} direction="up">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Consumo de Alimentos</p>
                <p className="text-xs text-muted-foreground mt-1">Análisis de consumo diario</p>
              </div>
              <div className="p-3 rounded-full bg-primary/10">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
            </CardContent>
          </Card>
        </AnimatedCard>

        <AnimatedCard delay={0.6} direction="up">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Eficiencia de Almacén</p>
                <p className="text-xs text-muted-foreground mt-1">Rotación de inventario</p>
              </div>
              <div className="p-3 rounded-full bg-success/10">
                <BarChart3 className="h-6 w-6 text-success" />
              </div>
            </CardContent>
          </Card>
        </AnimatedCard>

        <AnimatedCard delay={0.7} direction="up">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Donaciones por Período</p>
                <p className="text-xs text-muted-foreground mt-1">Tendencias de donativos</p>
              </div>
              <div className="p-3 rounded-full bg-warning/10">
                <PieChart className="h-6 w-6 text-warning" />
              </div>
            </CardContent>
          </Card>
        </AnimatedCard>

        <AnimatedCard delay={0.8} direction="up">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Reporte Fiscal</p>
                <p className="text-xs text-muted-foreground mt-1">Valoración de donaciones</p>
              </div>
              <div className="p-3 rounded-full bg-destructive/10">
                <FileText className="h-6 w-6 text-destructive" />
              </div>
            </CardContent>
          </Card>
        </AnimatedCard>
      </div>

      {/* Coming Soon */}
      <AnimatedCard delay={0.5} direction="up">
        <Card>
          <CardContent className="p-12 text-center">
            <BarChart3 className="h-16 w-16 text-foundation-orange mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Módulo de Reportes en Desarrollo
            </h3>
            <p className="text-muted-foreground mb-6">
              Esta sección incluirá reportes detallados y análisis avanzados para ayudar en la toma de decisiones,
              incluyendo gráficos interactivos, exportación de datos y reportes personalizados.
            </p>
            <div className="flex justify-center space-x-4">
              <Button variant="outline">
                Ver Reportes Básicos
              </Button>
              <Button className="bg-gradient-to-r from-foundation-orange to-foundation-gold hover:from-foundation-orange/90 hover:to-foundation-gold/90">
                Configurar Reporte
              </Button>
            </div>
          </CardContent>
        </Card>
      </AnimatedCard>
    </div>
  );
};

export default Reports;
