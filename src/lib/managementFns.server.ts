import { createServerFn } from "@tanstack/react-start";

async function getPrisma() {
  const mod = await import("./prisma.server");
  return mod.prisma;
}

// ==========================================
// HRM — Employees
// ==========================================

export const getEmployeesFn = createServerFn({ method: "GET" }).handler(async () => {
  const prisma = await getPrisma();
  const employees = await prisma.employee.findMany({
    include: { department: true, designation: true },
    orderBy: { fullName: "asc" },
  });
  return employees.map((e) => ({
    id: e.id,
    employeeCode: e.employeeCode,
    employeeNumber: e.employeeNumber,
    fullName: e.fullName,
    firstName: e.firstName,
    lastName: e.lastName,
    email: e.email,
    phone: e.phone,
    department: e.department?.name ?? "",
    designation: e.designation?.title ?? "",
    status: e.status,
    employmentType: e.employmentType,
    joiningDate: e.joiningDate.toISOString(),
    location: e.location,
    branch: e.branch,
    businessUnit: e.businessUnit,
    grade: e.grade,
    annualCTC: e.annualCTC ? Number(e.annualCTC) : 0,
    photo: e.photo,
    reportingManagerId: e.reportingManagerId,
  }));
});

export const getEmployeeByIdFn = createServerFn({ method: "GET" })
  .validator((id: string) => id)
  .handler(async ({ input: id }) => {
    const prisma = await getPrisma();
    return prisma.employee.findUnique({
      where: { id },
      include: { department: true, designation: true, directReports: true },
    });
  });

export const createEmployeeFn = createServerFn({ method: "POST" })
  .validator((data: {
    employeeCode: string; firstName: string; lastName: string; fullName: string;
    email: string; phone?: string; joiningDate: string; departmentId?: string;
    designationId?: string; location?: string; branch?: string; businessUnit?: string;
    grade?: string; employmentType?: string; annualCTC?: number;
  }) => data)
  .handler(async ({ input }) => {
    const prisma = await getPrisma();
    return prisma.employee.create({
      data: {
        employeeCode: input.employeeCode,
        firstName: input.firstName,
        lastName: input.lastName,
        fullName: input.fullName,
        email: input.email,
        phone: input.phone,
        joiningDate: new Date(input.joiningDate),
        departmentId: input.departmentId,
        designationId: input.designationId,
        location: input.location,
        branch: input.branch,
        businessUnit: input.businessUnit,
        grade: input.grade,
        employmentType: (input.employmentType as any) ?? "FullTime",
        annualCTC: input.annualCTC,
      },
    });
  });

export const updateEmployeeFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; [key: string]: any }) => data)
  .handler(async ({ input: { id, ...data } }) => {
    const prisma = await getPrisma();
    if (data.joiningDate) data.joiningDate = new Date(data.joiningDate);
    return prisma.employee.update({ where: { id }, data });
  });

export const deleteEmployeeFn = createServerFn({ method: "POST" })
  .validator((id: string) => id)
  .handler(async ({ input: id }) => {
    const prisma = await getPrisma();
    return prisma.employee.delete({ where: { id } });
  });

// ==========================================
// HRM — Departments
// ==========================================

export const getDepartmentsFn = createServerFn({ method: "GET" }).handler(async () => {
  const prisma = await getPrisma();
  return prisma.department.findMany({
    include: { _count: { select: { employees: true } } },
    orderBy: { name: "asc" },
  });
});

export const createDepartmentFn = createServerFn({ method: "POST" })
  .validator((data: { code: string; name: string; headOfDept?: string; location?: string }) => data)
  .handler(async ({ input }) => {
    const prisma = await getPrisma();
    return prisma.department.create({ data: input });
  });

// ==========================================
// HRM — Leave Requests
// ==========================================

export const getLeaveRequestsFn = createServerFn({ method: "GET" }).handler(async () => {
  const prisma = await getPrisma();
  const leaves = await prisma.leaveRequest.findMany({
    include: { employee: { select: { fullName: true, employeeCode: true, department: { select: { name: true } } } } },
    orderBy: { createdAt: "desc" },
  });
  return leaves.map((l) => ({
    id: l.id,
    leaveCode: l.leaveCode,
    employeeName: l.employee.fullName,
    employeeCode: l.employee.employeeCode,
    department: l.employee.department?.name ?? "",
    leaveType: l.leaveType,
    startDate: l.startDate.toISOString(),
    endDate: l.endDate.toISOString(),
    days: l.days,
    reason: l.reason,
    status: l.status,
    approvedBy: l.approvedBy,
  }));
});

export const createLeaveRequestFn = createServerFn({ method: "POST" })
  .validator((data: { employeeId: string; leaveCode: string; leaveType: string; startDate: string; endDate: string; days: number; reason?: string }) => data)
  .handler(async ({ input }) => {
    const prisma = await getPrisma();
    return prisma.leaveRequest.create({
      data: {
        leaveCode: input.leaveCode,
        employeeId: input.employeeId,
        leaveType: input.leaveType as any,
        startDate: new Date(input.startDate),
        endDate: new Date(input.endDate),
        days: input.days,
        reason: input.reason,
      },
    });
  });

export const updateLeaveRequestFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; status: string; approvedBy?: string }) => data)
  .handler(async ({ input }) => {
    const prisma = await getPrisma();
    return prisma.leaveRequest.update({
      where: { id: input.id },
      data: {
        status: input.status as any,
        approvedBy: input.approvedBy,
        approvedDate: input.status === "Approved" ? new Date() : undefined,
      },
    });
  });

// ==========================================
// HRM — Attendance
// ==========================================

export const getAttendanceFn = createServerFn({ method: "GET" }).handler(async () => {
  const prisma = await getPrisma();
  const records = await prisma.attendance.findMany({
    include: { employee: { select: { fullName: true, employeeCode: true, department: { select: { name: true } } } } },
    orderBy: { date: "desc" },
    take: 200,
  });
  return records.map((r) => ({
    id: r.id,
    employeeName: r.employee.fullName,
    employeeCode: r.employee.employeeCode,
    department: r.employee.department?.name ?? "",
    date: r.date.toISOString(),
    checkIn: r.checkIn?.toISOString(),
    checkOut: r.checkOut?.toISOString(),
    hoursWorked: r.hoursWorked,
    status: r.status,
    shift: r.shift,
    overtime: r.overtime,
  }));
});

// ==========================================
// HRM — Payroll
// ==========================================

export const getPayrollRecordsFn = createServerFn({ method: "GET" }).handler(async () => {
  const prisma = await getPrisma();
  const records = await prisma.payrollRecord.findMany({
    include: { employee: { select: { fullName: true, employeeCode: true, department: { select: { name: true } } } } },
    orderBy: { createdAt: "desc" },
  });
  return records.map((r) => ({
    id: r.id,
    payrollCode: r.payrollCode,
    employeeName: r.employee.fullName,
    employeeCode: r.employee.employeeCode,
    department: r.employee.department?.name ?? "",
    period: r.period,
    month: r.month,
    year: r.year,
    grossEarnings: Number(r.grossEarnings),
    totalDeductions: Number(r.totalDeductions),
    netPay: Number(r.netPay),
    status: r.status,
    paidDate: r.paidDate?.toISOString(),
    workingDays: r.workingDays,
    presentDays: r.presentDays,
  }));
});

// ==========================================
// HRM — KPI Aggregates
// ==========================================

export const getHrmKpisFn = createServerFn({ method: "GET" }).handler(async () => {
  const prisma = await getPrisma();
  const [totalEmployees, activeEmployees, onLeave, departments, pendingLeaves, payrollRecords] =
    await Promise.all([
      prisma.employee.count(),
      prisma.employee.count({ where: { status: "Active" } }),
      prisma.employee.count({ where: { status: "OnLeave" } }),
      prisma.department.count(),
      prisma.leaveRequest.count({ where: { status: "Pending" } }),
      prisma.payrollRecord.findMany({ where: { status: "Paid" }, select: { netPay: true } }),
    ]);
  const totalPayroll = payrollRecords.reduce((sum, r) => sum + Number(r.netPay), 0);
  return {
    totalEmployees,
    activeEmployees,
    onLeave,
    departments,
    pendingLeaves,
    totalPayroll,
    avgCtc: totalEmployees > 0 ? totalPayroll / totalEmployees : 0,
  };
});

// ==========================================
// CRM — Leads
// ==========================================

export const getCrmLeadsFn = createServerFn({ method: "GET" }).handler(async () => {
  const prisma = await getPrisma();
  return prisma.crmLead.findMany({ orderBy: { createdAt: "desc" } });
});

export const createCrmLeadFn = createServerFn({ method: "POST" })
  .validator((data: {
    leadNumber: string; leadName: string; leadType?: string; status?: string;
    rating?: string; priority?: string; ownerName: string; ownerEmail?: string;
    contactPerson?: string; email?: string; phone?: string; orgName?: string;
    industry?: string; city?: string; state?: string; leadSource?: string;
    description?: string;
  }) => data)
  .handler(async ({ input }) => {
    const prisma = await getPrisma();
    return prisma.crmLead.create({ data: input as any });
  });

export const updateCrmLeadFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; [key: string]: any }) => data)
  .handler(async ({ input: { id, ...data } }) => {
    const prisma = await getPrisma();
    return prisma.crmLead.update({ where: { id }, data });
  });

export const deleteCrmLeadFn = createServerFn({ method: "POST" })
  .validator((id: string) => id)
  .handler(async ({ input: id }) => {
    const prisma = await getPrisma();
    return prisma.crmLead.delete({ where: { id } });
  });

// ==========================================
// CRM — Opportunities
// ==========================================

export const getCrmOpportunitiesFn = createServerFn({ method: "GET" }).handler(async () => {
  const prisma = await getPrisma();
  return prisma.crmOpportunity.findMany({
    include: { lead: { select: { leadName: true } }, account: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });
});

export const createCrmOpportunityFn = createServerFn({ method: "POST" })
  .validator((data: {
    opportunityNumber: string; name: string; stage?: string; amount?: number;
    probability?: number; ownerName: string; leadId?: string; accountId?: string;
    productService?: string; expectedCloseDate?: string;
  }) => data)
  .handler(async ({ input }) => {
    const prisma = await getPrisma();
    return prisma.crmOpportunity.create({
      data: {
        ...input,
        stage: (input.stage as any) ?? "Discovery",
        amount: input.amount,
        expectedCloseDate: input.expectedCloseDate ? new Date(input.expectedCloseDate) : undefined,
      },
    });
  });

// ==========================================
// CRM — Accounts & Contacts
// ==========================================

export const getCrmAccountsFn = createServerFn({ method: "GET" }).handler(async () => {
  const prisma = await getPrisma();
  return prisma.crmAccount.findMany({
    include: { _count: { select: { contacts: true, opportunities: true, supportTickets: true } } },
    orderBy: { name: "asc" },
  });
});

export const createCrmAccountFn = createServerFn({ method: "POST" })
  .validator((data: {
    accountCode: string; name: string; type?: string; industry?: string;
    website?: string; phone?: string; email?: string; ownerName?: string;
    billingCity?: string; billingState?: string;
  }) => data)
  .handler(async ({ input }) => {
    const prisma = await getPrisma();
    return prisma.crmAccount.create({ data: input });
  });

export const getCrmContactsFn = createServerFn({ method: "GET" }).handler(async () => {
  const prisma = await getPrisma();
  return prisma.crmContact.findMany({
    include: { account: { select: { name: true } } },
    orderBy: { fullName: "asc" },
  });
});

export const createCrmContactFn = createServerFn({ method: "POST" })
  .validator((data: {
    contactCode: string; firstName: string; lastName: string; fullName: string;
    email?: string; phone?: string; designation?: string; accountId?: string;
  }) => data)
  .handler(async ({ input }) => {
    const prisma = await getPrisma();
    return prisma.crmContact.create({ data: input });
  });

// ==========================================
// CRM — Support Tickets
// ==========================================

export const getSupportTicketsFn = createServerFn({ method: "GET" }).handler(async () => {
  const prisma = await getPrisma();
  return prisma.supportTicket.findMany({
    include: { account: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });
});

export const createSupportTicketFn = createServerFn({ method: "POST" })
  .validator((data: {
    ticketNumber: string; subject: string; description?: string;
    priority?: string; category?: string; accountId?: string;
    contactName?: string; contactEmail?: string; assignedTo?: string;
  }) => data)
  .handler(async ({ input }) => {
    const prisma = await getPrisma();
    return prisma.supportTicket.create({ data: input as any });
  });

export const updateSupportTicketFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; status?: string; assignedTo?: string; resolution?: string }) => data)
  .handler(async ({ input: { id, ...data } }) => {
    const prisma = await getPrisma();
    return prisma.supportTicket.update({ where: { id }, data: data as any });
  });

// ==========================================
// CRM — KPI Aggregates
// ==========================================

export const getCrmKpisFn = createServerFn({ method: "GET" }).handler(async () => {
  const prisma = await getPrisma();
  const [totalLeads, hotLeads, convertedLeads, totalOpps, wonOpps, totalAccounts, openTickets, opportunities] =
    await Promise.all([
      prisma.crmLead.count(),
      prisma.crmLead.count({ where: { rating: "Hot" } }),
      prisma.crmLead.count({ where: { status: "Converted" } }),
      prisma.crmOpportunity.count(),
      prisma.crmOpportunity.count({ where: { stage: "ClosedWon" } }),
      prisma.crmAccount.count(),
      prisma.supportTicket.count({ where: { status: { in: ["Open", "InProgress", "Escalated"] } } }),
      prisma.crmOpportunity.findMany({ select: { amount: true, stage: true } }),
    ]);
  const pipelineValue = opportunities.filter((o) => !["ClosedWon", "ClosedLost"].includes(o.stage)).reduce((sum, o) => sum + Number(o.amount), 0);
  const wonValue = opportunities.filter((o) => o.stage === "ClosedWon").reduce((sum, o) => sum + Number(o.amount), 0);
  return {
    totalLeads,
    hotLeads,
    conversionRate: totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0,
    totalOpportunities: totalOpps,
    pipelineValue,
    wonValue,
    winRate: totalOpps > 0 ? Math.round((wonOpps / totalOpps) * 100) : 0,
    totalAccounts,
    openTickets,
  };
});

// ==========================================
// Sales — Orders & Quotations
// ==========================================

export const getSalesOrdersFn = createServerFn({ method: "GET" }).handler(async () => {
  const prisma = await getPrisma();
  return prisma.salesOrder.findMany({
    include: { _count: { select: { lines: true } } },
    orderBy: { orderDate: "desc" },
  });
});

export const getSalesOrderByIdFn = createServerFn({ method: "GET" })
  .validator((id: string) => id)
  .handler(async ({ input: id }) => {
    const prisma = await getPrisma();
    return prisma.salesOrder.findUnique({
      where: { id },
      include: { lines: { orderBy: { lineNumber: "asc" } } },
    });
  });

export const createSalesOrderFn = createServerFn({ method: "POST" })
  .validator((data: {
    orderNumber: string; customerName: string; customerCode?: string;
    orderDate: string; deliveryDate?: string; paymentTerms?: string;
    salesPerson?: string; territory?: string; notes?: string;
    lines: Array<{ productCode: string; productName: string; quantity: number; unitPrice: number; taxRate?: number; uom?: string }>;
  }) => data)
  .handler(async ({ input }) => {
    const prisma = await getPrisma();
    const lines = input.lines.map((l, i) => ({
      lineNumber: i + 1,
      productCode: l.productCode,
      productName: l.productName,
      quantity: l.quantity,
      unitPrice: l.unitPrice,
      taxRate: l.taxRate ?? 0,
      lineTotal: l.quantity * l.unitPrice,
      uom: l.uom ?? "Nos",
    }));
    const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0);
    const taxAmount = lines.reduce((s, l) => s + l.lineTotal * (l.taxRate / 100), 0);
    return prisma.salesOrder.create({
      data: {
        orderNumber: input.orderNumber,
        customerName: input.customerName,
        customerCode: input.customerCode,
        orderDate: new Date(input.orderDate),
        deliveryDate: input.deliveryDate ? new Date(input.deliveryDate) : undefined,
        paymentTerms: input.paymentTerms,
        salesPerson: input.salesPerson,
        territory: input.territory,
        notes: input.notes,
        subtotal,
        taxAmount,
        totalAmount: subtotal + taxAmount,
        lines: { create: lines },
      },
      include: { lines: true },
    });
  });

export const updateSalesOrderStatusFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; status: string }) => data)
  .handler(async ({ input }) => {
    const prisma = await getPrisma();
    return prisma.salesOrder.update({ where: { id: input.id }, data: { status: input.status as any } });
  });

export const getQuotationsFn = createServerFn({ method: "GET" }).handler(async () => {
  const prisma = await getPrisma();
  return prisma.quotation.findMany({ orderBy: { quotationDate: "desc" } });
});

export const getPriceListsFn = createServerFn({ method: "GET" }).handler(async () => {
  const prisma = await getPrisma();
  return prisma.priceList.findMany({
    include: { _count: { select: { items: true } } },
    orderBy: { name: "asc" },
  });
});

// ==========================================
// Sales — KPI Aggregates
// ==========================================

export const getSalesKpisFn = createServerFn({ method: "GET" }).handler(async () => {
  const prisma = await getPrisma();
  const [orders, confirmedOrders, deliveredOrders, quotations] = await Promise.all([
    prisma.salesOrder.findMany({ select: { totalAmount: true, status: true } }),
    prisma.salesOrder.count({ where: { status: { in: ["Confirmed", "Processing", "Shipped", "Delivered"] } } }),
    prisma.salesOrder.count({ where: { status: "Delivered" } }),
    prisma.quotation.count(),
  ]);
  const totalRevenue = orders.filter((o) => ["Confirmed", "Processing", "Shipped", "Delivered"].includes(o.status)).reduce((s, o) => s + Number(o.totalAmount), 0);
  const totalOrders = orders.length;
  return {
    totalOrders,
    confirmedOrders,
    deliveredOrders,
    totalRevenue,
    avgOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
    quotations,
    fulfillmentRate: totalOrders > 0 ? Math.round((deliveredOrders / totalOrders) * 100) : 0,
  };
});

// ==========================================
// Procurement — Purchase Orders
// ==========================================

export const getPurchaseOrdersFn = createServerFn({ method: "GET" }).handler(async () => {
  const prisma = await getPrisma();
  return prisma.purchaseOrder.findMany({
    include: { supplier: { select: { name: true } }, _count: { select: { lines: true, goodsReceipts: true } } },
    orderBy: { orderDate: "desc" },
  });
});

export const getPurchaseOrderByIdFn = createServerFn({ method: "GET" })
  .validator((id: string) => id)
  .handler(async ({ input: id }) => {
    const prisma = await getPrisma();
    return prisma.purchaseOrder.findUnique({
      where: { id },
      include: { lines: { orderBy: { lineNumber: "asc" } }, supplier: true, goodsReceipts: true },
    });
  });

export const createPurchaseOrderFn = createServerFn({ method: "POST" })
  .validator((data: {
    poNumber: string; supplierName: string; supplierId?: string;
    orderDate: string; expectedDate?: string; paymentTerms?: string;
    requestedBy?: string; notes?: string;
    lines: Array<{ itemCode: string; itemName: string; quantity: number; unitPrice: number; taxRate?: number; uom?: string }>;
  }) => data)
  .handler(async ({ input }) => {
    const prisma = await getPrisma();
    const lines = input.lines.map((l, i) => ({
      lineNumber: i + 1,
      itemCode: l.itemCode,
      itemName: l.itemName,
      quantity: l.quantity,
      unitPrice: l.unitPrice,
      taxRate: l.taxRate ?? 0,
      lineTotal: l.quantity * l.unitPrice,
      uom: l.uom ?? "Nos",
    }));
    const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0);
    const taxAmount = lines.reduce((s, l) => s + l.lineTotal * (l.taxRate / 100), 0);
    return prisma.purchaseOrder.create({
      data: {
        poNumber: input.poNumber,
        supplierName: input.supplierName,
        supplierId: input.supplierId,
        orderDate: new Date(input.orderDate),
        expectedDate: input.expectedDate ? new Date(input.expectedDate) : undefined,
        paymentTerms: input.paymentTerms,
        requestedBy: input.requestedBy,
        notes: input.notes,
        subtotal,
        taxAmount,
        totalAmount: subtotal + taxAmount,
        lines: { create: lines },
      },
      include: { lines: true },
    });
  });

export const updatePurchaseOrderStatusFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; status: string; approvedBy?: string }) => data)
  .handler(async ({ input }) => {
    const prisma = await getPrisma();
    return prisma.purchaseOrder.update({
      where: { id: input.id },
      data: {
        status: input.status as any,
        approvedBy: input.approvedBy,
        approvedDate: ["Approved", "Ordered"].includes(input.status) ? new Date() : undefined,
      },
    });
  });

// ==========================================
// Procurement — Suppliers
// ==========================================

export const getSuppliersFn = createServerFn({ method: "GET" }).handler(async () => {
  const prisma = await getPrisma();
  return prisma.supplier.findMany({
    include: { _count: { select: { purchaseOrders: true } } },
    orderBy: { name: "asc" },
  });
});

export const createSupplierFn = createServerFn({ method: "POST" })
  .validator((data: {
    supplierCode: string; name: string; category?: string; email?: string;
    phone?: string; city?: string; state?: string; gstin?: string;
    paymentTerms?: string;
  }) => data)
  .handler(async ({ input }) => {
    const prisma = await getPrisma();
    return prisma.supplier.create({ data: input });
  });

// ==========================================
// Procurement — Goods Receipts
// ==========================================

export const getGoodsReceiptsFn = createServerFn({ method: "GET" }).handler(async () => {
  const prisma = await getPrisma();
  return prisma.goodsReceipt.findMany({
    include: { _count: { select: { lines: true } } },
    orderBy: { receiptDate: "desc" },
  });
});

// ==========================================
// Procurement — KPIs
// ==========================================

export const getProcurementKpisFn = createServerFn({ method: "GET" }).handler(async () => {
  const prisma = await getPrisma();
  const [totalPOs, activePOs, suppliers, pendingGRNs, pos] = await Promise.all([
    prisma.purchaseOrder.count(),
    prisma.purchaseOrder.count({ where: { status: { in: ["Approved", "Ordered", "PartiallyReceived"] } } }),
    prisma.supplier.count({ where: { status: "Active" } }),
    prisma.goodsReceipt.count({ where: { status: "Pending" } }),
    prisma.purchaseOrder.findMany({ select: { totalAmount: true, status: true } }),
  ]);
  const totalSpend = pos.filter((p) => !["Draft", "Cancelled"].includes(p.status)).reduce((s, p) => s + Number(p.totalAmount), 0);
  return {
    totalPurchaseOrders: totalPOs,
    activePurchaseOrders: activePOs,
    activeSuppliers: suppliers,
    pendingGoodsReceipts: pendingGRNs,
    totalSpend,
    avgPOValue: totalPOs > 0 ? totalSpend / totalPOs : 0,
  };
});

// ==========================================
// Project Management
// ==========================================

export const getProjectsFn = createServerFn({ method: "GET" }).handler(async () => {
  const prisma = await getPrisma();
  return prisma.project.findMany({
    include: { _count: { select: { tasks: true, milestones: true, timeEntries: true } } },
    orderBy: { createdAt: "desc" },
  });
});

export const getProjectByIdFn = createServerFn({ method: "GET" })
  .validator((id: string) => id)
  .handler(async ({ input: id }) => {
    const prisma = await getPrisma();
    return prisma.project.findUnique({
      where: { id },
      include: {
        tasks: { orderBy: { createdAt: "asc" }, include: { assignee: { select: { fullName: true } } } },
        milestones: { orderBy: { dueDate: "asc" } },
        timeEntries: { orderBy: { date: "desc" }, take: 50 },
      },
    });
  });

export const createProjectFn = createServerFn({ method: "POST" })
  .validator((data: {
    projectCode: string; name: string; description?: string; priority?: string;
    category?: string; startDate?: string; endDate?: string;
    projectManager: string; department?: string; clientName?: string; budget?: number;
  }) => data)
  .handler(async ({ input }) => {
    const prisma = await getPrisma();
    return prisma.project.create({
      data: {
        projectCode: input.projectCode,
        name: input.name,
        description: input.description,
        priority: (input.priority as any) ?? "Medium",
        category: input.category,
        startDate: input.startDate ? new Date(input.startDate) : undefined,
        endDate: input.endDate ? new Date(input.endDate) : undefined,
        projectManager: input.projectManager,
        department: input.department,
        clientName: input.clientName,
        budget: input.budget,
      },
    });
  });

export const updateProjectFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; [key: string]: any }) => data)
  .handler(async ({ input: { id, ...data } }) => {
    const prisma = await getPrisma();
    if (data.startDate) data.startDate = new Date(data.startDate);
    if (data.endDate) data.endDate = new Date(data.endDate);
    return prisma.project.update({ where: { id }, data });
  });

export const getProjectTasksFn = createServerFn({ method: "GET" })
  .validator((projectId: string) => projectId)
  .handler(async ({ input: projectId }) => {
    const prisma = await getPrisma();
    return prisma.projectTask.findMany({
      where: { projectId },
      include: { assignee: { select: { fullName: true } }, milestone: { select: { name: true } } },
      orderBy: { createdAt: "asc" },
    });
  });

export const createProjectTaskFn = createServerFn({ method: "POST" })
  .validator((data: {
    taskCode: string; title: string; description?: string; projectId: string;
    priority?: string; assigneeId?: string; assigneeName?: string;
    milestoneId?: string; startDate?: string; dueDate?: string; estimatedHours?: number;
  }) => data)
  .handler(async ({ input }) => {
    const prisma = await getPrisma();
    return prisma.projectTask.create({
      data: {
        taskCode: input.taskCode,
        title: input.title,
        description: input.description,
        projectId: input.projectId,
        priority: (input.priority as any) ?? "Medium",
        assigneeId: input.assigneeId,
        assigneeName: input.assigneeName,
        milestoneId: input.milestoneId,
        startDate: input.startDate ? new Date(input.startDate) : undefined,
        dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
        estimatedHours: input.estimatedHours,
      },
    });
  });

export const updateProjectTaskFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; status?: string; actualHours?: number; completedDate?: string }) => data)
  .handler(async ({ input: { id, ...data } }) => {
    const prisma = await getPrisma();
    const updateData: any = { ...data };
    if (data.completedDate) updateData.completedDate = new Date(data.completedDate);
    return prisma.projectTask.update({ where: { id }, data: updateData });
  });

export const getMilestonesFn = createServerFn({ method: "GET" })
  .validator((projectId: string) => projectId)
  .handler(async ({ input: projectId }) => {
    const prisma = await getPrisma();
    return prisma.milestone.findMany({
      where: { projectId },
      include: { _count: { select: { tasks: true } } },
      orderBy: { dueDate: "asc" },
    });
  });

export const getTimeEntriesFn = createServerFn({ method: "GET" }).handler(async () => {
  const prisma = await getPrisma();
  return prisma.timeEntry.findMany({
    include: { project: { select: { name: true } }, employee: { select: { fullName: true } } },
    orderBy: { date: "desc" },
    take: 200,
  });
});

// ==========================================
// Project Management — KPIs
// ==========================================

export const getProjectKpisFn = createServerFn({ method: "GET" }).handler(async () => {
  const prisma = await getPrisma();
  const [totalProjects, activeProjects, completedProjects, totalTasks, completedTasks, overdueTasks, timeEntries] =
    await Promise.all([
      prisma.project.count(),
      prisma.project.count({ where: { status: "Active" } }),
      prisma.project.count({ where: { status: "Completed" } }),
      prisma.projectTask.count(),
      prisma.projectTask.count({ where: { status: "Done" } }),
      prisma.projectTask.count({ where: { status: { not: "Done" }, dueDate: { lt: new Date() } } }),
      prisma.timeEntry.findMany({ select: { hours: true, billable: true } }),
    ]);
  const totalHours = timeEntries.reduce((s, e) => s + e.hours, 0);
  const billableHours = timeEntries.filter((e) => e.billable).reduce((s, e) => s + e.hours, 0);
  return {
    totalProjects,
    activeProjects,
    completedProjects,
    totalTasks,
    completedTasks,
    taskCompletionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
    overdueTasks,
    totalHoursLogged: Math.round(totalHours * 10) / 10,
    billableHours: Math.round(billableHours * 10) / 10,
    utilizationRate: totalHours > 0 ? Math.round((billableHours / totalHours) * 100) : 0,
  };
});

// ==========================================
// Administration
// ==========================================

export const getAuditLogsFn = createServerFn({ method: "GET" }).handler(async () => {
  const prisma = await getPrisma();
  return prisma.auditLog.findMany({ orderBy: { timestamp: "desc" }, take: 200 });
});

export const createAuditLogFn = createServerFn({ method: "POST" })
  .validator((data: {
    action: string; module: string; entity?: string; entityId?: string;
    description?: string; performedBy: string; oldValue?: string; newValue?: string;
  }) => data)
  .handler(async ({ input }) => {
    const prisma = await getPrisma();
    return prisma.auditLog.create({ data: input });
  });

export const getPoliciesFn = createServerFn({ method: "GET" }).handler(async () => {
  const prisma = await getPrisma();
  return prisma.policy.findMany({ orderBy: { createdAt: "desc" } });
});

export const getDocumentControlsFn = createServerFn({ method: "GET" }).handler(async () => {
  const prisma = await getPrisma();
  return prisma.documentControl.findMany({ orderBy: { createdAt: "desc" } });
});

export const getApprovalMatricesFn = createServerFn({ method: "GET" }).handler(async () => {
  const prisma = await getPrisma();
  return prisma.approvalMatrix.findMany({ orderBy: [{ module: "asc" }, { level: "asc" }] });
});

// ==========================================
// Administration — KPIs
// ==========================================

export const getAdminKpisFn = createServerFn({ method: "GET" }).handler(async () => {
  const prisma = await getPrisma();
  const [totalPolicies, activePolicies, totalDocs, publishedDocs, pendingDocs, auditCount, approvalRules] =
    await Promise.all([
      prisma.policy.count(),
      prisma.policy.count({ where: { status: "Active" } }),
      prisma.documentControl.count(),
      prisma.documentControl.count({ where: { status: "Published" } }),
      prisma.documentControl.count({ where: { status: { in: ["Draft", "InReview"] } } }),
      prisma.auditLog.count(),
      prisma.approvalMatrix.count({ where: { isActive: true } }),
    ]);
  return {
    totalPolicies,
    activePolicies,
    totalDocuments: totalDocs,
    publishedDocuments: publishedDocs,
    pendingDocuments: pendingDocs,
    auditLogEntries: auditCount,
    activeApprovalRules: approvalRules,
  };
});

// ==========================================
// Quality Management
// ==========================================

export const getCapaRecordsFn = createServerFn({ method: "GET" }).handler(async () => {
  const prisma = await getPrisma();
  return prisma.capaRecord.findMany({
    include: { relatedNcr: { select: { ncrNumber: true, title: true } } },
    orderBy: { createdAt: "desc" },
  });
});

export const createCapaRecordFn = createServerFn({ method: "POST" })
  .validator((data: {
    capaNumber: string; title: string; type?: string; priority?: string;
    source?: string; department?: string; assignedTo?: string; initiatedBy?: string;
    problemStatement?: string; targetDate?: string; relatedNcrId?: string;
  }) => data)
  .handler(async ({ input }) => {
    const prisma = await getPrisma();
    return prisma.capaRecord.create({
      data: {
        ...input,
        type: (input.type as any) ?? "Corrective",
        priority: (input.priority as any) ?? "Medium",
        targetDate: input.targetDate ? new Date(input.targetDate) : undefined,
      },
    });
  });

export const updateCapaRecordFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; status?: string; rootCause?: string; actionPlan?: string; verification?: string }) => data)
  .handler(async ({ input: { id, ...data } }) => {
    const prisma = await getPrisma();
    return prisma.capaRecord.update({ where: { id }, data: data as any });
  });

export const getNcrRecordsFn = createServerFn({ method: "GET" }).handler(async () => {
  const prisma = await getPrisma();
  return prisma.ncrRecord.findMany({
    include: { _count: { select: { capas: true } } },
    orderBy: { createdAt: "desc" },
  });
});

export const createNcrRecordFn = createServerFn({ method: "POST" })
  .validator((data: {
    ncrNumber: string; title: string; description?: string; severity?: string;
    category?: string; department?: string; detectedBy?: string;
    productCode?: string; productName?: string; batchNumber?: string;
    defectType?: string; assignedTo?: string; targetDate?: string;
  }) => data)
  .handler(async ({ input }) => {
    const prisma = await getPrisma();
    return prisma.ncrRecord.create({
      data: {
        ...input,
        targetDate: input.targetDate ? new Date(input.targetDate) : undefined,
      },
    });
  });

export const getInspectionRecordsFn = createServerFn({ method: "GET" }).handler(async () => {
  const prisma = await getPrisma();
  return prisma.inspectionRecord.findMany({ orderBy: { inspectionDate: "desc" } });
});

// ==========================================
// Quality Management — KPIs
// ==========================================

export const getQualityKpisFn = createServerFn({ method: "GET" }).handler(async () => {
  const prisma = await getPrisma();
  const [totalCapas, openCapas, closedCapas, totalNcrs, openNcrs, totalInspections, passedInspections, failedInspections] =
    await Promise.all([
      prisma.capaRecord.count(),
      prisma.capaRecord.count({ where: { status: { in: ["Open", "InvestigationPending", "RootCauseIdentified", "ActionPlanned", "ActionInProgress"] } } }),
      prisma.capaRecord.count({ where: { status: "Closed" } }),
      prisma.ncrRecord.count(),
      prisma.ncrRecord.count({ where: { status: { in: ["Open", "UnderReview"] } } }),
      prisma.inspectionRecord.count(),
      prisma.inspectionRecord.count({ where: { result: "Pass" } }),
      prisma.inspectionRecord.count({ where: { result: "Fail" } }),
    ]);
  return {
    totalCapas,
    openCapas,
    closedCapas,
    capaClosureRate: totalCapas > 0 ? Math.round((closedCapas / totalCapas) * 100) : 0,
    totalNcrs,
    openNcrs,
    totalInspections,
    passRate: totalInspections > 0 ? Math.round((passedInspections / totalInspections) * 100) : 0,
    failedInspections,
  };
});
