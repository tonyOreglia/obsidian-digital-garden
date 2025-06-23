# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
A digital garden static site generator that converts Markdown files with wiki-style links into HTML. Only processes files with the "#Live" tag.

## Commands
- Build: `node build.js` - Processes markdown files from `./vault` into HTML in `./public`
- Install: `npm install` - Install dependencies (marked)

## Code Style
- **Formatting**: Use 2-space indentation
- **Naming**: camelCase for variables/functions, UPPER_CASE for constants
- **Imports**: Group Node.js core modules first, then third-party modules
- **Error Handling**: Use basic existence checks (fs.existsSync)
- **Functions**: Prefer small, single-purpose functions (like slugify)
- **File Processing**: Use synchronous fs methods for simplicity

## File Structure
- `vault/` - Source markdown files
- `public/` - Generated HTML output