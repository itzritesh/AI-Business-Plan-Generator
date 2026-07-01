import BusinessPlan from '../models/BusinessPlan.js';
import { generatePitchDeckAI } from '../services/groqService.js';
import { getPitchDeckPrompt } from '../utils/promptTemplates.js';

// @desc    Generate pitch deck slides for a business plan
// @route   POST /api/pitch/generate
// @access  Private
export const generatePitchDeck = async (req, res) => {
  try {
    const { planId } = req.body;

    if (!planId) {
      return res.status(400).json({ message: 'Business Plan ID is required' });
    }

    const plan = await BusinessPlan.findOne({ _id: planId, userId: req.user._id });
    if (!plan) {
      return res.status(404).json({ message: 'Business plan not found or unauthorized' });
    }

    const prompts = getPitchDeckPrompt({
      name: plan.name,
      idea: plan.idea,
      targetMarket: plan.targetMarket,
      revenueModel: plan.revenueModel,
      fundingStage: plan.fundingStage,
    });

    const pitchDeck = await generatePitchDeckAI(
      {
        name: plan.name,
        idea: plan.idea,
        targetMarket: plan.targetMarket,
        revenueModel: plan.revenueModel,
        fundingStage: plan.fundingStage,
      },
      prompts
    );

    plan.pitchDeck = pitchDeck;
    await plan.save();

    res.json(plan);
  } catch (error) {
    console.error('Pitch deck generation error:', error.message);
    res.status(500).json({ message: 'Failed to generate pitch deck' });
  }
};
