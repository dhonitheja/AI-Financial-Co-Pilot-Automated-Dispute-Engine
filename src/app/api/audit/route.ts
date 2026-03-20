
import { VertexAI } from '@google-cloud/vertexai';
import { NextResponse } from 'next/server';

const project = process.env.GOOGLE_CLOUD_PROJECT || 'project-22d06533-7f05-4359-bb0';
const location = 'us-central1';
const modelName = 'claude-3-5-sonnet@20240620';

console.log(`Auditor Engine initialization: Project=${project}, Location=${location}, Model=${modelName}`);

const vertexAI = new VertexAI({ project, location });

const systemPrompt = `
You are a Senior Forensic Accountant (CPA/CFA level). Your goal is to identify 'The Credit Chaos'—specifically hidden fees, 36% APR traps, and lifestyle creep.

### CHAIN-OF-THOUGHT (CoT) INSTRUCTIONS:
Before giving a final answer, you MUST follow these internal steps:
Step 1: Data Triage. Check for missing fields or irregular merchant names.
Step 2: Math Verification. Calculate the exact annualized percentage (APR) for any fee or interest charged.
Step 3: MoM Variance. Compare this transaction against the 5-year historical average for this category.
Step 4: Behavioral Risk. Assess if the user's spending 'velocity' (speed of spending) is sustainable for the rest of the month.

### FEW-SHOT EXAMPLE (Audit Logic):
Input: ₹250 'Convenience Fee' on a ₹1,000 Zepto order.
Expert Reasoning: This is a 25% overhead. If repeated 4x/week, the user loses ₹52,000/year in pure fees.
Insight: 'Critical Alert: You are losing 25% of your capital to convenience fees on this order. We recommend grouping orders to save ₹1,000+ this month.'

### STRUCTURED OUTPUT REQUIREMENTS:
Return all insights in a Structured JSON Schema with these keys: 
- severity_level (Low/Med/High)
- audit_logic (your internal math and CoT reasoning)
- human_insight (the coaching message)
- action_step (e.g., 'Dispute Fee' or 'Pause Spend')

All responses must be valid JSON strings enclosed in \`\`\`json blocks.
`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { transactions, merchantLimits, historicalContext } = body;

    const generativeModel = vertexAI.getGenerativeModel({
      model: modelName,
    });

    const userPrompt = `
      Input Data for Analysis:
      - Current Transactions: ${JSON.stringify(transactions)}
      - Merchant Spending Limits: ${JSON.stringify(merchantLimits)}
      - Historical context (6-mo and 1-yr averages): ${JSON.stringify(historicalContext)}

      Generate a Forensic Financial Audit report based on the above data.
    `;

    const response = await generativeModel.generateContent({
      contents: [{ role: 'user', parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }],
    });

    const resultText = response.response.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    let cleanedText = resultText.replace(/```json\n?/, '').replace(/```\n?/, '').trim();
    
    try {
      const parsed = JSON.parse(cleanedText);
      const displayString = `
# Forensic Financial Audit Report
*Produced by Advanced Reasoning Framework*

### 🚨 Severity: ${parsed.severity_level || 'High'}

### 💡 Human Insight
${parsed.human_insight}

### 🧠 Expert Audit Logic
${parsed.audit_logic}

### ⚡ Recommended Action
**${parsed.action_step}**
      `.trim();

      return NextResponse.json({ 
        forensicInsight: displayString,
        structuredAudit: parsed 
      });
    } catch (e) {
      console.warn("AI failed to provide valid JSON, returning raw text", e);
      return NextResponse.json({ forensicInsight: resultText });
    }
  } catch (error: any) {
    console.error('Forensic Audit Engine Error:', error?.message || error);
    if (error?.response) {
      console.error('Detailed AI Error:', JSON.stringify(error.response.data || {}, null, 2));
    }

    // Fallback Forensic Insight matched to the new schema
    const fallbackData = {
      severity_level: "High",
      audit_logic: "Detected [HDFC Bank] Late Fee of ₹500. Annualizing this behavior suggests an APR trap of 36%+, leading to ₹6,000/year in unnecessary finance charges.",
      human_insight: "Critical Alert: Your ₹500 late fee is an indicator of 'The Credit Chaos.' Paying this late is equivalent to a 36%+ interest trap.",
      action_step: "Move funds to pay this card immediately."
    };

    const displayString = `
# Forensic Financial Audit Report
*Engine Status: Fallback Logic Active*

### 🚨 Severity: ${fallbackData.severity_level}

### 💡 Human Insight
${fallbackData.human_insight}

### 🧠 Expert Audit Logic
${fallbackData.audit_logic}

### ⚡ Recommended Action
**${fallbackData.action_step}**
    `.trim();

    return NextResponse.json({ 
      forensicInsight: displayString,
      structuredAudit: fallbackData,
      error: 'AI Generation Failed - Returning Pre-computed Forensic Logic' 
    }, { status: 200 });
  }
}
