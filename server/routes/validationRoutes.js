import express from 'express';
import { validateBusinessIdea } from '../controllers/validationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/check', protect, validateBusinessIdea);

export default router;
