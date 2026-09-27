repo: webcartaonline/ProfessionalWeb
branch: main
path: (whole repo)

## Last sync
date: 2026-09-26T23:10:42Z

### Updated in this project
- New js/background-lines.js: random white/orange background strokes (max 3 at once, fast head, slow trailing tail)
- New js/card-glow.js + css/components/glow.css: subtle mouse-following light in cards (.feature, .step, .extra, .cta, .plan)
- Scripts added to all 8 pages, main transparent (css/base.css), black on <html> (index.css), hero image under the lines (css/components/hero.css)
- Footer brand name links to Inicio (js/components/organisms.js, css/components/footer.css)
- Preview page "Inicio con líneas" recreating the current home (index.html)

### Previous sync (2026-09-26T11:57:10Z)
- Mobile nav: hamburger + side drawer replaced by a "current page" button that opens a page menu (css/components/page-menu.css, js/navbar.js); drawer.css removed
- Plantillas: new "Partes de la carta" section (css/components/anatomy.css, js/anatomy.js, Recursos/img/Plantilla1/Alerta.png); "Plantillas / Otras cartas" selector muted
- Pure black page background (#000), footer on --color-black, footer links as blocks

### Previous sync (2026-09-24T21:39:22Z)
- FAQs page rebuilt (FAQs.dc.html): search, topic filters, animated accordion, screenshots with zoom
- New adminApp answers: install per device, connection, photos, labels, publishing, error messages, PDF, updates, changing device
- Content grounded in webcartaonline/adminApp (LEEME.md, ajustes.html, version.json, js/publicar.js, nube.js, version.js, imagen-recorte.js, destacados.js, idiomas.js, copia-ajustes.js)

### Previous sync (2026-09-24T12:00:00Z)
- New page "Conoce tus herramientas" presenting the adminApp editor
- Nav/drawer/footer recreated from source, new link added before "Precios y Planes"
- Interactive demos: device switcher, live preview + publish, PDF export options

### Previous sync (2026-09-06)
- Rebuilt as a 5-page web app (Inicio, Plantillas, Cómo trabajamos, Precios, FAQs)
- Extracted exact tokens, colors (#0a0a0a, #174ea6, #157f3c, #e8710a), DM Sans typography
- Copied real assets (logo, hero, Fusión Café + El Parke Lounge Bar images)
- Added desktop sidebar + mobile hamburger drawer, scroll-reveal micro-interactions

## Screen map
| Screen | Built from |
|---|---|
| Inicio (Home) | index.html, css/components/{hero,marquee,feature,footer}.css |
| Plantillas | Recursos/img/FusionCafe/*, Recursos/img/ParkeLoungueBar/* |
| Cómo trabajamos | new (brand voice) |
| Conoce tus herramientas | como-trabajamos.html, css/tokens.css, css/base.css, css/layout.css, css/components/{navbar,drawer,page-header,feature,step,button,footer}.css; content from adminApp (LEEME.md, index.html, manifest.json, js/pdf-config.js, js/pdf-ventana.js, sw.js) |
| Precios y Planes | new (brand: pago único) |
| FAQs | faqs.html, css/*; adminApp LEEME.md, ajustes.html, js/publicar.js, js/nube.js, js/version.js, js/imagen-recorte.js, js/destacados.js, js/idiomas.js, js/copia-ajustes.js, js/licencia.js |
| Aviso legal / Privacidad | aviso-legal.html, privacidad.html, css/components/legal.css; enlaces en el pie desde js/components/site-data.js (legal) |
| Inicio con líneas | index.html, css/tokens.css, css/base.css, css/layout.css, css/components/{navbar,hero,feature,button}.css, js/components/{organisms,site-data}.js |
| Nav/tokens | css/tokens.css, css/base.css, css/components/navbar.css |
