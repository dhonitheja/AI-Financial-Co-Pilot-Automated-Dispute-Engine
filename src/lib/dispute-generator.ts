
import { VertexAI } from '@google-cloud/vertexai';

const project = process.env.GOOGLE_CLOUD_PROJECT;
const location = process.env.GOOGLE_CLOUD_LOCATION;

const vertexAI = new VertexAI({ project: project || '', location: location || '' });
const model = 'claude-3-5-sonnet@20240620';

export interface DisputeParams {
  userName: string;
  merchantName: string;
  amount: number | string;
  date: string;
  reason: string;
}

/**
 * Generates a formal credit card dispute letter using Claude 3.5 Sonnet on Vertex AI.
 * Focuses on Indian consumer protection and RBI's Fair Practices Code.
 */
export async function generateDisputeLetter({
  userName,
  merchantName,
  amount,
  date,
  reason
}: DisputeParams): Promise<string> {
  try {
    const generativeModel = vertexAI.getGenerativeModel({
      model: model,
    });

    const systemPrompt = "You are a legal assistant specializing in Indian consumer protection. Draft a formal credit card dispute letter for a charge of [Amount] on [Date]. Mention that the user is requesting a reversal of fees under RBI's Fair Practices Code.";

    const userPrompt = `
      Please draft a formal dispute letter for the following case:
      - User Name: ${userName}
      - Merchant/Bank Name: ${merchantName}
      - Amount: ₹${amount}
      - Date of Transaction: ${date}
      - Reason for Dispute: ${reason}

      Include references to RBI's Fair Practices Code and request an immediate reversal of the charge including any associated GST. 
      The tone should be formal, professional, and firm.
    `;

    const response = await generativeModel.generateContent({
      contents: [{ role: 'user', parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }],
    });

    const resultText = response.response.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    return resultText.trim();
  } catch (error) {
    console.error('Error in generateDisputeLetter:', error);
    
    // Fallback template if AI call fails
    return `
To,
The Nodal Officer,
${merchantName}

Date: ${new Date().toLocaleDateString('en-IN')}

Subject: Formal Dispute for Transaction dated ${date} - ₹${amount}

Dear Sir/Madam,

I, ${userName}, am tokensing this formal dispute regarding a charge of ₹${amount} appearing on my statement for ${merchantName} on ${date}. 

The reason for this dispute is: ${reason}.

Under the RBI's Fair Practices Code, I am requesting an immediate reversal of this fee and any associated GST. I believe this charge lacks transparency and is not in alignment with fair banking practices.

Kindly process this reversal at the earliest.

Regards,
${userName}
    `.trim();
  }
}
