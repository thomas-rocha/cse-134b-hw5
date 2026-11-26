# cse-134b-hw5

Thomas Rocha's portfolio for CSE 134B Homework 5: Web Components, APIs, and Static Site Generation.

## Where things are

| Part | What | Where |
| --- | --- | --- |
| 1–3 | `<fact-panel>` Web Component (facts + live dad jokes, compact mode, saved preference) | Home page (`index.html`), code in `fact-panel.js`, styles in `styles.css` |
| 4 | Static site generator exercise (Astro) | [`ssg-exercise/`](ssg-exercise/) |

### SSG exercise

- **Folder:** `ssg-exercise/`
- **Pages to preview:** **Home** (`/`) and **About** (`/about.html`). Both use the shared footer in `ssg-exercise/src/components/Footer.astro`.
- Install, build, and preview commands are in [`ssg-exercise/README.md`](ssg-exercise/README.md).

## Design note: `<fact-panel>`

**What the visitor wants:** to learn a few quick things about me and get a laugh. The panel cycles through facts about me. **Make me groan** pulls in a new dad joke without leaving the page, and the visitor can hide the extra details if they want a cleaner view.

**Tracing one action: requesting a new joke**

1. **Control.** The visitor activates **Make me groan**, a `<button>` inside the component, with a mouse or the keyboard. Its click listener calls `loadJoke()`.
2. **Pending state.** `loadJoke()` sets `aria-disabled="true"` on the button, so repeat presses are ignored and keyboard focus stays put. It also sets `aria-busy` on the panel and writes **"Loading a dad joke…"** into the `role="status"` paragraph, which screen readers announce.
3. **Request.** `fetch("https://icanhazdadjoke.com/")` sends a GET request with the header `Accept: application/json` and an 8-second timeout (`AbortSignal.timeout`).
4. **Validation.**
   - If `response.ok` is false, the request is treated as failed.
   - `response.json()` throws if the body isn't valid JSON.
   - The `joke` field must be a non-empty string; `id` is used only if it is a string.
5. **DOM update (success).** The joke is added to the component's list of items and becomes the current item. The text goes into the `<blockquote>` with `textContent`, so remote text is never parsed as HTML. The caption reads "Dad joke … · icanhazdadjoke.com", and the status changes to **"New dad joke added. Item N of N"**.
6. **Failure.** A network error, timeout, HTTP error, bad JSON, or missing field all end in the same `catch` block:
   - The current item stays on screen.
   - The status turns red and reads **"Couldn't load a dad joke. Check your connection and try again."** (or a timeout message).
   - The button's label becomes **Try again**.
7. **Recovery.** A `finally` block always turns the button back on and clears `aria-busy`. Pressing **Try again** once the connection is back runs the same path. On success the error clears and the label returns to **Make me groan**.

**Page control and preference.** The **Hide/Show item details** button sits outside the component. It toggles the component's observed `compact` attribute, and `attributeChangedCallback()` hides or shows the caption. The choice is saved under the `localStorage` key `hw5-fact-panel-mode` and restored on load through the same path. Both storage calls are wrapped in `try`/`catch`.

**Without JavaScript.** The element shows a static list of the facts and a `<noscript>` message: "Enable JavaScript to load live data for this widget."
