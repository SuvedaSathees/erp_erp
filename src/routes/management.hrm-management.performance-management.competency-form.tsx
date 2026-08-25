import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/management/hrm-management/performance-management/competency-form")({
  component: RedirectToCompetencyForm,
});

export function RedirectToCompetencyForm() {
  return <Navigate to="/management/hrm-management/competency-form" replace />;
}

export default RedirectToCompetencyForm;
