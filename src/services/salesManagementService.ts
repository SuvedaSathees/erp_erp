import { apiRequest } from "./apiClient";
import {
  getSalesOrdersFn,
  getSalesOrderByIdFn,
  getQuotationsFn,
  getPriceListsFn,
  getSalesKpisFn,
  createSalesOrderFn,
  updateSalesOrderStatusFn,
} from "@/lib/managementFns.server";

export async function fetchSalesOrders() {
  return apiRequest("/api/sales/orders", () => getSalesOrdersFn());
}

export async function fetchSalesOrderById(id: string) {
  return getSalesOrderByIdFn(id);
}

export async function fetchQuotations() {
  return apiRequest("/api/sales/quotations", () => getQuotationsFn());
}

export async function fetchPriceLists() {
  return apiRequest("/api/sales/price-lists", () => getPriceListsFn());
}

export async function fetchSalesKpis() {
  return apiRequest("/api/sales/kpis", () => getSalesKpisFn());
}

export async function createSalesOrder(data: Parameters<typeof createSalesOrderFn>[0]) {
  return createSalesOrderFn(data);
}

export async function updateSalesOrderStatus(data: Parameters<typeof updateSalesOrderStatusFn>[0]) {
  return updateSalesOrderStatusFn(data);
}

export async function loadSalesDashboardData() {
  const [kpis, orders, quotations] = await Promise.all([
    fetchSalesKpis(),
    fetchSalesOrders(),
    fetchQuotations(),
  ]);
  return { kpis, orders, quotations };
}
