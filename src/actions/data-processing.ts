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
      .filter((cf: { type: string; }) => cf.type === 'REVENUE')
      .reduce((sum: number, cf: { amount: { toString: () => string; }; }) => sum + parseFloat(cf.amount.toString()), 0);

    const totalExpense = cashFlows
      .filter((cf: { type: string; }) => cf.type === 'EXPENSE')
      .reduce((sum: number, cf: { amount: { toString: () => string; }; }) => sum + parseFloat(cf.amount.toString()), 0);

    const netCashFlow = totalRevenue - totalExpense;

    // Calculate task completion rate
    const completedTasks = customer.task_participants.filter(
      (tp: { task: { task_status: string; }; }) => tp.task.task_status === 'COMPLETED'
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
      cash_flow_history: cashFlows.map((cf: { type: any; amount: { toString: () => string; }; date: any; description: any; }) => ({
        type: cf.type,
        amount: parseFloat(cf.amount.toString()),
        date: cf.date,
        description: cf.description,
      })),
      loan_history: customer.loan_snapshots.map((ls: { principal_amount: { toString: () => string; }; outstanding_amount: { toString: () => string; }; dpd: any; created_at: any; }) => ({
        principal_amount: parseFloat(ls.principal_amount.toString()),
        outstanding_amount: parseFloat(ls.outstanding_amount.toString()),
        dpd: ls.dpd,
        created_at: ls.created_at,
      })),
    };

    console.log(predictionData);
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

    const customerNumbers = [...new Set(loanSnapshots.map((ls: { customer_number: any; }) => ls.customer_number))];

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
    // participant_id in TaskParticipant maps to customer_number in Customer
    const customerNumbers = [
      ...new Set(
        tasks.flatMap((task: { participants: any[]; }) => task.participants.map((p: { participant_id: any; }) => p.participant_id))
      ),
    ];

    return { success: true, data: customerNumbers };
  } catch (error) {
    console.error('Error fetching customers by branch:', error);
    return { success: false, error: 'Failed to fetch customers by branch' };
  }
}

/**
 * Feature columns required for the prediction API
 * Note: Actual column names in loan_latest table (lowercase marital columns)
 */
const FEATURE_COLS = [
  'amount',
  'principal_amount',
  'outstanding_amount',
  'dpd',
  'religion',
  'utilization',
  'is_high_dpd',
  'is_evergreen',
  'age_years',
  'num_bills_so_far',
  'num_paid_so_far',
  'scheduled_dow',
  'scheduled_dom',
  'marital_married',  // lowercase in DB
  'marital_widowed',  // lowercase in DB
  'cum_paid',
  'ever_paid_raw',
  'marital_nan',
  'purpose_freq',
  'weekly_revenue',
  'weekly_expense',
  'rev_lag1',
  'exp_lag1',
  'margin_lag1',
  'rev_mean_4',
  'rev_std_4',
  'rev_vol_4',
  'rev_trend_4',
];

/**
 * Get prediction body by querying loan_latest table for a customer
 * Returns the formatted JSON body ready to send to the prediction API
 * @param customer_number - The customer_number (not customer_id) from loan_latest table
 */
export async function getPredictionBody(customer_number: string) {
  try {
    // Query loan_latest table using raw SQL since it's not in Prisma schema
    // Column names are from constant array so safe to interpolate
    const escapedCols = FEATURE_COLS.map(col => `"${col}"`).join(', ');
    
    // Escape customer_number to prevent SQL injection
    // Replace single quotes with double single quotes for SQL escaping
    const escapedCustomerNumber = customer_number.replace(/'/g, "''");
    
    // Build the query - column names are safe, customer_number is escaped
    // Note: loan_latest uses customer_number, not customer_id
    const query = `
      SELECT ${escapedCols}
      FROM loan_latest
      WHERE customer_number = '${escapedCustomerNumber}'
      LIMIT 1
    `;
    
    const result = await prisma.$queryRawUnsafe<Array<Record<string, any>>>(query);

    if (!result || result.length === 0) {
      return { 
        success: false, 
        error: `No data found in loan_latest for customer_number: ${customer_number}` 
      };
    }

    const row = result[0];

    // Map the row data to the required format
    // Convert boolean-like fields and ensure proper types
    // Note: API expects marital_MARRIED/marital_WIDOWED (uppercase) but DB has lowercase
    const instance = {
      amount: parseFloat(row.amount) || 0,
      principal_amount: parseFloat(row.principal_amount) || 0,
      outstanding_amount: parseFloat(row.outstanding_amount) || 0,
      dpd: parseInt(row.dpd) || 0,
      religion: parseInt(row.religion) || 0,
      utilization: parseFloat(row.utilization) || 0,
      is_high_dpd: row.is_high_dpd === true || row.is_high_dpd === 1 || row.is_high_dpd === '1' ? 1 : 0,
      is_evergreen: row.is_evergreen === true || row.is_evergreen === 1 || row.is_evergreen === '1' ? 1 : 0,
      age_years: parseFloat(row.age_years) || 0,
      num_bills_so_far: parseInt(row.num_bills_so_far) || 0,
      num_paid_so_far: parseInt(row.num_paid_so_far) || 0,
      scheduled_dow: parseInt(row.scheduled_dow) || 0,
      scheduled_dom: parseInt(row.scheduled_dom) || 0,
      // Map from DB lowercase to API uppercase format
      marital_MARRIED: row.marital_married === true || row.marital_married === 1 || row.marital_married === '1' || row.marital_married === 'true',
      marital_WIDOWED: row.marital_widowed === true || row.marital_widowed === 1 || row.marital_widowed === '1' || row.marital_widowed === 'true',
      cum_paid: parseInt(row.cum_paid) || 0,
      ever_paid_raw: parseInt(row.ever_paid_raw) || 0,
      marital_nan: row.marital_nan === true || row.marital_nan === 1 || row.marital_nan === '1' || row.marital_nan === 'true',
      purpose_freq: parseInt(row.purpose_freq) || 0,
      weekly_revenue: parseFloat(row.weekly_revenue) || 0,
      weekly_expense: parseFloat(row.weekly_expense) || 0,
      rev_lag1: parseFloat(row.rev_lag1) || 0,
      exp_lag1: parseFloat(row.exp_lag1) || 0,
      margin_lag1: parseFloat(row.margin_lag1) || 0,
      rev_mean_4: parseFloat(row.rev_mean_4) || 0,
      rev_std_4: parseFloat(row.rev_std_4) || 0,
      rev_vol_4: parseFloat(row.rev_vol_4) || 0,
      rev_trend_4: parseFloat(row.rev_trend_4) || 0,
    };

    const body = {
      instances: [instance],
    };

    return { success: true, data: body };
  } catch (error: any) {
    console.error('Error getting prediction body:', error);
    return { 
      success: false, 
      error: `Failed to get prediction body: ${error.message}` 
    };
  }
}

/**
 * Get weekly revenue and expense for a customer within a specific week
 * Calculates the week start (Monday) and end (Sunday) for the given date
 * @param customer_number - The customer_number to query
 * @param date - The date to calculate the week for (week will be Monday-Sunday containing this date)
 * @returns Object with weekly_revenue and weekly_expense
 */
export async function getWeeklyCashFlow(customer_number: string, date: Date) {
  try {
    // Calculate week start (Monday) and end (Sunday) for the given date
    const targetDate = new Date(date);
    const dayOfWeek = targetDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Convert to Monday = 0
    
    // Get Monday of the week
    const weekStart = new Date(targetDate);
    weekStart.setDate(targetDate.getDate() - daysFromMonday);
    weekStart.setHours(0, 0, 0, 0);
    
    // Get Sunday of the week (end of week)
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);
    
    // Query cash flows for this customer in this week
    const cashFlows = await prisma.cashFlow.findMany({
      where: {
        customer_number,
        date: {
          gte: weekStart,
          lte: weekEnd,
        },
      },
    });
    
    // Calculate totals by type
    let weeklyRevenue = 0;
    let weeklyExpense = 0;
    
    cashFlows.forEach((cf) => {
      const amount = parseFloat(cf.amount.toString());
      if (cf.type === 'REVENUE') {
        weeklyRevenue += amount;
      } else if (cf.type === 'EXPENSE') {
        weeklyExpense += amount;
      }
    });
    
    return {
      success: true,
      data: {
        weekly_revenue: weeklyRevenue,
        weekly_expense: weeklyExpense,
        week_start: weekStart,
        week_end: weekEnd,
      },
    };
  } catch (error: any) {
    console.error('Error getting weekly cash flow:', error);
    return {
      success: false,
      error: `Failed to get weekly cash flow: ${error.message}`,
    };
  }
}

/**
 * Hit the prediction endpoint with the formatted body
 * Returns the prediction score from the API
 * @param customer_number - The customer_number from loan_latest table
 * @param predictionDate - Optional date to calculate weekly cash flow for (defaults to today)
 */
export async function predictRiskScore(customer_number: string, predictionDate?: Date) {
  try {
    // Use provided date or default to today
    const targetDate = predictionDate || new Date();
    
    // First get the prediction body
    const bodyResult = await getPredictionBody(customer_number);
    
    if (!bodyResult.success || !bodyResult.data) {
      return {
        success: false,
        error: bodyResult.error || 'Failed to prepare prediction body',
      };
    }

    // Get weekly cash flow for the specified date
    const weeklyCashFlowResult = await getWeeklyCashFlow(customer_number, targetDate);
    
    if (!weeklyCashFlowResult.success || !weeklyCashFlowResult.data) {
      return {
        success: false,
        error: weeklyCashFlowResult.error || 'Failed to get weekly cash flow',
      };
    }

    // Replace weekly_revenue and weekly_expense in the prediction body
    if (bodyResult.data.instances && bodyResult.data.instances.length > 0) {
      bodyResult.data.instances[0].weekly_revenue = weeklyCashFlowResult.data.weekly_revenue;
      bodyResult.data.instances[0].weekly_expense = weeklyCashFlowResult.data.weekly_expense;
    }

    // Hit the prediction endpoint
    const response = await fetch(
      'https://aura-risk-api-164395237442.asia-southeast2.run.app/predict',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyResult.data),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: `API request failed with status ${response.status}: ${errorText}`,
      };
    }

    const predictionResult = await response.json();
    console.log(predictionResult);
    
    return {
      success: true,
      data: predictionResult,
    };
  } catch (error: any) {
    console.error('Error predicting risk score:', error);
    return {
      success: false,
      error: `Failed to predict risk score: ${error.message}`,
    };
  }
}

/**
 * Save risk score to risk_customers table
 * Extracts the risk value from the API response and stores it
 * @param customer_number - The customer_number
 * @param riskResponse - The API response from predictRiskScore (format: { risk: [number] })
 * @param date - Optional date for the risk record (defaults to now)
 * @returns Success status and the created record
 */
export async function saveRiskScore(
  customer_number: string,
  riskResponse: { risk: number[] },
  date?: Date
) {
  try {
    // Extract risk value from the response array
    // API returns: { "risk": [0.07162851812969029] }
    if (!riskResponse.risk || !Array.isArray(riskResponse.risk) || riskResponse.risk.length === 0) {
      return {
        success: false,
        error: 'Invalid risk response format. Expected { risk: [number] }',
      };
    }

    const riskValue = riskResponse.risk[0];
    const riskDate = date || new Date();

    // Create record in risk_customers table
    const record = await prisma.risk_customers.create({
      data: {
        customer_number,
        risk: riskValue,
        date: riskDate,
      },
    });

    return {
      success: true,
      data: record,
    };
  } catch (error: any) {
    console.error('Error saving risk score:', error);
    return {
      success: false,
      error: `Failed to save risk score: ${error.message}`,
    };
  }
}

/**
 * Predict risk score and automatically save it to the database
 * This is a convenience function that combines predictRiskScore and saveRiskScore
 * @param customer_number - The customer_number from loan_latest table
 * @param predictionDate - Optional date to calculate weekly cash flow for (defaults to today)
 * @param saveToDb - Whether to save the result to risk_customers table (default: true)
 * @returns Success status, prediction result, and saved record (if saved)
 */
export async function predictAndSaveRiskScore(
  customer_number: string,
  predictionDate?: Date,
  saveToDb: boolean = true
) {
  try {
    // Get prediction
    const predictionResult = await predictRiskScore(customer_number, predictionDate);

    if (!predictionResult.success || !predictionResult.data) {
      return {
        success: false,
        error: predictionResult.error || 'Failed to get prediction',
      };
    }

    // Save to database if requested
    let savedRecord = null;
    if (saveToDb) {
      const saveResult = await saveRiskScore(
        customer_number,
        predictionResult.data,
        predictionDate
      );

      if (!saveResult.success) {
        // Log error but don't fail the whole operation
        console.warn('Failed to save risk score to database:', saveResult.error);
      } else {
        savedRecord = saveResult.data;
      }
    }

    return {
      success: true,
      data: {
        prediction: predictionResult.data,
        savedRecord,
      },
    };
  } catch (error: any) {
    console.error('Error in predictAndSaveRiskScore:', error);
    return {
      success: false,
      error: `Failed to predict and save risk score: ${error.message}`,
    };
  }
}
