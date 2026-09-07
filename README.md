# Hotel Wyndham — estructura reorganizada

## Qué cambió respecto al proyecto original

Antes, el header, el nav, el footer, el menú responsivo, el año del footer y la
lógica de sesión estaban **copiados y pegados en cada página** (Acerca.html,
Contacto.html, Paquetes.html, etc.). Cambiar un link del menú significaba
editar 7 archivos.

Ahora:

- `/components/header.html` y `/components/footer.html` existen **una sola vez**.
- Cada página solo los "llama" con `<div data-include="/components/header.html"></div>`.
- `/assets/js/core/nav.js` se encarga de inyectar esos componentes, marcar el
  link activo, manejar el menú hamburguesa, actualizar el año del footer y
  revisar si hay sesión activa — todo eso ya NO se repite en cada script de página.
- `/assets/js/core/audio.js` tiene la única función `activarAudioAmbiente(id, volumen)`
  que cada página llama con su propio audio.
- Cada página conserva solo lo que de verdad le es propio, en
  `/assets/js/pages/<nombre>.js`.

## Ya migradas (de ejemplo)

- `index.html` + `assets/js/pages/inicio.js`
- `pages/acerca.html` + `assets/js/pages/acerca.js`

## Falta migrar con el mismo patrón

- `pages/contacto.html`, `pages/paquetes.html`, `pages/restaurant.html`,
  `pages/servicio.html`, `pages/inicio-sesion.html`

Para cada una: reemplazar el `<header>...</header>` hardcodeado por
`<div data-include="/components/header.html"></div>`, el `<footer>...</footer>`
por `<div data-include="/components/footer.html"></div>`, agregar
`data-page="nombre-pagina"` al `<body>`, y dejar en su script propio
solo lo que sea único de esa página (ej. la validación del login).

## Antes de correrlo

1. Copia tus carpetas `image/`, `audio/`, `video/`, `resources/` (las que ya
   tienes) dentro de `assets/` — no se incluyen aquí porque ya las tienes y
   pesan mucho.
2. Copia `.env.example` a `.env` y pon ahí tu `DATABASE_URL` real de Supabase/Neon.
3. `pip install -r requirements.txt` (o deja que Vercel lo haga en el deploy).
4. Falta crear la tabla `reservas` en Postgres antes de que `/api/reservas` funcione.
