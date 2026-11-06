# Mattu · Tienda y cuentas de clientes

Aplicación web React + Vite para el catálogo público de Mattu, cuentas de clientes y seguimiento de solicitudes.

## Autenticación y pedidos

- Registro con verificación obligatoria del correo.
- Inicio y cierre de sesión mediante cookie `HttpOnly`, `Secure` y `SameSite=Lax`.
- Recuperación de contraseña con enlace de un solo uso y vencimiento.
- Reenvío del enlace de verificación para cuentas pendientes, incluidas cuentas antiguas.
- Perfil de cliente sincronizado con Cloudflare D1.
- Solicitudes guardadas en la tabla `orders` que ya utiliza el equipo.
- Seguimiento de pedidos del cliente con actualización automática cada 15 segundos.
- Correos de bienvenida, verificación, recuperación y confirmación de solicitud mediante Resend.

## Arquitectura

La web se despliega en Vercel. Las rutas `/api/customer/*` se reescriben al Worker público `mattu-clientes` para mantener las cookies de sesión en el mismo origen del navegador.

El Worker público usa la base D1 existente `mattu-pedidos-db`. El portal interno del equipo continúa separado y protegido por Cloudflare Access; ambos leen y escriben la misma tabla `orders`. Las credenciales de correo nunca se exponen en Vite ni se guardan en este repositorio.

## Activación necesaria después de integrar los cambios

1. En la base D1 `mattu-pedidos-db`, ejecutar una sola vez el contenido de `migrations/0002_email_verification.sql` del repositorio `Electreer2005/Mattu`. No volver a ejecutar la migración inicial ni recrear `orders`.
2. Desplegar la rama actualizada del Worker público `mattu-clientes` desde el repositorio `Electreer2005/Mattu`.
3. En el Worker público, configurar:
   - `RESEND_API_KEY`: Secret de Resend.
   - `MAIL_FROM`: remitente verificado, por ejemplo `Mattu <cuentas@tu-dominio-verificado>`.
   - `PUBLIC_ORIGIN`: `https://mattu-app.vercel.app`, sin barra final.
4. En el Worker interno `mattu-pedidos`, configurar también `RESEND_API_KEY` y `MAIL_FROM` para notificar cambios de estado. `PUBLIC_ORIGIN` puede ser `https://mattu-app.vercel.app`.
5. Integrar y desplegar esta rama en Vercel. El archivo `vercel.json` ya contiene el proxy hacia el Worker público.

No pegar claves de Resend en el código, en variables `VITE_*` ni en GitHub. Los secretos se cargan desde Cloudflare Workers → Settings → Variables and Secrets.

## Cuentas existentes

Las cuentas anteriores que no verificaron el correo quedan pendientes de verificación. Al intentar iniciar sesión, la web permite solicitar un nuevo enlace. No se eliminan cuentas ni pedidos existentes.

## Desarrollo local

```bash
npm install
npm run dev
```

El proxy de `vercel.json` se aplica en Vercel; para desarrollo local se puede configurar un proxy equivalente en Vite hacia el Worker público.

## Alcance pendiente

El catálogo actual de productos y servicios todavía conserva el contenido editorial que ya tenía la web. La sincronización administrativa de catálogo y la administración de clientes desde el panel de la tienda requieren una etapa separada; no se presentan datos ficticios de pedidos ni usuarios.
