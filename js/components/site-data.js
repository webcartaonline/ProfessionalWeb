/* ==========================================================================
   SITE DATA — Única fuente de verdad del contenido compartido.

   Cambia aquí un enlace, un teléfono o el texto del pie y se actualiza en
   todas las páginas (navbar, menú móvil y footer leen de este objeto).
   ========================================================================== */

(function () {
    "use strict";

    var PW = (window.PW = window.PW || {});

    PW.site = {
        brand: {
            name: "Professional Web",
            home: "index.html",
            logo: "Recursos/img/Logo/IsoLogoBlack.png",
            claim: "Webs rápidas y cuidadas para negocios que quieren dar el siguiente paso."
        },

        // Orden y textos del menú: se usan en la barra, el menú móvil y el pie.
        nav: [
            { href: "index.html", label: "Inicio" },
            { href: "plantillas.html", label: "Plantillas" },
            { href: "como-trabajamos.html", label: "Cómo trabajamos" },
            { href: "conoce-tus-herramientas.html", label: "Conoce tus herramientas" },
            { href: "precios.html", label: "Precios y Planes" },
            { href: "faqs.html", label: "FAQs" }
        ],

        contact: [
            { href: "mailto:webcartaonline@gmail.com", label: "webcartaonline@gmail.com" },
            { href: "tel:+34722207215", label: "+34 722-207-215" }
        ],

        footer: {
            navHeading: "Navegación",
            contactHeading: "Contacto",
            // {year} se sustituye por el año en curso.
            copyright: "© {year} Professional Web. Todos los derechos reservados."
        }
    };
})();
