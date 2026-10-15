# a11y-flow

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
