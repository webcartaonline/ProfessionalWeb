/* ==========================================================================
   ÁTOMOS — Las piezas mínimas: un enlace, el logo, un botón.

   Cada átomo es una función que recibe datos y devuelve HTML (string).
   No saben dónde se van a usar: eso lo deciden las moléculas y organismos.
   ========================================================================== */

(function () {
    "use strict";

    var PW = (window.PW = window.PW || {});

    // Escapa texto para meterlo en HTML sin riesgo.
    function escape(value) {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }

    PW.atoms = {
        escape: escape,

        // Enlace "Saltar al contenido" para teclado y lectores de pantalla.
        skipLink: function (target) {
            return '<a class="skip-link" href="#' + escape(target) + '">Saltar al contenido</a>';
        },

        // Logo de la marca enlazado a Inicio.
        brandLogo: function (brand) {
            return (
                '<a class="navbar__brand" href="' + escape(brand.home) + '" aria-label="' +
                escape(brand.name) + ' — Inicio">' +
                '<img class="navbar__logo" src="' + escape(brand.logo) + '" alt="' +
                escape(brand.name) + '" width="120" height="32">' +
                "</a>"
            );
        },

        // Enlace de navegación. variant: "navbar" | "drawer" | "footer".
        // La página actual se marca con aria-current (el CSS la resalta).
        navLink: function (item, variant, isCurrent) {
            var current = isCurrent ? ' aria-current="page"' : "";
            var dot = variant === "drawer" ? '<span class="drawer__dot"></span>' : "";

            return (
                '<a class="' + variant + '__link" href="' + escape(item.href) + '"' + current + ">" +
                dot + escape(item.label) +
                "</a>"
            );
        },

        // Enlace de contacto (email, teléfono…). className según dónde viva.
        contactLink: function (item, className) {
            return '<a class="' + className + '" href="' + escape(item.href) + '">' + escape(item.label) + "</a>";
        },

        // Botón hamburguesa que abre el menú móvil (lo gestiona js/navbar.js).
        menuToggle: function (controls) {
            return (
                '<button class="navbar__toggle" type="button" data-drawer-toggle aria-expanded="false" ' +
                'aria-controls="' + escape(controls) + '" aria-label="Abrir menú">' +
                '<span class="navbar__bar"></span>' +
                '<span class="navbar__bar"></span>' +
                '<span class="navbar__bar"></span>' +
                "</button>"
            );
        },

        // Aspa que cierra el menú móvil.
        closeButton: function () {
            return '<button class="drawer__close" type="button" data-drawer-close aria-label="Cerrar menú">&times;</button>';
        },

        // Título pequeño de columna del pie.
        footerHeading: function (text) {
            return '<h2 class="footer__heading">' + escape(text) + "</h2>";
        }
    };
})();
