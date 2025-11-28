'use server';

import { prisma } from '@/lib/db';

/**
 * Prepare customer data for Vertex AI prediction
 * This function gathers all relevant data for a customer to send to Vertex AI
 */
export async function prepareCustomerDataForPrediction(customer_number: string) {
  try {
    // Get customer basic info
    const customer = await prisma.customer.findUnique({
      where: { customer_number },
      include: {
        loan_snapshots: {
          orderBy: { created_at: 'desc' },
          take: 10, // Last 10 loan snapshots
        },
        task_participants: {
          include: {
            task: true,
          },
          orderBy: { created_at: 'desc' },
          take: 20, // Last 20 tasks
        },
      },
    });

    if (!customer) {
      return { success: false, error: 'Customer not found' };
    }

    // Get cash flow data
    const cashFlows = await prisma.cashFlow.findMany({
      where: { customer_number },
      orderBy: { date: 'desc' },
      take: 50, // Last 50 transactions
    });

    // Calculate aggregated metrics
    const totalRevenue = cashFlows
      .filter((cf) => cf.type === 'REVENUE')
      .reduce((sum, cf) => sum + parseFloat(cf.amount.toString()), 0);

    const totalExpense = cashFlows
      .filter((cf) => cf.type === 'EXPENSE')
      .reduce((sum, cf) => sum + parseFloat(cf.amount.toString()), 0);

    const netCashFlow = totalRevenue - totalExpense;

    // Calculate task completion rate
    const completedTasks = customer.task_participants.filter(
      (tp) => tp.task.task_status === 'COMPLETED'
    ).length;
    const taskCompletionRate =
      customer.task_participants.length > 0
        ? completedTasks / customer.task_participants.length
        : 0;

    // Get latest loan info
    const latestLoan = customer.loan_snapshots[0];

    // Prepare data structure for Vertex AI
    const predictionData = {
      customer_info: {
        customer_number: customer.customer_number,
        date_of_birth: customer.date_of_birth,
        marital_status: customer.marital_status,
        religion: customer.religion,
        purpose: customer.purpose,
      },
      financial_metrics: {
        total_revenue: totalRevenue,
        total_expense: totalExpense,
        net_cash_flow: netCashFlow,
        latest_loan: latestLoan
          ? {
              principal_amount: parseFloat(latestLoan.principal_amount.toString()),
              outstanding_amount: parseFloat(latestLoan.outstanding_amount.toString()),
              dpd: latestLoan.dpd,
            }
          : null,
      },
      behavioral_metrics: {
        task_completion_rate: taskCompletionRate,
        total_tasks: customer.task_participants.length,
        completed_tasks: completedTasks,
      },
      cash_flow_history: cashFlows.map((cf) => ({
        type: cf.type,
        amount: parseFloat(cf.amount.toString()),
        date: cf.date,
        description: cf.description,
      })),
      loan_history: customer.loan_snapshots.map((ls) => ({
        principal_amount: parseFloat(ls.principal_amount.toString()),
        outstanding_amount: parseFloat(ls.outstanding_amount.toString()),
        dpd: ls.dpd,
        created_at: ls.created_at,
      })),
    };

    return { success: true, data: predictionData };
  } catch (error) {
    console.error('Error preparing customer data:', error);
    return { success: false, error: 'Failed to prepare customer data' };
  }
}

/**
 * Prepare majelis (group) data for Vertex AI prediction
 * This function gathers data for multiple customers in a majelis
 */
export async function prepareMajelisDataForPrediction(customer_numbers: string[]) {
  try {
    const customersData = [];

    for (const customer_number of customer_numbers) {
      const result = await prepareCustomerDataForPrediction(customer_number);
      if (result.success && result.data) {
        customersData.push(result.data);
      }
    }

    // Calculate aggregate majelis metrics
    const majelisMetrics = {
      total_members: customersData.length,
      aggregate_metrics: {
        total_net_cash_flow: customersData.reduce(
          (sum, cd) => sum + (cd.financial_metrics.net_cash_flow || 0),
          0
        ),
        average_task_completion: customersData.reduce(
          (sum, cd) => sum + (cd.behavioral_metrics.task_completion_rate || 0),
          0
        ) / customersData.length,
        total_outstanding_loans: customersData.reduce(
          (sum, cd) => sum + (cd.financial_metrics.latest_loan?.outstanding_amount || 0),
          0
        ),
        average_dpd: customersData.reduce(
          (sum, cd) => sum + (cd.financial_metrics.latest_loan?.dpd || 0),
          0
        ) / customersData.length,
      },
      members_data: customersData,
    };

    return { success: true, data: majelisMetrics };
  } catch (error) {
    console.error('Error preparing majelis data:', error);
    return { success: false, error: 'Failed to prepare majelis data' };
  }
}

/**
 * Get all customers with high-risk indicators
 * Useful for batch prediction processing
 */
export async function getHighRiskCustomers() {
  try {
    // Get customers with high DPD or low task completion
    const loanSnapshots = await prisma.loanSnapshot.findMany({
      where: {
        dpd: {
          gte: 30, // 30 days or more past due
        },
      },
      orderBy: {
        dpd: 'desc',
      },
      take: 100,
    });

    const customerNumbers = [...new Set(loanSnapshots.map((ls) => ls.customer_number))];

    return { success: true, data: customerNumbers };
  } catch (error) {
    console.error('Error fetching high-risk customers:', error);
    return { success: false, error: 'Failed to fetch high-risk customers' };
  }
}

/**
 * Get customers by majelis/branch for group predictions
 */
export async function getCustomersByBranch(branch_id: string) {
  try {
    // Get tasks for this branch
    const tasks = await prisma.task.findMany({
      where: { branch_id },
      include: {
        participants: true,
      },
    });

    // Extract unique customer numbers
    const customerNumbers = [
      ...new Set(
        tasks.flatMap((task) => task.participants.map((p) => p.participant_id))
      ),
    ];

    return { success: true, data: customerNumbers };
  } catch (error) {
    console.error('Error fetching customers by branch:', error);
    return { success: false, error: 'Failed to fetch customers by branch' };
  }
}
