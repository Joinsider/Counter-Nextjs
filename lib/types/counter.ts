import {CounterType} from "@/lib/pocketbase";
import {BaseModel} from "pocketbase";

// Type definitions for counter
export interface Counter extends BaseModel {
  value: number;
  date: string;
  type: string;
  expand?: {
    type?: CounterType;
  };
}


export interface CounterResponse {
  data?: Counter;
  error?: {
    message: string;
    status: number;
  };
}

export interface CounterUpdateResponse {
  success: boolean;
  data?: Counter;
  error?: {
    message: string;
    status: number;
  };
}
