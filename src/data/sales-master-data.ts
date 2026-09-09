/**
 * Sales Management Central Master Data
 * Shared master catalog for EVSE chargers, national regions, commercial channels, and executive governance.
 */

export interface SalesProductMaster {
  id: string;
  code: string;
  name: string;
  category: "AC Charging" | "DC Fast Charging" | "Services" | "Support";
  baseCost: number;
  msrp: number;
  floorPrice: number;
  stdMargin: string;
  warrantyYears: number;
}

export const SALES_PRODUCT_CATALOG: SalesProductMaster[] = [
  {
    id: "PROD-01",
    code: "EV-W-7KW",
    name: "Autonomous W-EVSE 7kW AC Smart Charger",
    category: "AC Charging",
    baseCost: 105000,
    msrp: 150000,
    floorPrice: 131250,
    stdMargin: "30.0%",
    warrantyYears: 2,
  },
  {
    id: "PROD-02",
    code: "EV-W-11KW",
    name: "Autonomous W-EVSE 11kW AC Dual Port",
    category: "AC Charging",
    baseCost: 135000,
    msrp: 195000,
    floorPrice: 168750,
    stdMargin: "30.8%",
    warrantyYears: 2,
  },
  {
    id: "PROD-03",
    code: "EV-DC-60KW",
    name: "HyperCharge 60kW DC Fast Dispenser",
    category: "DC Fast Charging",
    baseCost: 620000,
    msrp: 850000,
    floorPrice: 765000,
    stdMargin: "27.0%",
    warrantyYears: 3,
  },
  {
    id: "PROD-04",
    code: "SRV-INST-01",
    name: "Turnkey Site Civil, Electrical & Foundation",
    category: "Services",
    baseCost: 9000,
    msrp: 15000,
    floorPrice: 12000,
    stdMargin: "40.0%",
    warrantyYears: 1,
  },
  {
    id: "PROD-05",
    code: "AMC-3YR-PREM",
    name: "3-Year Comprehensive SLA Maintenance Package",
    category: "Support",
    baseCost: 18000,
    msrp: 30000,
    floorPrice: 24000,
    stdMargin: "40.0%",
    warrantyYears: 3,
  },
];

export const SALES_CHANNELS_MASTER = [
  { id: "CH-01", name: "Authorized Dealers", share: "40%", defaultMargin: "24.0%", color: "#0A3C75" },
  { id: "CH-02", name: "Direct Enterprise & CPO", share: "30%", defaultMargin: "32.0%", color: "#22C55E" },
  { id: "CH-03", name: "Master Distributors", share: "18%", defaultMargin: "20.0%", color: "#0284C7" },
  { id: "CH-04", name: "Govt / GeM Tenders", share: "8%", defaultMargin: "35.0%", color: "#F59E0B" },
  { id: "CH-05", name: "Global Exports", share: "4%", defaultMargin: "38.0%", color: "#8B5CF6" },
];

export const SALES_REGIONS_MASTER = [
  { code: "REG-SOUTH-01", name: "South India Region", hq: "Chennai", quota: "₹19.50 Cr", reps: 16 },
  { code: "REG-WEST-01", name: "West India Region", hq: "Mumbai", quota: "₹13.50 Cr", reps: 12 },
  { code: "REG-NORTH-01", name: "North India Region", hq: "Delhi-NCR", quota: "₹11.00 Cr", reps: 10 },
  { code: "REG-EAST-01", name: "East & Central Region", hq: "Kolkata", quota: "₹6.00 Cr", reps: 6 },
];

export const SALES_REVIEW_BOARD = [
  { role: "Sales Director", name: "Priya S", focus: "Commercial strategy & quota realization", status: "Approved" },
  { role: "Operations Head", name: "Vikram Verma", focus: "Production capacity & supply fulfillment", status: "Approved" },
  { role: "Finance Controller", name: "Ramesh Iyer", focus: "Gross margin safeguard & budget clearance", status: "Approved" },
];
