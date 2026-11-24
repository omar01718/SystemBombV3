# SystemBomb: revisión OWASP Top 10 (2021)

Alcance (23 de noviembre de 2026): código Next.js, dependencias del archivo de bloqueo,
configuración de `system-bomb-v3.vercel.app` y proyecto Supabase de SystemBomb.
Las siguientes evidencias distinguen producción y laboratorio. El monitor de
OpenCode, la sesión de correo y la custodia de la copia se gestionan fuera de Git.

| Riesgo | Evidencia y alcance |
| --- | --- |
| A01 Acceso | RLS activa en las cinco tablas. El rol `anon` carece de permisos de lectura, escritura y truncado en ellas. Los perfiles solo se consultan por su titular. El despliegue sirve únicamente a la B-233: `profiles.station` solo admite `B-233` y las altas son administrativas. Los perfiles autorizados comparten el inventario y los préstamos de esta estación. |
| A02 Criptografía | HTTP redirige a HTTPS y Vercel envía HSTS. Supabase exige SSL para PostgreSQL, mínimo TLS 1.2. Los clientes directos deben verificar el certificado y el nombre de host. |
| A03 Inyección | Los repositorios usan consultas estructuradas y parámetros RPC; no se observó SQL dinámico a partir de entradas ni renderizado HTML crudo en las vistas revisadas. La exportación CSV publicada neutraliza fórmulas. La CSP de producción limita los orígenes y bloquea `script-src-attr`, pero permite scripts inline y no sustituye el escape de salidas. |
| A04 Diseño | PostgreSQL controla los roles y las operaciones de préstamo, con transacciones y bloqueos de filas. Verificar concurrencia, devolución y anulación con datos ficticios antes de modificar estos flujos. |
| A05 Configuración | Registro público y acceso anónimo de Auth desactivados. Se conservan el alta administrativa y las cabeceras CSP, `nosniff` y `Referrer-Policy` de Vercel. |
| A06 Componentes | Publicada la actualización del archivo de bloqueo por el aviso de `minimatch` en herramientas de desarrollo. `npm audit` sin avisos tras el cambio; repetir en cada actualización. |
| A07 Autenticación | Supabase gestiona el inicio de sesión; confirmación de correo y cambio seguro de contraseña activos. El panel ofrece límite por IP para altas e inicios de sesión. Protección de contraseñas filtradas no activada (Pro). |
| A08 Integridad | Archivo de bloqueo npm con hashes y auditoría de dependencias. Dependabot semanal preparado para GitHub. Revisar las PR y ejecutar compilación y pruebas antes de integrar. Protección de rama no verificada. |
| A09 Registro | Disparadores de auditoría activos en inventario, préstamos y mantenimiento. En producción se corroboró el agregado de 120 solicitudes rechazadas de acceso con contraseña en diez minutos y la entrega del aviso de correo. No demuestra una intrusión. |
| A10 SSRF | La compilación actual produce páginas estáticas. En el código revisado no se encontró una ruta de servidor que reciba una URL del usuario y la consulte. Repetir la revisión si se incorporan importadores, proxies o webhooks. |

## Verificación después de publicar

Prueba realizada directamente en PostgreSQL en transacciones de solo lectura:
con el rol `authenticated` y el contexto de cada perfil, administrador y operador
solo ven su propio perfil y ninguno tiene permiso de actualizar `profiles`.
El administrador ve filas de auditoría; el operador no ve ninguna. Esta prueba
comprueba las políticas de lectura, no sustituye un inicio de sesión de extremo a extremo.

Ensayo local de restauración: se aplicaron las migraciones 001–008 en PGlite
con un perfil ficticio y se restauró la imagen en una instancia nueva. Se
comprobó que el perfil conservaba `B-233`, que las cinco tablas conservaban RLS
y que la restricción rechazaba otra estación y una estación omitida. No se
exportaron datos de producción en ese ensayo. Posteriormente se verificó una
copia lógica cifrada real: las 23 filas de las cinco tablas coincidieron al
restaurarlas en una base aislada. No incluye cuentas Auth ni archivos de Storage.

En el [laboratorio](https://system-bomb-b233-laboratorio.vercel.app/) se
verificaron ambos inicios y cierres de sesión en la interfaz. La API autenticada
solo devolvió el perfil propio; la auditoría devolvió filas al administrador
y ninguna al operador. No se ha medido la capacidad máxima bajo carga.

1. En un entorno de pruebas, iniciar sesión con los dos roles; comprobar permisos,
   exportar inventario y abrir el CSV con el programa de hojas de cálculo que se use en la estación.
2. Verificar que un cambio de inventario de prueba genera auditoría y que el equipo
   responsable puede consultar los registros de autenticación sin exponer credenciales.
3. Revisar las URL permitidas de recuperación y hacer un simulacro de restauración con
   datos de prueba. No incorporar otra estación a este despliegue sin rediseñar
   primero el modelo de acceso y las políticas.
