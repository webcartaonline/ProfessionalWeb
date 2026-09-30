/* ==========================================================================
   FAQ — Buscador (resultados exactos y por similitud), filtros por tema,
   pestañas internas y capturas ampliables.

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

    // Palabras que no aportan nada a la búsqueda por similitud.
    var STOPWORDS = ("de la el los las un una unos unas y o a en con por para que se me mi mis tu tus su sus " +
        "lo le les al del es son hay como cual donde cuando puedo puede quiero tengo esta este esto " +
        "eso muy mas pero sin sobre hasta").split(" ");

    function words(text) {
        return normalize(text).split(/[^a-z0-9]+/).filter(function (word) {
            return word.length > 2 && STOPWORDS.indexOf(word) === -1;
        });
    }

    function unique(list) {
        return list.filter(function (word, i) {
            return list.indexOf(word) === i;
        });
    }

    // Distancia de edición (letras que hay que cambiar para ir de una palabra a otra).
    function distance(a, b) {
        var row = [];
        for (var j = 0; j <= b.length; j++) row.push(j);
        for (var i = 1; i <= a.length; i++) {
            var diagonal = row[0];
            row[0] = i;
            for (var k = 1; k <= b.length; k++) {
                var above = row[k];
                row[k] = Math.min(row[k] + 1, row[k - 1] + 1, diagonal + (a[i - 1] === b[k - 1] ? 0 : 1));
                diagonal = above;
            }
        }
        return row[b.length];
    }

    // Parecido entre dos palabras, de 0 a 1: iguales, misma raíz
    // («publicar» / «publicación») o con alguna errata («alergneos»).
    function likeness(a, b) {
        if (a === b) return 1;
        var shorter = Math.min(a.length, b.length);
        if (shorter >= 4 && (a.indexOf(b) === 0 || b.indexOf(a) === 0)) return 0.9;

        var prefix = 0;
        while (prefix < shorter && a[prefix] === b[prefix]) prefix += 1;
        if (prefix >= 5) return 0.8;

        if (shorter < 4 || Math.abs(a.length - b.length) > 2) return 0;
        var ratio = 1 - distance(a, b) / Math.max(a.length, b.length);
        return ratio >= 0.75 ? ratio * 0.85 : 0;
    }

    function best(word, list) {
        var top = 0;
        for (var i = 0; i < list.length && top < 1; i++) {
            top = Math.max(top, likeness(word, list[i]));
        }
        return top;
    }

    // Pesa más coincidir con la pregunta o sus palabras clave que con la respuesta.
    function similarity(entry, queryWords) {
        var total = 0;
        queryWords.forEach(function (word) {
            total += Math.max(best(word, entry.title) * 3, best(word, entry.keywords) * 2.5, best(word, entry.body));
        });
        return total / (queryWords.length * 3);
    }

    var MIN_SIMILARITY = 0.16;
    var MAX_SIMILAR = 6;

    var tools = document.querySelector("[data-faq-tools]");
    var search = document.querySelector("[data-faq-search]");
    var topics = document.querySelectorAll("[data-faq-topic]");
    var list = document.querySelector("[data-faq-list]");
    var empty = document.querySelector("[data-faq-empty]");
    var queryLabels = document.querySelectorAll("[data-faq-query]");
    var status = document.querySelector("[data-faq-status]");
    var similarBox = document.querySelector("[data-faq-similar]");
    var similarList = document.querySelector("[data-faq-similar-list]");
    var similarNone = document.querySelector("[data-faq-similar-none]");
    var topic = "todas";

    // El texto de cada pregunta se indexa una sola vez.
    var index = [];
    each(items, function (item) {
        var title = item.querySelector(".faq__title").textContent;
        var text = item.textContent;
        // Los subtítulos del vídeo (JSON) no cuentan como texto de la respuesta.
        each(item.querySelectorAll("script"), function (script) {
            text = text.replace(script.textContent, "");
        });
        index.push({
            item: item,
            cat: item.getAttribute("data-cat"),
            text: normalize(text),
            title: unique(words(title)),
            keywords: unique(words(item.getAttribute("data-keywords") || "")),
            body: unique(words(text))
        });
    });

    function reveal(entry, visible) {
        var wasHidden = entry.item.hidden;
        entry.item.hidden = !visible;

        // Reinicia la animación de entrada solo en las que aparecen.
        if (visible && wasHidden) {
            entry.item.removeAttribute("data-shown");
            void entry.item.offsetWidth;
            entry.item.setAttribute("data-shown", "");
        }
    }

    function filter() {
        var raw = search.value.trim();
        var query = normalize(raw);
        var queryWords = unique(words(raw));
        var counts = { todas: 0 };
        var exact = [];
        var similar = [];

        index.forEach(function (entry) {
            if (!query || entry.text.indexOf(query) !== -1) {
                entry.score = Infinity;
                exact.push(entry);
            } else {
                entry.score = queryWords.length ? similarity(entry, queryWords) : 0;
                if (entry.score >= MIN_SIMILARITY) similar.push(entry);
            }
        });

        similar.sort(function (a, b) {
            return b.score - a.score;
        });
        similar = similar.slice(0, MAX_SIMILAR);

        exact.concat(similar).forEach(function (entry) {
            counts.todas += 1;
            counts[entry.cat] = (counts[entry.cat] || 0) + 1;
        });

        var inTopic = function (entry) {
            return topic === "todas" || entry.cat === topic;
        };

        // Exactas en su orden de siempre; parecidas aparte, de más a menos parecidas.
        index.forEach(function (entry) {
            list.appendChild(entry.item);
            reveal(entry, entry.score === Infinity && inTopic(entry));
        });
        similar.forEach(function (entry) {
            similarList.appendChild(entry.item);
            reveal(entry, inTopic(entry));
        });

        var shownExact = exact.filter(inTopic).length;
        var shownSimilar = similar.filter(inTopic).length;

        each(topics, function (button) {
            var count = counts[button.getAttribute("data-faq-topic")] || 0;
            button.querySelector(".faq-topic__count").textContent = count;
            button.toggleAttribute("data-empty", count === 0);
        });

        each(queryLabels, function (label) {
            label.textContent = raw;
        });
        empty.hidden = !query || shownExact > 0;
        similarBox.hidden = !query;
        similarNone.hidden = shownSimilar > 0;

        status.textContent = query
            ? shownExact + " resultados exactos y " + shownSimilar + " por similitud."
            : "";
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

        // Si la pregunta estaba oculta o apartada por un filtro o una
        // búsqueda, se quitan ambos para verla en su sitio.
        if (search && (target.hidden || search.value)) {
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
