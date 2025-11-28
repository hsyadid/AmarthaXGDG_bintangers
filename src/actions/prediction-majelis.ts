'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export interface CreatePredictionMajelisInput {
  id_majelis: string;
  id_user: string[];
  prediction: number;
  date?: Date;
}

/**
 * Create a new prediction majelis entry
 */
export async function createPredictionMajelis(data: CreatePredictionMajelisInput) {
  try {
    const predictionMajelis = await prisma.predictionMajelis.create({
      data: {
        id_majelis: data.id_majelis,
        id_user: data.id_user,
        prediction: data.prediction,
        date: data.date || new Date(),
      },
    });

    revalidatePath('/dashboard');
    return { success: true, data: predictionMajelis };
  } catch (error) {
    console.error('Error creating prediction majelis:', error);
    return { success: false, error: 'Failed to create prediction majelis' };
  }
}

/**
 * Get all prediction majelis with optional filtering
 */
export async function getPredictionMajelis(filters?: {
  id_majelis?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}) {
  try {
    const where: {
      id_majelis?: string;
      date?: {
        gte?: Date;
        lte?: Date;
      };
    } = {};

    if (filters?.id_majelis) {
      where.id_majelis = filters.id_majelis;
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

    const predictions = await prisma.predictionMajelis.findMany({
      where,
      orderBy: { date: 'desc' },
      take: filters?.limit || 100,
      skip: filters?.offset || 0,
    });

    return { success: true, data: predictions };
  } catch (error) {
    console.error('Error fetching prediction majelis:', error);
    return { success: false, error: 'Failed to fetch prediction majelis' };
  }
}

/**
 * Get a single prediction majelis by ID
 */
export async function getPredictionMajelisById(id: string) {
  try {
    const prediction = await prisma.predictionMajelis.findUnique({
      where: { id },
    });

    if (!prediction) {
      return { success: false, error: 'Prediction majelis not found' };
    }

    return { success: true, data: prediction };
  } catch (error) {
    console.error('Error fetching prediction majelis:', error);
    return { success: false, error: 'Failed to fetch prediction majelis' };
  }
}

/**
 * Get latest prediction majelis for a group
 */
export async function getLatestPredictionMajelis(id_majelis: string) {
  try {
    const prediction = await prisma.predictionMajelis.findFirst({
      where: { id_majelis },
      orderBy: { date: 'desc' },
    });

    if (!prediction) {
      return { success: false, error: 'No predictions found for this majelis' };
    }

    return { success: true, data: prediction };
  } catch (error) {
    console.error('Error fetching latest prediction majelis:', error);
    return { success: false, error: 'Failed to fetch latest prediction majelis' };
  }
}

/**
 * Batch create prediction majelis from Vertex AI output
 */
export async function createPredictionMajelisBatch(predictions: CreatePredictionMajelisInput[]) {
  try {
    const result = await prisma.predictionMajelis.createMany({
      data: predictions.map((p) => ({
        id_majelis: p.id_majelis,
        id_user: p.id_user,
        prediction: p.prediction,
        date: p.date || new Date(),
      })),
      skipDuplicates: true,
    });

    revalidatePath('/dashboard');
    return { success: true, count: result.count };
  } catch (error) {
    console.error('Error creating prediction majelis batch:', error);
    return { success: false, error: 'Failed to create prediction majelis' };
  }
}
