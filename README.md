# Tony Codes Digital Garden

A static site generator that converts Markdown files with wiki-style links into a beautiful digital garden. This tool processes Obsidian vault files and generates a clean, responsive website.

## Features

- **Markdown to HTML conversion** - Converts your markdown notes to clean HTML
- **Wiki-style links** - Supports `[[internal links]]` that get converted to proper HTML links
- **Live publishing** - Only publishes files tagged with `#Live`
- **YAML frontmatter support** - Automatically removes YAML metadata from published content
- **Tag filtering** - Removes hashtags from the final output for cleaner content
- **Responsive design** - Clean, modern styling that works on all devices

## Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager
- An Obsidian vault with markdown files

## Installation

1. Clone this repository:
```bash
git clone <repository-url>
cd tony-codes-digital-garden
```

2. Install dependencies:
```bash
npm install
```

   1. Setup the configuration
```bash
cp .env.example .env
```


## Usage

### Basic Build

To build your digital garden from your Obsidian vault:

```bash
node build.js
```

This will:
- Process all `.md` files in your vault
- Filter for files containing any of the tags listed in the configuration
- Convert markdown to HTML
- Generate wiki-style links
- Output files to the `./public` directory

### File Processing Rules

The build script processes your markdown files with the following rules:

1. **Tag Required**: Only files containing tags listed in the .env (either as a hashtag or in YAML frontmatter tags) will be published
2. **YAML Frontmatter Removal**: Any YAML metadata at the top of files is automatically removed from the final output
3. **Tag Cleanup**: All tags are removed from the final output
4. **Wiki Links**: `[[internal links]]` are converted to proper HTML links
5. **Slug Generation**: File titles are converted to URL-friendly slugs


## Deployment

### Local Development

After building, you can serve the `public` directory with any static file server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js (if you have serve installed)
npx serve public

# Using PHP
php -S localhost:8000 -t public
```

### Production Deployment

The repository includes a deployment script for uploading to a remote server:

```bash
./deploy.sh
```

**Note**: You'll need to configure the deployment settings in the .env:
- Update `SERVER` variable with your server hostname
- Update `DIR` variable with your web server directory path
- Ensure SSH key-based authentication is set up


## Customization

### Styling

Edit `style.css` to customize the appearance of your digital garden. The current design features:
- Clean, readable typography
- Responsive layout
- Subtle color scheme
- Proper spacing and hierarchy

### Build Script

Modify `build.js` to:
- Change the output directory
- Add custom markdown processing
- Implement different filtering rules
- Add metadata extraction

## Troubleshooting

## Contributing

This is a personal digital garden tool, but feel free to fork and adapt it for your own needs. The code is intentionally simple and well-commented for easy customization.

## License

This project is open source and available under the MIT License. 