'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { Decimal } from '@prisma/client/runtime/library';

export type CashFlowType = 'EXPENSE' | 'REVENUE';

export interface CreateCashFlowInput {
  type: CashFlowType;
  amount: number;
  description: string;
  customer_number: string;
  date?: Date;
}

export interface UpdateCashFlowInput {
  type?: CashFlowType;
  amount?: number;
  description?: string;
  customer_number?: string;
  date?: Date;
}

export interface CreateCashFlowTotalInput {
  type: CashFlowType;
  amount: number;
  customer_number: string;
  date?: Date;
}

export interface UpdateCashFlowTotalInput {
  type?: CashFlowType;
  amount?: number;
  customer_number?: string;
  date?: Date;
}

function normalizeDate(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

// Helper to serialize Decimal to number
function serializeDecimal(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(serializeDecimal);
  }
  if (obj && typeof obj === 'object') {
    if (Decimal.isDecimal(obj) || (obj instanceof Decimal)) {
      return obj.toNumber();
    }
    const newObj: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        newObj[key] = serializeDecimal(obj[key]);
      }
    }
    return newObj;
  }
  return obj;
}

async function syncCashFlowTotal(
  type: CashFlowType,
  customer_number: string,
  date: Date,
  amountChange: number
) {
  const normalizedDate = normalizeDate(date);

  const existing = await prisma.cashFlowTotal.findFirst({
    where: { type, customer_number, date: normalizedDate },
  });

  if (!existing) {
    await prisma.cashFlowTotal.create({
      data: {
        type,
        customer_number,
        date: normalizedDate,
        amount: new Decimal(amountChange),
      },
    });
    return;
  }

  const updatedAmount = parseFloat(existing.amount.toString()) + amountChange;

  if (updatedAmount <= 0) {
    await prisma.cashFlowTotal.delete({ where: { id: existing.id } });
  } else {
    await prisma.cashFlowTotal.update({
      where: { id: existing.id },
      data: { amount: new Decimal(updatedAmount) },
    });
  }
}

/* CREATE cash_flow */
export async function createCashFlow(data: CreateCashFlowInput) {
  try {
    const finalDate = data.date || new Date();

    const record = await prisma.cashFlow.create({
      data: {
        type: data.type,
        amount: new Decimal(data.amount),
        description: data.description,
        customer_number: data.customer_number,
        date: finalDate,
      },
    });

    await syncCashFlowTotal(data.type, data.customer_number, finalDate, data.amount);

    revalidatePath('/dashboard');
    return { success: true, data: serializeDecimal(record) };
  } catch {
    return { success: false, error: 'Failed to create cash flow entry' };
  }
}

/* READ list cash_flow */
export async function getCashFlows(filters?: {
  type?: CashFlowType;
  customer_number?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}) {
  try {
    const where: any = {};

    if (filters?.type) where.type = filters.type;
    if (filters?.customer_number) where.customer_number = filters.customer_number;

    if (filters?.startDate || filters?.endDate) {
      where.date = {};
      if (filters.startDate) where.date.gte = filters.startDate;
      if (filters.endDate) where.date.lte = filters.endDate;
    }

    const result = await prisma.cashFlow.findMany({
      where,
      orderBy: { date: 'desc' },
      take: filters?.limit || 100,
      skip: filters?.offset || 0,
    });

    return { success: true, data: serializeDecimal(result) };
  } catch {
    return { success: false, error: 'Failed to fetch cash flows' };
  }
}

/* READ single cash_flow */
export async function getCashFlowById(id: string) {
  const record = await prisma.cashFlow.findUnique({ where: { id } });
  if (!record) return { success: false, error: 'Cash flow not found' };
  return { success: true, data: serializeDecimal(record) };
}

/* UPDATE cash_flow */
export async function updateCashFlow(id: string, data: UpdateCashFlowInput) {
  try {
    const existing = await prisma.cashFlow.findUnique({ where: { id } });
    if (!existing) return { success: false, error: 'Cash flow not found' };

    const oldAmount = parseFloat(existing.amount.toString());
    const newAmount = data.amount !== undefined ? data.amount : oldAmount;

    const oldDate = existing.date;
    const newDate = data.date || existing.date;

    const oldType = existing.type;
    const newType = data.type || existing.type;

    const oldCustomer = existing.customer_number;
    const newCustomer = data.customer_number || existing.customer_number;

    // Check if grouping fields changed
    const isDifferentBucket =
      oldType !== newType ||
      oldCustomer !== newCustomer ||
      normalizeDate(oldDate).getTime() !== normalizeDate(newDate).getTime();

    const updated = await prisma.cashFlow.update({
      where: { id },
      data: {
        type: newType,
        amount: new Decimal(newAmount),
        description: data.description ?? existing.description,
        customer_number: newCustomer,
        date: newDate,
      },
    });

    if (isDifferentBucket) {
      // Remove from old bucket
      await syncCashFlowTotal(oldType, oldCustomer, oldDate, -oldAmount);
      // Add to new bucket
      await syncCashFlowTotal(newType, newCustomer, newDate, newAmount);
    } else {
      // Same bucket, update difference
      const amountChange = newAmount - oldAmount;
      if (amountChange !== 0) {
        await syncCashFlowTotal(oldType, oldCustomer, oldDate, amountChange);
      }
    }

    revalidatePath('/dashboard');
    return { success: true, data: serializeDecimal(updated) };
  } catch {
    return { success: false, error: 'Failed to update cash flow' };
  }
}

/* DELETE cash_flow */
export async function deleteCashFlow(id: string) {
  try {
    const existing = await prisma.cashFlow.findUnique({ where: { id } });
    if (!existing) return { success: false, error: 'Cash flow not found' };

    const amount = parseFloat(existing.amount.toString());

    await prisma.cashFlow.delete({ where: { id } });

    await syncCashFlowTotal(
      existing.type,
      existing.customer_number,
      existing.date,
      -amount
    );

    revalidatePath('/dashboard');
    return { success: true };
  } catch {
    return { success: false, error: 'Failed to delete cash flow' };
  }
}

/* SUMMARY */
export async function getCashFlowSummary(customer_number: string) {
  try {
    const list = await prisma.cashFlow.findMany({ where: { customer_number } });

    const summary = list.reduce(
      (acc: { totalRevenue: number; totalExpense: number; }, item: { amount: { toString: () => string; }; type: string; }) => {
        const num = parseFloat(item.amount.toString());
        if (item.type === 'REVENUE') acc.totalRevenue += num;
        if (item.type === 'EXPENSE') acc.totalExpense += num;
        return acc;
      },
      { totalRevenue: 0, totalExpense: 0, netCashFlow: 0 }
    );

    summary.netCashFlow = summary.totalRevenue - summary.totalExpense;

    return { success: true, data: summary };
  } catch {
    return { success: false, error: 'Failed to calculate summary' };
  }
}

/* CRUD cash_flow_totals */

export async function getCashFlowTotal(filters?: {
  type?: CashFlowType;
  customer_number?: string;
  startDate?: Date;
  endDate?: Date;
}) {
  try {
    const where: any = {};

    if (filters?.type) where.type = filters.type;
    if (filters?.customer_number) where.customer_number = filters.customer_number;

    if (filters?.startDate || filters?.endDate) {
      where.date = {};
      if (filters.startDate) where.date.gte = filters.startDate;
      if (filters.endDate) where.date.lte = filters.endDate;
    }

    const result = await prisma.cashFlowTotal.findMany({
      where,
      orderBy: { date: 'desc' },
    });

    return { success: true, data: serializeDecimal(result) };
  } catch {
    return { success: false, error: 'Failed to fetch totals' };
  }
}

/* NEW: getCashFlowTotalByCustomer */
export async function getCashFlowTotalByCustomer(customer_number: string) {
  try {
    const result = await prisma.cashFlowTotal.findMany({
      where: { customer_number },
      orderBy: { date: 'desc' },
    });

    return { success: true, data: serializeDecimal(result) };
  } catch {
    return { success: false, error: 'Failed to fetch totals by customer' };
  }
}

/* getCashFlowTotalById (clean version) */
export async function getCashFlowTotalById(id: string) {
  try {
    const record = await prisma.cashFlowTotal.findUnique({ where: { id } });
    if (!record) return { success: false, error: 'Total not found' };
    return { success: true, data: serializeDecimal(record) };
  } catch {
    return { success: false, error: 'Failed to fetch total by id' };
  }
}

/* UPDATE total */
export async function updateCashFlowTotal(id: string, data: UpdateCashFlowTotalInput) {
  try {
    const updated = await prisma.cashFlowTotal.update({
      where: { id },
      data: {
        type: data.type,
        customer_number: data.customer_number,
        amount: data.amount ? new Decimal(data.amount) : undefined,
        date: data.date,
      },
    });

    revalidatePath('/dashboard');
    return { success: true, data: serializeDecimal(updated) };
  } catch {
    return { success: false, error: 'Failed to update total' };
  }
}

/* DELETE total */
export async function deleteCashFlowTotal(id: string) {
  try {
    await prisma.cashFlowTotal.delete({ where: { id } });
    revalidatePath('/dashboard');
    return { success: true };
  } catch {
    return { success: false, error: 'Failed to delete total' };
  }
}

/* CREATE cash_flow_totals */
export async function createCashFlowTotal(data: CreateCashFlowTotalInput) {
  try {
    const finalDate = data.date || new Date();
    const normalizedDate = normalizeDate(finalDate);

    const record = await prisma.cashFlowTotal.create({
      data: {
        type: data.type,
        customer_number: data.customer_number,
        amount: new Decimal(data.amount),
        date: normalizedDate,
      },
    });

    revalidatePath('/dashboard');
    return { success: true, data: serializeDecimal(record) };
  } catch (err) {
    console.error("CREATE TOTAL ERROR:", err);
    return { success: false, error: 'Failed to create cash flow total' };
  }

}
