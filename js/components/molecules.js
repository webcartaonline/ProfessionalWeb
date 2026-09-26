/* ==========================================================================
   MOLÉCULAS — Grupos pequeños de átomos que funcionan juntos:
   una lista de enlaces de navegación, una lista de contactos.
   ========================================================================== */

(function () {
    "use strict";

    var PW = (window.PW = window.PW || {});
    var atoms = PW.atoms;

    PW.molecules = {
        // Lista de navegación. variant: "navbar" | "drawer" | "footer".
        navList: function (items, variant, currentHref) {
            var listClass = variant === "footer" ? "footer__list" : variant + "__menu";

            var links = items.map(function (item) {
                return "<li>" + atoms.navLink(item, variant, item.href === currentHref) + "</li>";
            });

            return '<ul class="' + listClass + '">' + links.join("") + "</ul>";
        },

        // Contactos del menú móvil: enlaces sueltos dentro de .drawer__footer.
        drawerContacts: function (items) {
            var links = items.map(function (item) {
                return atoms.contactLink(item, "drawer__contact");
            });

            return '<div class="drawer__footer">' + links.join("") + "</div>";
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
