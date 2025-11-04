import { z } from 'zod';
import { logger } from './logger';

const envSchem = z.object({
	NODE_ENV: z.enum(['dev', 'tst', 'stg', 'prd']),
	PORT: z.coerce.number().default(3000),
	DATABASE_URL: z.url(),
});

const parsed = envSchem.safeParse(process.env);

if (!parsed.success) {
	logger.error(
		z.flattenError(parsed.error),
		'Invalid environment configuration',
	);
	process.exit(1);
}
export const Env = parsed.data;
