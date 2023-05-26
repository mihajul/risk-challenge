import express from 'express';
import { riskRouter } from './routes/risk';

const router = express.Router();

router.use('/risk', riskRouter);

export default router;
