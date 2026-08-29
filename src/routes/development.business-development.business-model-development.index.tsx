import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute(
  "/development/business-development/business-model-development/",
)({
  component: BusinessModelIndexRedirect,
});

function BusinessModelIndexRedirect() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate({ to: "/development/business-development/business-model-development" });
  }, [navigate]);
  return null;
}
