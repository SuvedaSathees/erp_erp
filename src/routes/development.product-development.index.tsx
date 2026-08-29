import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/development/product-development/",
)({
  beforeLoad: () => {
    throw redirect({
      to: "/development/product-development/overview",
    });
  },
});
