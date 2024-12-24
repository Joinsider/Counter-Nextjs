// Collection names with type safety
import {Counter, CounterType} from "@/lib/pocketbase";

export const Collections = {
  COUNTER: 'counter',
  COUNTER_TYPE: 'counter_type',
} as const;

// Type for collection names
export type CollectionName = typeof Collections[keyof typeof Collections];

// Helper type to ensure type safety when using collection names
export type CollectionRecords = {
  [Collections.COUNTER]: Counter;
  [Collections.COUNTER_TYPE]: CounterType;
}
