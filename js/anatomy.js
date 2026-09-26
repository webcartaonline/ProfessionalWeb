/* ==========================================================================
   ANATOMY — Ilumina cada parte de la carta sobre la captura real.

   Las coordenadas están en píxeles de las capturas (780 × 1646). Cada pieza
   tiene su ejemplo en una o en las dos plantillas; si una plantilla no la
   muestra, su botón se desactiva y se usa la otra.
   Mientras nadie toque nada, el bloque hace un recorrido automático.
   ========================================================================== */

(function () {
    "use strict";

    var root = document.querySelector("[data-anatomy]");
    if (!root) return;

    var W = 780, H = 1646, PAD = 8, MARKS = 4, STEP = 4800;
    var SCREEN_NAMES = { Inicio: "Inicio", Tapas: "Tapas", Hamburguesas: "Hamburguesas", Cervezas: "Cervezas", "Alerta.png": "Tapas" };
    var TPL_NAMES = { p1: "Plantilla 1", p2: "Plantilla 2" };

    function shot(tpl, screen) {
        return "Recursos/img/Plantilla" + tpl.slice(1) + "/" + screen + (screen.indexOf(".") < 0 ? ".jpg" : "");
    }

    var PARTS = {
        portada: {
            p1: { s: "Inicio", r: [[0, 0, 780, 594]] },
            p2: { s: "Inicio", r: [[0, 0, 780, 328]] }
        },
        logo: {
            p1: { s: "Inicio", r: [[104, 298, 112, 112]] },
            p2: { s: "Inicio", r: [[40, 66, 116, 116]] }
        },
        secciones: {
            p1: { s: "Inicio", r: [[0, 598, 780, 108]] },
            p2: { s: "Inicio", r: [[0, 330, 780, 106]] }
        },
        decorativas: {
            p1: { s: "Inicio", r: [[0, 708, 780, 256], [0, 1082, 780, 232]] },
            p2: { s: "Inicio", r: [[0, 456, 780, 248], [40, 900, 700, 184], [40, 1120, 700, 184], [40, 1340, 700, 184]] }
        },
        notas: {
            p2: { s: "Tapas", r: [[40, 76, 470, 92]] }
        },
        grupos: {
            p1: { s: "Cervezas", r: [[40, 240, 700, 88], [40, 1560, 700, 76]] },
            p2: { s: "Cervezas", r: [[40, 220, 700, 182], [40, 1374, 700, 94], [40, 1504, 700, 94]] }
        },
        alertas: {
            p1: { s: "Alerta.png", r: [[26, 473, 302, 44]], below: true },
            p2: { s: "Hamburguesas", r: [[40, 314, 700, 86]] }
        },
        productos: {
            p1: { s: "Tapas", r: [[40, 470, 700, 330], [40, 848, 700, 370]] },
            p2: { s: "Hamburguesas", r: [[40, 410, 700, 416], [40, 836, 700, 466]] }
        },
        fotos: {
            p1: { s: "Tapas", r: [[564, 480, 176, 176], [564, 858, 176, 176], [564, 1278, 176, 176]] },
            p2: { s: "Hamburguesas", r: [[552, 442, 148, 148], [552, 868, 148, 148], [552, 1344, 148, 148]] }
        },
        etiquetas: {
            p1: { s: "Tapas", r: [[40, 656, 372, 46], [40, 1076, 186, 46], [40, 1454, 372, 46]] },
            p2: { s: "Hamburguesas", r: [[80, 550, 208, 42], [80, 1024, 100, 42], [268, 1156, 226, 42], [80, 1452, 242, 42]] }
        },
        alergenos: {
            p1: { s: "Hamburguesas", r: [[40, 636, 260, 56], [40, 1032, 192, 56], [40, 1382, 192, 56]] },
            p2: { s: "Tapas", r: [[80, 642, 120, 54], [80, 1016, 120, 54], [80, 1340, 120, 54]] }
        }
    };

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
        if (!data[state.tpl]) state.tpl = data.p1 ? "p1" : "p2";
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
        meta.textContent = TPL_NAMES[state.tpl] + " · pantalla «" + SCREEN_NAMES[ex.s] + "»";

        var only = !data.p1 ? "p2" : !data.p2 ? "p1" : null;
        note.hidden = !only;
        if (only) note.textContent = "En la demo solo aparece en la " + TPL_NAMES[only] + ".";

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
            // Al volver al principio, cambia de plantilla para enseñar las dos.
            if (i === parts.length - 1) state.tpl = state.tpl === "p1" ? "p2" : "p1";
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
        ["p1", "p2"].forEach(function (t) {
            ["Inicio", "Tapas", "Hamburguesas", "Cervezas"].forEach(function (s) {
                new Image().src = shot(t, s);
            });
        });
        new Image().src = shot("p1", "Alerta.png");
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
})();
