const fs = require('fs');
const path = require('path');
const marked = require('marked');

const OUTPUT_DIR = './public';
const VAULT_DIR = process.argv[2];

if (!VAULT_DIR) {
    console.error("[build.js] must provide vault directory as first argument");
    process.exit(1);
}

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);

const files = fs.readdirSync(VAULT_DIR, { recursive: true }).filter(f => f.endsWith('.md'));

console.log(`Found ${files.length} files`)

function slugify(title) {
  return title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
}

function removeYamlFrontmatter(content) {
  // Check if content starts with YAML frontmatter (---)
  const yamlMatch = content.match(/^---\n([\s\S]*?)\n---\n/);
  if (yamlMatch) {
    // Remove the YAML frontmatter part
    return content.slice(yamlMatch[0].length);
  }
  return content;
}

function hasLiveTag(content) {
    if (content.includes('#Live')) {
        return true;
    }

    // Check for "Live" tag in YAML metadata
    const yamlMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (yamlMatch) {
        const yamlContent = yamlMatch[1];
        // Check if "Live" is in the tags list
        if (/tags:[\s\S]*?-\s*Live\b/i.test(yamlContent)) {
            return true;
        }
    }

    return false;
}

files.forEach(filename => {
  const md = fs.readFileSync(path.join(VAULT_DIR, filename), 'utf-8');
  const title = path.basename(filename, '.md');

  // Skip files without the #Live tag
  if (!hasLiveTag(md)) {
    return;
  }

  console.log(`Processing ${filename}`);

  // Remove YAML frontmatter
  const contentWithoutYaml = removeYamlFrontmatter(md);

  // Replace [[Wiki Links]] with <a href="wiki-link.html">wiki link</a>
  const processed = contentWithoutYaml.replace(/\[\[([^\]]+)\]\]/g, (match, p1) => {
    const slug = slugify(p1);
    return `<a href="${slug}.html">${p1}</a>`;
  });

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${title}</title>
      <link rel="stylesheet" href="style.css">
    </head>
    <body>
      <main>${marked.parse(processed)}</main>
    </body>
    </html>
  `;

  fs.writeFileSync(
    path.join(OUTPUT_DIR, `${slugify(title)}.html`),
    html,
    'utf-8'
  );
});

