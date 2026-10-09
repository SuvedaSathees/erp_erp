import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { Prisma, PrismaClient } from "@/generated/prisma/client";

// Decimal results can't be serialized across server functions; nothing in the app does Decimal math.
function decimalsToNumbers(value: unknown): unknown {
  if (Prisma.Decimal.isDecimal(value)) return (value as Prisma.Decimal).toNumber();
  if (Array.isArray(value)) return value.map(decimalsToNumbers);
  if (value && typeof value === "object" && !(value instanceof Date) && !(value instanceof Uint8Array)) {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) out[k] = decimalsToNumbers(v);
    return out;
  }
  return value;
}

function createClient() {
  // Small pool with short idle timeout: fewer Postgres backends, and no idle traffic so App Sleeping can kick in.
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL, max: 5, idleTimeoutMillis: 10_000 });
  return new PrismaClient({ adapter }).$extends({
    query: {
      $allModels: {
        async $allOperations({ args, query }) {
          return decimalsToNumbers(await query(args));
        },
      },
    },
  });
}

const globalForPrisma = globalThis as unknown as { prisma?: ReturnType<typeof createClient> };

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
