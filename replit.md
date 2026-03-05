# BrowserStack Unified Account Command Center

## Overview
Full-stack dashboard for SDRs/BDRs to make 10-second prospecting decisions. Powered by Google Sheets data with mock data fallback.

## Architecture
- **Frontend**: React + Vite + TailwindCSS + shadcn/ui
- **Backend**: Express.js server
- **Data Source**: Google Sheets (via Replit connector) with mock data fallback
- **Routing**: wouter (frontend), Express (API)

## Data Flow (Two-Stage Loading)
1. User pastes Google Sheet URL/ID in the Data Source settings panel
2. Backend extracts spreadsheet ID and stores in memory
3. User searches for an account using the Account Selector in the header bar
4. Lightweight `/api/accounts?q=term` returns matching accounts (cached 60s)
5. User selects an account → `/api/dashboard?account=Name` fetches full data scoped to that account
6. Frontend components receive data via `DashboardContext`, filtered by selected Account Name
7. Priority: Sheet values (manual override) → Computed values → Mock data fallback (when no sheet connected)

## Data Model
- **Account Name** is the linking identifier across all tabs
- All tabs include an `Account Name` column for multi-account support
- Components filter data by the Account Name from the Account tab

## Expected Google Sheet Tabs (8 tabs)
| Tab Name | Purpose | Key Columns |
|----------|---------|-------------|
| Account | Header & profile info | Account Name, Category, BDR, AE, Segment, SFDC URL, Revenue, Description, Website, Geographies, Dev Count, LinkedIn, Parent Account, Parent SFDC URL |
| Summary | Optional stat overrides + summary text | Account Name, Label, Value (leave blank to auto-compute), Sub Value, Summary |
| Opportunities | Open & closed opps | Account Name, Name, Group ID, Amount, Status, SFDC Link, Close Date |
| Cross Rep Leads | Cross-rep discussions | Account Name, Name, Role, Rep, Rep Role, Intent Score, Intent Type |
| Personas | Top contacts to reach out | Account Name, Name, Role, Team, Type, Email, Phone, Location, SFDC URL, Reason, Score |
| Revenue | Paid team products & trials | Account Name, Group ID, Group Name, User Count, Product, Spend, Status, Term, Renewal, Active Trial, Completed Trial |
| Free Trials | Free user trials | Account Name, ID, Name, Trials (comma-separated), Status |
| Intent | Marketing leaderboard (flat: one row per event per user) | Account Name, User ID, Name, Role, Group Name, Group ID, Type, Email, Phone, Location, SFDC URL, Active, Marketing Signals, Intent Score, Intent Type, Last Signal, Event Type, Event Status, Event Date, Event Description |

## Dynamic Summary Computation
When Google Sheets is connected, the backend auto-computes:
- **Total Account ARR**: Sums `Spend` from Revenue tab (parses $X/yr and $X/mo → annualized), excludes Churned
- **Total Leads**: Counts distinct User IDs in Intent tab
- **Handraisers**: Counts distinct users where Intent Type = "Handraiser"
- **Prospecting Value**: High (≥2 handraisers + ARR ≥$10k), Medium (≥1 handraiser or ARR ≥$5k), Low (otherwise)

If the Summary tab has explicit values filled in, those take priority over computed values.

## Key Files
- `server/googleSheets.ts` - Google Sheets client (Replit connector)
- `server/sheetDataService.ts` - Data parsing, transformation, account list caching, and dynamic summary computation
- `server/routes.ts` - API routes (/api/sheets/*, /api/accounts, /api/dashboard)
- `client/src/lib/api.ts` - Frontend API client & React Query options (parameterized queries)
- `client/src/lib/dashboard-context.tsx` - Dashboard data context provider with selected account state
- `client/src/components/dashboard/sheet-settings.tsx` - Spreadsheet config UI
- `client/src/components/dashboard/account-selector.tsx` - Searchable account selector (header bar, debounced, dropdown)
- `client/src/pages/dashboard.tsx` - Main dashboard layout with account selection flow
- `sample_sheets/` - Sample CSV files for each tab with mock data

## API Endpoints
- `GET /api/sheets/config` - Get current spreadsheet config
- `POST /api/sheets/config` - Set spreadsheet ID (accepts URL or raw ID)
- `GET /api/sheets/tabs` - List tabs in connected sheet
- `GET /api/sheets/data/:sheetName` - Get raw data from a specific tab
- `GET /api/accounts?q=searchTerm` - Search accounts (lightweight, cached 60s, max 20 results)
- `GET /api/dashboard?account=AccountName` - Get dashboard data scoped to a specific account

## Design System
- BrowserStack Blue: #0666EB
- Font: Inter
- Dark header bar (slate-900)
- Card-based layout with subtle shadows and borders

## Important Notes
- Always use `import * as React from "react"` and `React.useState/React.useMemo` — named imports cause runtime errors
- Always explicitly import lucide-react icons before using
- Google Sheets client must NOT be cached (tokens expire)
- Dashboard components fallback to mock data when Google Sheets is not connected
