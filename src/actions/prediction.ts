'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export interface CreatePredictionInput {
  customer_number: string;
  prediction: number;
  date?: Date;
}

/**
 * Create a new prediction entry
 */
export async function createPrediction(data: CreatePredictionInput) {
  try {
    const prediction = await prisma.prediction.create({
      data: {
        customer_number: data.customer_number,
        prediction: data.prediction,
        date: data.date || new Date(),
      },
    });

    revalidatePath('/dashboard');
    return { success: true, data: prediction };
  } catch (error) {
    console.error('Error creating prediction:', error);
    return { success: false, error: 'Failed to create prediction' };
  }
}

/**
 * Get all predictions with optional filtering
 */
export async function getPredictions(filters?: {
  customer_number?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}) {
  try {
    const where: {
      customer_number?: string;
      date?: {
        gte?: Date;
        lte?: Date;
      };
    } = {};

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

    const predictions = await prisma.prediction.findMany({
      where,
      orderBy: { date: 'desc' },
      take: filters?.limit || 100,
      skip: filters?.offset || 0,
    });

    return { success: true, data: predictions };
  } catch (error) {
    console.error('Error fetching predictions:', error);
    return { success: false, error: 'Failed to fetch predictions' };
  }
}

/**
 * Get a single prediction by ID
 */
export async function getPredictionById(id: string) {
  try {
    const prediction = await prisma.prediction.findUnique({
      where: { id },
    });

    if (!prediction) {
      return { success: false, error: 'Prediction not found' };
    }

    return { success: true, data: prediction };
  } catch (error) {
    console.error('Error fetching prediction:', error);
    return { success: false, error: 'Failed to fetch prediction' };
  }
}

/**
 * Get latest prediction for a customer
 */
export async function getLatestPrediction(customer_number: string) {
  try {
    const prediction = await prisma.prediction.findFirst({
      where: { customer_number },
      orderBy: { date: 'desc' },
    });

    if (!prediction) {
      return { success: false, error: 'No predictions found for this customer' };
    }

    return { success: true, data: prediction };
  } catch (error) {
    console.error('Error fetching latest prediction:', error);
    return { success: false, error: 'Failed to fetch latest prediction' };
  }
}

/**
 * Get prediction history for a customer
 */
export async function getPredictionHistory(
  customer_number: string,
  options?: { limit?: number; offset?: number }
) {
  try {
    const predictions = await prisma.prediction.findMany({
      where: { customer_number },
      orderBy: { date: 'desc' },
      take: options?.limit || 10,
      skip: options?.offset || 0,
    });

    return { success: true, data: predictions };
  } catch (error) {
    console.error('Error fetching prediction history:', error);
    return { success: false, error: 'Failed to fetch prediction history' };
  }
}

/**
 * Batch create predictions
 */
export async function createPredictionsBatch(predictions: CreatePredictionInput[]) {
  try {
    const result = await prisma.prediction.createMany({
      data: predictions.map((p) => ({
        customer_number: p.customer_number,
        prediction: p.prediction,
        date: p.date || new Date(),
      })),
      skipDuplicates: true,
    });

    revalidatePath('/dashboard');
    return { success: true, count: result.count };
  } catch (error) {
    console.error('Error creating predictions batch:', error);
    return { success: false, error: 'Failed to create predictions' };
  }
}
