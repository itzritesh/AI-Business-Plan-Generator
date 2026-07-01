/**
 * Financial modeling algorithms for startup analysis.
 * Calculations for Revenue, Expenses, Cash Flow, Burn Rate, Break-Even, and ROI.
 */

export const calculateFinancials = (inputs) => {
  const {
    startingCapital = 50000,
    monthlyExpense = 5000,
    growthRate = 10, // monthly percentage growth of customers
    initialCustomers = 100,
    pricePerCustomer = 29, // monthly price
    marketingSpend = 1000,
    otherExpenses = 1500,
    investmentAsk = 150000,
  } = inputs;

  const projections = [];
  let currentCash = startingCapital + investmentAsk; // starting runway
  let currentCustomers = initialCustomers;

  // Let's model a 12-month projection
  for (let month = 1; month <= 12; month++) {
    // 1. Revenue: customers * monthly price
    const revenue = Math.round(currentCustomers * pricePerCustomer);

    // 2. Expenses: basic monthly expense + marketing + other expenses
    // Adjust expenses with inflation/scaling slightly
    const scaleFactor = 1 + (month * 0.02); // 2% overhead growth per month
    const expenses = Math.round((monthlyExpense + marketingSpend + otherExpenses) * scaleFactor);

    // 3. Profit: revenue - expenses
    const netProfit = revenue - expenses;

    // 4. Cash Flow: updates current cash balance
    currentCash += netProfit;

    projections.push({
      month: `Month ${month}`,
      customers: Math.round(currentCustomers),
      revenue,
      expenses,
      netProfit,
      cashBalance: Math.round(currentCash),
    });

    // Grow customer base for next month
    currentCustomers = currentCustomers * (1 + growthRate / 100);
  }

  // 5. Burn Rate: average monthly cash outflow (when profit is negative)
  const lossMonths = projections.filter((p) => p.netProfit < 0);
  const totalLoss = lossMonths.reduce((sum, p) => sum + Math.abs(p.netProfit), 0);
  const burnRate = lossMonths.length > 0 ? Math.round(totalLoss / lossMonths.length) : 0;

  // 6. Break-Even Analysis: number of customer accounts needed to cover monthly costs
  const monthlyFixedCost = monthlyExpense + marketingSpend + otherExpenses;
  const breakEvenCustomers = Math.ceil(monthlyFixedCost / pricePerCustomer);
  const breakEvenRevenue = breakEvenCustomers * pricePerCustomer;

  // 7. Return on Investment (ROI): (Net Profit Year 1 / Investment Ask) * 100
  const yearOneProfit = projections.reduce((sum, p) => sum + p.netProfit, 0);
  const roi = investmentAsk > 0 ? ((yearOneProfit / investmentAsk) * 100).toFixed(1) : 0;

  // 8. Investment Return: Multiple of initial investment ask based on 5-year projections (simulated)
  // Assume steady growth continues: Year 5 valuation = Year 1 revenue * 5 (standard SaaS multiple)
  const yearOneRevenue = projections.reduce((sum, p) => sum + p.revenue, 0);
  const projectedYearFiveValuation = yearOneRevenue * 5 * 2.5;
  const investmentReturnMultiple = investmentAsk > 0 ? (projectedYearFiveValuation / investmentAsk).toFixed(1) : 0;

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
