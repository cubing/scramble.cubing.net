import type { barelyServe } from "barely-a-dev-server";

export const barelyServeOptions: Parameters<typeof barelyServe>[0] = {
  entryRoot: "src",
  outDir: "dist/web/scramble.cubing.net",
  bundleCSS: true,
  esbuildOptions: {
    loader: { ".woff": "copy", ".woff2": "copy" },
  },
};
