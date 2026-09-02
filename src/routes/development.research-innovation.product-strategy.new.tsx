import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/development/research-innovation/product-strategy/new",
)({
  component: () => <Navigate to="/development/research-innovation/overview" replace />,
});

export const ProductStrategyFormPage = () => <Navigate to="/development/research-innovation/overview" replace />;
export const ProductStrategyPage = () => <Navigate to="/development/research-innovation/overview" replace />;
export default ProductStrategyPage;
