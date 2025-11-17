import pino, { type LoggerOptions } from 'pino';

const isDev = process.env.NODE_ENV === 'dev';
const REDACT: LoggerOptions['redact'] = {
	paths: [
		'req.headers.Authorization',
		'req.headers.authorization',
		'req.headers.X-API-KEY',
		'req.headers.X-Api-Key',
		'req.headers.x-api-key',
		'req.headers.cookie',
		'req.body.password',
		'req.body.token',
	],
	remove: false,
};

export const logger = pino({
	level: isDev ? 'debug' : 'info',
	redact: REDACT,
	transport: isDev
		? {
				target: 'pino-pretty',
				options: {
					colorize: true,
					translateTime: 'SYS:standard',
					ignore: 'pid,hostname',
				},
			}
		: undefined,
	messageKey: 'msg',
	formatters: {
		level(label) {
			return { level: label };
		},
	},
	timestamp: pino.stdTimeFunctions.isoTime,
});
