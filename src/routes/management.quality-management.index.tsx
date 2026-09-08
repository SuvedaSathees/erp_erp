import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/management/quality-management/")({
  beforeLoad: () => {
    throw redirect({
      to: "/management/quality-management/overview",
    });
  },
});
