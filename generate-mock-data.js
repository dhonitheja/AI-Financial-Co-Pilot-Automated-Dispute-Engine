const fs = require('fs');
const path = require('path');

const categories = [
  'Shopping', 'Fees', 'Food & Drink', 'Entertainment', 'Income', 'Fuel', 'Housing', 'Utilities', 'Investment'
];

const accounts = [
  'HDFC Bank Credit Card',
  'ICICI Bank Credit Card',
  'Axis Bank Credit Card',
  'SBI Savings Account',
  'ICICI Bank Savings',
  'Simpl BNPL',
  'LazyPay BNPL'
];

const transactions = [];
const now = new Date();

// Generate data for the last 12 months
for (let i = 0; i < 12; i++) {
  const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth() + 1;
  const monthStr = month < 10 ? `0${month}` : `${month}`;

  // Vary income slightly to make MoM growth interesting
  const incomeVariation = (Math.random() - 0.5) * 5000;
  transactions.push({
    id: `tx_salary_${year}_${month}`,
    date: `${year}-${monthStr}-01`,
    description: 'Salary Credit',
    amount: 85000.00 + incomeVariation,
    category: 'Income',
    account: 'ICICI Bank Savings',
    tags: ['income']
  });

  // Rent (fixed)
  transactions.push({
    id: `tx_rent_${year}_${month}`,
    date: `${year}-${monthStr}-02`,
    description: 'Monthly Rent Payment',
    amount: -25000.00,
    category: 'Housing',
    account: 'ICICI Bank Savings',
    tags: ['fixed-cost']
  });

  // Food & Drink (Discretionary) - increase over time
  const merchants = ['Zomato', 'Swiggy', 'Starbucks', 'Blinkit', 'Zepto'];
  const foodSpendFactor = 1 + (i * 0.1); // Spend more in recent months
  for (let j = 0; j < 12; j++) {
    const merchant = merchants[Math.floor(Math.random() * merchants.length)];
    const day = Math.floor(Math.random() * 28) + 1;
    const dayStr = day < 10 ? `0${day}` : `${day}`;
    transactions.push({
      id: `tx_food_${year}_${month}_${j}`,
      date: `${year}-${monthStr}-${dayStr}`,
      description: merchant,
      amount: -(300 + (Math.random() * 800)) * foodSpendFactor,
      category: 'Food & Drink',
      account: accounts[Math.floor(Math.random() * 3)],
      tags: ['lifestyle', 'discretionary']
    });
  }

  // Fees (reducng over time)
  if (i > 3) {
    const day = Math.floor(Math.random() * 28) + 1;
    const dayStr = day < 10 ? `0${day}` : `${day}`;
    transactions.push({
      id: `tx_fee_${year}_${month}`,
      date: `${year}-${monthStr}-${dayStr}`,
      description: 'Late Payment Fee',
      amount: -750.00,
      category: 'Fees',
      account: accounts[0],
      tags: ['hidden-fee']
    });
  }
}

fs.writeFileSync(path.join(__dirname, 'mock-data.json'), JSON.stringify(transactions, null, 2));
console.log(`Generated ${transactions.length} transactions with MoM variance.`);
