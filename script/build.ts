import { barelyServe } from "barely-a-dev-server";
import { build } from "esbuild";
import { injectManifest } from "workbox-build";
import { barelyServeOptions } from "./barelyServeOptions";

// TODO: Exclude `sw.ts`?
await barelyServe({ ...barelyServeOptions, dev: false });

// 😕 Can't use module worker yet.
await build({
  entryPoints: ["src/sw.ts"],
  bundle: true,
  outfile: "dist/web/scramble.cubing.net/sw.js",
});

await injectManifest({
  globDirectory: "dist/web/scramble.cubing.net/",
  globPatterns: ["**/*.{js,ico,html,png,css,ts,ttf,woff,woff2,txt}"],
  swDest: "dist/web/scramble.cubing.net/sw.js",
  swSrc: "dist/web/scramble.cubing.net/sw.js",
});
