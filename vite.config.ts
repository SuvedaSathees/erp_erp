// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import type { Plugin } from "vite";

/**
 * Increases Vite SSR ModuleRunner invoke timeout and directly fulfills `fetchModule`
 * in-process to prevent RPC transport invoke timeouts.
 * On cold start on Windows, transforming large route graph modules like routeTree.gen.ts
 * can exceed 60s. Setting transport.timeout and dispatching directly prevents spurious 500 timeouts.
 */
function ssrTransportTimeoutPlugin(timeoutMs = 300000): Plugin {
  function patchRunner(runner: any, env: any) {
    if (!runner?.transport || runner.transport.__timeoutPatched) return;
    runner.transport.__timeoutPatched = true;

    if (runner.transport.timeout == null || runner.transport.timeout < timeoutMs) {
      runner.transport.timeout = timeoutMs;
    }

    const origInvoke = runner.transport.invoke?.bind(runner.transport);
    runner.transport.invoke = async (name: string, data: any[]) => {
      if (name === "fetchModule" && typeof env.fetchModule === "function") {
        return await env.fetchModule(data[0], data[1], data[2]);
      }
      if (name === "getBuiltins" && env.config?.resolve?.builtins) {
        return env.config.resolve.builtins.map((builtin: any) =>
          typeof builtin === "string"
            ? { type: "string", value: builtin }
            : { type: "RegExp", source: builtin.source, flags: builtin.flags }
        );
      }
      if (origInvoke) {
        return await origInvoke(name, data);
      }
    };
  }

  function patchEnvironment(env: any) {
    if (!env || env.__transportPatched) return;
    env.__transportPatched = true;

    if (env._runnerOptions) {
      env._runnerOptions.transport = {
        ...env._runnerOptions.transport,
        timeout: timeoutMs,
      };
    }

    if (env._runner) {
      patchRunner(env._runner, env);
    }

    const proto = Object.getPrototypeOf(env);
    const desc =
      Object.getOwnPropertyDescriptor(proto, "runner") ||
      Object.getOwnPropertyDescriptor(env, "runner");

    if (desc?.get) {
      const origGet = desc.get;
      Object.defineProperty(env, "runner", {
        configurable: true,
        enumerable: true,
        get() {
          const runner = origGet.call(this);
          patchRunner(runner, this);
          return runner;
        },
      });
    }
  }

  function patchAllEnvironments(server: any) {
    const envs = [
      (server as any).environments?.ssr,
      (server as any).environments?.server,
      ...Object.values((server as any).environments || {}),
    ];
    for (const env of envs) {
      if (env) patchEnvironment(env);
    }
  }

  return {
    name: "ssr-transport-timeout",
    configureServer(server) {
      patchAllEnvironments(server);
      return () => {
        patchAllEnvironments(server);
      };
    },
  };
}

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  nitro: {
    preset: "node-server",
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
        "@tanstack/react-router",
        "@tanstack/react-query",
        "@dnd-kit/core",
        "@dnd-kit/sortable",
        "@dnd-kit/utilities",
        "@dnd-kit/modifiers",
        "recharts",
        "lucide-react",
        "clsx",
        "tailwind-merge",
        "class-variance-authority",
        "date-fns",
        "cmdk",
        "sonner",
        "@radix-ui/react-accordion",
        "@radix-ui/react-alert-dialog",
        "@radix-ui/react-avatar",
        "@radix-ui/react-checkbox",
        "@radix-ui/react-collapsible",
        "@radix-ui/react-context-menu",
        "@radix-ui/react-dialog",
        "@radix-ui/react-dropdown-menu",
        "@radix-ui/react-hover-card",
        "@radix-ui/react-label",
        "@radix-ui/react-popover",
        "@radix-ui/react-progress",
        "@radix-ui/react-radio-group",
        "@radix-ui/react-scroll-area",
        "@radix-ui/react-select",
        "@radix-ui/react-separator",
        "@radix-ui/react-slider",
        "@radix-ui/react-slot",
        "@radix-ui/react-switch",
        "@radix-ui/react-tabs",
        "@radix-ui/react-tooltip",
      ],
    },
    build: {
      rollupOptions: {
        external: ["mongodb"],
      },
    },
  },
});
