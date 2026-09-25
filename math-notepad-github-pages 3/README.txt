MATH NOTEPAD
============

This is a static website bundle for GitHub Pages. Open index.html from the published website. Keep the vendor folder next to it: the page loads MathLive and Compute Engine from those local files, so the editor does not depend on a CDN to start.

NOTES AND STORAGE
-----------------
- Notes, folders, graphs, drawings, AI chat history, and settings are saved automatically in this browser's local storage.
- Data is local to the current browser profile and website address. It does not sync between devices and is not included in TeX exports.
- Use the left sidebar to find or organize notes, create nested folders, and change folder colors. The narrow Files rail on the right opens the Import and Export actions.
- Graphs and diagrams can be moved to the scrollable Canvas tab in the left sidebar. Their placement and data save with the note.
- The first page has Math, Draw, and Graph entry points. Use Settings > Look for light/dark/AMOLED and plain/lined pages.

MATH AND DIAGRAMS
-----------------
- Type directly in the MathLive editor. Enter adds a row; Up/Down stay within the same multiline field.
- On Mac, Control+/ switches between math and normal writing. Enter keeps the current normal-writing mode.
- Command+S saves the current snapshot immediately; auto-save is always on. Command+Shift+S exports TeX, and Command+Shift+O imports TeX or text.
- Settings can suggest simple arithmetic in parentheses after Enter. Apply the suggestion or type `==` on the next row. It does not solve variables or general symbolic math.
- A drawing has only manual Line and Rectangle tools. Use the expandable Labels & alignment menu for text and snapping. Manual lines have no measurement unless you enter a length and press Enter.
- Auto Draw has shape-specific measurement fields. Numeric shapes are built to scale when the supplied measurements determine them. Variables create a schematic marked not to scale. If numbers do not determine a unique shape, the message says what additional information is needed.
- Show height/altitude adds a dashed perpendicular line for supported shapes. Select an Auto Draw shape and click it three times to edit its original data. Measured Auto Draw shapes keep their dimensions fixed while they are moved or rotated; triple-click to change their measurements.
- Diagram values beneath each drawing are editable and grouped into Lines, Angles, and Other details. Hand-drawn, unmeasured sketches are not given invented side lengths.
- Graph entries accept x^2, y = x^2, and f(x) = sin(x). Use the expandable graph menus for axis limits, functions, and data points.

AI ASSISTANT
------------
The AI assistant is optional. Each person needs an OpenAI API key and an HTTPS Worker URL they control. Configure both in Settings > Extras. The key is saved in this browser and sent to that Worker only when an AI request is made. The Worker forwards the request to OpenAI and does not intentionally store or log the key or note.

To deploy a personal Cloudflare Worker:
1. In `workers/wrangler.ai.toml`, set ALLOWED_ORIGIN to the exact website origin (scheme and host only; for example, https://loopotie.github.io, with no /gonitification path).
2. Install Wrangler and sign in to your Cloudflare account.
3. From the workers folder, run `npx wrangler deploy --config wrangler.ai.toml`.
4. Copy the resulting HTTPS Worker URL into Settings > Extras with your OpenAI API key.

Every visitor should use their own Worker and their own key. GitHub Pages cannot keep an API key secret inside public JavaScript. The Origin check is a browser CORS rule, not authentication or a request quota. Do not put a shared private key in the repository or publish your personal key. OpenAI API billing is separate from a ChatGPT subscription; check the account's current API billing and limits before use.

The AI sidebar reads the current note's math rows, text, diagram measurements/labels, and graph functions/points. It supports chat and a proofread view with red issue cards. For a requested math edit, the default setting shows a full-note preview to review before applying it. Settings can allow requested edits automatically or disable AI edits. Proofread is an assistant review, not a formal proof system, and it does not mark an exact character range inside MathLive.

The new AI Worker files are `workers/ai-proxy.js` and `workers/wrangler.ai.toml`. They contain no API key. The previous Wolfram proxy source/config remain in the bundle for reference, but the current page no longer calls Wolfram.

PROJECT FILES
-------------
- `index.html`: app structure, styles, MathLive interaction, notes, drawings, graphs, chat, and settings.
- `vendor/mathlive/`: locally bundled MathLive and its license.
- `vendor/compute-engine/`: locally bundled Compute Engine and its license, used for graph plotting.
- `workers/ai-proxy.js`: optional personal Cloudflare Worker for OpenAI requests.
- `workers/wrangler.ai.toml`: Worker deployment template; set ALLOWED_ORIGIN before deploying.
- `workers/wolfram-proxy.js` and `workers/wrangler.toml`: legacy Wolfram Worker files, not used by the current page.
