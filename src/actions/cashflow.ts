'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';

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

/**
 * Create a new cash flow entry
 */
export async function createCashFlow(data: CreateCashFlowInput) {
  try {
    const cashFlow = await prisma.cashFlow.create({
      data: {
        type: data.type,
        amount: new Prisma.Decimal(data.amount),
        description: data.description,
        customer_number: data.customer_number,
        date: data.date || new Date(),
      },
    });

    revalidatePath('/dashboard');
    return { success: true, data: cashFlow };
  } catch (error) {
    console.error('Error creating cash flow:', error);
    return { success: false, error: 'Failed to create cash flow entry' };
  }
}

/**
 * Get all cash flows with optional filtering
 */
export async function getCashFlows(filters?: {
  type?: CashFlowType;
  customer_number?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}) {
  try {
    const where: {
      type?: CashFlowType;
      customer_number?: string;
      date?: {
        gte?: Date;
        lte?: Date;
      };
    } = {};

    if (filters?.type) {
      where.type = filters.type;
    }

    if (filters?.customer_number) {
      where.customer_number = filters.customer_number;
    }

    if (filters?.startDate || filters?.endDate) {
      where.date = {};
      if (filters.startDate) {
        where.date.gte = filters.startDate;
      }
      if (filters.endDate) {
        where.date.lte = filters.endDate;
      }
    }

    const cashFlows = await prisma.cashFlow.findMany({
      where,
      orderBy: { date: 'desc' },
      take: filters?.limit || 100,
      skip: filters?.offset || 0,
    });

    return { success: true, data: cashFlows };
  } catch (error) {
    console.error('Error fetching cash flows:', error);
    return { success: false, error: 'Failed to fetch cash flows' };
  }
}

/**
 * Get a single cash flow by ID
 */
export async function getCashFlowById(id: string) {
  try {
    const cashFlow = await prisma.cashFlow.findUnique({
      where: { id },
    });

    if (!cashFlow) {
      return { success: false, error: 'Cash flow not found' };
    }

    return { success: true, data: cashFlow };
  } catch (error) {
    console.error('Error fetching cash flow:', error);
    return { success: false, error: 'Failed to fetch cash flow' };
  }
}

/**
 * Update a cash flow entry
 */
export async function updateCashFlow(id: string, data: UpdateCashFlowInput) {
  try {
    const updateData: {
      type?: CashFlowType;
      amount?: Prisma.Decimal;
      description?: string;
      customer_number?: string;
      date?: Date;
    } = {};

    if (data.type) updateData.type = data.type;
    if (data.amount !== undefined) updateData.amount = new Prisma.Decimal(data.amount);
    if (data.description) updateData.description = data.description;
    if (data.customer_number) updateData.customer_number = data.customer_number;
    if (data.date) updateData.date = data.date;

    const cashFlow = await prisma.cashFlow.update({
      where: { id },
      data: updateData,
    });

    revalidatePath('/dashboard');
    return { success: true, data: cashFlow };
  } catch (error) {
    console.error('Error updating cash flow:', error);
    return { success: false, error: 'Failed to update cash flow' };
  }
}

/**
 * Delete a cash flow entry
 */
export async function deleteCashFlow(id: string) {
  try {
    await prisma.cashFlow.delete({
      where: { id },
    });

    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Error deleting cash flow:', error);
    return { success: false, error: 'Failed to delete cash flow' };
  }
}

/**
 * Get cash flow summary by customer
 */
export async function getCashFlowSummary(customer_number: string) {
  try {
    const cashFlows = await prisma.cashFlow.findMany({
      where: { customer_number },
    });

    interface Summary {
      totalRevenue: number;
      totalExpense: number;
      netCashFlow: number;
    }

    interface CashFlowAccumulator {
      totalRevenue: number;
      totalExpense: number;
      netCashFlow: number;
    }

    const summary = cashFlows.reduce<Summary>(
      (acc: Summary, cf) => {
        const amount: number = parseFloat(cf.amount.toString());
        if (cf.type === 'REVENUE') {
          acc.totalRevenue += amount;
        } else if (cf.type === 'EXPENSE') {
          acc.totalExpense += amount;
        }
        return acc;
      },
      { totalRevenue: 0, totalExpense: 0, netCashFlow: 0 }
    );

    summary.netCashFlow = summary.totalRevenue - summary.totalExpense;

    return { success: true, data: summary };
  } catch (error) {
    console.error('Error calculating cash flow summary:', error);
    return { success: false, error: 'Failed to calculate summary' };
  }
}
