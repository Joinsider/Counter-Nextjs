import PocketBase from 'pocketbase';

const server = process.env.POCKETBASE_SERVER || 'https://ledschendlich.pockethost.io';

export const pb = new PocketBase(server);

pb.autoCancellation(false);

// Base type for common fields
export type BaseModel = {
  id: string;
  created: string;
  updated: string;
}

// Counter Type model
export type CounterType = BaseModel & {
  title: string;
}

// Counter model with relation to CounterType
export type Counter = BaseModel & {
  value: number;
  date: string;
  type: string; // This holds the ID of the related counter_type
  expand?: {
    type?: CounterType; // For expanded relations
  };
}

// Collection names as constants
export const COUNTER_COLLECTION = 'counter';
export const COUNTER_TYPE_COLLECTION = 'counter_type';
