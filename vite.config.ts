// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import type { Plugin } from "vite";

/**
 * Increases Vite SSR ModuleRunner invoke timeout from default 60s to 300s.
 * On cold start on Windows, transforming large route graph modules like routeTree.gen.ts
 * can exceed 60s. Setting transport.timeout to 300s prevents spurious 500 timeouts.
 */
function ssrTransportTimeoutPlugin(timeoutMs = 300000): Plugin {
  return {
    name: "ssr-transport-timeout",
    configureServer(server) {
      const serverEnv = (server as any).environments?.server;
      if (serverEnv) {
        const proto = Object.getPrototypeOf(serverEnv);
        const desc =
          Object.getOwnPropertyDescriptor(proto, "runner") ||
          Object.getOwnPropertyDescriptor(serverEnv, "runner");
        if (desc?.get) {
          const origGet = desc.get;
          Object.defineProperty(serverEnv, "runner", {
            configurable: true,
            enumerable: true,
            get() {
              const runner = origGet.call(this);
              if (runner?.transport && (runner.transport.timeout == null || runner.transport.timeout < timeoutMs)) {
                runner.transport.timeout = timeoutMs;
              }
              return runner;
            },
          });
        }
      }
    },
  };
}

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    plugins: [ssrTransportTimeoutPlugin()],
    resolve: {
      dedupe: ["react", "react-dom"],
    },
    optimizeDeps: {
      exclude: ["mongodb"],
      holdUntilCrawlEnd: false,
      include: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "@dnd-kit/core",
        "@dnd-kit/sortable",
        "@dnd-kit/utilities",
        "@dnd-kit/modifiers",
        "recharts",
        "lucide-react",
        "clsx",
        "tailwind-merge",
      ],
    },
    build: {
      rollupOptions: {
        external: ["mongodb"],
      },
    },
  },
});
