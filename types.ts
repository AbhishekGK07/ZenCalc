
export type Operator = '+' | '-' | '*' | '/' | null;

export interface Calculation {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
}

export interface CalculatorState {
  currentValue: string;
  previousValue: string;
  operator: Operator;
  overwrite: boolean;
  history: Calculation[];
}

export interface AiResponse {
  answer: string;
  explanation?: string;
}
