# Copilot instructions

## Repository context

This is an Adobe Experience Manager Edge Delivery Services site based on the AEM boilerplate. Content is authored in AEM and delivered as HTML/sections/blocks; the repository supplies the client-side decoration, block modules, styles, and page-loading pipeline. The runtime is browser-native ES modules and vanilla JavaScript: there is no bundler, transpilation step, or application framework.

`AGENTS.md` is the authoritative repository guidance. In particular, follow its AEM, accessibility, performance, responsive CSS, and block-structure conventions.

## Commands

Install dependencies:

```sh
npm install
```

Start local development with the AEM proxy:

```sh
npx -y @adobe/aem-cli up --no-open --forward-browser-logs
```

The server is available at `http://localhost:3000/`. If the CLI is installed globally, `aem up` is equivalent. Draft content can be served with the CLI's `--html-folder drafts` option.

Run the complete lint gate:

```sh
npm run lint
```

Run one lint domain:

```sh
npm run lint:js
npm run lint:css
```

Apply supported automatic fixes:

```sh
npm run lint:fix
```

There is currently no unit/integration test runner. For a single-page smoke check, start the local server and request the route under change, for example:

```sh
curl -I http://localhost:3000/drafts/product-teaser.plain.html
```

Use browser inspection for visual, responsive, accessibility, and interaction validation. CI runs `npm ci` and `npm run lint` on every push; the workflow uses Node.js 24.

## Architecture

- `scripts/scripts.js` is the page entry point. It registers Trusted Types policies, decorates the main content, and loads the page in three phases:
  - **Eager**: template/theme setup, auto-block creation, section/block decoration, button decoration, and the first section/LCP image.
  - **Lazy**: header and footer fragments, remaining sections, fonts, and `styles/lazy-styles.css`.
  - **Delayed**: `scripts/delayed.js` after a timeout for work that must not affect initial rendering.
- `scripts/aem.js` is the shared EDS runtime/library. It normalizes authored markup into sections and blocks, dynamically loads each block's JavaScript/CSS, handles optimized images/icons, and provides fragment/header/footer helpers. Treat it as vendor/framework code and do not modify it unless the task specifically targets the shared runtime.
- A block is discovered from the first class on an authored block element, then loaded from `blocks/{block-name}/{block-name}.js` and `blocks/{block-name}/{block-name}.css`. Its JavaScript must default-export a `decorate(block)` function and transform the authored DOM in place.
- Header and footer blocks load authored fragments (`/nav` and `/footer` by default, or metadata overrides). Fragment content is therefore part of the block contract even when it is not present in the repository.
- `buildAutoBlocks()` creates synthetic blocks for supported authored patterns, currently fragment links and `/widgets/` links. Extend this path only when a feature genuinely needs auto-blocking.
- `styles/styles.css` contains LCP-critical global tokens, typography, buttons, layout, and section defaults. `styles/lazy-styles.css` is for non-critical global styles. `styles/fonts.css` defines local font faces and is loaded separately.
- `drafts/` contains local static authoring fixtures. Use AEM markup-shaped HTML rather than inventing a separate component rendering system.

## Conventions specific to this codebase

- Preserve the authored DOM contract. Block code must tolerate missing optional rows/cells and avoid assuming every authored field exists. Use optional chaining and only append elements that are present, as in the product teaser block.
- Keep block behavior and styling colocated: block-specific DOM transformation belongs in the block JavaScript; block selectors belong in that block's CSS. Global selectors are reserved for shared page primitives.
- Use dynamic block loading and relative `.js` extensions; do not add a global bundle or dependency for a single block.
- Use `createOptimizedPicture()` for block-created/replaced images and preserve meaningful alt text. EDS handles image optimization and loading priority; do not eagerly load below-the-fold images.
- Follow mobile-first CSS and the repository breakpoints (`600px`, `900px`, and `1200px` where needed). Keep block selectors scoped and do not introduce `{blockname}-container` or `{blockname}-wrapper` classes; EDS itself adds those section/wrapper classes.
- Authored links are converted to buttons by `decorateButtons()` only when their formatting signals intent: `<strong>` creates a primary button, `<em>` a secondary button, and nested strong/em an accent CTA. Preserve that convention when adding content or styles.
- Header interactions must remain keyboard accessible: desktop dropdowns use focus/Enter/Space/Escape behavior, while mobile navigation controls body scrolling and uses the hamburger button's ARIA state.
- Keep semantic HTML, heading hierarchy, alt text, and ARIA labels intact. Do not use innerHTML for authored content transformations unless the existing runtime pattern requires it.
- Keep initial rendering light: put only LCP-critical styles/work in the eager path, defer non-critical styles to `lazy-styles.css`, and defer optional integrations to `delayed.js`.
- Check `git diff --check` and run the lint gate before finishing. For visual changes, verify a representative local route at desktop and mobile widths.

## Documentation and deployment references

Use the AEM documentation linked from `README.md` for markup, block, performance, and project structure questions:

- https://www.aem.live/developer/tutorial
- https://www.aem.live/developer/anatomy-of-a-project
- https://www.aem.live/developer/keeping-it-100
- https://www.aem.live/developer/markup-sections-blocks

Preview and live URLs follow:

```text
https://{branch}--{repo}--{owner}.aem.page/
https://main--{repo}--{owner}.aem.live/
```

Pull requests should follow `.github/pull_request_template.md`, including the related issue and before/after test URLs.
