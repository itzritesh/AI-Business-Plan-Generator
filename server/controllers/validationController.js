import BusinessPlan from '../models/BusinessPlan.js';
import { generateValidationAI } from '../services/groqService.js';
import { getValidationPrompt } from '../utils/promptTemplates.js';

// @desc    Generate validation details and checklist
// @route   POST /api/validation/check
// @access  Private
export const validateBusinessIdea = async (req, res) => {
  try {
    const { planId } = req.body;

    if (!planId) {
      return res.status(400).json({ message: 'Business Plan ID is required' });
    }

    const plan = await BusinessPlan.findOne({ _id: planId, userId: req.user._id });
    if (!plan) {
      return res.status(404).json({ message: 'Business plan not found or unauthorized' });
    }

    const prompts = getValidationPrompt({
      name: plan.name,
      idea: plan.idea,
      targetMarket: plan.targetMarket,
    });

    const validationReport = await generateValidationAI(
      { name: plan.name, idea: plan.idea, targetMarket: plan.targetMarket },
      prompts
    );

    plan.validationReport = validationReport;
    await plan.save();

    res.json(plan);
  } catch (error) {
    console.error('Validation checklist generation error:', error.message);
    res.status(500).json({ message: 'Failed to generate validation checklist' });
  }
};
