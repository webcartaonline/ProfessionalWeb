/* ==========================================================================
   NAVBAR — Ventana de navegación en móvil.

   El botón muestra la página actual; al pulsarlo se abre la ventana
   (components/page-menu.css). Aquí se alterna [hidden] + .is-open para
   animar entrada y salida, se bloquea el scroll del fondo, se mantiene el
   foco dentro (botón + enlaces) y Escape o el velo la cierran.
   ========================================================================== */

(function () {
    "use strict";

    var toggle = document.querySelector("[data-menu-toggle]");
    var menu = document.querySelector("[data-menu]");

    if (!toggle || !menu) return;

    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    var links = Array.prototype.slice.call(menu.querySelectorAll("a"));
    var timer;

    function isOpen() {
        return toggle.getAttribute("aria-expanded") === "true";
    }

    function open() {
        clearTimeout(timer);
        menu.hidden = false;
        void menu.offsetWidth; // fuerza el estado inicial antes de animar
        menu.classList.add("is-open");
        toggle.setAttribute("aria-expanded", "true");
        document.body.classList.add("is-locked", "is-menu-open");

        var current = menu.querySelector('[aria-current="page"]') || links[0];
        if (current) current.focus({ preventScroll: true });
    }

    function close(returnFocus) {
        if (!isOpen()) return;
        menu.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("is-locked");

        timer = setTimeout(function () {
            menu.hidden = true;
            document.body.classList.remove("is-menu-open");
        }, reduce.matches ? 0 : 380);

        if (returnFocus !== false) toggle.focus();
    }

    toggle.addEventListener("click", function () {
        if (isOpen()) close();
        else open();
    });

    menu.addEventListener("click", function (event) {
        if (event.target.closest("[data-menu-close]")) close();
        else if (event.target.closest("a")) close(false);
    });

    document.addEventListener("keydown", function (event) {
        if (!isOpen()) return;

        if (event.key === "Escape") {
            close();
            return;
        }

        // Foco en bucle entre el botón y los enlaces de la ventana.
        if (event.key === "Tab") {
            var items = [toggle].concat(links);
            var i = items.indexOf(document.activeElement);
            var next = event.shiftKey ? i - 1 : i + 1;
            if (next < 0) next = items.length - 1;
            if (next >= items.length) next = 0;
            event.preventDefault();
            items[next].focus();
        }
    });

    // Al pasar a escritorio la ventana deja de tener sentido.
    var desktop = window.matchMedia("(min-width: 64em)");
    var onChange = function (event) {
        if (event.matches) close(false);
    };

    if (desktop.addEventListener) desktop.addEventListener("change", onChange);
    else desktop.addListener(onChange);
})();
