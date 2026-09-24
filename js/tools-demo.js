/* ==========================================================================
   TOOLS DEMO — Demos interactivas de "Conoce tus herramientas".

   1. Dispositivos: cambia el marco (móvil, tablet, ordenador, reloj) y rota
      solo hasta que el usuario elige uno.
   2. Vista previa: el borrador se actualiza al escribir y "lo que ven tus
      clientes" solo cambia al pulsar Publicar.
   3. PDF: tamaño, idioma, portada y fotos del papel de muestra.

   El HTML ya trae el estado inicial de cada demo; sin JavaScript la página
   se ve completa, simplemente sin interacción. Los estilos de cada estado
   viven en css/components/tools.css y se activan con atributos data-*.
   ========================================================================== */

(function () {
    "use strict";

    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function each(list, fn) {
        Array.prototype.forEach.call(list, fn);
    }

    /* ----- 1. Dispositivos --------------------------------------------- */

    var DEVICES = {
        movil: {
            alt: "El editor adminApp en un móvil",
            size: "Móvil · Android e iPhone",
            text: "Edita desde la barra entre servicio y servicio. Se instala en la pantalla de inicio y se abre a pantalla completa."
        },
        tablet: {
            alt: "El editor adminApp en una tablet",
            size: "Tablet · vertical y horizontal",
            text: "Más espacio para ordenar secciones, grupos y fotos con calma."
        },
        ordenador: {
            alt: "El editor adminApp en un ordenador",
            size: "Ordenador · Chrome, Edge, Safari",
            text: "El panel lateral de secciones y el editor, todo a la vista a la vez."
        },
        reloj: {
            alt: "adminApp en la pantalla de un reloj",
            size: "Reloj · hasta la pantalla más pequeña",
            text: "Tu carta se adapta a cualquier pantalla, incluso a la de un reloj."
        }
    };

    var deviceDemo = document.querySelector("[data-device-demo]");

    if (deviceDemo) {
        var order = Object.keys(DEVICES);
        var picks = deviceDemo.querySelectorAll("[data-device-pick]");
        var deviceText = deviceDemo.querySelector("[data-device-text]");
        var deviceSize = deviceDemo.querySelector("[data-device-size]");
        var deviceScreen = deviceDemo.querySelector("[data-device-screen]");
        var cycle = null;

        var showDevice = function (id) {
            var device = DEVICES[id];
            deviceDemo.setAttribute("data-device", id);
            deviceText.textContent = device.text;
            deviceSize.textContent = device.size;
            deviceScreen.setAttribute("aria-label", device.alt);
            each(picks, function (pick) {
                pick.setAttribute("aria-selected", String(pick.getAttribute("data-device-pick") === id));
            });
        };

        each(picks, function (pick) {
            pick.addEventListener("click", function () {
                clearInterval(cycle);
                showDevice(pick.getAttribute("data-device-pick"));
            });
        });

        // Rotación automática: solo si se permite el movimiento.
        if (!reduceMotion) {
            cycle = setInterval(function () {
                var current = order.indexOf(deviceDemo.getAttribute("data-device"));
                showDevice(order[(current + 1) % order.length]);
            }, 2800);
        }
    }

    /* ----- 2. Vista previa y publicar ---------------------------------- */

    var previewDemo = document.querySelector("[data-preview-demo]");

    if (previewDemo) {
        var form = previewDemo.querySelector("[data-preview-form]");
        var publishButton = form.querySelector("[data-publish]");
        var draftBadge = previewDemo.querySelector("[data-draft-badge]");
        var liveStatus = previewDemo.querySelector("[data-live-status]");
        var draftItem = previewDemo.querySelector('[data-menu-item="draft"]');
        var liveItem = previewDemo.querySelector('[data-menu-item="live"]');
        var FIELDS = ["dish", "desc", "price"];
        var publishing = false;

        var read = function () {
            var values = {};
            FIELDS.forEach(function (name) {
                values[name] = form.elements[name].value;
            });
            return values;
        };

        var published = read();

        var paint = function (item, values) {
            item.querySelector('[data-field="dish"]').textContent = values.dish || "Sin nombre";
            item.querySelector('[data-field="desc"]').textContent = values.desc;
            item.querySelector('[data-field="price"]').textContent = (values.price || "0") + " €";
        };

        var update = function () {
            var draft = read();
            var dirty = FIELDS.some(function (name) {
                return draft[name] !== published[name];
            });

            paint(draftItem, draft);
            previewDemo.toggleAttribute("data-dirty", dirty);
            previewDemo.toggleAttribute("data-publishing", publishing);
            draftBadge.textContent = dirty ? "Sin publicar" : "Al día";
            liveStatus.textContent = publishing ? "Actualizando…" : "En línea";
            publishButton.disabled = !dirty || publishing;
            publishButton.textContent = publishing ? "Publicando…" : dirty ? "Publicar cambios" : "Todo publicado";
        };

        form.addEventListener("input", update);

        form.addEventListener("submit", function (event) {
            event.preventDefault();
            publishing = true;
            update();
            setTimeout(function () {
                publishing = false;
                published = read();
                paint(liveItem, published);
                update();
            }, 900);
        });

        // "Deshacer" vuelve al estado inicial en ambos lados.
        form.addEventListener("reset", function () {
            setTimeout(function () {
                published = read();
                paint(liveItem, published);
                update();
            }, 0);
        });
    }

    /* ----- 3. Exportar en PDF ------------------------------------------ */

    var SIZES = {
        a4: "A4 · 210 × 297 mm",
        a5: "A5 · 148 × 210 mm",
        tercio: "Tercio de A4 · 99 × 210 mm"
    };

    var TEXTS = {
        es: {
            kicker: "Carta", title: "Tu local", section: "Desayunos",
            items: [["Tostada de aguacate", "6,50 €"], ["Café con leche", "1,80 €"], ["Zumo natural", "3,20 €"], ["Croissant", "1,90 €"]]
        },
        en: {
            kicker: "Menu", title: "Your venue", section: "Breakfast",
            items: [["Avocado toast", "€6.50"], ["Latte", "€1.80"], ["Fresh juice", "€3.20"], ["Croissant", "€1.90"]]
        }
    };

    var pdfDemo = document.querySelector("[data-pdf-demo]");

    if (pdfDemo) {
        var caption = pdfDemo.querySelector("[data-pdf-caption]");
        var download = pdfDemo.querySelector("[data-pdf-download]");
        var downloadLabel = pdfDemo.querySelector("[data-pdf-label]");
        var progressTimer = null;

        var press = function (buttons, active) {
            each(buttons, function (button) {
                button.setAttribute("aria-pressed", String(button === active));
            });
        };

        var sizeButtons = pdfDemo.querySelectorAll("[data-pdf-size]");
        each(sizeButtons, function (button) {
            button.addEventListener("click", function () {
                var size = button.getAttribute("data-pdf-size");
                pdfDemo.setAttribute("data-size", size);
                caption.textContent = SIZES[size];
                press(sizeButtons, button);
            });
        });

        var langButtons = pdfDemo.querySelectorAll("[data-pdf-lang]");
        each(langButtons, function (button) {
            button.addEventListener("click", function () {
                var text = TEXTS[button.getAttribute("data-pdf-lang")];
                ["kicker", "title", "section"].forEach(function (key) {
                    pdfDemo.querySelector('[data-pdf-text="' + key + '"]').textContent = text[key];
                });
                text.items.forEach(function (item, index) {
                    pdfDemo.querySelector('[data-pdf-item="' + index + '"]').textContent = item[0];
                    pdfDemo.querySelector('[data-pdf-price="' + index + '"]').textContent = item[1];
                });
                press(langButtons, button);
            });
        });

        each(pdfDemo.querySelectorAll("[data-pdf-toggle]"), function (button) {
            button.addEventListener("click", function () {
                var on = button.getAttribute("aria-checked") !== "true";
                button.setAttribute("aria-checked", String(on));
                pdfDemo.toggleAttribute("data-no-" + button.getAttribute("data-pdf-toggle"), !on);
            });
        });

        // Simulación de la descarga: rellena el botón y muestra "¡PDF listo!".
        download.addEventListener("click", function () {
            if (progressTimer) return;
            var progress = 0;
            pdfDemo.setAttribute("data-busy", "");
            download.setAttribute("data-busy", "");

            progressTimer = setInterval(function () {
                progress = Math.min(100, progress + 6);
                download.style.setProperty("--progress", progress + "%");
                downloadLabel.textContent = progress < 100 ? "Generando… " + progress + "%" : "¡PDF listo!";
                if (progress < 100) return;

                clearInterval(progressTimer);
                setTimeout(function () {
                    progressTimer = null;
                    pdfDemo.removeAttribute("data-busy");
                    download.removeAttribute("data-busy");
                    download.style.removeProperty("--progress");
                    downloadLabel.textContent = "Descargar PDF";
                }, 1800);
            }, 60);
        });
    }
})();
