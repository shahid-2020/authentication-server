import type { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'node:crypto';
import { getHeader } from '../utils/http';
import { asyncLocalStorage } from '../lib/request-context';
import type { RequestContext } from '../types/context';

export function requestId(
	req: Request,
	res: Response,
	next: NextFunction,
): void {
	const requestId = getHeader(req, 'x-request-id') || randomUUID();

	res.setHeader('X-Request-ID', requestId);

	const ctx: RequestContext = {
		requestId,
		startTime: process.hrtime(),
	};

	asyncLocalStorage.run(ctx, () => {
		next();
	});
}
