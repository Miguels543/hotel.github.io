// ============================================================================
// nav.js — todo lo que antes estaba DUPLICADO en cada Scripts/*.js
// (carga de header/footer, menú responsivo, año del footer, sesión activa)
// Se carga UNA vez por página, antes del script propio de cada página.
// ============================================================================

document.addEventListener('DOMContentLoaded', async () => {
    await cargarComponentes();   // inyecta /components/header.html y footer.html
    marcarPaginaActiva();
    activarMenuResponsivo();
    actualizarAnioFooter();
    revisarSesionActiva();
});

// Busca cualquier elemento con [data-include="/components/algo.html"]
// y lo reemplaza por el contenido de ese archivo.
async function cargarComponentes() {
    const nodos = document.querySelectorAll('[data-include]');
    await Promise.all(
        Array.from(nodos).map(async (nodo) => {
            const ruta = nodo.getAttribute('data-include');
            const respuesta = await fetch(ruta);
            nodo.outerHTML = await respuesta.text();
        })
    );
}

// Marca como "activo" el link del nav que corresponde a la página actual,
// usando el atributo data-page del <body> de cada página.
function marcarPaginaActiva() {
    const paginaActual = document.body.dataset.page;
    if (!paginaActual) return;
    const enlace = document.querySelector(`#nav-principal a[data-page="${paginaActual}"]`);
    if (enlace) enlace.classList.add('activo');
}

function activarMenuResponsivo() {
    const btnMenu = document.getElementById('btn-menu');
    const navPrincipal = document.getElementById('nav-principal');
    if (!btnMenu || !navPrincipal) return;

    btnMenu.addEventListener('click', () => {
        const abierto = navPrincipal.classList.toggle('nav-abierto');
        btnMenu.classList.toggle('abierto', abierto);
        btnMenu.setAttribute('aria-expanded', abierto);
    });

    navPrincipal.querySelectorAll('a').forEach((a) => {
        a.addEventListener('click', () => {
            navPrincipal.classList.remove('nav-abierto');
            btnMenu.classList.remove('abierto');
            btnMenu.setAttribute('aria-expanded', false);
        });
    });
}

function actualizarAnioFooter() {
    const footerAnio = document.querySelector('footer p:last-child');
    if (footerAnio) {
        footerAnio.textContent = `© ${new Date().getFullYear()} Hotel Wyndham Costa del Sol Chiclayo`;
    }
}

// Si hay sesión activa en sessionStorage, oculta "Iniciar Sesión"
// y agrega el botón "Cerrar Sesión" al nav.
function revisarSesionActiva() {
    const sesionData = sessionStorage.getItem('wyndham_sesion');
    const enlaceLogin = document.querySelector('.btn-login');
    if (!sesionData || !enlaceLogin) return;

    try {
        const sesion = JSON.parse(sesionData);
        if (!sesion || !sesion.activo) return;

        enlaceLogin.style.display = 'none';
        const ulNav = document.querySelector('#nav-principal ul');
        if (ulNav && !document.getElementById('li-logout')) {
            const li = document.createElement('li');
            li.id = 'li-logout';
            const btn = document.createElement('button');
            btn.id = 'btn-logout';
            btn.className = 'btn-logout pulse';
            btn.textContent = 'Cerrar Sesión';
            btn.addEventListener('click', () => {
                sessionStorage.removeItem('wyndham_sesion');
                window.location.href = '/index.html';
            });
            li.appendChild(btn);
            ulNav.appendChild(li);
        }
    } catch (e) {
        // sesión corrupta en sessionStorage, se ignora
    }
}
