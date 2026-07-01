import BusinessPlan from '../models/BusinessPlan.js';
import { generateMarketResearchAI } from '../services/groqService.js';
import { getMarketResearchPrompt } from '../utils/promptTemplates.js';

// @desc    Analyze market research for a business plan
// @route   POST /api/market/analyze
// @access  Private
export const analyzeMarket = async (req, res) => {
  try {
    const { planId } = req.body;

    if (!planId) {
      return res.status(400).json({ message: 'Business Plan ID is required' });
    }

    const plan = await BusinessPlan.findOne({ _id: planId, userId: req.user._id });
    if (!plan) {
      return res.status(404).json({ message: 'Business plan not found or unauthorized' });
    }

    const prompts = getMarketResearchPrompt({
      name: plan.name,
      idea: plan.idea,
      targetMarket: plan.targetMarket,
    });

    const marketReport = await generateMarketResearchAI(
      { name: plan.name, idea: plan.idea, targetMarket: plan.targetMarket },
      prompts
    );

    plan.marketReport = marketReport;
    await plan.save();

    res.json(plan);
  } catch (error) {
    console.error('Market analysis error:', error.message);
    res.status(500).json({ message: 'Failed to generate market research' });
  }
};
