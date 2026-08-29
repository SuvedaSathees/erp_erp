export type ProductArchitectureTabId =
  | "overview"
  | "system_architecture"
  | "hardware_architecture"
  | "software_architecture"
  | "data_communication"
  | "integration"
  | "security_compliance"
  | "performance"
  | "ai_assessment"
  | "summary"
  | "attachments"
  | "review_approval";

export function ProductArchitectureTabBar({
  activeTab = "overview",
  onTabChange,
}: {
  activeTab?: ProductArchitectureTabId;
  onTabChange?: (tabId: ProductArchitectureTabId) => void;
}) {
  const tabs: { id: ProductArchitectureTabId; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "system_architecture", label: "System Architecture" },
    { id: "hardware_architecture", label: "Hardware Architecture" },
    { id: "software_architecture", label: "Software Architecture" },
    { id: "data_communication", label: "Data & Communication" },
    { id: "integration", label: "Integration" },
    { id: "security_compliance", label: "Security & Compliance" },
    { id: "performance", label: "Performance" },
    { id: "ai_assessment", label: "AI Assessment" },
    { id: "summary", label: "Summary" },
    { id: "attachments", label: "Attachments" },
    { id: "review_approval", label: "Review & Approval" },
  ];

  return (
    <div className="flex items-center gap-1 border-b border-border bg-white px-4 shadow-xs overflow-x-auto [&::-webkit-scrollbar]:hidden">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange?.(tab.id)}
            className={`shrink-0 whitespace-nowrap border-b-2 px-3 pb-3 pt-3 text-[13px] font-medium transition-all focus:outline-none cursor-pointer ${isActive
                ? "border-primary text-primary font-bold"
                : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
