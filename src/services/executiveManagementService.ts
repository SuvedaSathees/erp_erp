// Default Executive Review registers; each environment's saved copy lives in the
// "executive-management.executive-review" module dataset.

export const EXEC_DECISIONS = [
  { id: 1, text: "Approve 3 new product launches", owner: "CTO", dueDate: "31 Jan 2027", status: "Approved" },
  { id: 2, text: "Increase manufacturing capacity", owner: "COO", dueDate: "28 Feb 2027", status: "In Review" },
  { id: 3, text: "Explore external funding (Series A)", owner: "CEO", dueDate: "15 Feb 2027", status: "Open" },
  { id: 4, text: "Strengthen supply chain partners", owner: "COO", dueDate: "28 Feb 2027", status: "Open" },
  { id: 5, text: "Implement cybersecurity upgrade", owner: "CIO", dueDate: "31 Mar 2027", status: "Planned" },
];

export const EXEC_ACTIONS = [
  { id: 1, text: "Finalize product launch plan", owner: "A. Khan", dueDate: "15 Jan 2027", progress: 80, status: "On Track" },
  { id: 2, text: "Resolve supply chain delays", owner: "S. Ravi", dueDate: "31 Jan 2027", progress: 40, status: "At Risk" },
  { id: 3, text: "Improve fleet customer onboarding", owner: "P. Nithya", dueDate: "20 Jan 2027", progress: 60, status: "On Track" },
  { id: 4, text: "Close audit findings", owner: "R. Mani", dueDate: "31 Jan 2027", progress: 30, status: "Delayed" },
  { id: 5, text: "Update sustainability roadmap", owner: "M. Priya", dueDate: "28 Feb 2027", progress: 20, status: "Open" },
];
