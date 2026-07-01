import express from 'express';
import { calculateFinanceModel } from '../controllers/financeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/calculate', protect, calculateFinanceModel);

export default router;
