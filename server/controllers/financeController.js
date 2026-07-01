import BusinessPlan from '../models/BusinessPlan.js';
import { calculateFinancials } from '../services/financeService.js';

// @desc    Calculate financial projections
// @route   POST /api/finance/calculate
// @access  Private
export const calculateFinanceModel = async (req, res) => {
  try {
    const {
      planId,
      startingCapital,
      growthRate,
      monthlyExpense,
      pricePerCustomer,
      initialCustomers,
      marketingSpend,
      investmentAsk,
      otherExpenses,
    } = req.body;

    if (!planId) {
      return res.status(400).json({ message: 'Business Plan ID is required' });
    }

    const plan = await BusinessPlan.findOne({ _id: planId, userId: req.user._id });
    if (!plan) {
      return res.status(404).json({ message: 'Business plan not found or unauthorized' });
    }

    // Call finance calculation algorithms
    const financialReport = calculateFinancials({
      startingCapital: Number(startingCapital),
      growthRate: Number(growthRate),
      monthlyExpense: Number(monthlyExpense),
      pricePerCustomer: Number(pricePerCustomer),
      initialCustomers: Number(initialCustomers),
      marketingSpend: Number(marketingSpend),
      investmentAsk: Number(investmentAsk),
      otherExpenses: Number(otherExpenses),
    });

    // Save calculations back to MongoDB
    plan.financialReport = financialReport;
    await plan.save();

    res.json(plan);
  } catch (error) {
    console.error('Financial calculation error:', error.message);
    res.status(500).json({ message: 'Failed to process financial modeling' });
  }
};
