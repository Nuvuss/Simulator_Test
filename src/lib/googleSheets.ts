import { google } from 'googleapis';
import { ChatMessage } from '@/types';

export interface SubmitPayload {
  messages: ChatMessage[];
  candidateName: string;
  candidateEmail: string;
}

export const SHEET_HEADERS = [
  'Nama Kandidat',
  'Email Kandidat',
  'Transkrip Sesi 1 (Rina)',
  'Transkrip Sesi 2 (Dimas)',
  'Transkrip Sesi 3 (Shania)',
];

function formatSessionTranscript(sessionMessages: ChatMessage[]): string {
  if (!sessionMessages || sessionMessages.length === 0) return '-';

  return sessionMessages
    .map((msg) => {
      const timeStr = new Date(msg.timestamp).toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'Asia/Jakarta',
      });

      const senderLabel =
        msg.sender === 'bm' ? 'Kandidat (BM)' : `Lead (${msg.leadName})`;

      const rtLabel =
        msg.sender === 'bm' && msg.responseTimeSec !== undefined
          ? ` [Respon: ${msg.responseTimeSec}s]`
          : '';

      return `[${timeStr}] ${senderLabel}${rtLabel}:\n${msg.text}`;
    })
    .join('\n\n');
}

export function formatCandidateRow(
  messages: ChatMessage[],
  candidateName: string,
  candidateEmail: string
): string[] {
  const session1 = messages.filter(
    (m) => m.sectionIndex === 0 || m.leadName?.toLowerCase() === 'rina'
  );
  const session2 = messages.filter(
    (m) => m.sectionIndex === 1 || m.leadName?.toLowerCase() === 'dimas'
  );
  const session3 = messages.filter(
    (m) => m.sectionIndex === 2 || m.leadName?.toLowerCase() === 'shania'
  );

  return [
    candidateName,
    candidateEmail,
    formatSessionTranscript(session1),
    formatSessionTranscript(session2),
    formatSessionTranscript(session3),
  ];
}

export async function appendToGoogleSheet(
  messages: ChatMessage[],
  candidateName: string,
  candidateEmail: string
): Promise<void> {
  const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  const sheetName = process.env.GOOGLE_SHEET_NAME || 'Result';

  if (!serviceAccountEmail || !privateKey || !spreadsheetId) {
    throw new Error('Google Sheets credentials are not configured');
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: serviceAccountEmail,
      private_key: privateKey,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });

  // 1. Cek apakah baris 1 (Header) sudah ada
  const existingData = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!A1:E1`,
  });

  const firstRow = existingData.data.values?.[0];
  const needsHeader =
    !firstRow || firstRow.length === 0 || firstRow[0] !== 'Nama Kandidat';

  if (needsHeader) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${sheetName}!A1:E1`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [SHEET_HEADERS] },
    });
  }

  // 2. Format 1 baris per kandidat
  const candidateRow = formatCandidateRow(messages, candidateName, candidateEmail);

  // 3. Append baris kandidat ke sheet
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: sheetName,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [candidateRow] },
  });
}
