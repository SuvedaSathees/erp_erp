import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/management/strategy-management/")({
  beforeLoad: () => {
    throw redirect({
      to: "/management/strategy-management/overview",
    });
  },
});
