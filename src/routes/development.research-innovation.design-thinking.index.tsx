import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/development/research-innovation/design-thinking/")({
  beforeLoad: () => {
    throw redirect({ to: "/development/research-innovation/overview" });
  },
});
