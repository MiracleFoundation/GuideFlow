const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:5180';
const OUTPUT_DIR = path.join(__dirname, 'GuideFlow.Docs', 'html-export');

const PAGES = [
    { route: '/', file: 'index.html' },
    { route: '/docs', file: 'docs/index.html' },
    { route: '/docs/installation', file: 'docs/installation.html' },
    { route: '/docs/configuration', file: 'docs/configuration.html' },
    { route: '/docs/api', file: 'docs/api.html' },
    { route: '/docs/theming', file: 'docs/theming.html' },
    { route: '/docs/animated-tour', file: 'docs/animated-tour.html' },
    { route: '/docs/static-tour', file: 'docs/static-tour.html' },
    { route: '/docs/tour-progress', file: 'docs/tour-progress.html' },
    { route: '/docs/popover-position', file: 'docs/popover-position.html' },
    { route: '/docs/popover-buttons', file: 'docs/popover-buttons.html' },
    { route: '/docs/styling-popover', file: 'docs/styling-popover.html' },
    { route: '/docs/simple-highlight', file: 'docs/simple-highlight.html' },
    { route: '/docs/async-tour', file: 'docs/async-tour.html' },
    { route: '/docs/confirm-on-exit', file: 'docs/confirm-on-exit.html' },
    { route: '/docs/modal-tour', file: 'docs/modal-tour.html' },
    { route: '/docs/stage-overlay', file: 'docs/stage-overlay.html' },
    { route: '/docs/highlight-shapes', file: 'docs/highlight-shapes.html' },
    { route: '/docs/programmatic-tour', file: 'docs/programmatic-tour.html' },
    { route: '/docs/i18n', file: 'docs/i18n.html' },
    { route: '/docs/accessibility', file: 'docs/accessibility.html' },
];

async function main() {
    // Create output directories
    fs.mkdirSync(path.join(OUTPUT_DIR, 'docs'), { recursive: true });
    fs.mkdirSync(path.join(OUTPUT_DIR, 'css'), { recursive: true });
    fs.mkdirSync(path.join(OUTPUT_DIR, 'js'), { recursive: true });

    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    // Collect all CSS and JS resources
    const cssFiles = new Set();
    const jsFiles = new Set();

    page.on('response', async (response) => {
        const url = response.url();
        if (url.endsWith('.css') && !url.includes('blazor')) {
            cssFiles.add(url);
        }
        if (url.endsWith('.js') && !url.includes('blazor') && !url.includes('_framework')) {
            jsFiles.add(url);
        }
    });

    for (const { route, file } of PAGES) {
        const url = `${BASE_URL}${route}`;
        console.log(`Crawling: ${url}`);

        try {
            await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

            // Wait for Blazor to render
            await page.waitForTimeout(2000);

            // Get the rendered HTML
            const html = await page.content();

            // Fix relative paths for CSS/JS
            let fixedHtml = html.replace(/href="\.css/g, 'href="css/');
            fixedHtml = fixedHtml.replace(/src="\.js/g, 'src="js/');
            fixedHtml = fixedHtml.replace(/href="\//g, `href="${BASE_URL}/`);
            fixedHtml = fixedHtml.replace(/src="\//g, `src="${BASE_URL}/`);

            const outputPath = path.join(OUTPUT_DIR, file);
            fs.writeFileSync(outputPath, fixedHtml, 'utf-8');
            console.log(`  Saved: ${outputPath}`);
        } catch (err) {
            console.error(`  Error on ${route}: ${err.message}`);
        }
    }

    // Download CSS files
    for (const cssUrl of cssFiles) {
        try {
            const response = await page.goto(cssUrl);
            const css = await response.text();
            const fileName = path.basename(new URL(cssUrl).pathname);
            fs.writeFileSync(path.join(OUTPUT_DIR, 'css', fileName), css, 'utf-8');
            console.log(`Downloaded CSS: ${fileName}`);
        } catch (err) {
            console.error(`  Error downloading ${cssUrl}: ${err.message}`);
        }
    }

    // Download JS files
    for (const jsUrl of jsFiles) {
        try {
            const response = await page.goto(jsUrl);
            const js = await response.text();
            const fileName = path.basename(new URL(jsUrl).pathname);
            fs.writeFileSync(path.join(OUTPUT_DIR, 'js', fileName), js, 'utf-8');
            console.log(`Downloaded JS: ${fileName}`);
        } catch (err) {
            console.error(`  Error downloading ${jsUrl}: ${err.message}`);
        }
    }

    await browser.close();
    console.log(`\nDone! Exported ${PAGES.length} pages to ${OUTPUT_DIR}`);
}

main().catch(console.error);
