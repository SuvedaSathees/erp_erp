import { apiRequest } from "./apiClient";
import {
  getCrmLeadsFn,
  getCrmOpportunitiesFn,
  getCrmAccountsFn,
  getCrmContactsFn,
  getSupportTicketsFn,
  getCrmKpisFn,
  createCrmLeadFn,
  updateCrmLeadFn,
  deleteCrmLeadFn,
  createCrmOpportunityFn,
  createCrmAccountFn,
  createCrmContactFn,
  createSupportTicketFn,
  updateSupportTicketFn,
} from "@/lib/managementFns.server";

export async function fetchLeads() {
  return apiRequest("/api/crm/leads", () => getCrmLeadsFn());
}

export async function fetchOpportunities() {
  return apiRequest("/api/crm/opportunities", () => getCrmOpportunitiesFn());
}

export async function fetchAccounts() {
  return apiRequest("/api/crm/accounts", () => getCrmAccountsFn());
}

export async function fetchContacts() {
  return apiRequest("/api/crm/contacts", () => getCrmContactsFn());
}

export async function fetchSupportTickets() {
  return apiRequest("/api/crm/support-tickets", () => getSupportTicketsFn());
}

export async function fetchCrmKpis() {
  return apiRequest("/api/crm/kpis", () => getCrmKpisFn());
}

export async function createLead(data: Parameters<typeof createCrmLeadFn>[0]) {
  return createCrmLeadFn(data);
}

export async function updateLead(data: Parameters<typeof updateCrmLeadFn>[0]) {
  return updateCrmLeadFn(data);
}

export async function deleteLead(id: string) {
  return deleteCrmLeadFn(id);
}

export async function createOpportunity(data: Parameters<typeof createCrmOpportunityFn>[0]) {
  return createCrmOpportunityFn(data);
}

export async function createAccount(data: Parameters<typeof createCrmAccountFn>[0]) {
  return createCrmAccountFn(data);
}

export async function createContact(data: Parameters<typeof createCrmContactFn>[0]) {
  return createCrmContactFn(data);
}

export async function createTicket(data: Parameters<typeof createSupportTicketFn>[0]) {
  return createSupportTicketFn(data);
}

export async function updateTicket(data: Parameters<typeof updateSupportTicketFn>[0]) {
  return updateSupportTicketFn(data);
}

export async function loadCrmDashboardData() {
  const [kpis, leads, opportunities, accounts, tickets] = await Promise.all([
    fetchCrmKpis(),
    fetchLeads(),
    fetchOpportunities(),
    fetchAccounts(),
    fetchSupportTickets(),
  ]);
  return { kpis, leads, opportunities, accounts, tickets };
}
