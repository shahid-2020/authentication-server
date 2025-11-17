import type { Request, Response, NextFunction } from 'express';
import { getRequestContext } from '../lib/request-context';
import { logger } from '../lib/logger';
import { getFullUrl } from '../utils/http';

function getDuration(startTime: [number, number]): number {
	const diff = process.hrtime(startTime);
	return diff[0] * 1000 + diff[1] / 1000000;
}

export function httpLogging(
	req: Request,
	res: Response,
	next: NextFunction,
): void {
	const context = getRequestContext();
	const requestId = context?.requestId;
	const url = getFullUrl(req);

	const requestLog = {
		requestId,
		type: 'HTTP',
		msg: 'Request - Incoming',
		method: req.method,
		url,
		path: req.path,
		query: req.query,
		params: req.params,
		headers: req.headers,
		body: req.body,
		ip: req.ip || req.socket.remoteAddress,
	};

	logger.info(requestLog);

	const originalJson = res.json.bind(res);
	const originalSend = res.send.bind(res);

	let responseBody: unknown;

	res.json = (body: unknown) => {
		responseBody = body;
		return originalJson(body);
	};

	res.send = (body: unknown) => {
		if (!responseBody) {
			responseBody = body;
		}
		return originalSend(body);
	};

	res.on('finish', () => {
		const duration = context?.startTime ? getDuration(context.startTime) : 0;

		const responseLog = {
			requestId,
			type: 'HTTP',
			msg: 'Response - Outgoing',
			method: req.method,
			url,
			statusCode: res.statusCode,
			statusMessage: res.statusMessage,
			headers: res.getHeaders(),
			body: responseBody,
			durationMs: parseFloat(duration.toFixed(3)),
		};

		if (res.statusCode < 400) {
			logger.info(responseLog);
		} else if (res.statusCode < 500) {
			logger.error(responseLog);
		} else {
			logger.fatal(responseLog);
		}
	});

	next();
}
