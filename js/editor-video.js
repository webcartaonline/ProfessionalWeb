/* ==========================================================================
   EDITOR VIDEO — Vídeo «adminApp en acción» de "Conoce el editor".

   - Se reproduce (sin sonido y en bucle) solo mientras está a la vista, y
     no arranca solo si se pide reducir el movimiento.
   - Los subtítulos van fuera del vídeo, como texto de la página, para que
     se lean bien en el móvil. Se sincronizan con el tiempo del vídeo.
   - Botón de reproducir/pausar y de pantalla completa (en el móvil gira
     a horizontal cuando el navegador lo permite).

   Sin JavaScript el vídeo se ve con su póster y no hay controles propios.
   Los estilos viven en css/components/tools.css.
   ========================================================================== */

(function () {
    "use strict";

    var root = document.querySelector("[data-editor-video]");
    if (!root) return;

    var video = root.querySelector("[data-video]");
    var toggle = root.querySelector("[data-video-toggle]");
    var fullscreen = root.querySelector("[data-video-fullscreen]");
    var progress = root.querySelector("[data-video-progress]");
    var caption = root.querySelector("[data-video-caption]");
    var step = root.querySelector("[data-video-step]");

    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* Subtítulos: [desde, hasta, texto, número de paso, color].
       Los tiempos salen de las escenas de la animación original. */
    var DEFAULT_CAPTION = "adminApp en acción";
    var CAPTIONS = [
        [3.5, 6.5, "Cambias en adminApp. Se ve en tu carta."],
        [6.5, 10, "Carga tu carta", "1", "blue"],
        [10, 12.5, "Elige sección y grupo", "2", "green"],
        [12.5, 16, "Cambia un precio", "3", "orange"],
        [16, 20.5, "Añade un plato nuevo", "4", "blue"],
        [20.5, 24.9, "Con sus alérgenos y su foto"],
        [24.9, 27.4, "Publica", "5", "green"],
        [27.4, 32, "¡Y al instante, en tu carta!"],
        [32, 34.6, "Modo claro u oscuro, como prefieras"],
        [34.6, 38.8, "Y mucho más para el día a día"],
        [38.8, 42.4, "Un solo editor para todas las plantillas"]
    ];

    var current = null;

    var showCaption = function (time) {
        var cue = null;
        for (var i = 0; i < CAPTIONS.length; i++) {
            if (time >= CAPTIONS[i][0] && time < CAPTIONS[i][1]) {
                cue = CAPTIONS[i];
                break;
            }
        }
        if (cue === current) return;
        current = cue;
        caption.textContent = cue ? cue[2] : DEFAULT_CAPTION;
        step.textContent = cue && cue[3] ? cue[3] : "";
        step.setAttribute("data-accent", cue && cue[4] ? cue[4] : "blue");
    };

    /* Barra de progreso y subtítulos, a ritmo de pantalla mientras suena. */
    var frame = null;
    var tick = function () {
        if (video.duration) {
            progress.style.transform = "scaleX(" + video.currentTime / video.duration + ")";
        }
        showCaption(video.currentTime);
        frame = video.paused ? null : requestAnimationFrame(tick);
    };

    var setState = function () {
        var playing = !video.paused;
        root.setAttribute("data-state", playing ? "playing" : "paused");
        toggle.setAttribute("aria-label", playing ? "Pausar vídeo" : "Reproducir vídeo");
        if (playing && frame === null) frame = requestAnimationFrame(tick);
    };

    video.addEventListener("play", setState);
    video.addEventListener("pause", setState);
    video.addEventListener("seeked", tick);
    setState();

    /* Reproducir solo a la vista. Si el usuario lo pausa, se respeta. */
    var userPaused = reduceMotion;

    var play = function () {
        var attempt = video.play();
        if (attempt && attempt.catch) attempt.catch(function () {});
    };

    toggle.addEventListener("click", function () {
        if (video.paused) {
            userPaused = false;
            play();
        } else {
            userPaused = true;
            video.pause();
        }
    });

    if ("IntersectionObserver" in window) {
        new IntersectionObserver(function (entries) {
            var visible = entries[0].isIntersecting;
            if (visible && !userPaused) play();
            if (!visible && !video.paused) video.pause();
        }, { threshold: 0.35 }).observe(video);
    } else if (!userPaused) {
        play();
    }

    /* Pantalla completa: API estándar, o el reproductor nativo en iPhone. */
    var canFullscreen = document.fullscreenEnabled || document.webkitFullscreenEnabled ||
        typeof video.webkitEnterFullscreen === "function";

    if (canFullscreen) {
        fullscreen.hidden = false;
        fullscreen.addEventListener("click", function () {
            userPaused = false;
            play();

            var target = root.querySelector(".editor-video__frame");
            var request = target.requestFullscreen || target.webkitRequestFullscreen;

            if (request && (document.fullscreenEnabled || document.webkitFullscreenEnabled)) {
                var done = request.call(target);
                if (done && done.then && screen.orientation && screen.orientation.lock) {
                    done.then(function () {
                        return screen.orientation.lock("landscape");
                    }).catch(function () {});
                }
            } else {
                video.webkitEnterFullscreen();
            }
        });
    }
})();
