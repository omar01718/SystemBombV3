# Plan de verificación de integración (pendiente de ejecutar)

Este archivo no representa resultados de pruebas. Ejecutar en un proyecto de
prueba sin datos personales y anotar fecha, responsable, resultado y evidencia.
No publicar el sistema hasta resolver los fallos.

## Preparación

- Revisar las migraciones 001 a 004 y su compatibilidad antes de ejecutarlas.
- Configurar URL y clave publicable de Supabase sin añadir secretos al repositorio.
- Crear dos cuentas de prueba y asignar perfiles con roles diferentes mediante
  un procedimiento administrativo seguro. No permitir que el usuario edite su rol.
- Comprobar que la aplicación usa las tablas de Supabase y no datos locales.

## Acceso y permisos

1. Credenciales erróneas: acceso denegado.
2. Cuenta sin perfil autorizado: acceso denegado.
3. Administrador y operador: acceso con su propio perfil.
4. Sin sesión: leer o escribir tablas desde la API debe ser denegado.
5. Operador: consultas permitidas; cambios administrativos denegados incluso
   cuando se invoque la API directamente.
6. Intentar cambiar el rol mediante la API: denegado.
7. Cerrar sesión y volver a abrir: acceso a datos protegido.

## Integridad de inventario y mantenimiento

1. Crear, consultar, modificar y eliminar registros como administrador.
2. Repetir consulta desde otro navegador; comprobar persistencia compartida.
3. Probar códigos duplicados con distintas mayúsculas y espacios.
4. Probar campos requeridos, cantidades negativas y categorías inválidas
   enviando solicitudes directas, no solo usando los formularios.
5. Intentar eliminar un recurso con préstamos vinculados: debe rechazarse.

## Préstamos

1. Registrar un préstamo sobre un recurso disponible y verificar que ambos
   registros cambian en una sola transacción.
2. Intentar dos préstamos simultáneos para el mismo recurso: como máximo uno
   debe completarse.
3. Devolver un equipo en buen estado y comprobar que queda disponible.
4. Devolver un equipo deteriorado y comprobar que queda en mantenimiento.
5. Intentar devolver dos veces o usar fechas inválidas: debe rechazarse.
6. Probar desde dos sesiones y comprobar la consistencia de los datos.
7. Como administrador, anular un préstamo creado por error y verificar que el
   equipo quede disponible y el motivo permanezca en el historial.
8. Intentar anular como operador y volver a anular o devolver el mismo
   préstamo: debe rechazarse. Probar anulación simultánea con devolución.

## Publicación y documentación

- Verificar compilación, revisión de código, navegación móvil y resultados de
  seguridad después de configurar el entorno de producción.
- Registrar las limitaciones reales, los resultados y las pruebas fallidas.
- Actualizar informe y manual solo con lo implementado y comprobado.
