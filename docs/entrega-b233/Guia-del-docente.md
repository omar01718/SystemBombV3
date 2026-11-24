# SystemBomb B-233 · Guion de evaluación (7 minutos)

**Listo para exponer:** abrir `Presentacion.pdf` en pantalla completa. `Presentacion.html` es la versión sin conexión con enlaces. Las siguientes comprobaciones son de lectura; la presentación sirve también si en clase no hay Internet.

| Tiempo | Qué mostrar | Resultado esperado |
|---|---|---|
| 0:00–1:00 | Diapositivas 1–2. Explicar por qué se comparte inventario en una sola estación. | Un perfil B-233 autorizado es requisito de acceso; bombero y administrador no tienen los mismos permisos. |
| 1:00–2:00 | Diapositiva 3. Ejecutar las dos consultas HTTP de abajo. | HTTP 308 con destino HTTPS; HTTPS 200 con HSTS, CSP, `nosniff` y `Referrer-Policy`. |
| 2:00–3:00 | Con el panel autorizado ya abierto, mostrar RLS o usar el SQL inferior. | Cinco tablas, todas con `rls_activa = true`. RLS activa no prueba por sí sola que las reglas sean correctas: mostrar también los resultados por rol de la diapositiva 2. |
| 3:00–4:00 | Diapositiva 4 y el commit `ac1c95b`. | Identificar el código que neutraliza fórmulas CSV y la actualización de dependencias; distinguir pruebas de compilación de pruebas de seguridad. |
| 4:00–5:30 | Diapositiva 5. Buscar en el Gmail autorizado `in:inbox subject:B233MON1795477126417`. | Aviso con 120 rechazos; leer la ventana horaria. No abrir mensajes ajenos ni interpretar rechazos como accesos exitosos. |
| 5:30–7:00 | Diapositivas 6–7. | Explicar qué se recuperó y qué queda fuera: 23 filas de la aplicación, sin cuentas Auth ni archivos de Storage. |

**PowerShell, sin credenciales:**

```powershell
curl.exe -sSI http://system-bomb-v3.vercel.app/
curl.exe -sSI https://system-bomb-v3.vercel.app/
```

**Supabase SQL Editor, consulta opcional de metadatos:**

```sql
select relname as tabla, relrowsecurity as rls_activa
from pg_class
where relnamespace = 'public'::regnamespace
  and relkind = 'r'
  and relname in ('profiles','resources','loans','maintenance','audit_events')
order by relname;
```

**Si el docente pregunta «¿cómo sabemos que funciona?»**

- **Permisos:** se usaron transacciones de solo lectura con el contexto de cada perfil. Ningún rol pudo consultar perfiles de terceros ni obtuvo permiso de actualizar `profiles`; solo el administrador vio auditoría. No fue una prueba de inicio de sesión por la interfaz.
- **Inyección:** se revisaron los caminos de consulta y retorno, y se probó la neutralización de fórmulas en CSV. No se certifica ausencia de cualquier vulnerabilidad.
- **Detección:** el contador de logs y la recepción del correo corroboran la cadena para ese aviso, no su causa ni la identidad del origen. No hace falta repetirlo en producción.
- **Recuperación:** se restauraron y compararon las cinco tablas en una instancia aislada. La copia cifrada y la clave quedan en custodia; no se entregan al docente.
- **Qué mejoraría después:** ejecutar el monitor fuera del equipo local, custodiar una copia independiente recuperable y revisar periódicamente dependencias y permisos. La comprobación de contraseñas filtradas del plan Pro no está activa.

**Laboratorio para la clase:** https://system-bomb-b233-laboratorio.vercel.app/ usa otra base de datos y cuentas ficticias propias. Iniciar sesión como administrador del laboratorio, abrir la bitácora y localizar `Código: LAB-001`. Cerrar sesión, entrar como bombero y localizar `LAB-001` en inventario. Aunque la navegación pueda mostrar la opción de bitácora, la base no devuelve filas de auditoría al bombero. Verificación realizada por la interfaz y por la API autenticada de la base de pruebas. Las contraseñas no se incluyen en la entrega.

**Alcance:** el aviso y la restauración documentados corresponden a producción, no al laboratorio. Para ejercicios activos usar únicamente el laboratorio, acordar el volumen y la duración con el docente y respetar las condiciones del proveedor. No se ha medido la capacidad máxima; los proyectos del mismo equipo pueden compartir cuotas.
