import PocketBase from 'pocketbase';
import { POCKETBASE_URL } from '../config';

// Single PocketBase instance
export const pocketbase = new PocketBase(POCKETBASE_URL);