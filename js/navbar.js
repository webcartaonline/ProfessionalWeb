/* ==========================================================================
   NAVBAR — Apertura y cierre del menú lateral en móvil.

   El menú vive en el HTML con [hidden]; aquí solo se alterna ese atributo,
   se bloquea el scroll del fondo y se devuelve el foco al botón al cerrar.
   Sin JavaScript el botón queda oculto por CSS y nada se rompe.
   ========================================================================== */

(function () {
    "use strict";

    var toggle = document.querySelector("[data-drawer-toggle]");
    var drawer = document.querySelector("[data-drawer]");

    if (!toggle || !drawer) return;

    function open() {
        drawer.hidden = false;
        toggle.setAttribute("aria-expanded", "true");
        document.body.classList.add("is-locked");

        var first = drawer.querySelector(".drawer__close");
        if (first) first.focus();
    }

    function close() {
        drawer.hidden = true;
        toggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("is-locked");
        toggle.focus();
    }

    toggle.addEventListener("click", function () {
        if (drawer.hidden) open();
        else close();
    });

    // El velo, la aspa y cualquier enlace cierran el menú.
    drawer.addEventListener("click", function (event) {
        if (event.target.closest("[data-drawer-close], .drawer__link")) close();
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && !drawer.hidden) close();
    });

    // Al pasar a escritorio el menú lateral deja de tener sentido.
    var desktop = window.matchMedia("(min-width: 64em)");
    var onChange = function (event) {
        if (event.matches && !drawer.hidden) close();
    };

    if (desktop.addEventListener) desktop.addEventListener("change", onChange);
    else desktop.addListener(onChange);
})();
