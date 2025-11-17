import { AsyncLocalStorage } from 'node:async_hooks';
import { RequestContext } from '../types/context';

export const asyncLocalStorage = new AsyncLocalStorage<RequestContext>();

export function getRequestContext() {
	return asyncLocalStorage.getStore();
}
