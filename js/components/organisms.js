/* ==========================================================================
   ORGANISMOS — Bloques completos que se repiten en todas las páginas:
   cabecera (skip-link + navbar + menú móvil) y pie.

   Se registran como etiquetas propias para usarlas en el HTML:

       <pw-header current="precios.html"></pw-header>
       ...
       <pw-footer></pw-footer>

   Al conectarse, cada etiqueta se sustituye por su HTML final, así el DOM
   queda idéntico al marcado de siempre y el CSS y js/navbar.js funcionan
   sin cambios. Este archivo se carga en el <head> SIN defer: las etiquetas
   quedan definidas antes de leer el <body> y se pintan a la vez que el resto
   de la página, sin parpadeos.
   ========================================================================== */

(function () {
    "use strict";

    var PW = (window.PW = window.PW || {});
    var site = PW.site;
    var atoms = PW.atoms;
    var molecules = PW.molecules;

    var DRAWER_ID = "menu-movil";
    var CONTENT_ID = "contenido";

    PW.organisms = {
        // Barra flotante de escritorio + botón del menú en móvil.
        navbar: function (currentHref) {
            return (
                '<div class="navbar-scrim">' +
                '<nav class="navbar" aria-label="Navegación principal">' +
                atoms.brandLogo(site.brand) +
                molecules.navList(site.nav, "navbar", currentHref) +
                atoms.menuToggle(DRAWER_ID) +
                "</nav>" +
                "</div>"
            );
        },

        // Menú lateral de móvil (oculto con [hidden] hasta que se abre).
        drawer: function (currentHref) {
            return (
                '<div class="drawer" id="' + DRAWER_ID + '" data-drawer hidden>' +
                '<div class="drawer__scrim" data-drawer-close></div>' +
                '<nav class="drawer__panel" aria-label="Navegación móvil">' +
                '<div class="drawer__header">' + atoms.closeButton() + "</div>" +
                molecules.navList(site.nav, "drawer", currentHref) +
                molecules.drawerContacts(site.contact) +
                "</nav>" +
                "</div>"
            );
        },

        // Cabecera completa de cada página.
        header: function (currentHref) {
            return atoms.skipLink(CONTENT_ID) + this.navbar(currentHref) + this.drawer(currentHref);
        },

        // Pie: marca, mapa del sitio, contacto y copyright.
        footer: function () {
            var copyright = site.footer.copyright.replace("{year}", new Date().getFullYear());

            return (
                '<footer class="footer">' +
                '<div class="container">' +
                '<div class="footer__grid">' +
                "<div>" +
                '<p class="footer__brand-name">' + atoms.escape(site.brand.name) + "</p>" +
                '<p class="footer__claim">' + atoms.escape(site.brand.claim) + "</p>" +
                "</div>" +
                molecules.footerColumn(site.footer.navHeading, molecules.navList(site.nav, "footer")) +
                molecules.footerColumn(site.footer.contactHeading, molecules.footerContacts(site.contact)) +
                "</div>" +
                '<div class="footer__bottom"><p>' + atoms.escape(copyright) + "</p></div>" +
                "</div>" +
                "</footer>"
            );
        }
    };

    // Página actual: la del atributo current="" o, si falta, la de la URL.
    function currentPage(element) {
        var explicit = element.getAttribute("current");
        if (explicit) return explicit;

        var file = window.location.pathname.split("/").pop() || site.brand.home;
        return /\.html?$/.test(file) ? file : file + ".html";
    }

    // Sustituye la etiqueta por el HTML generado.
    function replaceWith(element, html) {
        var template = document.createElement("template");
        template.innerHTML = html;
        element.replaceWith(template.content);
    }

    function define(name, render) {
        if (!window.customElements || customElements.get(name)) return;

        customElements.define(
            name,
            class extends HTMLElement {
                connectedCallback() {
                    replaceWith(this, render(this));
                }
            }
        );
    }

    define("pw-header", function (element) {
        return PW.organisms.header(currentPage(element));
    });

    define("pw-footer", function () {
        return PW.organisms.footer();
    });
})();
