/* ==========================================================================
   GALLERY — Pestañas de la galería de plantillas.

   Hay dos niveles de pestañas anidados y los dos usan el mismo patrón ARIA:
   una lista [role="tablist"] cuyos botones apuntan con aria-controls al
   panel que muestran. Este archivo se limita a mover la selección; sin él
   no se oculta nada y la página sigue mostrando todos los diseños.
   ========================================================================== */

(function () {
    "use strict";

    var lists = document.querySelectorAll("[data-gallery-tabs]");
    if (!lists.length) return;

    function tabsOf(list) {
        return list.querySelectorAll("[role='tab']");
    }

    function panelOf(tab) {
        return document.getElementById(tab.getAttribute("aria-controls"));
    }

    // Repite la animación de entrada del carril: hay que quitar la clase,
    // forzar un reflujo y volver a ponerla, o el navegador no la reinicia.
    function replay(panel) {
        var rails = panel.classList.contains("gallery__screens")
            ? [panel]
            : panel.querySelectorAll(".gallery__screens:not([hidden])");

        Array.prototype.forEach.call(rails, function (rail) {
            rail.classList.remove("is-entering");
            void rail.offsetWidth;
            rail.classList.add("is-entering");
            rail.scrollLeft = 0;
        });
    }

    function select(list, tab, animate) {
        Array.prototype.forEach.call(tabsOf(list), function (other) {
            var active = other === tab;
            var panel = panelOf(other);

            other.setAttribute("aria-selected", active ? "true" : "false");
            other.tabIndex = active ? 0 : -1;

            if (!panel) return;
            panel.hidden = !active;
            if (active && animate) replay(panel);
        });
    }

    function move(list, from, step) {
        var tabs = tabsOf(list);
        var index = Array.prototype.indexOf.call(tabs, from);
        var next = tabs[(index + step + tabs.length) % tabs.length];

        select(list, next, true);
        next.focus();
    }

    Array.prototype.forEach.call(lists, function (list) {
        var tabs = tabsOf(list);
        if (tabs.length < 2) return;

        // Estado inicial sin animación: la primera visita no debe pelearse
        // con la aparición progresiva de js/reveal.js.
        var current = list.querySelector("[role='tab'][aria-selected='true']") || tabs[0];
        select(list, current, false);

        list.addEventListener("click", function (event) {
            var tab = event.target.closest("[role='tab']");
            if (tab) select(list, tab, true);
        });

        list.addEventListener("keydown", function (event) {
            var tab = event.target.closest("[role='tab']");
            if (!tab) return;

            var key = event.key;
            if (key === "ArrowRight" || key === "ArrowDown") move(list, tab, 1);
            else if (key === "ArrowLeft" || key === "ArrowUp") move(list, tab, -1);
            else if (key === "Home") move(list, tabsOf(list)[0], 0);
            else if (key === "End") move(list, tabsOf(list)[tabsOf(list).length - 1], 0);
            else return;

            event.preventDefault();
        });
    });
})();
