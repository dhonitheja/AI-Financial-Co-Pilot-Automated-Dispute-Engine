
export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  status: 'completed' | 'pending' | 'flagged';
}

export interface HiddenFee {
  id: string;
  name: string;
  amount: number;
  frequency: 'monthly' | 'yearly' | 'one-time';
  description: string;
  detectedAt: string;
}

export const transactions: Transaction[] = [
  {
    id: '1',
    date: '2024-03-24',
    description: 'Apple Music Subscription',
    amount: -10.99,
    category: 'Entertainment',
    status: 'completed',
  },
  {
    id: '2',
    date: '2024-03-23',
    description: 'Starbucks Coffee',
    amount: -5.50,
    category: 'Food & Drink',
    status: 'completed',
  },
  {
    id: '3',
    date: '2024-03-22',
    description: 'Rent Payment',
    amount: -1800.00,
    category: 'Housing',
    status: 'completed',
  },
  {
    id: '4',
    date: '2024-03-21',
    description: 'Salary Deposit',
    amount: 4500.00,
    category: 'Income',
    status: 'completed',
  },
  {
    id: '5',
    date: '2024-03-20',
    description: 'Amazon.com - Tech Gadget',
    amount: -129.99,
    category: 'Shopping',
    status: 'completed',
  },
  {
    id: '6',
    date: '2024-03-19',
    description: 'Netflix Subscription',
    amount: -15.99,
    category: 'Entertainment',
    status: 'flagged',
  },
  {
    id: '7',
    date: '2024-03-18',
    description: 'Uber Ride',
    amount: -24.50,
    category: 'Transport',
    status: 'completed',
  },
];

export const hiddenFees: HiddenFee[] = [
  {
    id: 'f1',
    name: 'Inactive Account Fee',
    amount: 5.00,
    frequency: 'monthly',
    description: 'Charged by Legacy Bank for your secondary savings account which saw no activity for 6 months.',
    detectedAt: '2024-03-15',
  },
  {
    id: 'f2',
    name: 'Streaming Price Hike',
    amount: 2.00,
    frequency: 'monthly',
    description: 'Your Netflix plan increased from $13.99 to $15.99 without a clear notification.',
    detectedAt: '2024-03-10',
  },
  {
    id: 'f3',
    name: 'Currency Conversion Loss',
    amount: 12.45,
    frequency: 'one-time',
    description: 'Inefficient exchange rate on your recent international purchase.',
    detectedAt: '2024-03-05',
  },
];

export const categoryData = [
  { category: 'Housing', amount: 1800, fill: 'var(--color-housing)' },
  { category: 'Food & Drink', amount: 450, fill: 'var(--color-food)' },
  { category: 'Shopping', amount: 320, fill: 'var(--color-shopping)' },
  { category: 'Entertainment', amount: 150, fill: 'var(--color-entertainment)' },
  { category: 'Transport', amount: 120, fill: 'var(--color-transport)' },
  { category: 'Utilities', amount: 200, fill: 'var(--color-utilities)' },
];

export const chartConfig = {
  amount: {
    label: "Amount ($)",
  },
  housing: {
    label: "Housing",
    color: "hsl(var(--chart-1))",
  },
  food: {
    label: "Food & Drink",
    color: "hsl(var(--chart-2))",
  },
  shopping: {
    label: "Shopping",
    color: "hsl(var(--chart-3))",
  },
  entertainment: {
    label: "Entertainment",
    color: "hsl(var(--chart-4))",
  },
  transport: {
    label: "Transport",
    color: "hsl(var(--chart-5))",
  },
  utilities: {
    label: "Utilities",
    color: "hsl(var(--chart-6))",
  },
};
