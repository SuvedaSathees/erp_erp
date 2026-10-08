// Magnertia ERP - Surveillance Management
// Management → Security Management → Physical Security → Surveillance
// Aligned with Screenshot 3 & MAICW Specification

import React, { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Camera,
  Video,
  Shield,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  HardDrive,
  Eye,
  Sliders,
  CheckCircle2,
  Clock,
  Plus,
  RefreshCw,
  Maximize2,
  Play,
  Pause,
  Grid,
  Radio,
  Tv,
  Save,
  Search,
  ChevronRight,
  ExternalLink,
  Layers,
  MapPin,
  X,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { AppShell } from "@/components/erp/AppShell";
import { SecurityManagementTabBar } from "@/components/erp/SecurityManagementTabBar";
import { SecuritySubmoduleHeader } from "@/components/erp/SecuritySubmoduleHeader";
import { ProductScoreBanner } from "@/components/erp/ProductScoreBanner";
import { cn } from "@/lib/utils";
import {
  mockSurveillanceCameras,
  mockSurveillanceAlerts,
  mockSurveillanceIncidents,
  type SurveillanceCamera,
} from "@/services/securityManagementService";
import { toast } from "sonner";

import { useModuleDataset } from "@/services/moduleDatasetService";
import { usePersistentState } from "@/services/moduleDatasetService";
import { QuickCreateDialog } from "@/components/erp/QuickCreateDialog";
import { exportRecords } from "@/lib/recordExport";
export const Route = createFileRoute(
  "/management/security-management/surveillance"
)({
  head: () => ({
    meta: [
      { title: "Surveillance Management · Magnertia ERP" },
      {
        name: "description",
        content:
          "24/7 CCTV surveillance matrix, IP camera health monitoring, NVR/DVR storage retention, AI perimeter analytics, and physical security control room.",
      },
    ],
  }),
  component: SurveillanceManagementPage,
});

const EVENT_TREND_DATA = [
  { day: "15 Sep", motion: 38, intrusion: 12, tampering: 5, vehicle: 22, other: 8 },
  { day: "17 Sep", motion: 42, intrusion: 15, tampering: 4, vehicle: 25, other: 9 },
  { day: "19 Sep", motion: 45, intrusion: 14, tampering: 6, vehicle: 24, other: 11 },
  { day: "21 Sep", motion: 40, intrusion: 10, tampering: 3, vehicle: 20, other: 7 },
  { day: "23 Sep", motion: 48, intrusion: 18, tampering: 7, vehicle: 28, other: 12 },
  { day: "25 Sep", motion: 52, intrusion: 16, tampering: 5, vehicle: 30, other: 10 },
  { day: "27 Sep", motion: 46, intrusion: 14, tampering: 4, vehicle: 26, other: 8 },
  { day: "28 Sep", motion: 55, intrusion: 19, tampering: 6, vehicle: 32, other: 11 },
];

const ZONE_STATUS_DATA = [
  { zone: "Main Gate", online: 10, offline: 0, maintenance: 0, total: 10 },
  { zone: "Parking", online: 14, offline: 1, maintenance: 1, total: 16 },
  { zone: "Office", online: 12, offline: 0, maintenance: 0, total: 12 },
  { zone: "Manufacturing", online: 20, offline: 1, maintenance: 1, total: 22 },
  { zone: "R&D Lab", online: 12, offline: 0, maintenance: 0, total: 12 },
  { zone: "Warehouse", online: 16, offline: 0, maintenance: 1, total: 17 },
  { zone: "Perimeter", online: 12, offline: 0, maintenance: 0, total: 12 },
];

const STORAGE_DATA = [
  { name: "Used Storage", value: 4.3, color: "#f59e0b" },
  { name: "Free Storage", value: 1.7, color: "#10b981" },
];

const CAMERA_HEALTH_DATA = [
  { name: "Online", value: 94, color: "#10b981" },
  { name: "Offline", value: 2, color: "#ef4444" },
  { name: "Maintenance", value: 3, color: "#f59e0b" },
];

const PAGE_DATASET = { EVENT_TREND_DATA, ZONE_STATUS_DATA };

function SurveillanceManagementPage() {
  const { EVENT_TREND_DATA, ZONE_STATUS_DATA } = useModuleDataset("security-management.surveillance", "Surveillance Management", PAGE_DATASET);
  const [newCameraOpen, setNewCameraOpen] = useState(false);
  const [cameras, setCameras] = usePersistentState<SurveillanceCamera[]>("security-management.surveillance", "Surveillance Management", "cameras", mockSurveillanceCameras);
  const [selectedCamera, setSelectedCamera] = useState<SurveillanceCamera>(
    mockSurveillanceCameras[3] || mockSurveillanceCameras[0] // CAM-PRK-04 default
  );

  // Form State
  const [formName, setFormName] = useState(selectedCamera.cameraName);
  const [formType, setFormType] = useState(selectedCamera.cameraType);
  const [formManufacturer, setFormManufacturer] = useState(selectedCamera.manufacturer);
  const [formModel, setFormModel] = useState(selectedCamera.model);
  const [formStatus, setFormStatus] = useState(selectedCamera.status);
  const [formZone, setFormZone] = useState(selectedCamera.zone);
  const [formCriticality, setFormCriticality] = useState(selectedCamera.criticality);
  const [formClassification, setFormClassification] = useState(selectedCamera.securityClassification);

  // Control Room view states
  const [selectedZoneFilter, setSelectedZoneFilter] = useState("All Zones");
  const [viewMode, setViewMode] = useState<"Camera View" | "PTZ Control" | "Video Search">("Camera View");
  const [mapViewMode, setMapViewMode] = useState<"Map View" | "Floor View">("Map View");


  const handleSelectCamera = (cam: SurveillanceCamera) => {
    setSelectedCamera(cam);
    setFormName(cam.cameraName);
    setFormType(cam.cameraType);
    setFormManufacturer(cam.manufacturer);
    setFormModel(cam.model);
    setFormStatus(cam.status);
    setFormZone(cam.zone);
    setFormCriticality(cam.criticality);
    setFormClassification(cam.securityClassification);
    toast.info(`Selected ${cam.cameraCode} (${cam.cameraName}) for inspection.`);
  };

  const handleUpdateCamera = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = cameras.map((c) =>
      c.id === selectedCamera.id
        ? {
            ...c,
            cameraName: formName,
            cameraType: formType,
            manufacturer: formManufacturer,
            model: formModel,
            status: formStatus,
            zone: formZone,
            criticality: formCriticality,
            securityClassification: formClassification,
          }
        : c
    );
    setCameras(updated);
    toast.success(`Camera record [${selectedCamera.cameraCode}] updated in Master Register.`);
  };

  return (
    <AppShell
      title="Surveillance Management"
      breadcrumb="Management > Security Management > Surveillance"
      description="IP CCTV camera network oversight, NVR/DVR storage health, AI video analytics, motion and tamper alerting, and continuous perimeter monitoring."
      tabs={<SecurityManagementTabBar />}
    >
      <div className="space-y-4 pb-16">
        {/* Executive Submodule Header */}
        <SecuritySubmoduleHeader
          icon={Camera}
          title="Surveillance Management"
          code="SUR-2026-001"
          status="Active"
          subtitle="High-definition video telemetry, AI optical tripwires, retention compliance, camera status diagnostics, and SOC video wall integration."
          slogan="Monitor. Detect. Respond. Secure Facilities."
          bannerQuote="Integrated real-time video intelligence and automated tamper alerts protecting Coimbatore, Namakkal, and remote charging hubs."
          primaryActionLabel="+ Add Camera Device"
          onPrimaryAction={() => setNewCameraOpen(true)}
          onGenerateReport={() => exportRecords("CCTV Camera Register", cameras.map(({ liveImage, ...c }) => c), "pdf")}
          onMoreActions={(act) => toast.info(`Action: ${act}`)}
        />

        {/* Executive 7-Gauge Circular Score Banner matching Screenshot */}
        <ProductScoreBanner submoduleKey="surveillance" />


        {/* 8 KPI Stat Cards Matching Screenshot 3 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <span className="text-[11px] font-medium text-slate-500">Total Cameras</span>
            <div className="text-xl font-bold text-slate-900 mt-1">96</div>
            <span className="text-[10px] text-emerald-600 font-semibold mt-0.5">↑ 2% vs prev qtr</span>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <span className="text-[11px] font-medium text-slate-500">Cameras Online</span>
            <div className="text-xl font-bold text-emerald-600 mt-1">94</div>
            <span className="text-[10px] text-emerald-600 font-semibold mt-0.5">98% Uptime</span>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <span className="text-[11px] font-medium text-slate-500">Cameras Offline</span>
            <div className="text-xl font-bold text-rose-600 mt-1">2</div>
            <span className="text-[10px] text-rose-600 font-semibold mt-0.5">Fault detected</span>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <span className="text-[11px] font-medium text-slate-500">Active Alerts</span>
            <div className="text-xl font-bold text-amber-600 mt-1">7</div>
            <span className="text-[10px] text-amber-600 font-semibold mt-0.5">↓ 30%</span>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <span className="text-[11px] font-medium text-slate-500">Open Incidents</span>
            <div className="text-xl font-bold text-rose-600 mt-1">5</div>
            <span className="text-[10px] text-emerald-600 font-semibold mt-0.5">↓ 44%</span>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <span className="text-[11px] font-medium text-slate-500">Under Maintenance</span>
            <div className="text-xl font-bold text-purple-600 mt-1">3</div>
            <span className="text-[10px] text-slate-400 font-semibold mt-0.5">Routine clean</span>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <span className="text-[11px] font-medium text-slate-500">Storage Utilization</span>
            <div className="text-xl font-bold text-slate-900 mt-1">72%</div>
            <span className="text-[10px] text-amber-600 font-semibold mt-0.5">4.3 TB / 6 TB</span>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <span className="text-[11px] font-medium text-slate-500">Coverage Compliance</span>
            <div className="text-xl font-bold text-emerald-600 mt-1">96.4%</div>
            <span className="text-[10px] text-emerald-600 font-semibold mt-0.5">↑ 2%</span>
          </div>
        </div>

        {/* Upper Grid: Facility Map + Zone Status + Recent Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Facility Map & Camera Locations */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-600" />
                <h3 className="text-xs font-bold text-slate-900">
                  Facility Map & Camera Locations
                </h3>
              </div>
              <div className="flex items-center gap-1.5 text-[11px]">
                <button
                  onClick={() => setMapViewMode("Map View")}
                  className={cn(
                    "px-2 py-0.5 rounded font-semibold transition-colors",
                    mapViewMode === "Map View"
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  )}
                >
                  Map View
                </button>
                <button
                  onClick={() => setMapViewMode("Floor View")}
                  className={cn(
                    "px-2 py-0.5 rounded font-semibold transition-colors",
                    mapViewMode === "Floor View"
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  )}
                >
                  Floor View
                </button>
              </div>
            </div>

            {/* Simulated Satellite Facility Image with Pin Overlays */}
            <div className="relative h-48 w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-900">
              <img
                src="https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80"
                alt="Plant 2 Coimbatore Aerial Layout"
                className="h-full w-full object-cover opacity-80"
              />
              {/* Overlay Pills */}
              <div className="absolute top-2 left-2 bg-slate-900/80 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-xs font-semibold">
                Plant 2 - Coimbatore
              </div>
              <div className="absolute top-2 right-2 bg-slate-900/80 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-xs flex items-center gap-2">
                <span className="text-emerald-400">● 94 Online</span>
                <span className="text-rose-400">● 2 Offline</span>
                <span className="text-amber-400">● 3 Maint</span>
              </div>

              {/* Pins */}
              <div className="absolute top-1/4 left-1/3 p-1 rounded-full bg-emerald-500 ring-4 ring-emerald-500/30 text-white text-[9px] font-bold shadow-lg cursor-pointer" title="Office: 12 Cameras">
                Off
              </div>
              <div className="absolute top-1/2 left-1/2 p-1 rounded-full bg-emerald-500 ring-4 ring-emerald-500/30 text-white text-[9px] font-bold shadow-lg cursor-pointer" title="Factory: 22 Cameras">
                Mfg
              </div>
              <div className="absolute bottom-1/4 right-1/4 p-1 rounded-full bg-emerald-500 ring-4 ring-emerald-500/30 text-white text-[9px] font-bold shadow-lg cursor-pointer" title="Charging Station: 4 Cameras">
                EV
              </div>
              <div className="absolute top-1/3 right-1/3 p-1 rounded-full bg-rose-500 ring-4 ring-rose-500/30 text-white text-[9px] font-bold shadow-lg cursor-pointer animate-pulse" title="CAM-15 Battery Storage Vault Offline">
                !
              </div>
            </div>

            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
              <span>96 Fixed, Thermal & PTZ units monitored</span>
              <button
                onClick={() => toast.info("Opening interactive CAD floor plan view")}
                className="text-blue-600 font-semibold hover:underline"
              >
                Expand CAD Map →
              </button>
            </div>
          </div>

          {/* Camera Status by Zone */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-slate-900">Camera Status by Zone</h3>
              <span className="text-[11px] text-blue-600 font-semibold cursor-pointer">View All</span>
            </div>
            <div className="space-y-2">
              {ZONE_STATUS_DATA.map((z) => (
                <div key={z.zone} className="space-y-0.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-700 font-medium">{z.zone}</span>
                    <span className="font-bold text-slate-900">
                      {z.online} / {z.total}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
                    <div
                      className="h-full bg-emerald-500"
                      style={{ width: `${(z.online / z.total) * 100}%` }}
                    />
                    {z.offline > 0 && (
                      <div
                        className="h-full bg-rose-500"
                        style={{ width: `${(z.offline / z.total) * 100}%` }}
                      />
                    )}
                    {z.maintenance > 0 && (
                      <div
                        className="h-full bg-amber-500"
                        style={{ width: `${(z.maintenance / z.total) * 100}%` }}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
              <span className="text-emerald-700">● Online</span>
              <span className="text-rose-700">● Offline</span>
              <span className="text-amber-700">● Maintenance</span>
            </div>
          </div>

          {/* Recent Alerts & Incident Status */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-slate-900">Recent Surveillance Alerts</h3>
              <button
                onClick={() => toast.info("Opening complete alarms & events ledger")}
                className="text-[11px] text-blue-600 font-semibold hover:underline"
              >
                View All
              </button>
            </div>
            <div className="space-y-2">
              {mockSurveillanceAlerts.map((al) => (
                <div
                  key={al.id}
                  className="p-2 rounded-lg border border-slate-100 hover:border-slate-300 transition-colors flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                      <AlertTriangle className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{al.event}</div>
                      <div className="text-[10px] text-slate-500">
                        {al.cameraCode} • {al.time}
                      </div>
                    </div>
                  </div>
                  <span
                    className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded",
                      al.severity === "High"
                        ? "bg-rose-50 text-rose-700"
                        : "bg-amber-50 text-amber-700"
                    )}
                  >
                    {al.severity}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Security Guard Dispatched: <strong>Yes</strong></span>
              <span className="text-emerald-600 font-semibold">Real-Time Sync</span>
            </div>
          </div>
        </div>

        {/* Middle Row: Event Trends + Storage Donut + Camera Health */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Event Trends Chart */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs md:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-900">Event Trends (Last 14 Days)</h3>
              <div className="flex items-center gap-3 text-[10px]">
                <span className="text-blue-600 font-semibold">● Motion</span>
                <span className="text-rose-600 font-semibold">● Intrusion</span>
                <span className="text-amber-600 font-semibold">● Tampering</span>
                <span className="text-emerald-600 font-semibold">● Vehicle</span>
              </div>
            </div>
            <div className="h-40 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={EVENT_TREND_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 9 }} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 9 }} stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      color: "#fff",
                      borderRadius: "8px",
                      fontSize: "11px",
                    }}
                  />
                  <Line type="monotone" dataKey="motion" stroke="#2563eb" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="intrusion" stroke="#ef4444" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="tampering" stroke="#f59e0b" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="vehicle" stroke="#10b981" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Storage & Camera Health Gauges */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-xs font-bold text-slate-900">Storage & Health Status</h3>
              <span className="text-[11px] text-slate-400">NVR Array #1</span>
            </div>
            <div className="grid grid-cols-2 gap-3 items-center">
              {/* Storage */}
              <div className="text-center p-2 rounded-lg bg-slate-50 border border-slate-100">
                <HardDrive className="h-5 w-5 text-amber-500 mx-auto mb-1" />
                <div className="text-lg font-bold text-slate-900">72%</div>
                <div className="text-[10px] text-slate-500">4.3 TB / 6.0 TB</div>
                <div className="text-[9px] text-amber-700 font-semibold mt-0.5">90-Day Retention</div>
              </div>
              {/* Health */}
              <div className="text-center p-2 rounded-lg bg-emerald-50/60 border border-emerald-100">
                <Camera className="h-5 w-5 text-emerald-600 mx-auto mb-1" />
                <div className="text-lg font-bold text-emerald-700">96 Total</div>
                <div className="text-[10px] text-emerald-800">94 Online (98%)</div>
                <div className="text-[9px] text-rose-600 font-semibold mt-0.5">2 Offline (Fault)</div>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
              <span>NVR Redundancy: <strong>RAID 6 Active</strong></span>
              <button
                onClick={() => toast.success("Storage diagnostics report verified.")}
                className="text-blue-600 font-semibold hover:underline"
              >
                Disk Health →
              </button>
            </div>
          </div>
        </div>

        {/* BOTTOM ROW: Live Surveillance Control Room (2/3) + Camera Master Form (1/3) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Live Surveillance - Control Room Matrix (16 Cameras) */}
          <div className="lg:col-span-2 bg-slate-950 text-white rounded-xl border border-slate-800 p-4 shadow-xl flex flex-col justify-between space-y-3">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Tv className="h-4 w-4 text-emerald-400" />
                <h3 className="text-xs font-bold text-white">
                  Live Surveillance - Control Room Matrix
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={selectedZoneFilter}
                  onChange={(e) => setSelectedZoneFilter(e.target.value)}
                  className="bg-slate-900 border border-slate-700 text-slate-200 rounded px-2 py-1 text-xs focus:outline-none"
                >
                  <option value="All Zones">All Zones (16 Cams)</option>
                  <option value="Main Gate">Main Gate</option>
                  <option value="Parking">Parking</option>
                  <option value="Office">Office</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Warehouse">Warehouse</option>
                </select>

                <div className="flex items-center bg-slate-900 rounded p-0.5 border border-slate-700 text-xs">
                  {(["Camera View", "PTZ Control", "Video Search"] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => {
                        setViewMode(m);
                        toast.info(`Switched control mode to ${m}`);
                      }}
                      className={cn(
                        "px-2 py-0.5 rounded text-[10px] font-semibold transition-colors",
                        viewMode === m ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                      )}
                    >
                      {m}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => toast.info("Full screen control room mode activated.")}
                  className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
                  title="Fullscreen"
                >
                  <Maximize2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* 16-Camera Tile Matrix Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {cameras.map((cam) => {
                const isSelected = selectedCamera.id === cam.id;
                return (
                  <div
                    key={cam.id}
                    onClick={() => handleSelectCamera(cam)}
                    className={cn(
                      "group relative rounded-lg overflow-hidden border transition-all cursor-pointer bg-slate-900 aspect-video flex flex-col justify-between p-1.5",
                      isSelected
                        ? "border-blue-500 ring-2 ring-blue-500/50 shadow-md"
                        : "border-slate-800 hover:border-slate-700"
                    )}
                  >
                    {/* Live Snapshot Mock */}
                    <img
                      src={cam.liveImage}
                      alt={cam.cameraName}
                      className={cn(
                        "absolute inset-0 h-full w-full object-cover transition-opacity",
                        cam.status === "Offline" ? "opacity-20 grayscale" : "opacity-70 group-hover:opacity-90"
                      )}
                    />

                    {/* Offline / Maintenance Overlay */}
                    {cam.status === "Offline" && (
                      <div className="absolute inset-0 flex items-center justify-center bg-rose-950/70 text-rose-300 text-[10px] font-bold">
                        SIGNAL LOST
                      </div>
                    )}
                    {cam.status === "Maintenance" && (
                      <div className="absolute inset-0 flex items-center justify-center bg-amber-950/70 text-amber-300 text-[10px] font-bold">
                        MAINTENANCE
                      </div>
                    )}

                    {/* Top Tag */}
                    <div className="relative z-10 flex items-center justify-between text-[9px]">
                      <span className="bg-slate-950/80 px-1 py-0.5 rounded font-mono font-bold text-white">
                        {cam.cameraCode}
                      </span>
                      <span
                        className={cn(
                          "h-2 w-2 rounded-full",
                          cam.status === "Online"
                            ? "bg-emerald-400 animate-pulse"
                            : cam.status === "Offline"
                            ? "bg-rose-500"
                            : "bg-amber-400"
                        )}
                      />
                    </div>

                    {/* Bottom Tag */}
                    <div className="relative z-10 flex items-center justify-between text-[9px] bg-slate-950/80 px-1 py-0.5 rounded mt-auto">
                      <span className="truncate text-slate-200 font-medium">{cam.cameraName}</span>
                      <span className="font-mono text-slate-400 shrink-0 ml-1">10:24:15</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <span>Streaming: H.265+ @ 25fps • 4K Resolution</span>
              <span className="text-emerald-400">All Security Protocols Operational</span>
            </div>
          </div>

          {/* Surveillance Form - Camera Master (Right 1/3) */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex flex-col justify-between space-y-4">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {selectedCamera.cameraCode}
                    </span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                      {selectedCamera.status}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mt-1">
                    Surveillance Form - Camera Master
                  </h3>
                </div>
              </div>

              {/* Camera Image Preview */}
              <div className="mt-3 relative h-28 w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-900">
                <img
                  src={selectedCamera.liveImage}
                  alt={selectedCamera.cameraName}
                  className="h-full w-full object-cover"
                />
                <button
                  onClick={() => toast.info("Camera snapshot uploaded to evidence ledger.")}
                  className="absolute bottom-2 right-2 bg-slate-900/80 hover:bg-slate-900 text-white text-[10px] font-semibold px-2 py-1 rounded backdrop-blur-xs shadow"
                >
                  Change Image
                </button>
              </div>

              {/* Form Fields */}
              <form onSubmit={handleUpdateCamera} className="mt-3 space-y-3 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                    Camera ID
                  </label>
                  <input
                    type="text"
                    disabled
                    value={selectedCamera.cameraCode}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 font-mono text-slate-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                    Camera Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                      Camera Type *
                    </label>
                    <select
                      value={formType}
                      onChange={(e) => setFormType(e.target.value as any)}
                      className="w-full px-2 py-1.5 rounded-lg border border-slate-300 bg-white"
                    >
                      <option value="Fixed IP Camera">Fixed IP Camera</option>
                      <option value="PTZ Camera">PTZ Camera</option>
                      <option value="Thermal Camera">Thermal Camera</option>
                      <option value="Panoramic">Panoramic</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                      Zone *
                    </label>
                    <select
                      value={formZone}
                      onChange={(e) => setFormZone(e.target.value)}
                      className="w-full px-2 py-1.5 rounded-lg border border-slate-300 bg-white"
                    >
                      <option value="Main Gate">Main Gate</option>
                      <option value="Parking">Parking</option>
                      <option value="Office">Office</option>
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Warehouse">Warehouse</option>
                      <option value="R&D Lab">R&D Lab</option>
                      <option value="Perimeter">Perimeter</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                      Manufacturer
                    </label>
                    <input
                      type="text"
                      value={formManufacturer}
                      onChange={(e) => setFormManufacturer(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                      Model
                    </label>
                    <input
                      type="text"
                      value={formModel}
                      onChange={(e) => setFormModel(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <label className="block font-medium text-slate-500 mb-0.5">IP Address</label>
                    <input
                      type="text"
                      disabled
                      value={selectedCamera.ipAddress}
                      className="w-full px-2 py-1 rounded border border-slate-200 bg-slate-50 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-500 mb-0.5">MAC Address</label>
                    <input
                      type="text"
                      disabled
                      value={selectedCamera.macAddress}
                      className="w-full px-2 py-1 rounded border border-slate-200 bg-slate-50 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                      Criticality
                    </label>
                    <select
                      value={formCriticality}
                      onChange={(e) => setFormCriticality(e.target.value as any)}
                      className="w-full px-2 py-1.5 rounded-lg border border-slate-300 bg-white"
                    >
                      <option value="Critical">Critical</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                      Classification
                    </label>
                    <select
                      value={formClassification}
                      onChange={(e) => setFormClassification(e.target.value as any)}
                      className="w-full px-2 py-1.5 rounded-lg border border-slate-300 bg-white"
                    >
                      <option value="Internal">Internal</option>
                      <option value="Confidential">Confidential</option>
                      <option value="Restricted">Restricted</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setFormName(selectedCamera.cameraName);
                      toast.info("Form reverted to stored configuration.");
                    }}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-xs"
                  >
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <QuickCreateDialog
        open={newCameraOpen}
        onOpenChange={setNewCameraOpen}
        title="Commission New Camera"
        description="Registers the camera in the CCTV Master Register."
        submitLabel="Commission Camera"
        fields={[
          { name: "cameraName", label: "Camera name", required: true, placeholder: "e.g. Gate 3 Entry" },
          { name: "zone", label: "Zone", required: true, placeholder: "e.g. Perimeter" },
          { name: "cameraType", label: "Camera type", type: "select", options: ["Fixed IP Camera", "PTZ Camera", "Thermal Camera", "Panoramic"] },
          { name: "criticality", label: "Criticality", type: "select", options: ["High", "Critical", "Medium", "Low"] },
          { name: "manufacturer", label: "Manufacturer", required: true, placeholder: "e.g. Hikvision" },
          { name: "model", label: "Model", required: true, placeholder: "e.g. DS-2CD2143G2" },
          { name: "ipAddress", label: "IP address", placeholder: "e.g. 10.20.4.31" },
          { name: "securityClassification", label: "Classification", type: "select", options: ["Internal", "Confidential", "Restricted"] },
        ]}
        onSubmit={(v) => {
          const base = cameras[0];
          const n = cameras.length + 1;
          const cam = {
            ...base,
            id: `cam-${Date.now()}`,
            cameraCode: `CAM-${String(n).padStart(3, "0")}`,
            cameraName: String(v.cameraName),
            zone: String(v.zone),
            cameraType: v.cameraType as typeof base.cameraType,
            criticality: v.criticality as typeof base.criticality,
            manufacturer: String(v.manufacturer),
            model: String(v.model),
            ipAddress: String(v.ipAddress || "—"),
            serialNumber: "Pending",
            macAddress: "Pending",
            status: "Online" as const,
            installationDate: new Date().toISOString().slice(0, 10),
            securityClassification: v.securityClassification as typeof base.securityClassification,
          };
          setCameras((prev) => [...prev, cam]);
          toast.success(`Camera ${cam.cameraCode} (${cam.cameraName}) commissioned in the Master Register`);
        }}
      />
    </AppShell>
  );
}
