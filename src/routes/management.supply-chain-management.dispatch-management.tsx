import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/management/supply-chain-management/dispatch-management")({
  beforeLoad: () => {
    throw redirect({ to: "/management/supply-chain-management/logistics" });
  },
});
