export type Persona = 'Coach' | 'Auditor' | 'Analyst';
export type AlertLevel = 'WARNING' | 'CRITICAL';

export interface NotificationPayload {
  merchant: string;
  amount: number;
  limit: number;
  current: number;
  level: AlertLevel;
}

export function generateNotificationMessage(payload: NotificationPayload, persona: Persona): string {
  const { merchant, level, current, limit } = payload;
  const percentage = Math.round((current / limit) * 100);

  // Merchant Categories
  const isLifestyle = ['Zomato', 'Swiggy', 'Starbucks', 'Blinkit', 'Zepto'].includes(merchant);
  const isEcom = ['Amazon', 'Flipkart', 'Myntra'].includes(merchant);
  const isSerious = ['Fuel', 'Rent', 'Electricity', 'Water', 'Utility'].includes(merchant);

  if (persona === 'Coach') {
    if (level === 'WARNING') {
      if (isLifestyle) return `You’ve reached ${percentage}% of your ${merchant} budget. Maybe a home-cooked meal tonight to save that last bit?`;
      if (isEcom) return `Wait a second! You've used ${percentage}% of your ${merchant} limit. Do you really need that item in your cart? "Want" vs "Need" check!`;
      if (isSerious) return `Heads up! You're at ${percentage}% of your ${merchant} budget. These essentials add up, let's keep an eye on them.`;
      return `Good job tracking your spend! You're at ${percentage}% of your ${merchant} limit. Stay strong!`;
    } else {
      if (isLifestyle) return `Swiggy/Zomato limit reached! Time to unleash your inner chef. Your wallet will thank you!`;
      return `Limit reached for ${merchant}. Let's take a break from spending here and focus on your savings goals!`;
    }
  }

  if (persona === 'Auditor') {
    if (level === 'WARNING') {
      return `Audit Alert: ${merchant} spending has reached ${percentage}% (₹${current}) of your ₹${limit} limit.`;
    } else {
      const over = Math.max(0, current - limit);
      return `Limit Breach: ${merchant} spending has hit ₹${current}. You are ₹${over} over your set ₹${limit} limit.`;
    }
  }

  if (persona === 'Analyst') {
    if (level === 'WARNING') {
      if (isLifestyle) return `Did you know? You spend 40% more on ${merchant} during weekends. You just hit ${percentage}% of your limit early.`;
      if (isEcom) return `Spending analysis: ${merchant} purchases are driving a 15% increase in your discretionary spend. ${percentage}% limit reached.`;
      if (isSerious) return `Insight: ${merchant} prices are up 5% recently. You've hit ${percentage}% of your budget faster than last month.`;
      return `Velocity Report: At your current rate, you will hit 100% of your ${merchant} budget in ${Math.round((limit - current) / (current / 20))} days.`;
    } else {
      return `Critical Insight: ${merchant} spend is ₹${current}, 100%+ of allocation. This deviates significantly from your 3-month average.`;
    }
  }

  return `Notification: ${merchant} limit at ${percentage}%.`;
}
