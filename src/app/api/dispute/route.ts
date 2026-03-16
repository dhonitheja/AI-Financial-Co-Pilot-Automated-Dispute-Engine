
import { NextResponse } from 'next/server';
import { generateDisputeLetter } from '@/lib/dispute-generator';

export async function POST(req: Request) {
  try {
    const { transaction } = await req.json();

    const email = await generateDisputeLetter({
      userName: "John Doe", // Fallback or could be passed from frontend
      merchantName: transaction.account || transaction.description,
      amount: Math.abs(transaction.amount),
      date: transaction.date,
      reason: transaction.tags?.includes('high-interest') 
        ? '36% APR Interest Trap / Finance Charge without transparent disclosure' 
        : (transaction.description.includes('BNPL') || transaction.account?.includes('BNPL'))
          ? 'Undisclosed annual convenience fee and lack of transparency on BNPL charges'
          : 'Hidden/Unfair Fee flagged by AI Audit'
    });
    
    return NextResponse.json({ email });
  } catch (error: any) {
    console.error('Error in dispute API route:', error);
    return NextResponse.json({ error: 'Failed to generate dispute' }, { status: 500 });
  }
}
