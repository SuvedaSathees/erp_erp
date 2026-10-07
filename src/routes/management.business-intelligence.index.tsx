import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/management/business-intelligence/")({
  beforeLoad: () => {
    throw redirect({
      to: "/management/business-intelligence/overview",
    });
  },
});
