/**
 * Client-side financial algorithm engine for the startup dashboard.
 * Projects revenue, expense, and runway trajectories over a 12-month timeline.
 */

export const performClientFinancialCalculations = (inputs) => {
  const {
    startingCapital = 50000,
    monthlyExpense = 5000,
    growthRate = 10, // monthly customer growth percentage
    initialCustomers = 100,
    pricePerCustomer = 29, // plan price
    marketingSpend = 1000,
    otherExpenses = 1500,
    investmentAsk = 150000,
  } = inputs;

  const projections = [];
  let currentCash = startingCapital + investmentAsk;
  let currentCustomers = initialCustomers;

  for (let month = 1; month <= 12; month++) {
    const revenue = Math.round(currentCustomers * pricePerCustomer);
    
    // Simulate minor operational cost scaling (2% per month)
    const scaleFactor = 1 + (month * 0.02);
    const expenses = Math.round((monthlyExpense + marketingSpend + otherExpenses) * scaleFactor);
    const netProfit = revenue - expenses;
    currentCash += netProfit;

    projections.push({
      month: `Month ${month}`,
      customers: Math.round(currentCustomers),
      revenue,
      expenses,
      netProfit,
      cashBalance: Math.round(currentCash),
    });

    currentCustomers = currentCustomers * (1 + growthRate / 100);
  }

  // Calculate Average Burn Rate (net loss months average)
  const negativeMonths = projections.filter((p) => p.netProfit < 0);
  const totalLoss = negativeMonths.reduce((sum, p) => sum + Math.abs(p.netProfit), 0);
  const burnRate = negativeMonths.length > 0 ? Math.round(totalLoss / negativeMonths.length) : 0;

  // Break-even Analysis
  const monthlyFixedCost = monthlyExpense + marketingSpend + otherExpenses;
  const breakEvenCustomers = Math.ceil(monthlyFixedCost / pricePerCustomer);
  const breakEvenRevenue = breakEvenCustomers * pricePerCustomer;

  // ROI Projections (Year 1 Profit / Investment Ask)
  const yearOneProfit = projections.reduce((sum, p) => sum + p.netProfit, 0);
  const roi = investmentAsk > 0 ? ((yearOneProfit / investmentAsk) * 100).toFixed(1) : 0;

  // Investment return valuation (simulating 5-year multiple)
  const yearOneRevenue = projections.reduce((sum, p) => sum + p.revenue, 0);
  const projectedValuation = yearOneRevenue * 5 * 2.5;
  const investmentReturnMultiple = investmentAsk > 0 ? (projectedValuation / investmentAsk).toFixed(1) : 0;

  return {
    projections,
    summary: {
      yearOneRevenue: projections.reduce((sum, p) => sum + p.revenue, 0),
      yearOneProfit,
      endingCash: Math.round(currentCash),
      burnRate,
      breakEvenCustomers,
      breakEvenRevenue,
      roi: parseFloat(roi),
      investmentAsk,
      investmentReturnMultiple: parseFloat(investmentReturnMultiple),
    },
  };
};
