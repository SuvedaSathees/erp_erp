import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/management/marketing-management/partner-marketing"
)({
  beforeLoad: () => {
    throw redirect({ to: "/management/marketing-management/brand-management" });
  },
});
