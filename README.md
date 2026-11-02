# WebCartaOnline
## Versión de los archivos (caché)

El dominio guarda CSS, JS e imágenes en el navegador durante 4 horas.
Para que los visitantes reciban los cambios al momento, cada archivo se
carga con `?v=AAAA-MM-DD` (en los `.html` y en los `@import` de `index.css`).

Cuando cambies CSS o JS, cambia esa fecha en todos los archivos por la del día:

    grep -rl "?v=2026-11-02" --include=*.html --include=index.css . | xargs sed -i "s/?v=2026-11-02/?v=NUEVA-FECHA/g"
