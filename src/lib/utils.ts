import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function for merging Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format currency to Indonesian Rupiah (IDR)
 */
export function formatCurrency(amount: number | string): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numAmount);
}

/**
 * Format date to Indonesian locale
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
}

/**
 * Format date with time in Indonesian locale
 */
export function formatDateTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(dateObj);
}

/**
 * Format date for forms (YYYY-MM-DD)
 */
export function formatDateForInput(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toISOString().split('T')[0];
}

/**
 * Format time for display (HH:MM)
 */
export function formatTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(dateObj);
}

/**
 * Validate customer number format
 */
export function isValidCustomerNumber(customerNumber: string): boolean {
  return /^[A-Za-z0-9-]+$/.test(customerNumber);
}

/**
 * Parse CSV string value to appropriate type
 */
export function parseCsvValue(value: string, type: 'string' | 'number' | 'date' | 'boolean'): unknown {
  if (!value || value.trim() === '') return null;
  
  switch (type) {
    case 'number':
      return parseFloat(value);
    case 'date':
      return new Date(value);
    case 'boolean':
      return value.toLowerCase() === 'true';
    default:
      return value;
  }
}

/**
 * Format number with thousand separators (Indonesian style)
 */
export function formatNumber(num: number | string): string {
  const numValue = typeof num === 'string' ? parseFloat(num) : num;
  return new Intl.NumberFormat('id-ID').format(numValue);
}

/**
 * Calculate days past due
 */
export function calculateDaysPastDue(dueDate: Date | string): number {
  const due = typeof dueDate === 'string' ? new Date(dueDate) : dueDate;
  const today = new Date();
  const diffTime = today.getTime() - due.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
}
