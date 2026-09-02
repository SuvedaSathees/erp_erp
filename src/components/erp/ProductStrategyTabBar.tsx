import { cn } from "@/lib/utils";

export type ProductStrategyTabId = "overview" | "form" | "portfolio" | "roadmaps" | "reports";

export interface ProductStrategyTabItem {
  id: ProductStrategyTabId;
  label: string;
  tooltip: string;
  badge?: string | number;
}

export const PRODUCT_STRATEGY_TABS: ProductStrategyTabItem[] = [
  { id: "overview", label: "Overview", tooltip: "Product Strategy Dashboard & Executive Summary" },
  { id: "form", label: "Product Strategy Form", tooltip: "Create & Edit Product Strategy Record" },
  { id: "portfolio", label: "Strategy Portfolio", tooltip: "Product Strategy Records Register", badge: "12" },
  { id: "roadmaps", label: "Product Roadmaps", tooltip: "Linked Product Roadmaps & Release Milestones", badge: "8" },
  { id: "reports", label: "Strategy Reports", tooltip: "Financial Projections & AI Strategy Briefs" },
];

export function ProductStrategyTabBar(_props?: any) {
  return null;
}


export default ProductStrategyTabBar;
