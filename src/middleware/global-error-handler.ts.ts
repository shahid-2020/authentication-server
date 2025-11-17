import type { Request, Response, NextFunction } from 'express';
import { getRequestContext } from '../lib/request-context';
import { ErrorCode, type HttpErrorResponse } from '../types/error';
import { logger } from '../lib/logger';
import { getFullUrl } from '../utils/http';

const ERROR_CONFIG: Record<ErrorCode, { status: number; message: string }> = {
	[ErrorCode.BAD_REQUEST]: { status: 400, message: 'Bad Request' },
	[ErrorCode.INVALID_CURRENT_PASSWORD]: { status: 400, message: 'Bad Request' },
	[ErrorCode.WEAK_PASSWORD]: { status: 400, message: 'Bad Request' },
	[ErrorCode.PASSWORD_PREVIOUSLY_USED]: { status: 400, message: 'Bad Request' },
	[ErrorCode.INVALID_RESET_TOKEN]: { status: 400, message: 'Bad Request' },
	[ErrorCode.INVALID_VERIFICATION_TOKEN]: {
		status: 400,
		message: 'Bad Request',
	},
	[ErrorCode.UNAUTHORIZED]: { status: 401, message: 'Unauthorized' },
	[ErrorCode.INVALID_TOKEN]: { status: 401, message: 'Unauthorized' },
	[ErrorCode.TOKEN_EXPIRED]: { status: 401, message: 'Unauthorized' },
	[ErrorCode.AUTHENTICATION_REQUIRED]: { status: 401, message: 'Unauthorized' },
	[ErrorCode.INVALID_CREDENTIALS]: { status: 401, message: 'Unauthorized' },
	[ErrorCode.INVALID_REFRESH_TOKEN]: { status: 401, message: 'Unauthorized' },
	[ErrorCode.SESSION_REVOKED]: { status: 401, message: 'Unauthorized' },
	[ErrorCode.FORBIDDEN]: { status: 403, message: 'Forbidden' },
	[ErrorCode.INSUFFICIENT_PERMISSIONS]: { status: 403, message: 'Forbidden' },
	[ErrorCode.ACCOUNT_SUSPENDED]: { status: 403, message: 'Forbidden' },
	[ErrorCode.ACCOUNT_DELETED]: { status: 403, message: 'Forbidden' },
	[ErrorCode.ACCOUNT_INACTIVE]: { status: 403, message: 'Forbidden' },
	[ErrorCode.ACCOUNT_LOCKED]: { status: 403, message: 'Forbidden' },
	[ErrorCode.EMAIL_NOT_VERIFIED]: { status: 403, message: 'Forbidden' },
	[ErrorCode.PHONE_NOT_VERIFIED]: { status: 403, message: 'Forbidden' },
	[ErrorCode.NOT_FOUND]: { status: 404, message: 'Not Found' },
	[ErrorCode.ROUTE_NOT_FOUND]: { status: 404, message: 'Not Found' },
	[ErrorCode.USER_NOT_FOUND]: { status: 404, message: 'Not Found' },
	[ErrorCode.SESSION_NOT_FOUND]: { status: 404, message: 'Not Found' },
	[ErrorCode.METHOD_NOT_ALLOWED]: {
		status: 405,
		message: 'Method Not Allowed',
	},
	[ErrorCode.CONFLICT]: { status: 409, message: 'Conflict' },
	[ErrorCode.EMAIL_ALREADY_EXISTS]: { status: 409, message: 'Conflict' },
	[ErrorCode.PHONE_ALREADY_EXISTS]: { status: 409, message: 'Conflict' },
	[ErrorCode.PAYLOAD_TOO_LARGE]: { status: 413, message: 'Payload Too Large' },
	[ErrorCode.UNSUPPORTED_MEDIA_TYPE]: {
		status: 415,
		message: 'Unsupported Media Type',
	},
	[ErrorCode.VALIDATION_ERROR]: {
		status: 422,
		message: 'Unprocessable Entity',
	},
	[ErrorCode.REQUIRED_FIELD_MISSING]: {
		status: 422,
		message: 'Unprocessable Entity',
	},
	[ErrorCode.INVALID_FIELD_VALUE]: {
		status: 422,
		message: 'Unprocessable Entity',
	},
	[ErrorCode.RATE_LIMIT_EXCEEDED]: {
		status: 429,
		message: 'Too Many Requests',
	},
	[ErrorCode.TOO_MANY_LOGIN_ATTEMPTS]: {
		status: 429,
		message: 'Too Many Requests',
	},
	[ErrorCode.INTERNAL_ERROR]: { status: 500, message: 'Internal Server Error' },
	[ErrorCode.DATABASE_ERROR]: { status: 500, message: 'Internal Server Error' },
	[ErrorCode.TIMEOUT]: { status: 500, message: 'Internal Server Error' },
	[ErrorCode.SERVICE_UNAVAILABLE]: {
		status: 503,
		message: 'Service Unavailable',
	},
};

export function globalErrorHandler(
	err: unknown,
	req: Request,
	res: Response,
	next: NextFunction,
): void {
	const requestId = getRequestContext()?.requestId;

	let errorCode = ErrorCode.INTERNAL_ERROR;
	let { status: statusCode, message } = ERROR_CONFIG[ErrorCode.INTERNAL_ERROR];
	let cause = 'An unexpected error occurred';
	let causes: string[] | undefined;

	const url = getFullUrl(req);

	const errorLog = {
		requestId,
		type: errorCode,
		msg: `${req.method} ${url} ${statusCode} - ${cause}`,
		error: err,
	};

	if (statusCode < 500) {
		logger.error(errorLog);
	} else {
		logger.fatal(errorLog);
	}

	if (res.headersSent) {
		logger.warn({
			requestId,
			msg: 'Skipping httpErrorResponse, Headers already sent',
		});
		next(err);
		return;
	}

	const response: HttpErrorResponse = {
		statusCode,
		errorCode,
		message,
		[causes?.length ? cause : cause]: causes?.length ? cause : cause,
		url,
		datetime: new Date().toISOString(),
	};

	res.status(statusCode).json(response);
}
