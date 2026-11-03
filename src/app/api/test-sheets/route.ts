import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { sanitizePrivateKey } from '@/lib/googleSheets';

export async function GET() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.trim();
  const rawKey = process.env.GOOGLE_PRIVATE_KEY;
  const sheetId = process.env.GOOGLE_SHEET_ID?.trim();
  const sheetName = process.env.GOOGLE_SHEET_NAME?.trim() || 'Result';

  const diagnostics = {
    hasEmail: !!email,
    emailValue: email || null,
    hasRawKey: !!rawKey,
    rawKeyLength: rawKey?.length || 0,
    rawKeyStartsWithQuote: rawKey ? rawKey.startsWith('"') || rawKey.startsWith("'") : false,
    hasSheetId: !!sheetId,
    sheetIdValue: sheetId || null,
    sheetName: sheetName,
    testAppendStatus: 'pending',
    error: null as any,
  };

  if (!email || !rawKey || !sheetId) {
    diagnostics.testAppendStatus = 'FAILED_MISSING_ENV';
    diagnostics.error = 'Satu atau lebih Environment Variables belum diset di Vercel.';
    return NextResponse.json(diagnostics, { status: 500 });
  }

  try {
    const privateKey = sanitizePrivateKey(rawKey);

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: email,
        private_key: privateKey,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Coba baca metadata spreadsheet
    const meta = await sheets.spreadsheets.get({
      spreadsheetId: sheetId,
    });

    const tabs = meta.data.sheets?.map((s) => s.properties?.title) || [];

    // Coba append baris diagnosa
    const appendRes = await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: sheetName,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [
          [
            'Uji Diagnosa Vercel',
            'system-test@vercel.app',
            `[${new Date().toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta' })}] Sistem:\nTes koneksi dari Vercel berhasil.`,
            '-',
            '-',
          ],
        ],
      },
    });

    diagnostics.testAppendStatus = 'SUCCESS';
    return NextResponse.json({
      ...diagnostics,
      spreadsheetTitle: meta.data.properties?.title,
      availableTabs: tabs,
      updatedRange: appendRes.data.updates?.updatedRange,
      message: 'Koneksi ke Google Sheets BERHASIL 100%! Data uji coba sudah masuk.',
    });
  } catch (err: any) {
    diagnostics.testAppendStatus = 'FAILED';
    diagnostics.error = {
      message: err.message,
      code: err.code,
      status: err.status || err.response?.status,
      details: err.response?.data || err.opensslErrorStack || err.stack,
    };
    return NextResponse.json(diagnostics, { status: 500 });
  }
}

