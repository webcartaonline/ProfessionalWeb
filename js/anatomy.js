/* ==========================================================================
   ANATOMY — Ilumina cada parte de la carta sobre la captura real.

   Las coordenadas están en píxeles de las capturas (780 × 1646). Cada pieza
   tiene su ejemplo en una o en varias plantillas; si una plantilla no la
   muestra, su botón se desactiva y se usa la primera que sí la tiene.
   Mientras nadie toque nada, el bloque hace un recorrido automático.

   PARA AÑADIR UNA PLANTILLA:
     1. Sus capturas van en Recursos/img/PlantillaN/ (780 × 1646, .jpg).
     2. Se añade a TEMPLATES, con el nombre que se enseña de cada captura.
     3. Se añade su ejemplo a cada pieza de PARTS (la que no tenga, sin él).
     4. Se añade su botón en plantillas.html (data-tpl="pN").
   ========================================================================== */

(function () {
    "use strict";

    var root = document.querySelector("[data-anatomy]");
    if (!root) return;

    var W = 780, H = 1646, PAD = 8, MARKS = 4, STEP = 4800;

    /* Cada plantilla: su nombre y sus capturas (archivo → nombre que se enseña). */
    var TEMPLATES = {
        p1: {
            name: "Plantilla 1",
            screens: { Inicio: "Inicio", Tapas: "Tapas", Hamburguesas: "Hamburguesas", Cervezas: "Cervezas", Alergenos: "Tapas (final)", Redes: "Tapas (final)", "Alerta.png": "Tapas" }
        },
        p2: {
            name: "Plantilla 2",
            screens: { Inicio: "Inicio", Tapas: "Tapas", Hamburguesas: "Hamburguesas", Cervezas: "Cervezas", Alergenos: "Tapas (final)" }
        },
        p3: {
            name: "Plantilla 3",
            screens: { Inicio: "Inicio", Panes: "Panes", Pasteleria: "Pastelería", Alergenos: "Panes (filtro)", Pie: "Panes (final)" }
        },
        p4: {
            name: "Plantilla 4",
            screens: { Inicio: "Inicio", Desayunos: "Desayunos", Tapas: "Tapas y raciones", Alergenos: "Desayunos (final)", Pie: "Desayunos (final)" }
        }
    };
    var TPL_ORDER = Object.keys(TEMPLATES);

    function shot(tpl, screen) {
        return "Recursos/img/Plantilla" + tpl.slice(1) + "/" + screen + (screen.indexOf(".") < 0 ? ".jpg" : "");
    }

    var PARTS = {
        portada: {
            p1: { s: "Inicio", r: [[0, 0, 780, 594]] },
            p2: { s: "Inicio", r: [[0, 0, 780, 328]] },
            p3: { s: "Inicio", r: [[0, 0, 780, 440]] },
            p4: { s: "Inicio", r: [[0, 0, 780, 734]] }
        },
        logo: {
            p1: { s: "Inicio", r: [[104, 298, 112, 112]] },
            p2: { s: "Inicio", r: [[40, 66, 116, 116]] },
            p3: { s: "Inicio", r: [[274, 326, 232, 232]] },
            p4: { s: "Inicio", r: [[270, 211, 240, 240]] }
        },
        secciones: {
            p1: { s: "Inicio", r: [[0, 598, 780, 108]] },
            p2: { s: "Inicio", r: [[0, 330, 780, 106]] },
            p3: { s: "Inicio", r: [[0, 777, 780, 214]] },
            p4: { s: "Inicio", r: [[0, 1096, 780, 103]] }
        },
        decorativas: {
            p1: { s: "Inicio", r: [[0, 708, 780, 256], [0, 1082, 780, 232]] },
            p2: { s: "Inicio", r: [[0, 456, 780, 248], [40, 900, 700, 184], [40, 1120, 700, 184], [40, 1340, 700, 184]] },
            p3: { s: "Inicio", r: [[0, 0, 780, 440], [0, 801, 780, 124], [32, 1561, 716, 85]] },
            p4: { s: "Inicio", r: [[0, 0, 780, 734], [32, 829, 716, 239], [32, 1239, 716, 143]] }
        },
        notas: {
            p2: { s: "Tapas", r: [[40, 76, 470, 92]] },
            p3: { s: "Inicio", r: [[30, 1137, 633, 192], [164, 1346, 585, 152]] }
        },
        grupos: {
            p1: { s: "Cervezas", r: [[40, 240, 700, 88], [40, 1560, 700, 76]] },
            p2: { s: "Cervezas", r: [[40, 220, 700, 182], [40, 1374, 700, 94], [40, 1504, 700, 94]] },
            p3: { s: "Panes", r: [[52, 362, 360, 80]] },
            p4: { s: "Desayunos", r: [[68, 159, 441, 47]] }
        },
        alertas: {
            p1: { s: "Alerta.png", r: [[26, 473, 302, 44]], below: true },
            p2: { s: "Hamburguesas", r: [[40, 314, 700, 86]] },
            p3: { s: "Pasteleria", r: [[304, 740, 255, 55]] },
            p4: { s: "Tapas", r: [[67, 526, 585, 72]] }
        },
        productos: {
            p1: { s: "Tapas", r: [[40, 470, 700, 330], [40, 848, 700, 370]] },
            p2: { s: "Hamburguesas", r: [[40, 410, 700, 416], [40, 836, 700, 466]] },
            p3: { s: "Panes", r: [[32, 473, 344, 552], [404, 473, 344, 552]] },
            p4: { s: "Desayunos", r: [[68, 308, 644, 312], [68, 620, 644, 216], [68, 836, 644, 314]] }
        },
        fotos: {
            p1: { s: "Tapas", r: [[564, 480, 176, 176], [564, 858, 176, 176], [564, 1278, 176, 176]] },
            p2: { s: "Hamburguesas", r: [[552, 442, 148, 148], [552, 868, 148, 148], [552, 1344, 148, 148]] },
            p3: { s: "Panes", r: [[32, 473, 344, 344], [404, 473, 344, 344], [32, 1069, 344, 344], [404, 1069, 344, 344]] },
            p4: { s: "Tapas", r: [[68, 650, 128, 128], [68, 923, 128, 128], [68, 1405, 128, 128]] }
        },
        etiquetas: {
            p1: { s: "Tapas", r: [[40, 656, 372, 46], [40, 1076, 186, 46], [40, 1454, 372, 46]] },
            p2: { s: "Hamburguesas", r: [[80, 550, 208, 42], [80, 1024, 100, 42], [268, 1156, 226, 42], [80, 1452, 242, 42]] },
            p3: { s: "Panes", r: [[52, 489, 271, 39], [424, 489, 94, 39], [36, 1574, 138, 39]] },
            p4: { s: "Desayunos", r: [[68, 397, 199, 40], [222, 1016, 284, 40], [68, 1461, 118, 40]] }
        },
        alergenos: {
            p1: { s: "Hamburguesas", r: [[40, 636, 260, 56], [40, 1032, 192, 56], [40, 1382, 192, 56]] },
            p2: { s: "Tapas", r: [[80, 642, 120, 54], [80, 1016, 120, 54], [80, 1340, 120, 54]] },
            p3: { s: "Panes", r: [[36, 981, 44, 44], [408, 981, 94, 44]] },
            p4: { s: "Desayunos", r: [[68, 542, 50, 50], [68, 758, 108, 50], [222, 1072, 108, 50], [68, 1292, 166, 50]] }
        },
        filtro: {
            p1: { s: "Alergenos", r: [[0, 282, 780, 898]] },
            p2: { s: "Alergenos", r: [[40, 280, 700, 792]] },
            p3: { s: "Alergenos", r: [[0, 736, 780, 910]] },
            p4: { s: "Alergenos", r: [[40, 136, 700, 769]] }
        },
        pie: {
            p1: { s: "Alergenos", r: [[180, 1310, 420, 284]] },
            p2: { s: "Alergenos", r: [[190, 1140, 400, 204]] },
            p3: { s: "Pie", r: [[74, 724, 632, 161], [74, 913, 632, 121]] },
            p4: { s: "Pie", r: [[94, 833, 584, 203], [99, 1060, 583, 158]] }
        },
        redes: {
            p1: { s: "Redes", r: [[100, 1322, 580, 60]] },
            p2: { s: "Alergenos", r: [[100, 1432, 580, 82]] },
            p3: { s: "Pie", r: [[122, 1100, 536, 76]] },
            p4: { s: "Pie", r: [[299, 1249, 190, 88]] }
        }
    };

    /* Las plantillas que tienen ejemplo de esta pieza, en orden. */
    function templatesWith(data) {
        return TPL_ORDER.filter(function (t) { return data[t]; });
    }

    /* «la Plantilla 2» · «las plantillas 2 y 3» · «las plantillas 1, 2 y 4» */
    function describeTemplates(list) {
        if (list.length === 1) return "la " + TEMPLATES[list[0]].name;
        var numbers = list.map(function (t) { return t.slice(1); });
        return "las plantillas " + numbers.slice(0, -1).join(", ") + " y " + numbers[numbers.length - 1];
    }

    var parts = Array.prototype.slice.call(root.querySelectorAll("[data-part]"));
    var tpls = Array.prototype.slice.call(root.querySelectorAll("[data-tpl]"));
    var list = root.querySelector(".anatomy__list");
    var shots = root.querySelectorAll(".anatomy__shot");
    var holes = root.querySelectorAll("[data-anatomy-hole]");
    var marks = root.querySelectorAll(".anatomy__mark");
    var label = root.querySelector("[data-anatomy-label]");
    var meta = root.querySelector("[data-anatomy-meta]");
    var caption = root.querySelector("[data-anatomy-caption]");
    var note = root.querySelector("[data-anatomy-note]");

    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var state = { part: parts[0].dataset.part, tpl: "p1", touring: false };
    var current = empty();
    var frame, tourTimer, activeShot = 0, labelBelow = false;

    root.style.setProperty("--anatomy-step", STEP + "ms");

    function empty() {
        var out = [];
        for (var i = 0; i < MARKS; i++) out.push([W / 2, H / 2, 0, 0, 0]);
        return out;
    }

    function targetsFor(rects) {
        var out = [];
        for (var i = 0; i < MARKS; i++) {
            var r = rects[i];
            if (r) out.push([r[0] - PAD, r[1] - PAD, r[2] + PAD * 2, r[3] + PAD * 2, 1]);
            else {
                var last = rects[rects.length - 1];
                out.push([last[0] + last[2] / 2, last[1] + last[3] / 2, 0, 0, 0]);
            }
        }
        return out;
    }

    function paint(rects) {
        for (var i = 0; i < MARKS; i++) {
            var r = rects[i], m = marks[i], h = holes[i];
            m.style.left = (r[0] / W * 100) + "%";
            m.style.top = (r[1] / H * 100) + "%";
            m.style.width = (r[2] / W * 100) + "%";
            m.style.height = (r[3] / H * 100) + "%";
            m.style.opacity = r[4];
            h.setAttribute("x", r[0]);
            h.setAttribute("y", r[1]);
            h.setAttribute("width", Math.max(0, r[2]));
            h.setAttribute("height", Math.max(0, r[3]));
        }

        // Etiqueta con el nombre, pegada al primer recuadro (arriba o debajo).
        var f = rects[0];
        var above = f[1] > 120 && !labelBelow;
        label.style.left = Math.min(Math.max(f[0], 12), W - 300) / W * 100 + "%";
        label.style.top = ((above ? f[1] : f[1] + f[3]) / H * 100) + "%";
        label.style.transform = above ? "translateY(calc(-100% - 6px))" : "translateY(6px)";
    }

    function tween(to) {
        cancelAnimationFrame(frame);
        var from = current.map(function (r) { return r.slice(); });
        var start = performance.now();
        var dur = reduce ? 0 : 620;

        function tick(now) {
            var t = dur ? Math.min(1, (now - start) / dur) : 1;
            var e = 1 - Math.pow(1 - t, 3);
            current = from.map(function (r, i) {
                return r.map(function (v, k) { return v + (to[i][k] - v) * e; });
            });
            paint(current);
            if (t < 1) frame = requestAnimationFrame(tick);
        }
        frame = requestAnimationFrame(tick);
    }

    function showShot(src) {
        var now = shots[activeShot];
        if (now.getAttribute("src") === src) return;
        var next = shots[1 - activeShot];
        next.onload = null;
        var swap = function () {
            next.classList.add("is-active");
            now.classList.remove("is-active");
            activeShot = 1 - activeShot;
        };
        next.setAttribute("src", src);
        if (next.complete) swap();
        else next.onload = swap;
    }

    function render() {
        var data = PARTS[state.part];
        var available = templatesWith(data);
        if (!data[state.tpl]) state.tpl = available[0];
        var ex = data[state.tpl];
        labelBelow = !!ex.below;
        var btn = root.querySelector('[data-part="' + state.part + '"]');
        var name = btn.querySelector(".anatomy__part-name").textContent;

        parts.forEach(function (p) {
            p.setAttribute("aria-pressed", p === btn ? "true" : "false");
        });
        tpls.forEach(function (b) {
            var t = b.dataset.tpl;
            b.setAttribute("aria-pressed", t === state.tpl ? "true" : "false");
            b.disabled = !data[t];
        });

        showShot(shot(state.tpl, ex.s));
        tween(targetsFor(ex.r));

        label.textContent = name;
        meta.textContent = TEMPLATES[state.tpl].name + " · pantalla «" + TEMPLATES[state.tpl].screens[ex.s] + "»";

        var partial = available.length < TPL_ORDER.length;
        note.hidden = !partial;
        if (partial) note.textContent = "En la demo solo aparece en " + describeTemplates(available) + ".";

        caption.innerHTML = "<strong>" + name + ".</strong> " +
            btn.querySelector(".anatomy__part-text").textContent;
        caption.classList.remove("is-entering");
        void caption.offsetWidth;
        caption.classList.add("is-entering");

        // En móvil, la ficha activa se desplaza a la vista dentro de su fila.
        if (list.scrollWidth > list.clientWidth) {
            var li = btn.parentElement;
            list.scrollTo({ left: li.offsetLeft - (list.clientWidth - li.offsetWidth) / 2, behavior: reduce ? "auto" : "smooth" });
        }

        // Reinicia la barra de avance del recorrido.
        if (state.touring) {
            root.classList.remove("is-touring");
            void root.offsetWidth;
            root.classList.add("is-touring");
        }
    }

    function stopTour() {
        state.touring = false;
        clearInterval(tourTimer);
        root.classList.remove("is-touring");
    }

    function startTour() {
        if (reduce || state.touring || root.dataset.touched) return;
        state.touring = true;
        root.classList.add("is-touring");
        tourTimer = setInterval(function () {
            var i = parts.findIndex(function (p) { return p.dataset.part === state.part; });
            var next = parts[(i + 1) % parts.length].dataset.part;
            // Al volver al principio, pasa a la siguiente plantilla para enseñarlas todas.
            if (i === parts.length - 1) {
                state.tpl = TPL_ORDER[(TPL_ORDER.indexOf(state.tpl) + 1) % TPL_ORDER.length];
            }
            state.part = next;
            render();
        }, STEP);
    }

    function touch() {
        root.dataset.touched = "1";
        stopTour();
    }

    parts.forEach(function (p) {
        p.addEventListener("click", function () {
            touch();
            state.part = p.dataset.part;
            render();
        });
    });

    tpls.forEach(function (b) {
        b.addEventListener("click", function () {
            touch();
            state.tpl = b.dataset.tpl;
            render();
        });
    });

    root.addEventListener("pointerdown", function (e) {
        if (e.target.closest(".anatomy__stage")) touch();
    });

    // Precarga las capturas y arranca el recorrido solo cuando el bloque se ve.
    var preloaded = false;
    function preload() {
        if (preloaded) return;
        preloaded = true;
        TPL_ORDER.forEach(function (t) {
            Object.keys(TEMPLATES[t].screens).forEach(function (s) {
                new Image().src = shot(t, s);
            });
        });
    }

    if ("IntersectionObserver" in window) {
        new IntersectionObserver(function (entries) {
            entries.forEach(function (en) {
                if (en.isIntersecting) { preload(); startTour(); }
                else stopTour();
            });
        }, { threshold: 0.35 }).observe(root);
    } else preload();

    render();

    // Enlace directo a una parte (plantillas.html#parte-secciones), p. ej. desde
    // las FAQs: la selecciona, para el recorrido y lleva al bloque.
    function openFromHash() {
        var match = /^#parte-([a-z]+)$/.exec(location.hash);
        if (!match || !PARTS[match[1]]) return;
        touch();
        state.part = match[1];
        render();
        preload();

        // Se repite al terminar de cargar: las imágenes de más arriba mueven el bloque.
        var section = document.getElementById("partes");
        section.scrollIntoView({ block: "start" });
        if (document.readyState !== "complete") {
            window.addEventListener("load", function () {
                section.scrollIntoView({ block: "start" });
            }, { once: true });
        }
    }

    window.addEventListener("hashchange", openFromHash);
    openFromHash();
})();
