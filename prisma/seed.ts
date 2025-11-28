import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';

const prisma = new PrismaClient();

interface CustomerCSV {
  customer_number: string;
  date_of_birth: string;
  marital_status: string;
  religion: string;
  purpose: string;
}

interface TaskCSV {
  task_id: string;
  task_type: string;
  task_status: string;
  start_datetime: string;
  end_datetime: string;
  actual_datetime: string;
  latitude: string;
  longitude: string;
  branch_id: string;
}

interface TaskParticipantCSV {
  task_id: string;
  participant_type: string;
  participant_id: string;
  customer_number: string;
  is_face_matched: string; // 'True' or 'False' from CSV
  is_qr_matched: string; // 'True' or 'False' from CSV
  payment_amount: string; // Can be empty string
}

interface LoanSnapshotCSV {
  customer_number: string;
  loan_id: string;
  principal_amount: string;
  outstanding_amount: string;
  dpd: string;
}

interface BillCSV {
  loan_id: string;
  bill_id: string;
  bill_scheduled_date: string;
  bill_paid_date: string; // Empty string if unpaid
  amount: string;
  paid_amount: string;
}

/**
 * Read and parse CSV file
 */
function readCSV<T>(filePath: string): T[] {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });
    return records as T[];
  } catch (error) {
    console.error(`Error reading CSV file ${filePath}:`, error);
    return [];
  }
}

/**
 * Seed Customers
 */
async function seedCustomers(dataDir: string) {
  console.log('Seeding customers...');
  const customersPath = path.join(dataDir, 'customers.csv');
  
  if (!fs.existsSync(customersPath)) {
    console.warn('customers.csv not found, skipping...');
    return;
  }

  const customers = readCSV<CustomerCSV>(customersPath);
  
  if (customers.length === 0) {
    console.warn('No customer data found');
    return;
  }

  console.log(`Found ${customers.length} customers to seed`);

  const result = await prisma.customer.createMany({
    data: customers.map((c) => ({
      customer_number: c.customer_number,
      date_of_birth: c.date_of_birth ? new Date(c.date_of_birth) : null,
      marital_status: c.marital_status || null,
      religion: c.religion || null,
      purpose: c.purpose || null,
      preference: null, // Empty by default
    })),
    skipDuplicates: true,
  });

  console.log(`✓ Seeded ${result.count} customers`);
}

/**
 * Seed Tasks
 */
async function seedTasks(dataDir: string) {
  console.log('Seeding tasks...');
  const tasksPath = path.join(dataDir, 'tasks.csv');
  
  if (!fs.existsSync(tasksPath)) {
    console.warn('tasks.csv not found, skipping...');
    return;
  }

  const tasks = readCSV<TaskCSV>(tasksPath);
  
  if (tasks.length === 0) {
    console.warn('No task data found');
    return;
  }

  console.log(`Found ${tasks.length} tasks to seed`);

  const result = await prisma.task.createMany({
    data: tasks.map((t) => ({
      task_id: t.task_id,
      task_type: t.task_type,
      task_status: t.task_status,
      start_datetime: new Date(t.start_datetime),
      end_datetime: new Date(t.end_datetime),
      actual_datetime: t.actual_datetime ? new Date(t.actual_datetime) : null,
      latitude: t.latitude && t.latitude.trim() !== '' ? parseFloat(t.latitude) : null,
      longitude: t.longitude && t.longitude.trim() !== '' ? parseFloat(t.longitude) : null,
      branch_id: t.branch_id,
    })),
    skipDuplicates: true,
  });

  console.log(`✓ Seeded ${result.count} tasks`);
}

/**
 * Seed Task Participants
 */
async function seedTaskParticipants(dataDir: string) {
  console.log('Seeding task participants...');
  const participantsPath = path.join(dataDir, 'task_participants.csv');
  
  if (!fs.existsSync(participantsPath)) {
    console.warn('task_participants.csv not found, skipping...');
    return;
  }

  const participants = readCSV<TaskParticipantCSV>(participantsPath);
  
  if (participants.length === 0) {
    console.warn('No task participant data found');
    return;
  }

  console.log(`Found ${participants.length} task participants to seed`);

  // Get all existing task_ids to validate foreign keys
  const existingTasks = await prisma.task.findMany({
    select: { task_id: true }
  });
  const existingTaskIds = new Set(existingTasks.map(t => t.task_id));
  console.log(`Found ${existingTaskIds.size} existing tasks in database`);

  // Get all existing customer_numbers to validate foreign keys
  const existingCustomers = await prisma.customer.findMany({
    select: { customer_number: true }
  });
  const existingCustomerNumbers = new Set(existingCustomers.map(c => c.customer_number));
  console.log(`Found ${existingCustomerNumbers.size} existing customers in database`);

  // Filter participants with valid foreign keys
  const validParticipants = participants.filter((p) => {
    const hasValidTask = existingTaskIds.has(p.task_id);
    const hasValidCustomer = existingCustomerNumbers.has(p.participant_id);
    return hasValidTask && hasValidCustomer;
  });

  const invalidCount = participants.length - validParticipants.length;
  if (invalidCount > 0) {
    console.warn(`⚠ Skipping ${invalidCount} participants with invalid task_id or participant_id`);
  }

  if (validParticipants.length === 0) {
    console.warn('No valid task participants to seed');
    return;
  }

  console.log(`Seeding ${validParticipants.length} valid task participants...`);

  const result = await prisma.taskParticipant.createMany({
    data: validParticipants.map((p) => ({
      task_id: p.task_id,
      participant_type: p.participant_type,
      participant_id: p.participant_id,
      is_face_matched: p.is_face_matched === 'True',
      is_qr_matched: p.is_qr_matched === 'True',
      payment_amount: p.payment_amount && p.payment_amount.trim() !== '' 
        ? parseFloat(p.payment_amount) 
        : null,
    })),
    skipDuplicates: true,
  });

  console.log(`✓ Seeded ${result.count} task participants`);
}

/**
 * Seed Loan Snapshots
 */
async function seedLoanSnapshots(dataDir: string) {
  console.log('Seeding loan snapshots...');
  const snapshotsPath = path.join(dataDir, 'loan_snapshots.csv');
  
  if (!fs.existsSync(snapshotsPath)) {
    console.warn('loan_snapshots.csv not found, skipping...');
    return;
  }

  const snapshots = readCSV<LoanSnapshotCSV>(snapshotsPath);
  
  if (snapshots.length === 0) {
    console.warn('No loan snapshot data found');
    return;
  }

  console.log(`Found ${snapshots.length} loan snapshots to seed`);

  const result = await prisma.loanSnapshot.createMany({
    data: snapshots.map((s) => ({
      customer_number: s.customer_number,
      loan_id: s.loan_id,
      principal_amount: parseFloat(s.principal_amount),
      outstanding_amount: parseFloat(s.outstanding_amount),
      dpd: parseInt(s.dpd),
    })),
    skipDuplicates: true,
  });

  console.log(`✓ Seeded ${result.count} loan snapshots`);
}

/**
 * Seed Bills
 */
async function seedBills(dataDir: string) {
  console.log('Seeding bills...');
  const billsPath = path.join(dataDir, 'bills.csv');
  
  if (!fs.existsSync(billsPath)) {
    console.warn('bills.csv not found, skipping...');
    return;
  }

  const bills = readCSV<BillCSV>(billsPath);
  
  if (bills.length === 0) {
    console.warn('No bill data found');
    return;
  }

  console.log(`Found ${bills.length} bills to seed`);

  // Filter out bills with invalid dates
  const validBills = bills.filter((b) => {
    const scheduledDate = new Date(b.bill_scheduled_date);
    const isValid = !isNaN(scheduledDate.getTime());
    return isValid;
  });

  const invalidCount = bills.length - validBills.length;
  if (invalidCount > 0) {
    console.warn(`⚠ Skipping ${invalidCount} bills with invalid dates`);
  }

  if (validBills.length === 0) {
    console.warn('No valid bills to seed');
    return;
  }

  console.log(`Seeding ${validBills.length} valid bills...`);

  const result = await prisma.bill.createMany({
    data: validBills.map((b) => ({
      loan_id: b.loan_id,
      bill_id: b.bill_id,
      bill_scheduled_date: new Date(b.bill_scheduled_date),
      bill_paid_date: b.bill_paid_date && b.bill_paid_date.trim() !== '' 
        ? new Date(b.bill_paid_date) 
        : null,
      amount: parseFloat(b.amount),
      paid_amount: parseFloat(b.paid_amount),
    })),
    skipDuplicates: true,
  });

  console.log(`✓ Seeded ${result.count} bills`);
}

/**
 * Main seed function
 */
async function main() {
  console.log('🌱 Starting database seeding...\n');

  // Default to prisma/data directory, but can be overridden
  const dataDir = process.env.DATA_DIR || path.join(__dirname, 'data');
  
  console.log(`Using data directory: ${dataDir}\n`);

  try {
    // Seed in order to respect foreign key constraints
    await seedCustomers(dataDir);
    await seedTasks(dataDir);
    await seedTaskParticipants(dataDir);
    await seedLoanSnapshots(dataDir);
    await seedBills(dataDir); // Bills reference loan_id from loan_snapshots

    console.log('\n✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('\n❌ Error during seeding:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
