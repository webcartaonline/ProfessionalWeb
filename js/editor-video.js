/* ==========================================================================
   EDITOR VIDEO — Vídeos de demostración (animaciones de Claude Design
   renderizadas a MP4): «adminApp en acción» en "Conoce el editor" y
   «Personaliza tu carta» en "Plantillas".

   - Se reproducen (sin sonido y en bucle) solo mientras están a la vista,
     y no arrancan solos si se pide reducir el movimiento.
   - Los subtítulos van fuera del vídeo, como texto de la página, para que
     se lean bien en el móvil. Cada vídeo trae los suyos en un
     <script type="application/json" data-video-captions> con filas
     [desde, hasta, texto, número de paso?, color?]; fuera de ellos se
     muestra el texto inicial del subtítulo.
   - Botón de reproducir/pausar y de pantalla completa (en el móvil gira
     a horizontal cuando el navegador lo permite).

   Sin JavaScript el vídeo se ve con su póster y no hay controles propios.
   Los estilos viven en css/components/tools.css.
   ========================================================================== */

(function () {
    "use strict";

    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var setup = function (root) {
        var video = root.querySelector("[data-video]");
        var toggle = root.querySelector("[data-video-toggle]");
        var fullscreen = root.querySelector("[data-video-fullscreen]");
        var progress = root.querySelector("[data-video-progress]");
        var caption = root.querySelector("[data-video-caption]");
        var step = root.querySelector("[data-video-step]");
        var captionsData = root.querySelector("[data-video-captions]");

        var defaultCaption = caption.textContent;
        var captions = [];
        try {
            captions = captionsData ? JSON.parse(captionsData.textContent) : [];
        } catch (error) {
            captions = [];
        }

        var current = null;

        var showCaption = function (time) {
            var cue = null;
            for (var i = 0; i < captions.length; i++) {
                if (time >= captions[i][0] && time < captions[i][1]) {
                    cue = captions[i];
                    break;
                }
            }
            if (cue === current) return;
            current = cue;
            caption.textContent = cue ? cue[2] : defaultCaption;
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
    };

    Array.prototype.forEach.call(document.querySelectorAll("[data-editor-video]"), setup);
})();
