import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const meta = JSON.parse(fs.readFileSync(path.join(root, 'src/content-html/_meta.json'), 'utf8'));
const pagesDir = path.join(root, 'src/pages');

// wipe generated pages except we rebuild everything under pages
function rmrf(dir) {
  if (!fs.existsSync(dir)) return;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) rmrf(p);
    else fs.unlinkSync(p);
  }
}
rmrf(pagesDir);
fs.mkdirSync(pagesDir, { recursive: true });

function routeToFile(route) {
  if (route === '/') return path.join(pagesDir, 'index.astro');
  // /foo/bar/ -> foo/bar/index.astro
  const parts = route.replace(/^\/|\/$/g, '').split('/');
  const dir = path.join(pagesDir, ...parts);
  fs.mkdirSync(dir, { recursive: true });
  return path.join(dir, 'index.astro');
}

for (const page of meta) {
  const file = routeToFile(page.route);
  // depth for relative imports
  const depth = page.route === '/' ? 0 : page.route.replace(/^\/|\/$/g, '').split('/').length;
  const rel = '../'.repeat(depth + 1); // pages[/a/b] -> ../../layouts
  const htmlImport = `${rel}content-html/${page.htmlFile}?raw`;
  const layoutImport = `${rel}layouts/BaseLayout.astro`;
  const pageCssLit = JSON.stringify(page.pageCss, null, 2);
  const bodyClass = JSON.stringify(page.bodyClass);
  const title = JSON.stringify(page.title);
  const description = JSON.stringify(page.description || '');

  const src = `---
import BaseLayout from '${layoutImport}';
import content from '${htmlImport}';
---
<BaseLayout
  title={${title}}
  description={${description}}
  bodyClass={${bodyClass}}
  pageCss={${pageCssLit}}
  stylesSlug="${page.slug}"
>
  <Fragment set:html={content} />
</BaseLayout>
`;
  fs.writeFileSync(file, src);
  console.log('wrote', path.relative(root, file));
}
console.log(`\nGenerated ${meta.length} Astro pages.`);
