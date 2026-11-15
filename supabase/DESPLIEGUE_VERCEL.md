# Despliegue de SystemBomb en Vercel

## Antes de publicar

- Haz una copia de seguridad y comprueba cómo restaurarla. Utiliza datos de
  prueba durante la primera publicación y verifica las políticas de Supabase.
- Comprueba que las migraciones 001 a 006 están instaladas en el proyecto
  Supabase elegido. No vuelvas a ejecutarlas si ya están instaladas.
- `.env.local` contiene la configuración local y está excluido por `.gitignore`.
  No lo subas a GitHub. No publiques claves `secret`, `service_role` ni
  contraseñas. Las variables `NEXT_PUBLIC_` quedan visibles en el navegador.

## GitHub

El repositorio Git local tiene un remoto configurado. Revisa el repositorio,
la rama y los cambios antes de hacer commit y push; no subas datos sensibles.
Si el repositorio de GitHub es privado, da acceso a Vercel solo si lo necesitas.
Esta guía no realiza el commit ni el push por ti.

## Vercel

1. En Vercel, selecciona **Add New > Project** e importa el repositorio GitHub.
2. Si el repositorio contiene directamente `package.json`, deja el directorio
   raíz por defecto. Si `systembomb-app` es una subcarpeta, selecciónala como
   **Root Directory**. Confirma que Vercel detecte Next.js.
3. En **Environment Variables**, agrega para Production:
   - `NEXT_PUBLIC_SUPABASE_URL`: URL del proyecto Supabase.
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: clave publishable o anon pública.
   Los valores son los que ya configuraste localmente; no uses claves secretas.
4. Si habilitas Preview o Development, considera usar un proyecto Supabase de
   prueba separado y configurar las variables correspondientes en esos entornos.
5. Pulsa **Deploy**. Las variables `NEXT_PUBLIC_` se incorporan al compilar:
   si las cambias, vuelve a desplegar para que el cambio llegue al navegador.

## Después del despliegue

- Comprueba el inicio de sesión y el cierre de sesión con cuentas de prueba.
- Prueba inventario, préstamo, devolución, anulación y mantenimiento con datos
  ficticios; comprueba auditoría y permisos de ambos roles.
- Revisa las URL permitidas en **Authentication > URL Configuration** de
  Supabase antes de utilizar recuperación de contraseña u otros flujos que
  redirijan al sitio. Incluye únicamente direcciones necesarias y confiables.
- El sitio publicado es accesible por internet según la configuración de Vercel.
  No lo consideres listo para datos reales solo porque la compilación funcione.
