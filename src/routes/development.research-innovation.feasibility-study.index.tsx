import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/development/research-innovation/feasibility-study/")({
  beforeLoad: () => {
    throw redirect({ to: "/development/research-innovation/overview" });
  },
});
