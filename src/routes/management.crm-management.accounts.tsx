import { createFileRoute } from "@tanstack/react-router";
import { AccountManagementPage } from "@/routes/management.crm-management.account-management";

export const Route = createFileRoute("/management/crm-management/accounts")({
  head: () => ({
    meta: [
      { title: "Account Management Form ⭐ · CRM Management · Magnertia ERP" },
      {
        name: "description",
        content:
          "Account Management Form - Central CRM record for complete business relationship lifecycle, account health (82/100), revenue overview (₹2.48 Cr), opportunity pipeline funnel (₹1.10 Cr), contracts, support, key contacts, and account summary.",
      },
    ],
  }),
  component: AccountManagementPage,
});
