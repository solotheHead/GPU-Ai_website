#!/usr/bin/env python3
"""Extract EN page main HTML + page-specific CSS from the wget mirror into Astro content fragments."""
from __future__ import annotations
import json, re, os, html as html_lib
from pathlib import Path

MIRROR = Path('/workspace/nodex-clone/site')
OUT_HTML = Path('/workspace/nodex-clone/astro/src/content-html')
OUT_META = Path('/workspace/nodex-clone/astro/src/content-html/_meta.json')
OUT_HTML.mkdir(parents=True, exist_ok=True)

# route path (URL) -> mirror relative file
PAGES = [
    ('/', 'index.html'),
    ('/our-products/', 'our-products/index.html'),
    ('/product/nx-g12-sp3/', 'product/nx-g12-sp3/index.html'),
    ('/product/nx-g8-dual-sp3/', 'product/nx-g8-dual-sp3/index.html'),
    ('/product/nx-g8-dual-sp5/', 'product/nx-g8-dual-sp5/index.html'),
    ('/product/custom-graphics-cards/', 'product/custom-graphics-cards/index.html'),
    ('/gpu-rental-business/', 'gpu-rental-business/index.html'),
    ('/vast-ai-hosting/', 'vast-ai-hosting/index.html'),
    ('/request-a-quote/', 'request-a-quote/index.html'),
    ('/contact-us/', 'contact-us/index.html'),
    ('/guides/', 'guides/index.html'),
    ('/rtx-4090-48gb/', 'rtx-4090-48gb/index.html'),
    ('/rtx-pro-6000/', 'rtx-pro-6000/index.html'),
    ('/rtx-pro-6000-vs-h200/', 'rtx-pro-6000-vs-h200/index.html'),
    ('/rtx-pro-6000-vs-rtx-5090/', 'rtx-pro-6000-vs-rtx-5090/index.html'),
    ('/h200-nvl/', 'h200-nvl/index.html'),
    ('/8x-rtx-pro-6000-server/', '8x-rtx-pro-6000-server/index.html'),
    ('/local-llm-server/', 'local-llm-server/index.html'),
    ('/buy-or-rent-gpu-server/', 'buy-or-rent-gpu-server/index.html'),
    ('/about-us/', 'about-us/index.html'),
    ('/faq/', 'faq/index.html'),
    ('/support/', 'support/index.html'),
    ('/terms-of-use/', 'terms-of-use/index.html'),
    ('/privacy-policy/', 'privacy-policy/index.html'),
    ('/refund-policy/', 'refund-policy/index.html'),
    ('/warranty-policy/', 'warranty-policy/index.html'),
    ('/shipping-policy/', 'shipping-policy/index.html'),
    ('/my-account/withdraw-order/', 'my-account/withdraw-order/index.html'),
]

SHARED_CSS = {
    '/wp-content/plugins/woocommerce/assets/css/woocommerce-layout.css',
    '/wp-content/plugins/woocommerce/assets/css/woocommerce-smallscreen.css',
    '/wp-content/plugins/woocommerce/assets/css/woocommerce.css',
    '/wp-content/plugins/woocommerce-composite-products/assets/css/frontend/woocommerce.css',
    '/wp-content/plugins/woocommerce-composite-products/assets/css/frontend/checkout-blocks.css',
    '/wp-content/plugins/ai-server-quote-system/nodex-redesign.css',
    '/wp-content/plugins/ai-server-quote-system/nodex-server-photo-scene.css',
    '/wp-content/plugins/ai-server-quote-system/nodex-language.css',
    '/wp-content/themes/Divi-Child-Theme/style.css',
    '/wp-content/et-cache/global/et-divi-customizer-global.min.css',
}

def slug_from_route(route: str) -> str:
    if route == '/':
        return 'home'
    return route.strip('/').replace('/', '__')

def extract(route: str, rel: str) -> dict:
    path = MIRROR / rel
    html = path.read_text(encoding='utf-8', errors='replace')

    title_m = re.search(r'<title>(.*?)</title>', html, re.I | re.S)
    title = html_lib.unescape(re.sub(r'\s+', ' ', title_m.group(1)).strip()) if title_m else 'NodeX'
    desc_m = re.search(r'<meta\s+name=["\']description["\']\s+content=["\'](.*?)["\']', html, re.I | re.S)
    if not desc_m:
        desc_m = re.search(r'<meta\s+content=["\'](.*?)["\']\s+name=["\']description["\']', html, re.I | re.S)
    description = html_lib.unescape(desc_m.group(1).strip()) if desc_m else ''

    body_m = re.search(r'<body([^>]*)>', html, re.I)
    body_attrs = body_m.group(1) if body_m else ''
    # keep useful classes only (strip WP noise a bit later in layout)
    class_m = re.search(r'class=["\']([^"\']*)["\']', body_attrs)
    body_class = class_m.group(1) if class_m else 'nx-design nodex-lang-en'

    # page-specific CSS links
    css_links = re.findall(r"""href=['"](/wp-content/[^'"]+\.css)['"]""", html)
    page_css = [c for c in css_links if c not in SHARED_CSS]
    # de-dupe preserve order
    seen = set(); page_css = [c for c in page_css if not (c in seen or seen.add(c))]

    # Collect ALL head <style> blocks (Divi inlines critical CSS per page)
    styles = []
    for m in re.finditer(r'<style([^>]*)>(.*?)</style>', html, re.I | re.S):
        attrs, body = m.group(1), m.group(2)
        # skip empty
        if not body.strip():
            continue
        # skip the tiny header brand override — Layout re-emits it
        if '.nx-header .nx-brand' in body and len(body) < 400:
            continue
        styles.append(body)

    # Main content: prefer <main>...</main>, else #et-main-area / between header&footer
    main = None
    m = re.search(r'<main\b[^>]*>(.*?)</main>', html, re.I | re.S)
    if m:
        # keep the main tag itself for landmark
        main = html[m.start():m.end()]
    else:
        # between </header> and <footer
        hs = html.find('</header>')
        fs = html.find('<footer')
        if hs > 0 and fs > hs:
            chunk = html[hs + len('</header>'):fs].strip()
            # Strip ONLY the opening #et-main-area — Layout re-adds it.
            # Do not eat a trailing </div> (WordPress often leaves the
            # wrapper unbalanced between header and footer).
            import re as _re
            chunk = _re.sub(r'^<div id="et-main-area">\s*', '', chunk, count=1)
            main = chunk
        else:
            raise SystemExit(f'No main content for {route}')

    # Stub forms: add data-nx-form-stub on forms so client JS can intercept
    main = re.sub(
        r'<form\b',
        '<form data-nx-form-stub="1"',
        main,
        flags=re.I,
    )

    slug = slug_from_route(route)
    out = OUT_HTML / f'{slug}.html'
    out.write_text(main, encoding='utf-8')
    styles_out = OUT_HTML / f'{slug}.styles.css'
    styles_out.write_text('\n\n'.join(styles), encoding='utf-8')

    return {
        'route': route,
        'slug': slug,
        'title': title,
        'description': description,
        'bodyClass': body_class,
        'pageCss': page_css,
        'htmlFile': f'{slug}.html',
        'stylesFile': f'{slug}.styles.css',
        'hasScene': 'data-nx-scene' in main,
        'mirror': rel,
    }

meta = []
for route, rel in PAGES:
    info = extract(route, rel)
    meta.append(info)
    print(f"OK {route} -> {info['slug']} main={OUT_HTML.joinpath(info['htmlFile']).stat().st_size} styles={OUT_HTML.joinpath(info['stylesFile']).stat().st_size} css={len(info['pageCss'])} scene={info['hasScene']}")

OUT_META.write_text(json.dumps(meta, indent=2), encoding='utf-8')
print(f'\nWrote {len(meta)} pages -> {OUT_META}')
