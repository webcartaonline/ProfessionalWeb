/* ==========================================================================
   REVEAL — Aparición suave de los bloques marcados con [data-reveal].

   El <head> de cada página añade la clase .js-reveal al <html> (solo si el
   navegador soporta IntersectionObserver y el usuario no ha pedido reducir
   el movimiento). Ese guardián evita el parpadeo inicial y garantiza que,
   sin JavaScript o sin soporte, la página se vea completa desde el principio.
   ========================================================================== */

(function () {
    "use strict";

    if (!document.documentElement.classList.contains("js-reveal")) return;

    var elements = document.querySelectorAll("[data-reveal]");
    if (!elements.length) return;

    var observer = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                entry.target.setAttribute("data-revealed", "");
                observer.unobserve(entry.target);
            });
        },
        { threshold: 0.1, rootMargin: "0px 0px -6% 0px" }
    );

    Array.prototype.forEach.call(elements, function (element, index) {
        // Escalonado corto: hasta 240 ms de retardo entre bloques vecinos.
        element.style.setProperty("--reveal-delay", Math.min(index * 40, 240) + "ms");
        observer.observe(element);
    });
})();
