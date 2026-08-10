/**
 * Configuración central del sitio.
 * Editar aquí evita tocar el marcado: la barra y el pie se generan solos.
 */

/**
 * Carpeta desde la que se sirve el sitio, calculada a partir de la URL de
 * este propio módulo. Así los enlaces y assets funcionan igual en local,
 * en GitHub Pages (p. ej. "/ProfessionalWeb") o en un dominio propio en la
 * raíz, sin tener que hardcodear ninguna ruta.
 */
export const BASE_PATH = new URL("../../", import.meta.url).pathname.replace(/\/$/, "");

export const SITE = {
    name: "Professional Web",
    claim: "Webs rápidas y cuidadas para negocios que quieren dar el siguiente paso.",
    email: "hola@professionalweb.es",
    phone: "+34 600 000 000",
    isologo: `${BASE_PATH}/Recursos/img/Logo/IsoLogoBlack.png`,
};

/** Páginas del sitio. Añade una entrada y aparecerá en la barra y en el pie. */
export const NAV_LINKS = [
    { label: "Inicio", href: `${BASE_PATH}/` },
    { label: "Servicios", href: `${BASE_PATH}/servicios/` },
    { label: "Precios", href: `${BASE_PATH}/precios/` },
    { label: "Contacto", href: `${BASE_PATH}/contacto/` },
];

/** Enlaces legales del pie de página. */
export const LEGAL_LINKS = [
    { label: "Aviso legal", href: `${BASE_PATH}/aviso-legal/` },
    { label: "Privacidad", href: `${BASE_PATH}/privacidad/` },
    { label: "Cookies", href: `${BASE_PATH}/cookies/` },
];