import express from 'express';
import helmet from 'helmet';

import { logger } from './config/logger';
import { Env } from './config/env';

const app = express();

app.use(helmet());
app.use(express.json());

app.get('/healthz', (_, res) => res.json({ status: 'Ok' }));

app.listen(Env.PORT, () => logger.info(`Server started at port ${Env.PORT}`));
