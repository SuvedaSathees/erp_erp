import React from "react";
import { AlertOctagon, GitPullRequest, CheckCircle2, ArrowDown, UserCheck, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export const IpqcNcrCapaTab: React.FC = () => {
  const approvalRoles = [
    { role: "Production Operator", person: "Rajesh K", action: "Process execution and parameter setup", status: "Verified" },
    { role: "Quality Inspector", person: "Priya S", action: "Dimensional & functional in-process check", status: "Signed Off" },
    { role: "Quality Engineer", person: "Arun K", action: "Statistical capability & Cpk confirmation", status: "Approved" },
    { role: "Quality Manager", person: "K. Priya", action: "NCR disposition & deviation sign-off", status: "Pending Final Review" },
    { role: "Production Manager", person: "Suresh N", action: "Process recovery & schedule alignment", status: "Notified" },
  ];

  return (
    <div className="space-y-4 text-xs">
      {/* Reaction Plan Card */}
      <div className="bg-card border border-border rounded-xl p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <div className="flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 text-rose-600" />
            <h3 className="text-sm font-bold text-foreground tracking-tight">
              Standard Quality Reaction Plan & Escalation Matrix
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-rose-300 dark:border-rose-800 bg-rose-50/30 dark:bg-rose-950/20 space-y-2">
            <span className="font-extrabold text-rose-700 dark:text-rose-400 block text-xs uppercase tracking-wider">
              Critical Defect Detected (Immediate Containment)
            </span>
            <ul className="space-y-1.5 text-muted-foreground text-[11px]">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                <span>Stop machine and interlock assembly line conveyor.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                <span>Segregate and tag all WIP since last known good part.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                <span>Issue formal Non-Conformance Record (NCR-2026-0041).</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                <span>Initiate 8D CAPA and convene Quality Engineering review.</span>
              </li>
            </ul>
          </div>

          <div className="p-4 rounded-xl border border-blue-300 dark:border-blue-800 bg-blue-50/30 dark:bg-blue-950/20 space-y-2">
            <span className="font-extrabold text-blue-700 dark:text-blue-400 block text-xs uppercase tracking-wider">
              Normal Parameter Drift (Operational Adjustment)
            </span>
            <ul className="space-y-1.5 text-muted-foreground text-[11px]">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                <span>Segregate current sample and notify production supervisor.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                <span>Perform parameter offset correction on torque / pressure tool.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                <span>Inspect next 3 consecutive pieces (100% verification).</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                <span>Resume regular hourly inspection frequency once conforming.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Multi-level Approval Matrix */}
      <div className="bg-card border border-border rounded-xl p-4 sm:p-5 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-foreground tracking-tight flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-blue-600" />
          <span>In-Process Quality Approval Chain</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="text-[10px] font-semibold text-muted-foreground uppercase border-b border-border/60">
              <tr>
                <th className="pb-2 font-medium">Role</th>
                <th className="pb-2 font-medium">Responsible Person</th>
                <th className="pb-2 font-medium">Action Description</th>
                <th className="pb-2 font-medium text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {approvalRoles.map((role, idx) => (
                <tr key={idx} className="hover:bg-muted/30 transition-colors">
                  <td className="py-2.5 font-bold text-foreground">{role.role}</td>
                  <td className="py-2.5 text-muted-foreground font-medium">{role.person}</td>
                  <td className="py-2.5 text-muted-foreground">{role.action}</td>
                  <td className="py-2.5 text-center">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                        role.status === "Approved" || role.status === "Signed Off" || role.status === "Verified"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                          : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                      }`}
                    >
                      {role.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
