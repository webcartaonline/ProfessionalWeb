/* ==========================================================================
   CARD GLOW — Pasa la posición del ratón a las tarjetas (.feature, .step,
   .extra, .cta, .plan) como --glow-x / --glow-y, relativa a cada una. Así la tarjeta
   bajo el puntero muestra el haz y las vecinas iluminan su borde.
   Solo con ratón: en táctil no hace nada (css/components/glow.css tampoco
   pinta el efecto fuera de "hover: hover" + "pointer: fine").
   ========================================================================== */

(function () {
    "use strict";

    if (!window.matchMedia) return;
    var fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    var SELECTOR = ".feature, .step, .extra, .cta, .plan";
    var REACH = 320; // px alrededor de la tarjeta en los que se calcula el brillo
    var root = document.documentElement;
    var frame = 0, x = -9999, y = -9999;

    function paint() {
        frame = 0;
        var cards = document.querySelectorAll(SELECTOR);
        for (var i = 0; i < cards.length; i++) {
            var r = cards[i].getBoundingClientRect();
            if (x < r.left - REACH || x > r.right + REACH || y < r.top - REACH || y > r.bottom + REACH) continue;
            cards[i].style.setProperty("--glow-x", (x - r.left) + "px");
            cards[i].style.setProperty("--glow-y", (y - r.top) + "px");
        }
    }

    function queue() { if (!frame) frame = requestAnimationFrame(paint); }

    document.addEventListener("pointermove", function (e) {
        if (e.pointerType !== "mouse" || !fine.matches) return;
        x = e.clientX;
        y = e.clientY;
        root.style.setProperty("--glow-b", "1");
        queue();
    }, { passive: true });

    // Al hacer scroll el ratón no se mueve pero las tarjetas sí.
    window.addEventListener("scroll", function () { if (x > -9999) queue(); }, { passive: true });

    document.addEventListener("pointerleave", function () {
        root.style.setProperty("--glow-b", "0");
    });
    document.documentElement.addEventListener("mouseleave", function () {
        root.style.setProperty("--glow-b", "0");
    });
})();
