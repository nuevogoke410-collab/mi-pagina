# Esteban y Sara · Almuerzos caseros

Página del menú del día, con pedidos por WhatsApp y un panel admin para cambiar qué platos hay hoy.

## Archivos

- `index.html`, `styles.css`, `app.js`: la página.
- `menu.json`: el menú inicial (se usa hasta que guardes cambios desde el admin).
- `netlify/functions/menu.mjs`: guarda el menú en Netlify y revisa la clave del admin.

## Publicar en Netlify

1. En Netlify: **Add new site → Import an existing project → GitHub** y elige este repo.
   (No sirve arrastrar la carpeta: el panel admin necesita que Netlify instale y ejecute la función.)
2. Deja la configuración por defecto (ya viene en `netlify.toml`).
3. En **Site configuration → Environment variables** crea `ADMIN_PASSWORD` con la clave del admin.
4. Haz un nuevo deploy para que tome la clave.

## Usar el admin

Toca **Admin**, escribe la clave y podrás:

- Apagar/encender platos (los apagados salen en "Hoy no hay").
- Cambiar nombres y precios, agregar o borrar platos.
- Editar la nota de cada sección y el "Va con".

Al tocar **Guardar cambios**, todos los clientes ven el menú nuevo.
