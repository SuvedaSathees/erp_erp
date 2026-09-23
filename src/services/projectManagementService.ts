import { apiRequest } from "./apiClient";
import {
  getProjectsFn,
  getProjectByIdFn,
  getProjectTasksFn,
  getMilestonesFn,
  getTimeEntriesFn,
  getProjectKpisFn,
  createProjectFn,
  updateProjectFn,
  createProjectTaskFn,
  updateProjectTaskFn,
} from "@/lib/managementFns.server";

export async function fetchProjects() {
  return apiRequest("/api/projects", () => getProjectsFn());
}

export async function fetchProjectById(id: string) {
  return getProjectByIdFn(id);
}

export async function fetchProjectTasks(projectId: string) {
  return getProjectTasksFn(projectId);
}

export async function fetchMilestones(projectId: string) {
  return getMilestonesFn(projectId);
}

export async function fetchTimeEntries() {
  return apiRequest("/api/projects/time-entries", () => getTimeEntriesFn());
}

export async function fetchProjectKpis() {
  return apiRequest("/api/projects/kpis", () => getProjectKpisFn());
}

export async function createProject(data: Parameters<typeof createProjectFn>[0]) {
  return createProjectFn(data);
}

export async function updateProject(data: Parameters<typeof updateProjectFn>[0]) {
  return updateProjectFn(data);
}

export async function createTask(data: Parameters<typeof createProjectTaskFn>[0]) {
  return createProjectTaskFn(data);
}

export async function updateTask(data: Parameters<typeof updateProjectTaskFn>[0]) {
  return updateProjectTaskFn(data);
}

export async function loadProjectDashboardData() {
  const [kpis, projects, timeEntries] = await Promise.all([
    fetchProjectKpis(),
    fetchProjects(),
    fetchTimeEntries(),
  ]);
  return { kpis, projects, timeEntries };
}
