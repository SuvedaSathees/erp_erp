import { apiRequest } from "./apiClient";
import {
  getCapaRecordsFn,
  getNcrRecordsFn,
  getInspectionRecordsFn,
  getQualityKpisFn,
  createCapaRecordFn,
  updateCapaRecordFn,
  createNcrRecordFn,
} from "@/lib/managementFns.server";

export async function fetchCapaRecords() {
  return apiRequest("/api/quality/capa", () => getCapaRecordsFn());
}

export async function fetchNcrRecords() {
  return apiRequest("/api/quality/ncr", () => getNcrRecordsFn());
}

export async function fetchInspectionRecords() {
  return apiRequest("/api/quality/inspections", () => getInspectionRecordsFn());
}

export async function fetchQualityKpis() {
  return apiRequest("/api/quality/kpis", () => getQualityKpisFn());
}

export async function createCapa(data: Parameters<typeof createCapaRecordFn>[0]) {
  return createCapaRecordFn(data);
}

export async function updateCapa(data: Parameters<typeof updateCapaRecordFn>[0]) {
  return updateCapaRecordFn(data);
}

export async function createNcr(data: Parameters<typeof createNcrRecordFn>[0]) {
  return createNcrRecordFn(data);
}

export async function loadQualityDashboardData() {
  const [kpis, capas, ncrs, inspections] = await Promise.all([
    fetchQualityKpis(),
    fetchCapaRecords(),
    fetchNcrRecords(),
    fetchInspectionRecords(),
  ]);
  return { kpis, capas, ncrs, inspections };
}
