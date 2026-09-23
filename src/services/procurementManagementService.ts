import { apiRequest } from "./apiClient";
import {
  getPurchaseOrdersFn,
  getPurchaseOrderByIdFn,
  getSuppliersFn,
  getGoodsReceiptsFn,
  getProcurementKpisFn,
  createPurchaseOrderFn,
  updatePurchaseOrderStatusFn,
  createSupplierFn,
} from "@/lib/managementFns.server";

export async function fetchPurchaseOrders() {
  return apiRequest("/api/procurement/purchase-orders", () => getPurchaseOrdersFn());
}

export async function fetchPurchaseOrderById(id: string) {
  return getPurchaseOrderByIdFn(id);
}

export async function fetchSuppliers() {
  return apiRequest("/api/procurement/suppliers", () => getSuppliersFn());
}

export async function fetchGoodsReceipts() {
  return apiRequest("/api/procurement/goods-receipts", () => getGoodsReceiptsFn());
}

export async function fetchProcurementKpis() {
  return apiRequest("/api/procurement/kpis", () => getProcurementKpisFn());
}

export async function createPurchaseOrder(data: Parameters<typeof createPurchaseOrderFn>[0]) {
  return createPurchaseOrderFn(data);
}

export async function updatePurchaseOrderStatus(data: Parameters<typeof updatePurchaseOrderStatusFn>[0]) {
  return updatePurchaseOrderStatusFn(data);
}

export async function createSupplier(data: Parameters<typeof createSupplierFn>[0]) {
  return createSupplierFn(data);
}

export async function loadProcurementDashboardData() {
  const [kpis, purchaseOrders, suppliers, goodsReceipts] = await Promise.all([
    fetchProcurementKpis(),
    fetchPurchaseOrders(),
    fetchSuppliers(),
    fetchGoodsReceipts(),
  ]);
  return { kpis, purchaseOrders, suppliers, goodsReceipts };
}
