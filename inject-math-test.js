
const fs = require('fs');

const mockDataPath = 'd:\\Ideas\\india fintech\\mock-data.json';
const mockData = JSON.parse(fs.readFileSync(mockDataPath, 'utf8'));

const lateFee = {
  id: "math-audit-late-fee-" + Date.now(),
  date: new Date().toISOString().split('T')[0],
  description: "CREDIT CARD FINANCE CHARGES - LATE FEE",
  amount: -500,
  category: "Fees",
  account: "HDFC Bank Credit Card",
  tags: ["math-verification"]
};

mockData.unshift(lateFee);
fs.writeFileSync(mockDataPath, JSON.stringify(mockData, null, 2));

console.log("Injected ₹500 late fee for math verification test.");
