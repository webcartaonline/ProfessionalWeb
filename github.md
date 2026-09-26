repo: webcartaonline/ProfessionalWeb
branch: main
path: (whole repo)

## Last sync
date: 2026-09-26T11:57:10Z

### Updated in this project
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
| Nav/tokens | css/tokens.css, css/base.css, css/components/navbar.css |
