import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute(
  "/development/business-development/value-proposition-development/",
)({
  component: ValuePropositionIndexRedirect,
});

function ValuePropositionIndexRedirect() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate({ to: "/development/business-development/value-proposition-development" });
  }, [navigate]);
  return null;
}
