Math Notepad

This static website is designed for GitHub Pages. Notes, drawings, graph blocks, and Wolfram settings are stored in the user's browser.

Wolfram|Alpha
- Each person gets their own Wolfram AppID from https://products.wolframalpha.com/api/ and enters it in Settings.
- GitHub Pages cannot run a private server request, and browsers cannot reliably read Wolfram's API response across origins. This project includes a small Cloudflare Worker proxy in workers/wolfram-proxy.js.
- For privacy, deploy your own copy of the Worker in your Cloudflare account and use its URL in Settings. The AppID is sent only when you press Solve; the Worker code forwards it in Wolfram's Authorization header and does not store or log it.
- To deploy the Worker, edit workers/wrangler.toml and change ALLOWED_ORIGIN to the origin serving the site. For a GitHub Pages project site, use https://OWNER.github.io (omit /gonitification and any other path).
- Install Wrangler and log in to Cloudflare, then run cd workers followed by npx wrangler deploy. Cloudflare gives you a Worker URL.
- In the notepad Settings, paste your personal AppID and Worker URL. Do not use a Worker URL you do not trust: it receives the key briefly to forward your request.
- The Worker is configured to accept browser requests only from ALLOWED_ORIGIN. Do not commit an AppID to this public repository.
- Solve sends the equations, diagram labels and dimensions, graph functions and data, and the user's instruction. It does not send drawing images.
- Wolfram's API page currently advertises up to 2,000 free non-commercial calls per month; the actual quota and allowed use are determined by the AppID's API plan and terms. See https://products.wolframalpha.com/api and https://products.wolframalpha.com/api/termsofuse.

Drawing board
- Select a shape, then drag on the board to draw it. Select/move lets you move shapes. Drag a handle to resize; drag the round handle to rotate.
- The board includes lines, squares, rectangles, circles, cylinders, rhombuses, parallelograms, and isosceles, equilateral, and right triangles.
- Auto-label is on by default. Select Text / corner label, type a label, and click a vertex to rename it; clicking elsewhere places free text.
- Select Angle, enter a value, then click a polygon corner. The app draws an arc and adds a degree sign if needed.
- Select Side value, enter a length or radius, then click an edge. Select Area value and click inside a shape to record an area. Undo restores the last drawing change.
- Ink eraser masks only the brushed part of the diagram. Shape eraser removes only the clicked shape.
- Alignment options snap lines to endpoints and nearby shapes, align lines parallel to existing segments, and snap angles to 90 degrees.
- The board grid uses 25 canvas pixels per model unit. Displayed dimensions and areas are calculated from the vector shape. Enter one known side value to scale the other inferred dimensions and area. The board flags mismatches between typed side or angle labels and the drawn proportions; check the sketch and values before relying on them mathematically.
- Each diagram is pinned above the MathLive note and includes a measurement summary. The summaries are also sent to Wolfram when Solve is used.

Graphs
- Select Graph to add a four-quadrant graph. Plot functions such as x^2 or sin(x), change the x and y ranges, and add point sets using x,y pairs separated by semicolons.

Saving and keyboard
- Use Save to store the note in the sidebar. Diagrams and graphs save with the note.
- Enter: add a math row; in normal writing mode the new row stays in normal writing mode
- Control+/ (Mac): toggle math and normal writing modes
- Backspace on an empty row in normal writing mode keeps that row in text mode
- Command+S (Control+S on Windows/Linux): save or update the current note
- Command+Shift+S: download a standalone .tex copy
- Command+Shift+O: import a .tex or .txt file
- Up / Down: move through the multiline document
- Backspace at the start of an equation row: remove that row
- As you add lower rows, the page scrolls smoothly to keep the active cursor near the center

Use + Folder to create folders; use the + beside a folder to create subfolders. Drag notes and folders into folders to organize them.

MathLive project: https://github.com/arnog/mathlive
MathLive license: vendor/mathlive/LICENSE.txt
Compute Engine project: https://github.com/cortex-js/compute-engine
Compute Engine license: vendor/compute-engine/LICENSE.txt
Compute Engine version: 0.134.0
