# Public API List (Loading/Error/Retry)

A minimal, framework-free example that fetches a list from a public API, renders items, shows loading/error states, and supports retry. Works great in VS Code and is easy to deploy on GitHub Pages.

- Stack: HTML + CSS + Vanilla JS
- API: https://jsonplaceholder.typicode.com/users
- Features:
  - Loading indicator with aria-live updates
  - Error handling with a Retry button
  - Refresh button to re-fetch
  - In-flight fetch cancellation (AbortController)
  - Accessible semantics and keyboard focus on error

## Run locally

Option A: VS Code Live Server
1. Open this folder in VS Code.
2. Install the “Live Server” extension (you’ll be prompted by VS Code).
3. Right-click `index.html` → “Open with Live Server”.

Option B: Any static server
- Python 3: `python -m http.server 5173`
- Node: `npx http-server -c-1 -p 5173`

Then open http://localhost:5173 in your browser.

## Deploy to GitHub Pages

1. Create a new GitHub repository and push this folder.
2. In your repo: Settings → Pages → Build and deployment
   - Source: “Deploy from a branch”
   - Branch: `main` (or `master`) and select `/ (root)`
3. Save. Your site will be published at:
   `https://<your-username>.github.io/<repo-name>/`

## Customizing

- Change API: Update `API_URL` in `src/app.js` and adjust rendering in `renderList`.
- Styling: Edit `src/styles.css`.
- Error testing: Temporarily set `API_URL` to an invalid endpoint to see the error UI.

## License

MIT — see [LICENSE](./LICENSE).
