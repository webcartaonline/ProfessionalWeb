/* ==========================================================================
   FAQ — Buscador, filtros por tema, pestañas internas y capturas ampliables.

   Las preguntas son <details> nativos y funcionan sin este archivo: sin
   JavaScript se ven todas, con los pasos de cada dispositivo y cada
   mensaje de error uno detrás de otro. Esto solo añade la interacción.
   ========================================================================== */

(function () {
    "use strict";

    var items = document.querySelectorAll(".faq[data-cat]");
    if (!items.length) return;

    function each(list, fn) {
        Array.prototype.forEach.call(list, fn);
    }

    // Minúsculas y sin tildes: "publicación" encuentra "publicacion".
    function normalize(text) {
        return String(text).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
    }

    /* ----- Buscador y temas -------------------------------------------- */

    var tools = document.querySelector("[data-faq-tools]");
    var search = document.querySelector("[data-faq-search]");
    var topics = document.querySelectorAll("[data-faq-topic]");
    var empty = document.querySelector("[data-faq-empty]");
    var emptyQuery = document.querySelector("[data-faq-query]");
    var topic = "todas";

    // El texto de cada pregunta se indexa una sola vez.
    var index = [];
    each(items, function (item) {
        index.push({ item: item, cat: item.getAttribute("data-cat"), text: normalize(item.textContent) });
    });

    function filter() {
        var query = normalize(search.value.trim());
        var counts = { todas: 0 };
        var shown = 0;

        index.forEach(function (entry) {
            var matches = !query || entry.text.indexOf(query) !== -1;
            if (matches) {
                counts.todas += 1;
                counts[entry.cat] = (counts[entry.cat] || 0) + 1;
            }

            var visible = matches && (topic === "todas" || entry.cat === topic);
            var wasHidden = entry.item.hidden;
            entry.item.hidden = !visible;

            // Reinicia la animación de entrada solo en las que aparecen.
            if (visible && wasHidden) {
                entry.item.removeAttribute("data-shown");
                void entry.item.offsetWidth;
                entry.item.setAttribute("data-shown", "");
            }
            if (visible) shown += 1;
        });

        each(topics, function (button) {
            var count = counts[button.getAttribute("data-faq-topic")] || 0;
            button.querySelector(".faq-topic__count").textContent = count;
            button.toggleAttribute("data-empty", count === 0);
        });

        empty.hidden = shown > 0;
        emptyQuery.textContent = search.value.trim();
    }

    if (tools && search) {
        tools.hidden = false;

        search.addEventListener("input", filter);

        each(topics, function (button) {
            button.addEventListener("click", function () {
                topic = button.getAttribute("data-faq-topic");
                each(topics, function (other) {
                    other.setAttribute("aria-pressed", String(other === button));
                });
                filter();
            });
        });

        filter();
    }

    /* ----- Flechas para desplazar la fila de temas --------------------- */

    var topicsBar = document.querySelector("[data-faq-topics-bar]");
    var topicsRow = document.querySelector("[data-faq-topics]");

    if (topicsBar && topicsRow) {
        var prev = topicsBar.querySelector('[data-faq-scroll="-1"]');
        var next = topicsBar.querySelector('[data-faq-scroll="1"]');
        var smooth = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";

        // Activa o apaga cada flecha según quede fila por ese lado.
        var updateArrows = function () {
            var max = topicsRow.scrollWidth - topicsRow.clientWidth;
            topicsBar.toggleAttribute("data-fits", max <= 1);
            prev.disabled = topicsRow.scrollLeft <= 1;
            next.disabled = topicsRow.scrollLeft >= max - 1;
        };

        each([prev, next], function (arrow) {
            arrow.addEventListener("click", function () {
                var direction = Number(arrow.getAttribute("data-faq-scroll"));
                topicsRow.scrollBy({ left: direction * topicsRow.clientWidth * 0.6, behavior: smooth });
            });
        });

        topicsRow.addEventListener("scroll", updateArrows, { passive: true });
        window.addEventListener("resize", updateArrows);
        updateArrows();

        // La tipografía web cambia el ancho de los botones al terminar de cargar.
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(updateArrows);
    }

    /* ----- Enlace directo a una pregunta (faqs.html#instalar) ---------- */

    function openFromHash() {
        var id = decodeURIComponent(location.hash.slice(1));
        var target = id && document.getElementById(id);
        if (!target || !target.matches(".faq")) return;

        // Si la pregunta estaba oculta por un filtro, se quita el filtro.
        if (target.hidden && search) {
            search.value = "";
            topics[0].click();
        }
        target.open = true;
        target.scrollIntoView({ block: "start" });
    }

    window.addEventListener("hashchange", openFromHash);
    openFromHash();

    /* ----- Pestañas dentro de una respuesta ---------------------------- */

    var isApple = /iPhone|iPad|iPod/.test(navigator.userAgent);
    var isAndroid = /Android/.test(navigator.userAgent);

    each(document.querySelectorAll("[data-faq-tabs]"), function (panel) {
        var buttons = panel.querySelectorAll("[data-tab]");
        var panes = panel.querySelectorAll("[data-tab-panel]");

        function show(id) {
            each(buttons, function (button) {
                button.setAttribute("aria-pressed", String(button.getAttribute("data-tab") === id));
            });
            each(panes, function (pane) {
                pane.toggleAttribute("data-active", pane.getAttribute("data-tab-panel") === id);
            });
        }

        panel.setAttribute("data-tabs", "");
        each(buttons, function (button) {
            button.addEventListener("click", function () {
                show(button.getAttribute("data-tab"));
            });
        });

        // En la guía de instalación se preselecciona el dispositivo del visitante.
        if (panel.getAttribute("data-faq-tabs") === "install") {
            show(isApple ? "iphone" : isAndroid ? "android" : "pc");
        }
    });

    /* ----- Capturas ampliables ----------------------------------------- */

    var dialog = document.querySelector("[data-faq-zoom-dialog]");

    if (dialog && typeof dialog.showModal === "function") {
        var zoomImage = dialog.querySelector("img");

        each(document.querySelectorAll("[data-faq-zoom]"), function (button) {
            button.addEventListener("click", function () {
                var image = button.querySelector("img");
                zoomImage.src = image.currentSrc || image.src;
                zoomImage.alt = image.alt;
                dialog.showModal();
            });
        });

        // Cualquier clic dentro del visor lo cierra (Escape lo cierra de serie).
        dialog.addEventListener("click", function () {
            dialog.close();
        });
    } else {
        // Sin <dialog>: el botón de ampliar abre la imagen en otra pestaña.
        each(document.querySelectorAll("[data-faq-zoom]"), function (button) {
            button.addEventListener("click", function () {
                window.open(button.querySelector("img").src, "_blank", "noopener");
            });
        });
    }
})();
