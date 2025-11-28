'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export interface CreateCustomerInput {
    customer_number: string;
    date_of_birth?: Date;
    marital_status?: string;
    religion?: string;
    purpose?: string;
    preference?: string;
}

export interface UpdateCustomerInput {
    date_of_birth?: Date;
    marital_status?: string;
    religion?: string;
    purpose?: string;
    preference?: string;
}

/* Normalize date (optional) */
function normalize(date?: Date) {
    if (!date) return undefined;
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
}

/* CREATE */
export async function createCustomer(data: CreateCustomerInput) {
    const record = await prisma.customer.create({
        data: {
            customer_number: data.customer_number,
            date_of_birth: normalize(data.date_of_birth),
            marital_status: data.marital_status,
            religion: data.religion,
            purpose: data.purpose,
            preference: data.preference,
            created_at: new Date()
        },
    });

    revalidatePath('/dashboard');
    return { success: true, data: record };
}

/* GET ALL */
export async function getAllCustomers() {
    const list = await prisma.customer.findMany({
        orderBy: { created_at: 'desc' }
    });

    return { success: true, data: list };
}

/* GET BY CUSTOMER_NUMBER */
export async function getCustomerByCustomerNumber(customer_number: string) {
    const record = await prisma.customer.findFirst({
        where: { customer_number },
    });

    return record
        ? { success: true, data: record }
        : { success: false, error: "Customer not found" };
}

/* UPDATE BY CUSTOMER_NUMBER */
export async function updateCustomer(customer_number: string, data: UpdateCustomerInput) {
    const existing = await prisma.customer.findFirst({ where: { customer_number } });
    if (!existing) return { success: false, error: "Customer not found" };

    const updated = await prisma.customer.update({
        where: { customer_number },
        data: {
            date_of_birth: normalize(data.date_of_birth) ?? existing.date_of_birth,
            marital_status: data.marital_status ?? existing.marital_status,
            religion: data.religion ?? existing.religion,
            purpose: data.purpose ?? existing.purpose,
            preference: data.preference ?? existing.preference
        },
    });

    revalidatePath('/dashboard');
    return { success: true, data: updated };
}

/* DELETE BY CUSTOMER_NUMBER */
export async function deleteCustomer(customer_number: string) {
    const existing = await prisma.customer.findFirst({ where: { customer_number } });
    if (!existing) return { success: false, error: "Customer not found" };

    await prisma.customer.delete({
        where: { customer_number },
    });

    revalidatePath('/dashboard');
    return { success: true };
}
