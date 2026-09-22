import { apiRequest } from "./apiClient";
import {
  getEmployeesFn,
  getDepartmentsFn,
  getLeaveRequestsFn,
  getAttendanceFn,
  getPayrollRecordsFn,
  getHrmKpisFn,
  createEmployeeFn,
  updateEmployeeFn,
  deleteEmployeeFn,
  createLeaveRequestFn,
  updateLeaveRequestFn,
  createDepartmentFn,
} from "@/lib/managementFns.server";

export async function fetchEmployees() {
  return apiRequest("/api/hrm/employees", () => getEmployeesFn());
}

export async function fetchDepartments() {
  return apiRequest("/api/hrm/departments", () => getDepartmentsFn());
}

export async function fetchLeaveRequests() {
  return apiRequest("/api/hrm/leave-requests", () => getLeaveRequestsFn());
}

export async function fetchAttendance() {
  return apiRequest("/api/hrm/attendance", () => getAttendanceFn());
}

export async function fetchPayrollRecords() {
  return apiRequest("/api/hrm/payroll", () => getPayrollRecordsFn());
}

export async function fetchHrmKpis() {
  return apiRequest("/api/hrm/kpis", () => getHrmKpisFn());
}

export async function createEmployee(data: Parameters<typeof createEmployeeFn>[0]) {
  return createEmployeeFn(data);
}

export async function updateEmployee(data: Parameters<typeof updateEmployeeFn>[0]) {
  return updateEmployeeFn(data);
}

export async function deleteEmployee(id: string) {
  return deleteEmployeeFn(id);
}

export async function createLeaveRequest(data: Parameters<typeof createLeaveRequestFn>[0]) {
  return createLeaveRequestFn(data);
}

export async function updateLeaveRequest(data: Parameters<typeof updateLeaveRequestFn>[0]) {
  return updateLeaveRequestFn(data);
}

export async function createDepartment(data: Parameters<typeof createDepartmentFn>[0]) {
  return createDepartmentFn(data);
}

export async function loadHrmDashboardData() {
  const [kpis, employees, departments, leaveRequests, payroll] = await Promise.all([
    fetchHrmKpis(),
    fetchEmployees(),
    fetchDepartments(),
    fetchLeaveRequests(),
    fetchPayrollRecords(),
  ]);
  return { kpis, employees, departments, leaveRequests, payroll };
}
