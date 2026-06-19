# Chemo Graphic International

Marketing website for **Chemo Graphic International** — a supplier of world-class print
consumables, press room chemistry, printing blankets and machinery for the graphic arts,
commercial, security and currency printing industries.

Inspired by the layout/content of [moneda-tech.com](http://moneda-tech.com) and
[chemo.in](https://chemo.in), rebuilt with a **black / dark-grey + gold** theme
(brand gold `#D2AE6D`, sampled from the logo).

## Structure

```
chemo-graphic-international/
├── index.html        # Home: hero, about, stats, products, partners, testimonials, contact
├── products.html     # Full product catalogue
└── assets/
    ├── css/style.css # Theme + layout (responsive)
    ├── js/main.js    # Nav, scroll reveal, stat counters, testimonial carousel, form
    └── img/logo.png  # Brand logo
```

Static site — no build step. Fonts (Cormorant Garamond + Jost) and Font Awesome icons
are loaded from CDNs.

## Run locally

```bash
cd chemo-graphic-international
python -m http.server 8123
# open http://127.0.0.1:8123/index.html
```
