# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a landing page project for **PuzzleBot**, a video game where a robot advances through puzzle-solving challenges. The landing page is a standalone HTML file with embedded CSS and JavaScript.

## Project Structure

- [landing-page.html](landing-page.html) - Main landing page with inline styles and scripts
- [package.json](package.json) - NPM configuration with development scripts
- [prompts.txt](prompts.txt) - Development history/requirements (in French)

## Key Technologies

- Pure HTML5 with embedded CSS3 and vanilla JavaScript
- No build process required - simple HTML file with embedded resources
- NPM scripts available for development server
- Responsive design with three breakpoints:
  - Mobile (≤768px): Hamburger menu pattern
  - Tablet (769px-1024px): Centered navigation
  - Desktop (≥1025px): Left-aligned navigation

## Development

### NPM Commands

**Start development server:**
```bash
npm start
```
Launches an HTTP server on port 8080 and automatically opens the landing page in your browser.

**Development with live reload:**
```bash
npm run dev
```
Launches a server with automatic page refresh when files are modified.

**Simple server (no auto-open):**
```bash
npm run serve
```
Starts an HTTP server without automatically opening the browser.

### Direct Viewing
You can also open [landing-page.html](landing-page.html) directly in a browser without running a server.

### Making Changes
Edit [landing-page.html](landing-page.html) directly. All styles are in the `<style>` block and all scripts are in the `<script>` block at the bottom.

## Code Quality Integration


## Project Language

This is a French-language project. All content, including UI text and documentation, is in French.

## Design Guidelines

### Color Scheme
**Primary Color: Orange** - The main brand color for this project is orange. When making design changes or adding new elements, ensure orange is used as the primary accent color.

## Architecture Notes

### Navigation System
The navigation bar ([landing-page.html:22-500](landing-page.html#L22-L500)) implements a responsive design:
- Fixed position with backdrop blur effect
- Hamburger menu controlled by JavaScript ([landing-page.html:586-601](landing-page.html#L586-L601))
- Responsive behavior handled by media queries ([landing-page.html:426-481](landing-page.html#L426-L481))

### Animation System
Multiple CSS animations create an engaging experience:
- `float`, `pulse`, `blink`, `glow`, `wave` for robot elements
- `fadeInDown`, `fadeInUp` for hero section
- `puzzleFloat` for puzzle pieces
- JavaScript event handlers add interactivity ([landing-page.html:603-622](landing-page.html#L603-L622))

### Layout Structure
Single-page design with sections:
1. Navigation (fixed header)
2. Hero section with robot showcase
3. Features grid (6 feature cards)
4. CTA section
5. Footer
