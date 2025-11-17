import express from 'express';
import helmet from 'helmet';

import { logger } from './lib/logger';
import { Env } from './config/env';
import { requestId } from './middleware/request-id';
import { httpLogging } from './middleware/http-logging';
import { routeNotFound } from './middleware/route-not-found';
import { globalErrorHandler } from './middleware/global-error-handler.ts';

const app = express();

app.use([helmet(), express.json()]);

app.get('/healthz', (_, res) => res.json({ status: 'Ok' }));

app.use([requestId, httpLogging]);

app.use([routeNotFound, globalErrorHandler]);

app.listen(Env.PORT, () => logger.info(`Server started at port ${Env.PORT}`));
