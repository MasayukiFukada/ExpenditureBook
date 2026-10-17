export interface Expenditure {
  id: string;
  category: string;
  amount: number;
  note: string;
  updated_at: string;
}

export interface DayData {
  [day: string]: Expenditure[];
}

export interface MonthlyData {
  year_month: string;
  comment: string;
  days: DayData;
}

export interface UnassignedItem {
  yearMonth: string;
  day: string;
  date: string; // YYYY-MM-DD
  id: string;
  category: string;
  amount: number;
  note: string;
  updated_at: string;
}

export interface PlanHistoryEntry {
  id: string;
  plan_name?: string;
  price?: number; // same unit as Expenditure.amount
  currency?: string;
  billing_cycle?: { unit: string; interval?: number };
  start_date?: string;
  end_date?: string | null;
  reason?: string;
  changed_by?: string;
  created_at?: string;
  metadata?: any;
}

export interface Subscription {
  id: string;
  name: string;
  provider?: string;
  category?: string;
  status?:
    | "active"
    | "trial"
    | "past_due"
    | "canceled"
    | "paused"
    | "expired"
    | "pending";
  account?: {
    login_id?: string;
    associated_email?: string;
  };
  contract?: {
    plan_name?: string;
    price?: number; // same unit as Expenditure.amount
    currency?: string;
    billing_cycle?: {
      unit: "day" | "week" | "month" | "year" | "custom";
      interval?: number;
    };
    auto_renew?: boolean;
    effective_from?: string;
  };
  plan_history?: PlanHistoryEntry[];
  schedule?: {
    start_date?: string;
    next_billing_date?: string;
    cancellation_deadline?: string;
    grace_period_days?: number;
  };
  payment?: {
    method?: string;
    provider?: string;
    payment_profile_id?: string;
    last4?: string;
    last_4_digits?: string; // サンプルのキーに合わせるため
    brand?: string;
    exp_month?: number;
    exp_year?: number;
  };
  last_payment?: {
    date?: string;
    amount?: number;
    currency?: string;
    status?: string;
    invoice_id?: string;
  };
  meta?: {
    tags?: string[];
    url?: string;
    notes?: string;
  };
  external?: {
    subscription_id?: string;
    customer_id?: string;
  };
  created_at?: string;
  updated_at?: string;
}

export interface DBData {
  monthly: MonthlyData[];
  subscriptions?: Subscription[];
}
