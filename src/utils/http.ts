import type { Request } from 'express';

export function getHeader(
	req: Request,
	headerName: string,
): string | undefined {
	const normalizedName = headerName.toLowerCase();

	const headers = req.headers;

	for (const [key, value] of Object.entries(headers)) {
		if (key.toLowerCase() === normalizedName) {
			if (Array.isArray(value)) {
				return value[0];
			}
			return value;
		}
	}

	return undefined;
}

export function getHeaders(req: Request, headerName: string): string[] {
	const normalizedName = headerName.toLowerCase();
	const headers = req.headers;

	for (const [key, value] of Object.entries(headers)) {
		if (key.toLowerCase() === normalizedName) {
			if (Array.isArray(value)) {
				return value;
			}
			return value ? [value] : [];
		}
	}

	return [];
}

export function getFullUrl(req: Request): string {
	return `${req.protocol}://${req.get('host')}${req.originalUrl}`;
}
