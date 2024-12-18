import PocketBase from 'pocketbase';

export const pb = new PocketBase('https://ledschendlich.pockethost.io');

pb.autoCancellation(false);

export type Counter = {
  id: string;
  value: number;
  date: string;
  created: string;
  updated: string;
}

export const COUNTER_COLLECTION = 'counter';