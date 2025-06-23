require("dotenv").config();
const fs = require("fs");
const path = require("path");
const marked = require("marked");

const OUTPUT_DIR = "./public";
const VAULT_DIR = process.env.OBSIDIAN_VAULT_PATH;
const TAGS = process.env.TAGS || "Live";
const REQUIRED_TAGS = TAGS.split(",")
  .map((tag) => tag.trim())
  .filter((tag) => tag.length > 0);

if (!VAULT_DIR) {
  console.error("[build.js] OBSIDIAN_VAULT_PATH must be set in .env file");
  process.exit(1);
}

console.log(`[build.js] Vault directory: ${VAULT_DIR}`);
console.log(`[build.js] Filtering by tags: ${REQUIRED_TAGS.join(", ")}`);

// Clean public directory if it exists
if (fs.existsSync(OUTPUT_DIR)) {
  const existingFiles = fs.readdirSync(OUTPUT_DIR);
  existingFiles.forEach((file) => {
    const filePath = path.join(OUTPUT_DIR, file);
    if (fs.statSync(filePath).isFile()) {
      fs.unlinkSync(filePath);
    }
  });
} else {
  fs.mkdirSync(OUTPUT_DIR);
}

const files = fs
  .readdirSync(VAULT_DIR, { recursive: true })
  .filter((f) => f.endsWith(".md"));

console.log(`Found ${files.length} files`);

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
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

// tag should include full tag string (not including the preceding #)
// case matters
function hasTag(content, tag) {
  if (content.includes(`#${tag}`)) {
    return true;
  }

  // Check for tag in YAML metadata
  const yamlMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (yamlMatch) {
    const yamlContent = yamlMatch[1];
    // Check if tag is in the tags list
    if (new RegExp(`tags:[\\s\\S]*?-\\s*${tag}\\b`).test(yamlContent)) {
      return true;
    }
  }

  return false;
}

// Check if content has any of the required tags
function hasAnyRequiredTag(content, requiredTags) {
  if (requiredTags.length === 0) {
    return false; // If no tags specified, exclude all files
  }

  return requiredTags.some((tag) => hasTag(content, tag));
}

files.forEach((filename) => {
  const md = fs.readFileSync(path.join(VAULT_DIR, filename), "utf-8");
  const title = path.basename(filename, ".md");

  // Skip files without any of the required tags
  if (!hasAnyRequiredTag(md, REQUIRED_TAGS)) {
    return;
  }

  // Remove YAML frontmatter
  const contentWithoutYaml = removeYamlFrontmatter(md);

  // Remove all tags (words that start with # and have no space after the #)
  const contentWithoutTags = contentWithoutYaml.replace(
    /#[a-zA-Z0-9_-]+\b/g,
    ""
  );

  // Replace [[Wiki Links]] with <a href="wiki-link.html">wiki link</a>
  const processed = contentWithoutTags.replace(
    /\[\[([^\]]+)\]\]/g,
    (match, p1) => {
      const slug = slugify(p1);
      return `<a href="${slug}.html">${p1}</a>`;
    }
  );

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${title}</title>
      <link rel="stylesheet" href="style.css">
    </head>
    <body>
      <header>
        <div class="site-title"><a href="/">Tony Codes</a></div>
        <div class="site-subtitle">a digital garden derived from markdown notes</div>
      </header>
      <main>${marked.parse(processed)}</main>
    </body>
    </html>
  `;

  fs.writeFileSync(
    path.join(OUTPUT_DIR, `${slugify(title)}.html`),
    html,
    "utf-8"
  );
});

// Copy style.css to the output directory
if (fs.existsSync("./style.css")) {
  fs.copyFileSync("./style.css", path.join(OUTPUT_DIR, "style.css"));
  console.log("Copied style.css to public directory");
}
