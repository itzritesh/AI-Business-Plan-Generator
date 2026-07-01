import express from 'express';
import { generatePitchDeck } from '../controllers/pitchController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/generate', protect, generatePitchDeck);

export default router;
