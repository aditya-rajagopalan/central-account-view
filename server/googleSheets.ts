import { google } from 'googleapis';

async function getAccessToken() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('Google Sheets integration not available. Please check that the Google Sheet connector is installed.');
  }

  const response = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=google-sheet',
    {
      headers: {
        'Accept': 'application/json',
        'X-Replit-Token': xReplitToken
      }
    }
  );

  if (!response.ok) {
    throw new Error(`Google Sheet connector returned status ${response.status}. Try reconnecting the integration.`);
  }

  const data = await response.json();
  const connectionSettings = data.items?.[0];

  if (!connectionSettings) {
    throw new Error('Google Sheet integration not connected. Please set up the Google Sheet connector in your Replit project.');
  }

  const accessToken = connectionSettings.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;

  if (!accessToken) {
    throw new Error('Google Sheet access token missing. Try reconnecting the Google Sheet integration.');
  }
  return accessToken;
}

export async function getUncachableGoogleSheetClient() {
  const accessToken = await getAccessToken();

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({
    access_token: accessToken
  });

  return google.sheets({ version: 'v4', auth: oauth2Client });
}

function mapGoogleError(e: any): never {
  const msg = e?.message || e?.errors?.[0]?.message || String(e);
  if (msg.includes('Invalid Credentials') || msg.includes('invalid_grant')) {
    throw new Error('Google credentials expired. The integration will refresh automatically — please try again.');
  }
  if (msg.includes('not supported for this document')) {
    throw new Error('Could not read this spreadsheet. Make sure it is a Google Sheets file (not Excel/CSV) and is shared with your connected Google account.');
  }
  if (msg.includes('not found') || msg.includes('404')) {
    throw new Error('Spreadsheet not found. Check that the spreadsheet ID or URL is correct.');
  }
  if (msg.includes('permission') || msg.includes('403')) {
    throw new Error('Permission denied. Make sure the spreadsheet is shared with the Google account connected to this project.');
  }
  throw new Error(`Google Sheets error: ${msg}`);
}

export async function getSheetData(spreadsheetId: string, range: string): Promise<any[][]> {
  try {
    const sheets = await getUncachableGoogleSheetClient();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });
    return response.data.values || [];
  } catch (e: any) {
    mapGoogleError(e);
  }
}

export async function getSheetNames(spreadsheetId: string): Promise<string[]> {
  try {
    const sheets = await getUncachableGoogleSheetClient();
    const response = await sheets.spreadsheets.get({
      spreadsheetId,
      fields: 'sheets.properties.title',
    });
    return (response.data.sheets || []).map(s => s.properties?.title || '');
  } catch (e: any) {
    mapGoogleError(e);
  }
}

export async function getAllSheetData(spreadsheetId: string): Promise<Record<string, any[][]>> {
  const sheetNames = await getSheetNames(spreadsheetId);
  const result: Record<string, any[][]> = {};
  
  for (const name of sheetNames) {
    try {
      result[name] = await getSheetData(spreadsheetId, name);
    } catch (e) {
      result[name] = [];
    }
  }
  
  return result;
}
