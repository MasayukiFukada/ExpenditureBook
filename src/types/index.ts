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

export interface DBData {
  monthly: MonthlyData[];
}
