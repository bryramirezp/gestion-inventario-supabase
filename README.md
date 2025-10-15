# Sistema de Gestión de Inventario para "La Gran Familia"

Este proyecto es una aplicación web moderna diseñada para gestionar el inventario de donaciones (entradas y salidas) de la ONG "La Gran Familia".

El sistema utiliza un backend serverless a través de Supabase y un frontend reactivo que puede ser desplegado fácilmente en plataformas como Vercel o GitHub Pages.

## 🛠️ Tecnologías Utilizadas

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white) ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) ![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-222222?style=for-the-badge&logo=github-pages&logoColor=white) ![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white) ![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

## **Acerca de La Gran Familia**

### **Historia**

La Gran Familia nació en la década de los ochenta como un esfuerzo conjunto de empresarios, encabezados por Don Alberto Santos de Hoyos, y el gobierno de Nuevo León, para asegurar que no hubiera niños en situación de calle en el estado. Hoy en día, la organización acoge a niños cuyas familias no les han ofrecido la protección que merecen, habiendo albergado a aproximadamente 2200 menores de edad a lo largo de su historia.

### **Misión**

Brindar a menores de edad privados de cuidados parentales, un acogimiento residencial inspirado por valores y habilidades familiares que encienda en ellos la esperanza y les prepare para un proyecto de vida en familia.

### **Visión**

A niñas, niños y adolescentes privados de cuidados parentales, se les incorpora en una familia que promueve su desarrollo integral como hombres y mujeres capaces de formar familias en armonía.

### **Sitio Web Oficial**

https://www.lagranfamilia.org.mx/

## **Contexto del Proyecto**

### **1. La Necesidad (El porqué del proyecto)**

La necesidad principal es la **falta de control y la ineficiencia en la gestión del almacén**. El problema de raíz es que los procesos actuales están desconectados y son manuales:

* Las entradas de donativos se registran en Excel.
* Las salidas de productos del almacén se apuntan a mano.

Esta falta de un sistema unificado provoca que sea muy difícil saber con exactitud qué tienen, cuánto les queda y cómo se están utilizando los recursos. Esto es crítico para una organización que debe garantizar la alimentación e higiene de los niños a su cargo.

### **2. Lo que Justifica el Proyecto**

El proyecto se justifica por el deseo de **profesionalizar y estandarizar la operación del almacén**. La gestión actual, al ser manual y desorganizada, no es sostenible ni fiable. La justificación se basa en alcanzar objetivos concretos que resolverán los problemas actuales:

* **Centralizar la Información:** Crear una única base de datos para saber exactamente qué hay en el inventario.
* **Mejorar la Organización:** Clasificar todos los productos por categorías (alimentación, limpieza, ropa, etc.) para facilitar la búsqueda y el control.
* **Aumentar la Trazabilidad:** Implementar un sistema de validación, como una firma digital, para tener un registro claro de quién retira los materiales y cuándo.
* **Control Financiero:** Añadir una función para monitorear los gastos de la organización.

### **3. La Razón del Proyecto (El Objetivo Final)**

La razón fundamental del proyecto es implementar una solución que sea **sencilla, intuitiva y gratuita**. El objetivo no es simplemente digitalizar, sino hacerlo de una manera que se adapte a las necesidades y limitaciones de la ONG. La filosofía es clara: **"que el sistema trabaje para ellos, no ellos para el sistema"**.

En resumen, no quieren un sistema complejo y caro como un ERP. Buscan una herramienta inteligente y de bajo mantenimiento que les dé el control que necesitan sobre sus recursos para que puedan enfocarse en su misión principal: cuidar a los niños.

## **Cronograma del Proyecto**

**Duración Total:** 26 de agosto - 11 de noviembre (2024)

Este cronograma refleja las actividades realmente ejecutadas en el proyecto, divididas en tres fases principales que incluyen todos los entregables académicos requeridos.

### **Fase 1: Diagnóstico y Planificación Inicial** *(26 de agosto - 9 de septiembre)*

Esta fase se enfocó en establecer el contacto con la ONG, realizar el diagnóstico de necesidades y formalizar la colaboración.

| N° | Actividad | Responsable | Fecha de Inicio | Fecha de Fin | Entregable |
|----|-----------|-------------|-----------------|--------------|------------|
| **1.1** | Detallar la documentación inicial | Equipo | 26/ago | 02/sep | Diagnóstico completado |
| **1.2** | Realizar diagnóstico con la ONG | Equipo | 26/ago | 09/sep | Definición final de tablas y políticas de seguridad |
| **1.3** | Entregar formato de acuerdo | Equipo | 02/sep | 09/sep | 📋 **Formato de acuerdo de colaboración firmado** |

### **Fase 2: Desarrollo y Configuración del Sistema** *(10 de septiembre - 21 de octubre)*

Con el diagnóstico completado, el equipo se enfocó en construir la infraestructura técnica del sistema y desarrollar las funcionalidades principales.

| N° | Actividad | Responsable | Fecha de Inicio | Fecha de Fin | Entregable |
|----|-----------|-------------|-----------------|--------------|------------|
| **2.1** | Configurar entorno de desarrollo | Equipo | 10/sep | 16/sep | Repositorio en GitHub y entorno local |
| **2.2** | Crear y configurar proyecto en Supabase | Equipo | 10/sep | 23/sep | Proyecto en Supabase creado |
| **2.3** | Conectar frontend con Supabase | Equipo | 17/sep | 30/sep | Conexión exitosa a la API |
| **2.4** | Diseñar e implementar base de datos | Equipo | 24/sep | 07/oct | Estructura de la base de datos finalizada |
| **2.5** | Desarrollar componentes UI | Equipo | 01/oct | 14/oct | Vistas para registrar y ver inventario |
| **2.6** | Implementar Seguridad (RLS) | Equipo | 08/oct | 21/oct | Políticas de acceso implementadas |
| **2.7** | Preparar Project Charter | Equipo | 15/oct | 21/oct | Project Charter |
| **2.8** | Entregar Project Charter | Equipo | 21/oct | 21/oct | 📋 **Project Charter (21 de octubre)** |

### **Fase 3: Pruebas, Despliegue y Cierre** *(22 de octubre - 11 de noviembre)*

La fase final se centró en validar el sistema, desplegarlo en producción y completar toda la documentación de cierre del proyecto.

| N° | Actividad | Responsable | Fecha de Inicio | Fecha de Fin | Entregable |
|----|-----------|-------------|-----------------|--------------|------------|
| **3.1** | Realizar pruebas funcionales | Equipo | 22/oct | 28/oct | Funcionalidades validadas |
| **3.2** | Preparar reporte de avance | Equipo | 29/oct | 04/nov | Reporte de estado del proyecto |
| **3.3** | Desplegar la aplicación | Equipo | 22/oct | 11/nov | Aplicación en URL pública |
| **3.4** | Elaborar documentación final | Equipo | 05/nov | 11/nov | 📋 **Evaluación del servicio y Lecciones aprendidas (11 de noviembre)** |
| **3.5** | Preparar informe de cierre | Equipo | 05/nov | 11/nov | Informe de cierre del proyecto |
| **3.6** | Preparar la presentación final | Equipo | 05/nov | 11/nov | 🎯 **Presentación de resultados (Fecha examen final)** |

### **Hitos Clave del Proyecto**

| Hito | Fecha | Estado |
|------|-------|--------|
| ⭐ Inicio de contacto con la ONG | 26 de agosto | ✅ Completado |
| 📋 Formato de acuerdo de colaboración | 9 de septiembre | ✅ Entregado |
| 📋 Project Charter | 21 de octubre | 🔄 En ejecución |
| 🚀 Despliegue del proyecto | 22 octubre - 9 noviembre | 📅 Programado |
| 📋 Evaluación del servicio | 11 de noviembre | 📅 Programado |
| 🎯 Presentación final | Fecha examen final | 📅 Programado |

## 📜 Tecnologías Principales

- **Backend:** Supabase (Base de datos PostgreSQL, Autenticación, APIs automáticas)
- **Frontend:** JavaScript, con un framework como Vue.js o React
- **Alojamiento (Hosting):** Vercel (Recomendado) o GitHub Pages
- **Control de Versiones:** Git y GitHub

## ✅ Beneficios de esta Arquitectura

**Costo Cero:** Todo el stack tecnológico, desde la base de datos hasta el hosting, puede operar bajo generosos planes gratuitos, ideales para una ONG.

**Escalable y Moderno:** La arquitectura "serverless" permite que el sistema crezca sin necesidad de administrar servidores. El rendimiento es excelente.

**Mantenimiento Sencillo:** Las actualizaciones del frontend se despliegan automáticamente y la base de datos es gestionada por Supabase, reduciendo la carga de mantenimiento.

**Desarrollo Rápido:** Supabase autogenera las APIs, lo que permite que el desarrollo se centre casi exclusivamente en la experiencia del usuario (frontend).

## ⚠️ Desafíos en la Construcción

**Curva de Aprendizaje:** Es necesario familiarizarse con el framework de frontend elegido (Vue/React) y entender los conceptos básicos de Supabase, especialmente la seguridad.

**Seguridad de Datos (RLS):** El desafío más importante es configurar correctamente la Seguridad a Nivel de Fila (Row Level Security) en Supabase. Es crucial definir políticas que aseguren que los usuarios solo puedan ver y modificar los datos que les corresponden.

**Gestión del Estado:** A medida que la aplicación crece, manejar el "estado" (los datos que se muestran y actualizan en la interfaz) en el frontend puede volverse complejo.

**Funcionalidad Offline:** Este sistema depende de una conexión a internet. Implementar un soporte offline robusto requeriría una lógica de sincronización de datos considerablemente más avanzada.

## 🚀 Guía de Implementación Paso a Paso

### Fase 1: Configuración del Backend (Supabase)

1. **Crear Proyecto:** Regístrate en Supabase y crea un nuevo proyecto. Guarda bien la contraseña de tu base de datos.

2. **Diseñar Tablas:** Usa el "Table Editor" para crear tus tablas. Como mínimo, necesitarás:
   - `articulos` (id, nombre, descripcion, stock_actual)
   - `movimientos` (id, articulo_id, tipo_movimiento, cantidad, fecha)

3. **Implementar Seguridad (¡Crítico!):**
   - Ve a Authentication > Policies
   - Deshabilita el acceso público a las tablas por defecto
   - Crea Políticas de Seguridad (RLS) para permitir operaciones SELECT, INSERT, UPDATE solo a usuarios autenticados. Por ejemplo:
   ```sql
   CREATE POLICY "Permitir acceso a usuarios autenticados" ON movimientos FOR ALL USING (auth.role() = 'authenticated');
   ```

4. **Obtener las Keys:** Ve a Project Settings > API. Copia tu URL y tu anon public key. Las necesitarás para el frontend.

### Fase 2: Desarrollo del Frontend

1. **Entorno Local:** Asegúrate de tener Node.js instalado. Usa la terminal para crear un nuevo proyecto de Vue o React.
   ```bash
   # Para Vue.js
   npm create vue@latest
   ```

2. **Instalar Cliente de Supabase:** Dentro de la carpeta de tu proyecto, instala la librería cliente de Supabase.
   ```bash
   npm install @supabase/supabase-js
   ```

3. **Conectar con Supabase:** Crea un archivo de configuración (ej. `src/supabase.js`) donde inicializarás el cliente de Supabase con la URL y la anon key que copiaste en la Fase 1.

4. **Construir la Interfaz:** Desarrolla los componentes visuales:
   - Un formulario para registrar entradas y salidas (INSERT en la tabla `movimientos`)
   - Una tabla o lista para mostrar el inventario actual (SELECT de la tabla `articulos`)

5. **Guardar en GitHub:** Inicializa un repositorio de Git, y sube tu código a GitHub.
   ```bash
   git init
   git add .
   git commit -m "Versión inicial del sistema de inventario"
   # Sigue las instrucciones de GitHub para subir tu repositorio
   ```

### Fase 3: Despliegue en la Nube (Deployment)

#### Opción A: Vercel (Recomendada)

1. **Crear Cuenta:** Regístrate en Vercel con tu cuenta de GitHub.

2. **Importar Proyecto:** En tu dashboard de Vercel, haz clic en "Add New... > Project" e importa el repositorio de GitHub que creaste.

3. **Configurar Variables de Entorno:** Vercel detectará tu framework. Durante la configuración, ve a la sección "Environment Variables". Aquí debes añadir de forma segura tu URL y anon key de Supabase para que no queden expuestas en el código.
   - `VUE_APP_SUPABASE_URL` = (tu URL de Supabase)
   - `VUE_APP_SUPABASE_ANON_KEY` = (tu anon key de Supabase)

4. **Desplegar:** Haz clic en "Deploy". Vercel construirá tu aplicación y la publicará en una URL. A partir de ahora, cada vez que hagas `git push` a tu rama principal en GitHub, Vercel redesplegarán los cambios automáticamente.

#### Opción B: GitHub Pages (Para proyectos más simples)

1. **Configurar en GitHub:** En tu repositorio de GitHub, ve a Settings > Pages.

2. **Seleccionar Fuente:** Elige la rama que quieres desplegar (usualmente `main`).

3. **Publicar:** GitHub Pages construirá tu sitio y te dará una URL (`tunombredeusuario.github.io/tu-repositorio`).

> **Nota sobre Seguridad:** Gestionar las "API keys" en GitHub Pages de forma segura es más complicado que en Vercel. Por esta razón, Vercel es la opción superior para cualquier aplicación que necesite claves de API.

## 📊 Estructura de Base de Datos

### Tabla `articulos`
```sql
CREATE TABLE articulos (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    categoria VARCHAR(100),
    stock_actual INTEGER DEFAULT 0,
    stock_minimo INTEGER DEFAULT 0,
    unidad_medida VARCHAR(50),
    precio_estimado DECIMAL(10,2),
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Tabla `movimientos`
```sql
CREATE TABLE movimientos (
    id BIGSERIAL PRIMARY KEY,
    articulo_id BIGINT REFERENCES articulos(id),
    tipo_movimiento VARCHAR(20) NOT NULL CHECK (tipo_movimiento IN ('entrada', 'salida')),
    cantidad INTEGER NOT NULL,
    motivo VARCHAR(255),
    responsable VARCHAR(255),
    firma_digital TEXT,
    fecha_movimiento TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notas TEXT
);
```

### Tabla `categorias`
```sql
CREATE TABLE categorias (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    color VARCHAR(7) DEFAULT '#6B7280'
);
```

## 🔒 Políticas de Seguridad (RLS)

### Para la tabla `articulos`
```sql
-- Habilitar RLS
ALTER TABLE articulos ENABLE ROW LEVEL SECURITY;

-- Permitir lectura a usuarios autenticados
CREATE POLICY "Usuarios autenticados pueden leer artículos" 
ON articulos FOR SELECT 
TO authenticated 
USING (true);

-- Permitir inserción a usuarios autenticados
CREATE POLICY "Usuarios autenticados pueden crear artículos" 
ON articulos FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Permitir actualización a usuarios autenticados
CREATE POLICY "Usuarios autenticados pueden actualizar artículos" 
ON articulos FOR UPDATE 
TO authenticated 
USING (true);
```

### Para la tabla `movimientos`
```sql
-- Habilitar RLS
ALTER TABLE movimientos ENABLE ROW LEVEL SECURITY;

-- Permitir todas las operaciones a usuarios autenticados
CREATE POLICY "Usuarios autenticados pueden gestionar movimientos" 
ON movimientos FOR ALL 
TO authenticated 
USING (true);
```

## 🎨 Componentes del Frontend

### Estructura de Carpetas Sugerida
```
src/
├── components/
│   ├── Layout/
│   │   ├── Header.vue
│   │   ├── Sidebar.vue
│   │   └── Footer.vue
│   ├── Inventario/
│   │   ├── ListaArticulos.vue
│   │   ├── FormularioArticulo.vue
│   │   └── ResumenInventario.vue
│   ├── Movimientos/
│   │   ├── RegistrarMovimiento.vue
│   │   ├── HistorialMovimientos.vue
│   │   └── ValidacionFirma.vue
│   └── Common/
│       ├── Loading.vue
│       ├── Modal.vue
│       └── Alert.vue
├── views/
│   ├── Dashboard.vue
│   ├── Inventario.vue
│   ├── Movimientos.vue
│   └── Reportes.vue
├── composables/
│   ├── useSupabase.js
│   ├── useInventario.js
│   └── useMovimientos.js
├── utils/
│   ├── constants.js
│   ├── formatters.js
│   └── validators.js
└── supabase.js
```

## 📱 Funcionalidades Principales

### 1. Gestión de Inventario
- ✅ Registro de nuevos artículos
- ✅ Actualización de stock
- ✅ Clasificación por categorías
- ✅ Alertas de stock bajo
- ✅ Búsqueda y filtrado

### 2. Control de Movimientos
- ✅ Registro de entradas (donaciones)
- ✅ Registro de salidas (consumo)
- ✅ Validación con firma digital
- ✅ Historial completo de movimientos
- ✅ Trazabilidad por responsable

### 3. Reportes y Analytics
- ✅ Dashboard con métricas clave
- ✅ Reportes de consumo por período
- ✅ Análisis de donaciones recibidas
- ✅ Proyección de necesidades
- ✅ Exportación a Excel/PDF

### 4. Seguridad y Control
- ✅ Autenticación de usuarios
- ✅ Roles y permisos
- ✅ Auditoría de cambios
- ✅ Respaldos automáticos
- ✅ Validación de datos

## 🔧 Variables de Entorno

Crea un archivo `.env.local` en la raíz de tu proyecto con las siguientes variables:

```env
# Configuración de Supabase
VUE_APP_SUPABASE_URL=tu_url_de_supabase_aqui
VUE_APP_SUPABASE_ANON_KEY=tu_anon_key_de_supabase_aqui

# Configuración de la aplicación
VUE_APP_NOMBRE_APP=Sistema de Inventario - La Gran Familia
VUE_APP_VERSION=1.0.0
VUE_APP_ENTORNO=desarrollo
```

## 🚦 Scripts de Desarrollo

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest",
    "lint": "eslint . --ext .vue,.js,.jsx,.cjs,.mjs --fix",
    "format": "prettier --write ."
  }
}
```

## 📋 Lista de Verificación Pre-Despliegue

### Backend (Supabase)
- [ ] Proyecto creado y configurado
- [ ] Tablas creadas con las columnas correctas
- [ ] Políticas RLS implementadas y probadas
- [ ] Índices creados para optimizar consultas
- [ ] Funciones SQL creadas (si es necesario)
- [ ] Triggers configurados para auditoría
- [ ] Respaldos automáticos habilitados

### Frontend
- [ ] Conexión a Supabase configurada
- [ ] Componentes principales desarrollados
- [ ] Validación de formularios implementada
- [ ] Manejo de errores configurado
- [ ] Responsive design verificado
- [ ] Pruebas unitarias escritas
- [ ] Optimización de bundle realizada

### Despliegue
- [ ] Variables de entorno configuradas en Vercel
- [ ] SSL habilitado
- [ ] Dominio personalizado configurado (opcional)
- [ ] Analytics implementado (opcional)
- [ ] Monitoreo de errores configurado
- [ ] Documentación de usuario creada

## 🐛 Solución de Problemas Comunes

### Problema: Error de CORS al conectar con Supabase
```javascript
// Solución: Verificar la configuración del cliente
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VUE_APP_SUPABASE_URL
const supabaseKey = import.meta.env.VUE_APP_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})
```

### Problema: Políticas RLS bloquean operaciones
```sql
-- Verificar políticas existentes
SELECT * FROM pg_policies WHERE tablename = 'articulos';

-- Desactivar temporalmente para debugging (¡NO en producción!)
ALTER TABLE articulos DISABLE ROW LEVEL SECURITY;
```

### Problema: Build falla en Vercel
```json
// Asegurar compatibilidad en package.json
{
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=8.0.0"
  }
}
```

## 📚 Recursos Adicionales

### Documentación Oficial
- [Supabase Docs](https://supabase.com/docs)
- [Vue.js Guide](https://vuejs.org/guide/)
- [Vercel Documentation](https://vercel.com/docs)

### Tutoriales Recomendados
- [Building a Full Stack App with Supabase and Vue.js](https://supabase.com/blog/building-a-realtime-app-with-vue-js-and-supabase)
- [Row Level Security in Supabase](https://supabase.com/docs/guides/auth/row-level-security)
- [Deploying Vue.js Apps to Vercel](https://vercel.com/guides/deploying-vuejs-to-vercel)

### Herramientas de Desarrollo
- [Vue Devtools](https://devtools.vuejs.org/)
- [Supabase CLI](https://supabase.com/docs/reference/cli)
- [Postman](https://www.postman.com/) para probar APIs

## 🤝 Contribución

Este proyecto es desarrollado por estudiantes como parte de un curso académico. Si eres parte del equipo:

1. Clona el repositorio
2. Crea una rama para tu feature: `git checkout -b feature/nueva-funcionalidad`
3. Realiza tus cambios y commit: `git commit -m "Agregar nueva funcionalidad"`
4. Push a la rama: `git push origin feature/nueva-funcionalidad`
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es desarrollado con fines educativos para la ONG "La Gran Familia". El código está disponible bajo la licencia MIT para uso educativo y de caridad.

## 📞 Contacto

Para consultas sobre el proyecto:
- **Organización:** La Gran Familia A.C.
- **Sitio Web:** https://www.lagranfamilia.org.mx/
- **Equipo de Desarrollo:** [Información de contacto del equipo]

---

**Nota:** Este README será actualizado conforme el proyecto evolucione. Última actualización: Septiembre 2024
