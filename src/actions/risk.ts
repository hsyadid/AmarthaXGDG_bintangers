'use server';

import { prisma } from "@/lib/db";

// TYPES
export interface RiskCustomerInput {
  customer_number: string;
  risk: number;
  date?: Date;
}

export interface RiskMajelisInput {
  id_majelis: string;
  customer_numbers: string[];
  risk: number;
  date?: Date;
}

// UTIL
function normalizeDate(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/* ============================
     RISK CUSTOMER CRUD
============================= */

export async function createRiskCustomer(data: RiskCustomerInput) {
  const finalDate = normalizeDate(data.date || new Date());

  const record = await prisma.risk_customers.create({
    data: {
      id: crypto.randomUUID(),
      customer_number: data.customer_number,
      risk: data.risk,
      date: finalDate,
    },
  });

  return { success: true, data: record };
}

export async function getRiskCustomer(id: string) {
  const record = await prisma.risk_customers.findUnique({ where: { id } });
  if (!record) return { success: false, error: "Not found" };
  return { success: true, data: record };
}

export async function getRiskCustomerByCustomerAndDate(
  customer_number: string,
  date: Date
) {
  const finalDate = normalizeDate(date);

  const record = await prisma.risk_customers.findFirst({
    where: { customer_number, date: finalDate },
  });

  return record
    ? { success: true, data: record }
    : { success: false, error: "Not found" };
}

export async function updateRiskCustomer(customer_number: string, date: Date, risk: number) {
  const finalDate = normalizeDate(date);

  const record = await prisma.risk_customers.updateMany({
    where: { customer_number, date: finalDate },
    data: { risk },
  });

  return { success: true, updated: record.count };
}

export async function deleteRiskCustomer(id: string) {
  await prisma.risk_customers.delete({ where: { id } });
  return { success: true };
}

/* ============================
     RISK MAJELIS CRUD
============================= */

export async function createRiskMajelis(data: RiskMajelisInput) {
  const finalDate = normalizeDate(data.date || new Date());

  const record = await prisma.risk_majelis.create({
    data: {
      id: crypto.randomUUID(),
      id_majelis: data.id_majelis,
      customer_number: data.customer_numbers, // array
      risk: data.risk,
      date: finalDate,
    },
  });

  return { success: true, data: record };
}

export async function getRiskMajelis(id: string) {
  const record = await prisma.risk_majelis.findUnique({ where: { id } });
  if (!record) return { success: false, error: "Not found" };
  return { success: true, data: record };
}

export async function getRiskMajelisByDate(id_majelis: string, date: Date) {
  const finalDate = normalizeDate(date);

  const record = await prisma.risk_majelis.findFirst({
    where: { id_majelis, date: finalDate },
  });

  return record
    ? { success: true, data: record }
    : { success: false, error: "Not found" };
}

export async function updateRiskMajelis(id_majelis: string, date: Date, risk: number) {
  const finalDate = normalizeDate(date);

  const updated = await prisma.risk_majelis.updateMany({
    where: { id_majelis, date: finalDate },
    data: { risk },
  });

  return { success: true, updated: updated.count };
}

export async function deleteRiskMajelis(id: string) {
  await prisma.risk_majelis.delete({ where: { id } });
  return { success: true };
}

/* ============================
     RISK ANALYTICS
============================= */

/**
 * Get count of high-risk majelis (risk > 20%) from most recent data
 */
export async function getHighRiskMajelisCount() {
  try {
    // Get the most recent date for each majelis
    const allMajelis = await prisma.risk_majelis.groupBy({
      by: ['id_majelis'],
      _max: {
        date: true,
      },
    });

    // Get the latest risk data for each majelis
    const latestRisks = await Promise.all(
      allMajelis.map(async (m: { id_majelis: string; _max: { date: Date | null } }) => {
        const record = await prisma.risk_majelis.findFirst({
          where: {
            id_majelis: m.id_majelis,
            date: m._max.date!,
          },
        });
        return record;
      })
    );

    // Count high-risk majelis (risk > 0.20 = 20%)
    type MajelisRiskRecord = { id: string; risk: number } | null;
    const highRiskCount = latestRisks.filter((r: MajelisRiskRecord) => r && r.risk > 0.20).length;
    const totalCount = latestRisks.length;

    return { success: true, highRiskCount, totalCount };
  } catch (error) {
    console.error('Error getting high-risk majelis count:', error);
    return { success: false, error: 'Failed to get high-risk majelis count', highRiskCount: 0, totalCount: 0 };
  }
}

/**
 * Get count of high-risk borrowers (risk > 20%) from most recent data
 */
export async function getHighRiskBorrowersCount() {
  try {
    // Get the most recent date for each customer
    const allCustomers = await prisma.risk_customers.groupBy({
      by: ['customer_number'],
      _max: {
        date: true,
      },
    });

    // Get the latest risk data for each customer
    const latestRisks = await Promise.all(
      allCustomers.map(async (c: { customer_number: string; _max: { date: Date | null } }) => {
        const record = await prisma.risk_customers.findFirst({
          where: {
            customer_number: c.customer_number,
            date: c._max.date!,
          },
        });
        return record;
      })
    );

    // Count high-risk borrowers (risk > 0.20 = 20%)
    type CustomerRiskRecord = { id: string; risk: number } | null;
    const highRiskCount = latestRisks.filter((r: CustomerRiskRecord) => r && r.risk > 0.20).length;

    return { success: true, highRiskCount };
  } catch (error) {
    console.error('Error getting high-risk borrowers count:', error);
    return { success: false, error: 'Failed to get high-risk borrowers count', highRiskCount: 0 };
  }
}

/**
 * Get majelis risk data with members count and trend
 */
export async function getMajelisRiskAnalytics() {
  try {
    // Get all unique majelis with their latest date
    const majelisGroups = await prisma.risk_majelis.groupBy({
      by: ['id_majelis'],
      _max: {
        date: true,
      },
    });

    const analytics = await Promise.all(
      majelisGroups.map(async (m: { id_majelis: string; _max: { date: Date | null } }) => {
        // Get latest risk data
        const latestData = await prisma.risk_majelis.findFirst({
          where: {
            id_majelis: m.id_majelis,
            date: m._max.date!,
          },
        });

        if (!latestData) return null;

        // Get risk data from 1 week ago for trend calculation
        const oneWeekAgo = new Date(m._max.date!);
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const previousData = await prisma.risk_majelis.findFirst({
          where: {
            id_majelis: m.id_majelis,
            date: {
              lte: oneWeekAgo,
            },
          },
          orderBy: {
            date: 'desc',
          },
        });

        // Calculate trend
        let trend: 'up' | 'down' | 'stable' = 'stable';
        if (previousData) {
          const diff = latestData.risk - previousData.risk;
          if (Math.abs(diff) >= 0.01) {  // 1% change
            trend = diff > 0 ? 'up' : 'down';
          }
        }

        return {
          id_majelis: latestData.id_majelis,
          members: latestData.customer_number.length,
          riskScore: latestData.risk,
          trend,
          date: latestData.date,
        };
      })
    );

    type MajelisAnalytic = { id_majelis: string; members: number; riskScore: number; trend: 'up' | 'down' | 'stable'; date: Date } | null;
    const validAnalytics = analytics.filter((a: MajelisAnalytic) => a !== null) as Array<NonNullable<MajelisAnalytic>>;

    return { success: true, data: validAnalytics };
  } catch (error) {
    console.error('Error getting majelis risk analytics:', error);
    return { success: false, error: 'Failed to get majelis risk analytics', data: [] };
  }
}

/**
 * Get borrower risk data with business type and trend
 */
export async function getBorrowerRiskAnalytics() {
  try {
    // Get all unique customers with their latest date
    const customerGroups = await prisma.risk_customers.groupBy({
      by: ['customer_number'],
      _max: {
        date: true,
      },
    });

    const analytics = await Promise.all(
      customerGroups.map(async (c: { customer_number: string; _max: { date: Date | null } }) => {
        // Get latest risk data
        const latestRiskData = await prisma.risk_customers.findFirst({
          where: {
            customer_number: c.customer_number,
            date: c._max.date!,
          },
        });

        if (!latestRiskData) return null;

        // Get customer details for business type
        const customerData = await prisma.customer.findFirst({
          where: {
            customer_number: c.customer_number,
          },
        });

        // Get risk data from 1 week ago for trend calculation
        const oneWeekAgo = new Date(c._max.date!);
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const previousRiskData = await prisma.risk_customers.findFirst({
          where: {
            customer_number: c.customer_number,
            date: {
              lte: oneWeekAgo,
            },
          },
          orderBy: {
            date: 'desc',
          },
        });

        // Calculate trend
        let trend: 'up' | 'down' | 'stable' = 'stable';
        if (previousRiskData) {
          const diff = latestRiskData.risk - previousRiskData.risk;
          if (Math.abs(diff) >= 0.01) {  // 1% change
            trend = diff > 0 ? 'up' : 'down';
          }
        }

        return {
          customer_number: latestRiskData.customer_number,
          business: customerData?.purpose || 'Unknown',
          riskScore: latestRiskData.risk,
          trend,
          date: latestRiskData.date,
        };
      })
    );

    type BorrowerAnalytic = { customer_number: string; business: string; riskScore: number; trend: 'up' | 'down' | 'stable'; date: Date } | null;
    const validAnalytics = analytics.filter((a: BorrowerAnalytic) => a !== null) as Array<NonNullable<BorrowerAnalytic>>;

    return { success: true, data: validAnalytics };
  } catch (error) {
    console.error('Error getting borrower risk analytics:', error);
    return { success: false, error: 'Failed to get borrower risk analytics', data: [] };
  }
}
