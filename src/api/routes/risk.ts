import express from 'express';

import { riskRequestValidator } from '../validator/risk';
import { calculateRisk } from '../controller/risk';

export const riskRouter = express.Router();

riskRouter.post('/', riskRequestValidator, calculateRisk as any);
