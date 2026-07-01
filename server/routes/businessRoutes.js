import express from 'express';
import {
  generateBusinessPlan,
  getBusinessPlans,
  getBusinessPlanById,
  deleteBusinessPlan,
} from '../controllers/businessController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(protect);

router.post('/generate', generateBusinessPlan);
router.get('/history', getBusinessPlans);
router.get('/:id', getBusinessPlanById);
router.delete('/:id', deleteBusinessPlan);

export default router;
