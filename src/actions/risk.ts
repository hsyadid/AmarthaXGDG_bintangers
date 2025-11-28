'use server';

import { prisma } from "@/lib/db";
import { Decimal } from "@prisma/client/runtime/library";

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

// action/risk.ts

function getLastSaturday(date: Date) {
  const d = new Date(date);
  const day = d.getDay(); // 0=Sun, 6=Sat

  // jika hari ini Sabtu, gunakan hari ini
  if (day === 6) {
    d.setHours(0, 0, 0, 0);
    return d;
  }

  const diff = (day + 1);
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);

  return d;
}

export async function getRiskCustomerByCustomerAndDate(
  customer_number: string,
  date: Date
) {
  // 1. Hitung target hari Sabtu berdasarkan input
  let targetDate = getLastSaturday(date);

  // Helper untuk query DB
  const findRecord = async (d: Date) => {
    const startOfDay = new Date(d);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(d);
    endOfDay.setHours(23, 59, 59, 999);

    return prisma.risk_customers.findFirst({
      where: {
        customer_number,
        date: {
          gte: startOfDay,
          lte: endOfDay
        }
      },
    });
  };

  // 2. Coba cari data untuk targetDate
  let record = await findRecord(targetDate);

  // 3. Jika tidak ada, mundur 1 minggu (Sabtu sebelumnya)
  if (!record) {
    const prevSaturday = new Date(targetDate);
    prevSaturday.setDate(prevSaturday.getDate() - 7);
    record = await findRecord(prevSaturday);
  }

  return record
    ? { success: true, data: record }
    : { success: false, error: "Not found" };
}

export async function getRiskMajelisByCustomerAndDate(
  customer_number: string,
  date: Date
) {
  // 1. Hitung target hari Sabtu
  let targetDate = getLastSaturday(date);

  // Helper untuk query DB
  const findRecord = async (d: Date) => {
    const startOfDay = new Date(d);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(d);
    endOfDay.setHours(23, 59, 59, 999);

    return prisma.risk_majelis.findFirst({
      where: {
        customer_number: {
          has: customer_number
        },
        date: {
          gte: startOfDay,
          lte: endOfDay
        }
      },
    });
  };

  // 2. Coba cari data untuk targetDate
  let record = await findRecord(targetDate);

  // 3. Jika tidak ada, mundur 1 minggu
  if (!record) {
    const prevSaturday = new Date(targetDate);
    prevSaturday.setDate(prevSaturday.getDate() - 7);
    record = await findRecord(prevSaturday);
  }

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
