/* ==========================================================================
   BACKGROUND LINES — Trazos finos, blancos y naranjas, que cruzan la pantalla
   de forma aleatoria. La cabeza avanza rápido y la cola tarda en alcanzarla,
   dejando un rastro que se desvanece.

   Uso: <script src="js/background-lines.js" defer></script>
   Opcional, antes del script: window.PWLinesConfig = { maxLines: 3, ... }
   API: PWLines.configure({...}), PWLines.spawn(), PWLines.destroy()

   Respeta prefers-reduced-motion y se pausa con la pestaña oculta.
   ========================================================================== */

(function () {
    "use strict";

    if (window.PWLines) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    var cfg = {
        maxLines: 3,           // como mucho, a la vez
        minGap: 8000,          // ms entre apariciones (aleatorio entre min y max)
        maxGap: 18000,
        introLines: 2,         // trazos al cargar la página
        whiteAlpha: 0.16,
        orangeAlpha: 0.3,
        orangeRatio: 0.4       // proporción de trazos naranjas
    };
    var user = window.PWLinesConfig || {};
    for (var k in user) cfg[k] = user[k];

    var WHITE = "255,255,255";
    var ORANGE = "232,113,10"; // --color-orange

    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    var W = 0, H = 0, dpr = 1;
    var lines = [];
    var raf = 0, timer = 0, introTimers = [];
    var alive = true;

    canvas.setAttribute("aria-hidden", "true");
    canvas.className = "pw-lines";

    // Siempre detrás del contenido. El fondo de <main> debe ser transparente
    // (el negro lo pone el <body>) para que las líneas se vean.
    function applyLayer() {
        canvas.style.cssText =
            "position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:-1;";
    }

    function resize() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        W = window.innerWidth;
        H = window.innerHeight;
        canvas.width = Math.round(W * dpr);
        canvas.height = Math.round(H * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function rand(a, b) { return a + Math.random() * (b - a); }
    function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
    // Cabeza: arranque ágil que frena al final.
    function easeOutQuart(t) { return 1 - Math.pow(1 - t, 4); }
    // Cola: suave y lenta.
    function easeInOutSine(t) { return -(Math.cos(Math.PI * t) - 1) / 2; }

    // Recorrido aleatorio y suave: el rumbo gira poco a poco con una curvatura
    // que también cambia de forma gradual (sin quiebros).
    function buildPath(len) {
        var step = 4;
        var n = Math.max(2, Math.round(len / step));
        var x = rand(W * 0.1, W * 0.9);
        var y = rand(H * 0.1, H * 0.9);
        var toCenter = Math.atan2(H / 2 - y, W / 2 - x);
        var h = toCenter + rand(-1.1, 1.1);
        var turn = rand(-0.004, 0.004);
        var pts = [x, y];
        for (var i = 1; i < n; i++) {
            turn += rand(-0.0007, 0.0007);
            if (turn > 0.009) turn = 0.009;
            if (turn < -0.009) turn = -0.009;
            h += turn * step;
            x += Math.cos(h) * step;
            y += Math.sin(h) * step;
            pts.push(x, y);
        }
        return pts;
    }

    function spawn() {
        if (lines.length >= cfg.maxLines) return;
        var diag = Math.hypot(W, H);
        var orange = Math.random() < cfg.orangeRatio;
        var headDur = rand(5500, 8000);
        var mobile = W < 768;
        lines.push({
            pts: buildPath(diag * rand(0.45, 0.85)),
            rgb: orange ? ORANGE : WHITE,
            alpha: (orange ? cfg.orangeAlpha : cfg.whiteAlpha) * rand(0.8, 1),
            width: mobile ? rand(3.5, 6) : rand(6, 11),
            headDur: headDur,
            tailDelay: headDur * rand(0.25, 0.45),
            tailDur: rand(11000, 15000),
            born: performance.now()
        });
        if (!raf) raf = requestAnimationFrame(frame);
    }

    function draw(l, now) {
        var t = now - l.born;
        var h = easeOutQuart(clamp01(t / l.headDur));
        var s = easeInOutSine(clamp01((t - l.tailDelay) / l.tailDur));
        if (s > h) s = h;
        var p = l.pts, n = p.length / 2 - 1;
        var hi = h * n, si = s * n;
        if (hi - si < 0.5) return t > l.tailDelay + l.tailDur;

        function at(f) {
            var i = Math.min(Math.floor(f), n - 1), k = f - i;
            return [p[i * 2] + (p[i * 2 + 2] - p[i * 2]) * k, p[i * 2 + 1] + (p[i * 2 + 3] - p[i * 2 + 1]) * k];
        }
        var tail = at(si), head = at(hi);

        var fade = 1 - clamp01((s - 0.8) / 0.2);
        var a = l.alpha * fade;
        var g = ctx.createLinearGradient(tail[0], tail[1], head[0], head[1]);
        g.addColorStop(0, "rgba(" + l.rgb + ",0)");
        g.addColorStop(0.6, "rgba(" + l.rgb + "," + (a * 0.5) + ")");
        g.addColorStop(1, "rgba(" + l.rgb + "," + a + ")");
        ctx.strokeStyle = g;
        ctx.lineWidth = l.width;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.beginPath();
        ctx.moveTo(tail[0], tail[1]);
        for (var i = Math.ceil(si); i <= Math.floor(hi); i++) ctx.lineTo(p[i * 2], p[i * 2 + 1]);
        ctx.lineTo(head[0], head[1]);
        ctx.stroke();
        return false;
    }

    function frame(now) {
        raf = 0;
        ctx.clearRect(0, 0, W, H);
        lines = lines.filter(function (l) { return !draw(l, now); });
        if (lines.length && alive) raf = requestAnimationFrame(frame);
    }

    function schedule() {
        clearTimeout(timer);
        if (!alive) return;
        timer = setTimeout(function () {
            if (!document.hidden) spawn();
            schedule();
        }, rand(cfg.minGap, cfg.maxGap));
    }

    function intro() {
        introTimers.forEach(clearTimeout);
        introTimers = [];
        var at = 250;
        for (var i = 0; i < Math.min(cfg.introLines, cfg.maxLines); i++) {
            introTimers.push(setTimeout(spawn, at));
            at += rand(350, 900);
        }
    }

    function start() {
        applyLayer();
        document.body.insertBefore(canvas, document.body.firstChild);
        resize();
        window.addEventListener("resize", resize);
        intro();
        schedule();
    }

    document.addEventListener("visibilitychange", function () {
        if (document.hidden) { clearTimeout(timer); }
        else if (alive) { schedule(); }
    });

    window.PWLines = {
        spawn: spawn,
        replay: function () { lines = []; intro(); schedule(); },
        configure: function (o) {
            for (var key in o) cfg[key] = o[key];
            applyLayer();
            schedule();
        },
        destroy: function () {
            alive = false;
            clearTimeout(timer);
            introTimers.forEach(clearTimeout);
            cancelAnimationFrame(raf);
            window.removeEventListener("resize", resize);
            canvas.remove();
            delete window.PWLines;
        }
    };

    if (document.body) start();
    else document.addEventListener("DOMContentLoaded", start);
})();
