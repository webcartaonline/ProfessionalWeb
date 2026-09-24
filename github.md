repo: webcartaonline/ProfessionalWeb
branch: main
path: (whole repo)

## Last sync
date: 2026-09-24T12:00:00Z

### Updated in this project
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
| FAQs | new (brand voice) |
| Nav/tokens | css/tokens.css, css/base.css, css/components/navbar.css |
