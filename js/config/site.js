/**
 * Configuración central del sitio.
 * Editar aquí evita tocar el marcado: la barra y el pie se generan solos.
 */

export const SITE = {
    name: "Professional Web",
    claim: "Webs rápidas y cuidadas para negocios que quieren dar el siguiente paso.",
    email: "hola@professionalweb.es",
    phone: "+34 600 000 000",
    isologo: "/recursos/img/logo/isoLogoBlack.png",
};

/** Páginas del sitio. Añade una entrada y aparecerá en la barra y en el pie. */
export const NAV_LINKS = [
    { label: "Inicio", href: "/" },
    { label: "Servicios", href: "/servicios/" },
    { label: "Precios", href: "/precios/" },
    { label: "Contacto", href: "/contacto/" },
];

/** Enlaces legales del pie de página. */
export const LEGAL_LINKS = [
    { label: "Aviso legal", href: "/aviso-legal/" },
    { label: "Privacidad", href: "/privacidad/" },
    { label: "Cookies", href: "/cookies/" },
];