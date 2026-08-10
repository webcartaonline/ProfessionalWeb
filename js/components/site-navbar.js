import { NAV_LINKS, SITE } from "../config/site.js";
import { findCurrentLink, normalizePath } from "../utils/routes.js";

const CHEVRON_ICON = `
    <svg class="navbar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
         aria-hidden="true" focusable="false">
        <path d="m6 9 6 6 6-6" />
    </svg>`;

/**
 * <site-navbar>
 * Barra flotante presente en todas las páginas. Se renderiza en DOM ligero
 * para que herede los estilos globales del sitio.
 */
class SiteNavbar extends HTMLElement {
    #toggle = null;
    #list = null;

    connectedCallback() {
        this.innerHTML = this.#render();

        this.#toggle = this.querySelector("[data-nav-toggle]");
        this.#list = this.querySelector("[data-nav-list]");

        this.#toggle.addEventListener("click", this.#onToggleClick);
        document.addEventListener("click", this.#onOutsideClick);
        document.addEventListener("keydown", this.#onKeydown);
    }

    disconnectedCallback() {
        document.removeEventListener("click", this.#onOutsideClick);
        document.removeEventListener("keydown", this.#onKeydown);
    }

    get #isOpen() {
        return this.#toggle.getAttribute("aria-expanded") === "true";
    }

    /* ----- Renderizado --------------------------------------------------- */

    #render() {
        const current = findCurrentLink(NAV_LINKS);

        return `
            <div class="navbar-scrim">
                <nav class="navbar" aria-label="Navegación principal">
                    <a class="navbar__brand" href="/" aria-label="${SITE.name} — Inicio">
                        <img class="navbar__logo" src="${SITE.isologo}"
                             alt="${SITE.name}" width="120" height="32" />
                    </a>

                    <div class="navbar__menu">
                        <button class="navbar__toggle" type="button"
                                data-nav-toggle
                                aria-expanded="false"
                                aria-controls="navbar-list">
                            <span class="visually-hidden">Página actual:</span>
                            <span>${current.label}</span>
                            ${CHEVRON_ICON}
                        </button>

                        <ul class="navbar__list" id="navbar-list" data-nav-list hidden>
                            ${NAV_LINKS.map((link) => this.#renderLink(link, current)).join("")}
                        </ul>
                    </div>
                </nav>
            </div>`;
    }

    #renderLink(link, current) {
        const isCurrent =
            normalizePath(link.href) === normalizePath(current.href);

        return `
            <li>
                <a class="navbar__link" href="${link.href}"
                   ${isCurrent ? 'aria-current="page"' : ""}>${link.label}</a>
            </li>`;
    }

    /* ----- Estado y eventos ---------------------------------------------- */

    #setExpanded(isOpen) {
        this.#toggle.setAttribute("aria-expanded", String(isOpen));
        this.#list.hidden = !isOpen;
    }

    #onToggleClick = () => {
        this.#setExpanded(!this.#isOpen);
    };

    #onOutsideClick = (event) => {
        if (this.#isOpen && !this.contains(event.target)) {
            this.#setExpanded(false);
        }
    };

    #onKeydown = (event) => {
        if (event.key === "Escape" && this.#isOpen) {
            this.#setExpanded(false);
            this.#toggle.focus();
        }
    };
}

customElements.define("site-navbar", SiteNavbar);