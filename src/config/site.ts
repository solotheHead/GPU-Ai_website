/**
 * Brand tokens for the NodeX Astro rebuild.
 *
 * Defaults match the original nodexservers.com chrome so the clone
 * looks one-for-one. Before any public deploy, replace every field
 * using the checklist in /workspace/nodex-clone/REBRAND.md — shipping
 * this with NodeX / N D Z Ltd. details is impersonation.
 */
export const site = {
  /** Short brand used in titles, aria-labels, nav */
  name: 'NodeX',
  /** Longer product name */
  productName: 'NodeX Servers',
  /** Legal entity (EN footer / legal pages) */
  companyLegal: 'Ен Ди Зет ЕООД / N D Z Ltd.',
  companyShort: 'Ен Ди Зет ЕООД',
  uic: '207046568',
  vat: 'BG207046568',
  email: 'business@nodexservers.com',
  phones: [
    { display: '+359 892 933 423', tel: '+359892933423' },
    { display: '+359 886 422 875', tel: '+359886422875' },
  ],
  address: {
    line1: '7 Edelweiss Street',
    line2: 'Bansko 2770, Bulgaria',
  },
  linkedIn: 'https://www.linkedin.com/company/nodexservers/',
  domain: 'nodexservers.com',
  tagline: 'GPU servers and managed AI infrastructure.',
  taglineSub: 'From build to business.',
  footerCta: "Let's build your infrastructure",
  footerHook: "Built for what's next.",
  logos: {
    header: '/wp-content/uploads/2026/11/Nodex_logo_with_angular_N_monogram-removebg-preview.png',
    footer: '/wp-content/uploads/2026/10/ChatGPT-Image-Aug-25-2026-04_36_25-PM-1-removebg-preview.png',
    favicon: '/favicon.ico',
    og: '/wp-content/plugins/ai-server-quote-system/assets/nodex-social-1200x630.png',
  },
  nav: [
    { href: '/our-products/', label: 'Hardware' },
    { href: '/gpu-rental-business/', label: 'AI business' },
    { href: '/about-us/', label: 'About' },
    { href: '/support/', label: 'Support' },
    { href: '/contact-us/', label: 'Contact' },
  ],
  cta: { href: '/request-a-quote/', label: 'Start your project' },
  explore: [
    { href: '/our-products/', label: 'GPU servers & hardware' },
    { href: '/gpu-rental-business/', label: 'GPU rental business' },
    { href: '/guides/', label: 'GPU guides' },
    { href: '/about-us/', label: 'About NodeX' },
    { href: '/contact-us/', label: 'Contact' },
  ],
  help: [
    { href: '/faq/', label: 'Frequently asked questions' },
    { href: '/support/', label: 'Technical support' },
    { href: '/warranty-policy/', label: 'Warranty & EU legal guarantee' },
    { href: '/shipping-policy/', label: 'Shipping policy' },
    { href: '/refund-policy/', label: 'Refund & cancellation' },
  ],
  legal: [
    { href: '/terms-of-use/', label: 'Terms of use' },
    { href: '/privacy-policy/', label: 'Privacy policy' },
    { href: '/my-account/withdraw-order/', label: 'Withdraw from contract' },
  ],
  languages: [
    { code: 'bg', href: '/bg/', label: 'BG', aria: 'Български' },
    { code: 'en', href: '/', label: 'EN', aria: 'English' },
    { code: 'de', href: '/de/', label: 'DE', aria: 'Deutsch' },
  ],
  /** Shared CSS always loaded (paths under public/) */
  styles: [
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
  ],
  /** Scripts always loaded at end of body */
  scripts: [
    '/wp-includes/js/jquery/jquery.min.js',
    '/wp-content/plugins/ai-server-quote-system/nodex-redesign.js',
    '/wp-content/plugins/ai-server-quote-system/nodex-server-photo-scene.js',
    '/wp-content/plugins/ai-server-quote-system/nodex-language.js',
  ],
} as const;

export type SiteConfig = typeof site;
