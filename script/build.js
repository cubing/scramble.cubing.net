import { build } from "esbuild";
import { barelyServe } from "barely-a-dev-server";
import { injectManifest } from "workbox-build";

// TODO: Exclude `sw.ts`?
await barelyServe({
  entryRoot: "src",
  outDir: "dist/scramble.cubing.net",
  dev: false,
});

// 😕 Can't use module worker yet.
await build({
  entryPoints: ["src/sw.ts"],
  bundle: true,
  outfile: "dist/scramble.cubing.net/sw.js",
});

await injectManifest({
  globDirectory: "dist/scramble.cubing.net/",
  globPatterns: ["**/*.{js,ico,html,png,css,ts,ttf,txt}"],
  swDest: "dist/scramble.cubing.net/sw.js",
  swSrc: "dist/scramble.cubing.net/sw.js",
});
