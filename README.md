# SystemBomb 🚒 — Sistema Web de Gestión y Trazabilidad Operativa

> **Aviso importante:** la aplicación utiliza Supabase para autenticación,
> persistencia y políticas de acceso. Antes de usar datos reales o publicar,
> verifica permisos, copias de seguridad y recuperación en el entorno desplegado.
> Las secciones académicas siguientes pueden describir objetivos del proyecto;
> para el estado de la configuración consulta `supabase/GUIA_CONFIGURACION.md`.

> **Caso de Estudio Social:** Compañía de Bomberos Virgen de Chapi N.° 233 (B-233)  
> **Jurisdicción:** Paucarpata, Arequipa — VII Comandancia Departamental Arequipa • CGBVP  
> **Asignatura:** Programación Web — Universidad Continental (Plan 2024 / Consolidado 2)  
> **Docente:** CORNEJO ARISMENDI, Victor Alfonzo  
> **Integrantes:**  
> - MENDOZA FLORES, Carlos Alberto (Coordinación, problemática, módulo de préstamos)  
> - QUISPE HUAMÁN, Diego Alejandro (Diseño UI/UX, entrevistas de campo, seguridad web)  
> - HERRERA SALAZAR, Luis Fernando (Arquitectura, modelo de datos, API y despliegue)  

---

## 1. Problemática Social y Justificación

La Compañía de Bomberos B-233 atiende diariamente emergencias críticas en el distrito de Paucarpata (más de 130,000 habitantes). La falta de un sistema digitalizado provocaba que el registro de Equipos de Protección Personal (EPP), cilindros ERA y herramientas hidráulicas se llevara en cuadernos manuales, generando demoras en la salida de las autobombas e incertidumbre sobre la disponibilidad de los equipos.

**SystemBomb** soluciona esta problemática proporcionando una plataforma web en tiempo real, responsive, sin emojis informales (utilizando iconografía vectorial Lucide SVG), con control de acceso por roles, alertas automáticas de caducidad/inspección técnica y trazabilidad de préstamos en guardia.

---

## 2. Tecnologías y Arquitectura MVC

El sistema fue desarrollado con el framework moderno **Next.js 16 (App Router)** y **TypeScript**, implementando una arquitectura MVC desacoplada:

- **Modelo (`src/types/index.ts`, `src/lib/models`):** Entidades fuertemente tipadas (`Resource`, `Loan`, `Maintenance`, `User`, `AuditLog`) con reglas de negocio e integridad referencial.
- **Controlador (`src/lib/context/AppContext.tsx`, API Handlers):** Capa de servicios y controladores que intercepta peticiones, valida permisos por rol, sanitiza entradas y gestiona la persistencia reactiva.
- **Vista (`src/components/...`):** Componentes visuales desacoplados estilizados con **Tailwind CSS** y renderizado interactivo sin recargas de página completas.
- **Iconografía:** **Lucide Icons** (vectorial SVG corporativo, sin emojis).

---

## 3. Entidades y Operaciones CRUD Implementadas

### CRUD 1: Inventario de Recursos y Equipamiento
- **Create:** Alta de equipos con validación de código único institucional, categoría, ubicación en autobomba/almacén, stock mínimo y fecha de inspección técnica.
- **Read:** Búsqueda en tiempo real, filtros por categoría (EPP, Extinción, Rescate, ERA, etc.), por estado y por ubicación física.
- **Update:** Edición in-place de atributos, traslados entre unidades y ajustes de existencias.
- **Delete / Retiro:** Baja lógica de recursos del catálogo activo con confirmación y auditoría.

### CRUD 2: Préstamos y Asignaciones de Guardia
- **Create:** Asignación nominal de equipo a un bombero voluntario durante el turno de guardia. El recurso cambia su estado a `"En Uso"` automáticamente.
- **Read:** Monitoreo de préstamos activos en turno con tiempo transcurrido e historial consolidado de servicios.
- **Update / Return:** Recepción de equipo con evaluación de condición física (`"Óptimo"`, `"Buen Estado"`, `"Deteriorado"`, `"Requiere Mantenimiento"`). Si requiere reparación, el equipo pasa automáticamente a `"En Mantenimiento"`.
- **Delete:** Anulación de registros por parte del administrador.

### CRUD 3: Flota Vehicular y Mantenimientos Técnicos
- **Create:** Programación de servicios preventivos, correctivos y pruebas hidrostáticas NFPA para Autobomba B-233, Cisterna C-233 y cilindros ERA.
- **Read:** Tablero de órdenes técnicas con semaforización de prioridades y seguimiento de costos.
- **Update:** Cambio rápido de estado (`Programado` → `En Taller / Curso` → `Completado`), actualización de costos y notas de taller.
- **Delete:** Cancelación de órdenes técnicas por jefatura.

---

## 4. Medidas de Seguridad Web (Criterio C4)

1. **Control de Acceso Basado en Roles (RBAC):**
   - **Administrador de Logística (`admin_logistica`):** Acceso total (altas, bajas, presupuestos, auditoría).
   - **Bombero Voluntario Operativo (`bombero_operativo`):** Consulta de disponibilidad, solicitud de préstamos y reporte de novedades; botones de baja/eliminación restringidos.
2. **Autenticación:** Supabase Auth gestiona las contraseñas; la aplicación no implementa un algoritmo propio de hash.
3. **Acceso a datos:** las políticas de Supabase y las funciones de base de datos deben revisarse y probarse directamente.
4. **Limitaciones:** no se debe asumir que el uso de React o TypeScript elimina todos los riesgos de XSS, CSRF o inyección.

---

## 5. Instrucciones de Ejecución Local y Despliegue

### Ejecución Local:
```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo
npm run dev

# 3. Abrir en el navegador: http://localhost:3000
```

### Compilación para Producción:
```bash
npm run build
npm run start
```

### Despliegue en Vercel:
Consulta `supabase/DESPLIEGUE_VERCEL.md` para configurar las variables públicas,
importar el repositorio y comprobar el despliegue sin subir secretos a GitHub.

---

## 6. Cuentas

Las cuentas se crean en Supabase Auth y requieren una fila correspondiente en
`profiles`. No existen credenciales de demostración integradas. Las contraseñas
no deben almacenarse en este repositorio.
