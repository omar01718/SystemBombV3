# Acceso de demostración para el docente

**Abrir el [laboratorio de SystemBomb B-233](https://system-bomb-b233-laboratorio.vercel.app/).** Las siguientes cuentas públicas se crearon únicamente en el laboratorio, que tiene su propia base de datos y utiliza datos ficticios.

| Ingresar como | Correo electrónico | Contraseña |
|---|---|---|
| Administrador de logística | `docente-admin@b233-lab.example.com` | `DemoB233!Admin-Roble42` |
| Bombero operativo | `docente-bombero@b233-lab.example.com` | `DemoB233!Guardia-Lima87` |

1. Ingresar como **administrador** y abrir **Bitácora y Auditoría**: se pueden consultar los eventos de la estación, incluida la creación del recurso ficticio `LAB-001`.
2. Pulsar **Salir** e ingresar como **bombero**. Abrir **Inventario de Recursos** y buscar `LAB-001`. Aunque el menú muestre la bitácora, la base de datos no devuelve filas de auditoría a este rol.

Estas cuentas son compartidas: usar solo datos de prueba y no cambiar sus contraseñas durante la evaluación. La cuenta de administrador corresponde a la **aplicación de laboratorio**, no a los paneles de Vercel ni de Supabase.
