
const fs = require('fs');
const path = require('path');

const mockDataPath = path.join(__dirname, 'mock-data.json');
const data = JSON.parse(fs.readFileSync(mockDataPath, 'utf8'));

const today = new Date();
const formatDate = (date) => date.toISOString().split('T')[0];

const messyData = [
  {
    id: "messy-late-fee-" + Date.now(),
    date: formatDate(today),
    description: "Credit Card Late Fee - HDFC",
    amount: -750.00,
    category: "Fees",
    account: "HDFC Bank Credit Card",
    tags: ["fee", "penalty"]
  },
  {
    id: "messy-cash-advance-" + Date.now(),
    date: formatDate(new Date(today.getTime() - 86400000)), // 1 day ago
    description: "ATM Cash Advance (3.5% Fee applicable)",
    amount: -5000.00,
    category: "Cash Withdrawal",
    account: "Axis Bank Credit Card",
    tags: ["cash", "advance"]
  },
  // Zepto orders totaling 4200 over 4 days
  {
    id: "messy-zepto-1-" + Date.now(),
    date: formatDate(new Date(today.getTime() - 86400000 * 1)),
    description: "Zepto - Quick Commerce",
    amount: -1050.00,
    category: "Food & Drink",
    account: "ICICI Bank Credit Card",
    tags: ["convenience", "zepto"]
  },
  {
    id: "messy-zepto-2-" + Date.now(),
    date: formatDate(new Date(today.getTime() - 86400000 * 2)),
    description: "Zepto - Quick Commerce",
    amount: -1050.00,
    category: "Food & Drink",
    account: "ICICI Bank Credit Card",
    tags: ["convenience", "zepto"]
  },
  {
    id: "messy-zepto-3-" + Date.now(),
    date: formatDate(new Date(today.getTime() - 86400000 * 3)),
    description: "Zepto - Quick Commerce",
    amount: -1050.00,
    category: "Food & Drink",
    account: "ICICI Bank Credit Card",
    tags: ["convenience", "zepto"]
  },
  {
    id: "messy-zepto-4-" + Date.now(),
    date: formatDate(new Date(today.getTime() - 86400000 * 4)),
    description: "Zepto - Quick Commerce",
    amount: -1050.00,
    category: "Food & Drink",
    account: "ICICI Bank Credit Card",
    tags: ["convenience", "zepto"]
  }
];

data.unshift(...messyData);
fs.writeFileSync(mockDataPath, JSON.stringify(data, null, 2));
console.log("Injected 'messy' mock data for AI Intelligence Audit.");
