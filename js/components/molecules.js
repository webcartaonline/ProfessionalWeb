/* ==========================================================================
   MOLÉCULAS — Grupos pequeños de átomos que funcionan juntos:
   una lista de enlaces de navegación, una lista de contactos.
   ========================================================================== */

(function () {
    "use strict";

    var PW = (window.PW = window.PW || {});
    var atoms = PW.atoms;

    PW.molecules = {
        // Lista de navegación. variant: "navbar" | "page-menu" | "footer".
        navList: function (items, variant, currentHref) {
            var listClass = {
                navbar: "navbar__menu",
                "page-menu": "page-menu__list",
                footer: "footer__list"
            }[variant];

            var links = items.map(function (item, index) {
                // --i escalona la entrada animada de la ventana móvil.
                var li = variant === "page-menu" ? '<li style="--i: ' + index + '">' : "<li>";
                return li + atoms.navLink(item, variant, item.href === currentHref) + "</li>";
            });

            return '<ul class="' + listClass + '">' + links.join("") + "</ul>";
        },

        // Contactos de la ventana móvil: enlaces sueltos en .page-menu__footer.
        menuContacts: function (items) {
            var links = items.map(function (item) {
                return atoms.contactLink(item, "page-menu__contact");
            });

            return '<div class="page-menu__footer">' + links.join("") + "</div>";
        },

        // Contactos del pie: lista con el mismo estilo que la navegación.
        footerContacts: function (items) {
            var links = items.map(function (item) {
                return "<li>" + atoms.contactLink(item, "footer__link") + "</li>";
            });

            return '<ul class="footer__list">' + links.join("") + "</ul>";
        },

        // Columna del pie: título + contenido.
        footerColumn: function (heading, content) {
            return "<div>" + atoms.footerHeading(heading) + content + "</div>";
        }
    };
})();
