# Preparación de Supabase para SystemBomb

## Antes de empezar

Usa un proyecto de prueba nuevo y sin información importante. Los scripts crean
tablas y reglas en el esquema `public`; no los ejecutes en una base existente
sin revisar antes su contenido y hacer una copia de seguridad.

La URL y la clave pública van en `.env.local`. No compartas contraseñas, claves
`secret` o `service_role`, ni coloques estas últimas en archivos del navegador.

## Crear las tablas y funciones

1. Entra al proyecto correcto en el panel de Supabase.
2. Abre **SQL Editor** y crea una consulta nueva.
3. Abre el archivo `001_initial_schema.sql` de esta carpeta, copia su contenido
   completo en el editor y ejecútalo con **Run**.
4. Repite con `002_loan_operations.sql`, `003_inventory_permissions.sql` y
   `004_maintenance_permissions.sql`, en ese orden, cada uno por separado.
5. Si aparece un error, detente y conserva el mensaje. No sigas con el
   siguiente archivo ni vuelvas a ejecutar todos a ciegas: algunos comandos no
   se pueden repetir sobre tablas o reglas ya creadas.
6. En **Table Editor** comprueba que existen `profiles`, `resources`, `loans`
   y `maintenance`.

## Crear una cuenta de prueba

1. En **Authentication > Users**, crea un usuario de prueba con correo y
   contraseña. No compartas la contraseña en el chat.
2. Copia su **User UID** desde el panel.
3. En **Table Editor > profiles**, inserta una fila:
   - `id`: el User UID de la cuenta.
   - `full_name`: nombre de prueba.
   - `role`: `admin_logistica`.
   - `rank`: grado de prueba, por ejemplo `Bombero`.
   - `station`: estación de prueba, por ejemplo `B-233`.
4. Guarda y verifica que la fila existe. El UID debe corresponder exactamente
   al usuario creado en Authentication.

Para probar permisos después, crea otra cuenta y otra fila con el rol
`bombero_operativo`. La asignación de roles debe hacerse solo desde el panel
administrativo, no desde la aplicación.

## Estado actual y pruebas

Las pantallas de inventario, préstamos y mantenimiento se han conectado a los
repositorios de Supabase, pero requieren pruebas con cuentas de prueba.
Los antiguos datos locales no se borran ni se migran automáticamente.
La migración `005_auditoria_integridad.sql` añade auditoría de cambios y
protección de estados. Debe ejecutarse una sola vez después de las anteriores.
No registra operaciones anteriores ni inicios de sesión. La migración
`006_anular_prestamo.sql` habilita la anulación de préstamos activos por un
administrador; debe instalarse después de la 005. Se conserva el motivo y el
registro. Solo se debe anular un préstamo registrado por error si el equipo no
salió y está físicamente disponible; una devolución real debe registrarse como tal.
Revisar las reglas y ejecutar las pruebas de `PRUEBAS_PENDIENTES.md`.

No uses datos reales ni publiques el sistema hasta completar la integración y
comprobar los permisos, transacciones, concurrencia y recuperación de errores.
No restaures datos iniciales ni borres almacenamiento local si necesitas
conservar registros de prueba existentes.
