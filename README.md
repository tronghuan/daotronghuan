This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator. It serves as my personal space to build my personal brand, share technical guides, Japanese learning resources, and personal blogs.

## 🚀 Quick Start

We recommend that you begin by typing:

```bash
cd my-website
npm start
```

This command starts a local development server and opens up a browser window at `http://localhost:3000`. Most changes are reflected live without having to restart the server.

Happy building awesome websites!

---

## 🛠 Available Commands

Inside the project directory, you can run several commands:

### `npm install`
Installs all dependencies required for the project. Run this command first if you just cloned the repository.

### `npm start`
Starts the development server.

### `npm run build`
Bundles your website into static files for production. This command generates static content into the `build` directory and can be served using any static contents hosting service.

### `npm run serve`
Serves the built website locally. This is highly recommended to test your production build locally before deploying it to the live server.

### `npm run deploy`
Publishes the website to GitHub pages. 

If you are using GitHub Pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch:

- **Using SSH:**
  ```bash
  USE_SSH=true npm run deploy
  ```
- **Not using SSH:**
  ```bash
  GIT_USER=<Your GitHub username> npm run deploy
  ```