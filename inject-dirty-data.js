
const fs = require('fs');
const path = require('path');

const mockDataPath = path.join(__dirname, 'mock-data.json');
const data = JSON.parse(fs.readFileSync(mockDataPath, 'utf8'));

const today = new Date();
const formatDate = (date) => date.toISOString().split('T')[0];

const dirtyData = [
  {
    id: "dirty-late-fee-" + Date.now(),
    date: formatDate(today),
    description: "CREDIT CARD LATE FEE - OVERDUE",
    amount: -750.00,
    category: "Fees",
    account: "HDFC Bank Credit Card",
    tags: ["hidden-fee", "penalty"]
  },
  {
    id: "dirty-cash-advance-" + Date.now(),
    date: formatDate(today),
    description: "CASH ADVANCE WITHDRAWAL (TRANS FEE: 3.5%)",
    amount: -5000.00,
    category: "Cash Withdrawal",
    account: "Axis Bank Credit Card",
    tags: ["hidden-fee", "cash-leak"]
  },
  // 5 Zepto transactions totaling 3200 in last 48 hours
  {
    id: "dirty-zepto-1-" + Date.now(),
    date: formatDate(today),
    description: "Zepto - Grocery Flash",
    amount: -640.00,
    category: "Food & Drink",
    account: "ICICI Bank Credit Card",
    tags: ["lifestyle", "convenience"]
  },
  {
    id: "dirty-zepto-2-" + Date.now(),
    date: formatDate(today),
    description: "Zepto - Grocery Flash",
    amount: -640.00,
    category: "Food & Drink",
    account: "ICICI Bank Credit Card",
    tags: ["lifestyle", "convenience"]
  },
  {
    id: "dirty-zepto-3-" + Date.now(),
    date: formatDate(new Date(today.getTime() - 86400000)), // 24 hours ago
    description: "Zepto - Grocery Flash",
    amount: -640.00,
    category: "Food & Drink",
    account: "ICICI Bank Credit Card",
    tags: ["lifestyle", "convenience"]
  },
  {
    id: "dirty-zepto-4-" + Date.now(),
    date: formatDate(new Date(today.getTime() - 86400000)), // 24 hours ago
    description: "Zepto - Grocery Flash",
    amount: -640.00,
    category: "Food & Drink",
    account: "ICICI Bank Credit Card",
    tags: ["lifestyle", "convenience"]
  },
  {
    id: "dirty-zepto-5-" + Date.now(),
    date: formatDate(new Date(today.getTime() - 86400000 * 2)), // 48 hours ago
    description: "Zepto - Grocery Flash",
    amount: -640.00,
    category: "Food & Drink",
    account: "ICICI Bank Credit Card",
    tags: ["lifestyle", "convenience"]
  }
];

// Prepend dirty data
data.unshift(...dirtyData);
fs.writeFileSync(mockDataPath, JSON.stringify(data, null, 2));
console.log("Injected 'Dirty JSON' payload for Deep AI Logic test.");
