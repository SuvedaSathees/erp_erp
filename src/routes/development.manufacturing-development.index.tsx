import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/development/manufacturing-development/",
)({
  beforeLoad: () => {
    throw redirect({
      to: "/development/manufacturing-development/overview",
    });
  },
});
