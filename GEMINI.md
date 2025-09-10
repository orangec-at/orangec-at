# GEMINI.md

## Project Overview

This project is a personal portfolio and blog for Jaeil Lee (OrangeCat). It is a monorepo built with Yarn workspaces and contains a Next.js application for the blog.

**Main Technologies:**

*   **Frontend:** Next.js, React, TypeScript, Tailwind CSS
*   **Content:** MDX (for blog posts)
*   **Internationalization:** `next-intl`
*   **Package Manager:** Yarn

**Architecture:**

*   The project is a monorepo with applications in the `apps` directory.
*   The main application is `@orangec-at/blog`, which is a Next.js-based blog and portfolio site.
*   The blog uses MDX for authoring posts, allowing for a mix of Markdown and React components.
*   The site supports multiple languages through the `next-intl` library.

## Building and Running

To work with the blog application, use the following commands from the root directory:

*   **Install dependencies:** `yarn install`
*   **Run the development server:** `yarn blog dev`
*   **Build for production:** `yarn blog build`
*   **Start the production server:** `yarn blog start`
*   **Lint the code:** `yarn blog lint`
*   **Type-check the code:** `yarn blog typecheck`

## Development Conventions

*   The project follows standard Next.js and React conventions.
*   Code is written in TypeScript.
*   Styling is done with Tailwind CSS.
*   Blog posts are written in MDX and stored in the `src/posts` directory of the blog application.
*   The project uses `eslint` for linting.
