# Memory Game

A React memory game built with Vite.

## Deploying to Netlify

`netlify.toml` configures Netlify to run `npm run build` and publish Vite's
`dist` directory. In Netlify, set the **Base directory** to the folder that
contains this project's `package.json` if the repository root is its parent.
For this workspace's repository layout, that is `Memory Game/memoryGame`.
If this project folder is the repository root, leave the Base directory blank.

Do not publish the project source folder directly. The production build places
the processed JavaScript modules and `favicon.svg` in `dist`.

## Local development

```sh
npm install
npm run dev
```

To create and preview a production build:

```sh
npm run build
npm run preview
```
