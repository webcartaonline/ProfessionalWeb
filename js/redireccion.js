// Si alguien entra por la dirección de GitHub Pages (por ejemplo, desde el QR
// de las tarjetas), lo enviamos a la misma página en el dominio propio.
const DOMINIO_GITHUB = "webcartaonline.github.io";
const DOMINIO_PROPIO = "https://webcartaonline.com";
const CARPETA_GITHUB = "/ProfessionalWeb";

if (window.location.hostname === DOMINIO_GITHUB) {
    const paginaActual = window.location.pathname.replace(CARPETA_GITHUB, "");
    window.location.replace(DOMINIO_PROPIO + paginaActual + window.location.search + window.location.hash);
}
