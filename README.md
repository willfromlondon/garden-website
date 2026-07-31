# Garden website

The static website for [garden.engineering](https://garden.engineering).

It uses plain HTML, CSS and JavaScript. Open `index.html` directly or serve the folder with any static file server.

The download buttons request the latest public release from `willfromlondon/garden` and select an installer for the visitor’s operating system. If no matching release is available, they link to the GitHub Releases page.

GitHub Pages deployment is configured in `.github/workflows/pages.yml`.
