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

        // Enlace de navegación. variant: "navbar" | "page-menu" | "footer".
        // La página actual se marca con aria-current (el CSS la resalta).
        navLink: function (item, variant, isCurrent) {
            var current = isCurrent ? ' aria-current="page"' : "";
            var label = escape(item.label);

            // En la ventana móvil el texto va en <span> seguido de una flecha.
            if (variant === "page-menu") {
                label = "<span>" + label + "</span>" + '<span class="page-menu__arrow" aria-hidden="true"></span>';
            }

            return '<a class="' + variant + '__link" href="' + escape(item.href) + '"' + current + ">" + label + "</a>";
        },

        // Enlace de contacto (email, teléfono…). className según dónde viva.
        contactLink: function (item, className) {
            return '<a class="' + className + '" href="' + escape(item.href) + '">' + escape(item.label) + "</a>";
        },

        // Botón de móvil que muestra la página actual y abre la ventana de
        // navegación (lo gestiona js/navbar.js).
        menuToggle: function (controls, currentLabel) {
            return (
                '<button class="navbar__toggle" type="button" data-menu-toggle aria-expanded="false" ' +
                'aria-controls="' + escape(controls) + '" aria-haspopup="dialog">' +
                '<span class="visually-hidden">Página actual: </span>' +
                '<span class="navbar__current">' + escape(currentLabel) + "</span>" +
                '<span class="visually-hidden">. Abrir menú de páginas</span>' +
                '<span class="navbar__chevron" aria-hidden="true"></span>' +
                "</button>"
            );
        },

        // Rótulo pequeño sobre la lista de la ventana móvil.
        eyebrow: function (text) {
            return '<p class="page-menu__eyebrow">' + escape(text) + "</p>";
        },

        // Título pequeño de columna del pie.
        footerHeading: function (text) {
            return '<h2 class="footer__heading">' + escape(text) + "</h2>";
        }
    };
})();
