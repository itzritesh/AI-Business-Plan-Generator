import BusinessPlan from '../models/BusinessPlan.js';
import { generateBusinessPlanAI } from '../services/groqService.js';
import { getBusinessPlanPrompt } from '../utils/promptTemplates.js';

// @desc    Generate a new business plan
// @route   POST /api/business/generate
// @access  Private
export const generateBusinessPlan = async (req, res) => {
  try {
    const { name, idea, targetMarket, revenueModel, fundingStage, businessType } = req.body;

    if (!name || !idea || !targetMarket || !revenueModel || !fundingStage || !businessType) {
      return res.status(400).json({ message: 'Please provide all business details' });
    }

    // Build the AI Prompt templates
    const prompts = getBusinessPlanPrompt({
      name,
      idea,
      targetMarket,
      revenueModel,
      fundingStage,
      businessType,
    });

    // Request generation from AI (falls back to mock if key is missing/invalid)
    const generatedReport = await generateBusinessPlanAI(
      { name, idea, targetMarket, revenueModel, fundingStage, businessType },
      prompts
    );

    // Save to database
    const plan = await BusinessPlan.create({
      userId: req.user._id,
      name,
      idea,
      targetMarket,
      revenueModel,
      fundingStage,
      businessType,
      generatedReport,
    });

    res.status(201).json(plan);
  } catch (error) {
    console.error('Generate business plan error:', error.message);
    res.status(500).json({ message: 'Failed to generate business plan' });
  }
};

// @desc    Get all business plans for logged-in user
// @route   GET /api/business/history
// @access  Private
export const getBusinessPlans = async (req, res) => {
  try {
    const plans = await BusinessPlan.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(plans);
  } catch (error) {
    console.error('Get plans error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get business plan by ID
// @route   GET /api/business/:id
// @access  Private
export const getBusinessPlanById = async (req, res) => {
  try {
    const plan = await BusinessPlan.findOne({ _id: req.params.id, userId: req.user._id });

    if (!plan) {
      return res.status(404).json({ message: 'Business plan not found or unauthorized' });
    }

    res.json(plan);
  } catch (error) {
    console.error('Get plan by ID error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete business plan
// @route   DELETE /api/business/:id
// @access  Private
export const deleteBusinessPlan = async (req, res) => {
  try {
    const plan = await BusinessPlan.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

    if (!plan) {
      return res.status(404).json({ message: 'Business plan not found or unauthorized' });
    }

    res.json({ message: 'Business plan deleted successfully' });
  } catch (error) {
    console.error('Delete plan error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};
