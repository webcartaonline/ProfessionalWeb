/**
 * Normaliza una ruta para poder compararla sin depender de "/index.html"
 * ni de la barra final. Ejemplo: "/precios/index.html" → "/precios".
 *
 * @param {string} path
 * @returns {string}
 */
export const normalizePath = (path) =>
    path.replace(/index\.html$/, "").replace(/\/+$/, "") || "/";

/**
 * Devuelve el enlace de navegación correspondiente a la página actual.
 *
 * @param {Array<{label: string, href: string}>} links
 * @returns {{label: string, href: string}}
 */
export const findCurrentLink = (links) => {
    const current = normalizePath(window.location.pathname);

    return (
        links.find((link) => normalizePath(link.href) === current) ?? links[0]
    );
};