# a11y-flow — HTML Accessibility Checker

[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=20232A)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)](https://vite.dev/)
[![MIT License](https://img.shields.io/badge/License-MIT-2ea44f?style=flat)](LICENSE)

Check HTML for common accessibility issues, including missing labels, invalid ARIA references, keyboard focus problems, and heading structure. The audit runs in your browser; HTML is not uploaded to a server.

## Run locally

Requires Node.js 20.19 or later.

```sh
npm install
npm run dev
```

Open the local URL printed by Vite, paste HTML or choose a file, and select **Analyze HTML**.

Run `npm test` for the rule tests or `npm run build` to create the static app in `dist/`.

This is a markup check, not a substitute for testing the finished interface with a keyboard and assistive technology.
