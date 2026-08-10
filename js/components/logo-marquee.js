/**
 * <logo-marquee>
 * Duplica una sola vez el contenido de la pista para que la animación CSS
 * (que desplaza el 50% de su anchura) se repita sin costuras.
 * El marcado real vive en el HTML: el componente solo lo prepara.
 */
class LogoMarquee extends HTMLElement {
    connectedCallback() {
        const track = this.querySelector("[data-marquee-track]");

        if (!track || track.dataset.duplicated === "true") {
            return;
        }

        this.#duplicate(track);
        track.dataset.duplicated = "true";
    }

    /** Clona los elementos y oculta la copia a los lectores de pantalla. */
    #duplicate(track) {
        const fragment = document.createDocumentFragment();

        for (const item of Array.from(track.children)) {
            const copy = item.cloneNode(true);

            copy.setAttribute("aria-hidden", "true");
            copy.querySelectorAll("a, button").forEach((element) => {
                element.setAttribute("tabindex", "-1");
            });

            fragment.append(copy);
        }

        track.append(fragment);
    }
}

customElements.define("logo-marquee", LogoMarquee);