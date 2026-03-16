
const fs = require('fs');
const path = require('path');

const mockDataPath = path.join(__dirname, 'mock-data.json');
const data = JSON.parse(fs.readFileSync(mockDataPath, 'utf8'));

// Add a specific Zomato transaction to exceed the 2000 limit
const testTx = {
  id: "test-audit-zomato-" + Date.now(),
  date: new Date().toISOString().split('T')[0],
  description: "Zomato - Audit Test Dinner",
  amount: -2500.00,
  category: "Food & Drink",
  account: "HDFC Bank Credit Card",
  tags: ["audit-test", "discretionary"]
};

data.unshift(testTx);
fs.writeFileSync(mockDataPath, JSON.stringify(data, null, 2));
console.log("Injected Zomato transaction of ₹2,500 for audit verification.");
