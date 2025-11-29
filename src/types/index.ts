// Global type definitions

export type CashFlowType = 'EXPENSE' | 'REVENUE';

export interface CashFlow {
  id: string;
  type: CashFlowType;
  amount: number;
  description: string;
  customer_number: string;
  date: Date;
}

export interface CashFlowTotal {
  id: string;
  type: string;
  amount: number;
  customer_number: string;
  date: Date;
}

export interface Prediction {
  id: string;
  customer_number: string;
  prediction: number;
  date: Date;
}

export interface PredictionMajelis {
  id: string;
  id_majelis: string;
  id_user: string[];
  prediction: number;
  date: Date;
}

export interface Bill {
  id: string;
  loan_id: string;
  bill_id: string;
  bill_scheduled_date: Date;
  bill_paid_date: Date | null;
  amount: number;
  paid_amount: number;
  created_at: Date;
}

export interface Customer {
  id: string;
  customer_number: string;
  date_of_birth: Date | null;
  marital_status: string | null;
  religion: string | null;
  purpose: string | null;
  preference: string | null;
  created_at: Date;
}

export interface Task {
  id: string;
  task_id: string;
  task_type: string;
  task_status: string;
  start_datetime: Date;
  end_datetime: Date;
  actual_datetime: Date | null;
  latitude: number | null;
  longitude: number | null;
  branch_id: string;
  created_at: Date;
}

export interface TaskParticipant {
  id: string;
  task_id: string;
  participant_type: string;
  participant_id: string;
  is_face_matched: boolean;
  is_qr_matched: boolean;
  payment_amount: number | null;
  created_at: Date;
}

export interface LoanSnapshot {
  id: string;
  customer_number: string;
  loan_id: string;
  principal_amount: number;
  outstanding_amount: number;
  dpd: number;
  created_at: Date;
}
