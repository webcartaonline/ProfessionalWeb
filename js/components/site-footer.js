import { LEGAL_LINKS, NAV_LINKS, SITE } from "../config/site.js";

/**
 * <site-footer>
 * Pie de página común. Se genera desde la configuración del sitio para que
 * al añadir una página nueva no haya que tocar el marcado de ninguna otra.
 */
class SiteFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = this.#render();
    }

    #render() {
        const year = new Date().getFullYear();

        return `
            <footer class="footer">
                <div class="container">
                    <div class="footer__grid">
                        <div>
                            <p class="footer__brand-name">${SITE.name}</p>
                            <p class="footer__claim">${SITE.claim}</p>
                        </div>

                        <nav aria-label="Páginas">
                            <h2 class="footer__heading">Páginas</h2>
                            <ul class="footer__list">
                                ${this.#renderLinks(NAV_LINKS)}
                            </ul>
                        </nav>

                        <div>
                            <h2 class="footer__heading">Contacto</h2>
                            <ul class="footer__list">
                                <li>
                                    <a class="footer__link" href="mailto:${SITE.email}">${SITE.email}</a>
                                </li>
                                <li>
                                    <a class="footer__link" href="tel:${SITE.phone.replace(/\s/g, "")}">${SITE.phone}</a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div class="footer__bottom">
                        <p>© ${year} ${SITE.name}. Todos los derechos reservados.</p>
                        <ul class="footer__list footer__list--inline">
                            ${this.#renderLinks(LEGAL_LINKS)}
                        </ul>
                    </div>
                </div>
            </footer>`;
    }

    #renderLinks(links) {
        return links
            .map(
                (link) => `
                <li>
                    <a class="footer__link" href="${link.href}">${link.label}</a>
                </li>`
            )
            .join("");
    }
}

customElements.define("site-footer", SiteFooter);