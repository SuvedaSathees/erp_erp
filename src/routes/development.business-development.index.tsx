import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/development/business-development/",
)({
  beforeLoad: () => {
    throw redirect({
      to: "/development/business-development/overview",
    });
  },
});
