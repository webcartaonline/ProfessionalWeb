/* ==========================================================================
   FAQ — Comportamiento de acordeón: al abrir una pregunta se cierran las
   demás. El acordeón funciona sin este archivo (son <details> nativos);
   esto solo evita que queden varias abiertas a la vez.
   ========================================================================== */

(function () {
    "use strict";

    var items = document.querySelectorAll("[data-faq]");
    if (items.length < 2) return;

    Array.prototype.forEach.call(items, function (item) {
        item.addEventListener("toggle", function () {
            if (!item.open) return;

            Array.prototype.forEach.call(items, function (other) {
                if (other !== item) other.open = false;
            });
        });
    });
})();
