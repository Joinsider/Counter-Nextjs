// Type definitions for counter
export interface Counter {
  id: string;
  value: number;
  created: string;
  updated: string;
}

export interface CounterResponse {
  data?: Counter;
  error?: string;
}