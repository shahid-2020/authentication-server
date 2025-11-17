import type { Request, Response } from 'express';
import { logger } from '../lib/logger';
import { getRequestContext } from '../lib/request-context';
import { ErrorCode } from '../types/error';
import { getFullUrl } from '../utils/http';

export function routeNotFound(req: Request, res: Response): void {
	const requestId = getRequestContext()?.requestId;
	const url = getFullUrl(req);

	logger.warn({
		requestId,
		type: 'ROUTE_NOT_FOUND',
		message: `${req.method} ${url}`,
	});

	res.status(404).json({
		statusCode: 404,
		message: 'Not Found',
		errorCode: ErrorCode.ROUTE_NOT_FOUND,
		cause: `Route ${req.method} ${url} does not exist`,
		url,
		datetime: new Date().toISOString(),
	});
}
