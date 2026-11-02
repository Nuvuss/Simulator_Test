import { NextResponse } from 'next/server';
import { appendToGoogleSheet } from '@/lib/googleSheets';

export async function POST(request: Request) {
  try {
    const { messages, candidateName, candidateEmail } = await request.json();

    const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;
    const sheetId = process.env.GOOGLE_SHEET_ID;

    if (!serviceAccountEmail || !privateKey || !sheetId) {
      console.error('Missing Google Sheets credentials');
      return NextResponse.json({
        success: false,
        error: 'Google Sheets not configured. Transcript saved locally.',
      });
    }

    await appendToGoogleSheet(messages, candidateName, candidateEmail);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error submitting to Google Sheets:', error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Failed to submit to Google Sheets',
      },
      { status: 500 }
    );
  }
}
