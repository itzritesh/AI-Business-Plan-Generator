import express from 'express';
import { analyzeMarket } from '../controllers/marketController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/analyze', protect, analyzeMarket);

export default router;
