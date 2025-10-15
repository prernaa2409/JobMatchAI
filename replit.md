# JobMatchAI - AI-Powered Resume Analysis & ATS Optimization

## Project Overview
JobMatchAI is an MVP web application that helps job seekers optimize their resumes for Applicant Tracking Systems (ATS). The platform provides AI-powered resume analysis, scoring, and improvement suggestions using Google Gemini AI.

## Tech Stack
- **Frontend**: React with TypeScript, Wouter routing, TailwindCSS, Shadcn UI
- **Backend**: Node.js + Express
- **AI**: Google Gemini API (@google/genai v1.24.0)
- **Storage**: In-memory (MemStorage) - ready for PostgreSQL migration
- **PDF Generation**: jsPDF (client-side)

## Color Palette
- Background Deep: #222831
- Background Elevated: #393E46
- Primary/Accent: #00ADB5
- Text/Surface: #EEEEEE

## Core Features Implemented

### 1. Resume Analysis
- **Endpoint**: POST `/api/analyze`
- **Process**: Upload resume → Extract text → Gemini AI analysis → ATS score
- **Output**: Overall score (0-100), content/keyword/format/experience scores, suggestions
- **Frontend**: `/analyze` page with file upload component

### 2. Resume Improvement
- **Endpoint**: POST `/api/improve`
- **Quota System**: 3 free improvements per user (enforced via storage)
- **Process**: Analyze resume → Generate AI improvements → Increment quota
- **Frontend**: `/improve` page with side-by-side comparison

### 3. PDF Download
- **Implementation**: Client-side PDF generation using jsPDF
- **Location**: Improve page download button
- **Format**: Professional PDF with improved resume text

### 4. Dashboard
- **Endpoint**: GET `/api/analyses`
- **Features**: Recent analyses grid, quota indicator, stats cards
- **Data**: Total analyses, improvements remaining, average score

### 5. Authentication (Mock)
- **Current**: LocalStorage-based mock auth
- **Next Phase**: NextAuth.js + Firebase Auth integration
- **OAuth**: Placeholder for Google/GitHub (UI ready)

## API Routes
- `POST /api/analyze` - Analyze resume with Gemini AI
- `GET /api/analysis/:id` - Get specific analysis
- `GET /api/analyses` - Get user's analyses
- `POST /api/improve` - Generate improved resume (quota enforced)
- `GET /api/quota` - Get user's improvement quota
- `GET /api/admin/users` - Admin user list (mock)
- `GET /api/admin/logs` - Admin audit logs (mock)

## Data Model (shared/schema.ts)

### Users
```typescript
{
  id: string
  username: string
  email: string
  password: string
  provider: string (email|google|github)
  improvementsUsed: number
  improvementsLimit: number
  createdAt: Date
}
```

### Analyses
```typescript
{
  id: string
  userId: string
  resumeText: string
  overallScore: number
  contentScore: number
  keywordScore: number
  formatScore: number
  experienceScore: number
  suggestions: jsonb
  keywords: jsonb { present: [], missing: [] }
  createdAt: Date
}
```

### Revisions
```typescript
{
  id: string
  analysisId: string
  userId: string
  improvedText: string
  createdAt: Date
}
```

## Gemini AI Integration

### Analysis Prompt
Returns JSON with:
- Scores (overall, content, keywords, format, experience)
- Present/missing keywords
- Categorized improvement suggestions

### Improvement Prompt
Returns enhanced resume text incorporating:
- Action verbs and quantified achievements
- Missing keywords (naturally incorporated)
- Improved clarity and ATS compatibility

## Recent Changes (Latest Session)

### Critical Fixes Applied
1. **Gemini API Integration** (server/gemini.ts):
   - Fixed `contents` format to SDK standard: `[{ role: "user", parts: [{ text: prompt }] }]`
   - Response access uses `response.text` property (getter, not method)

2. **Quota Enforcement** (server/routes.ts, server/storage.ts):
   - Added `getOrCreateMockUser()` for persistent user state
   - `/api/improve` now uses actual user quota from storage
   - `/api/quota` returns real user data
   - Quota properly increments and persists across requests

### Testing Status
- Frontend: ✅ All pages render correctly with dark theme
- Backend: ⏳ Ready for E2E testing (Gemini API calls, quota enforcement)
- Flow: Upload → Analyze → Improve → Download

## Next Phase (Post-MVP)
1. Replace mock auth with NextAuth.js + Firebase Auth
2. Migrate from MemStorage to PostgreSQL (Neon)
3. Implement actual OAuth flows (Google, GitHub)
4. Add Firestore logging for admin audit trail
5. Rate limiting middleware
6. Environment variable management (.env.example)
7. Vercel deployment configuration

## Environment Variables Required
```
GEMINI_API_KEY=<Google Gemini API Key>
SESSION_SECRET=<Random secret for sessions>
DATABASE_URL=<PostgreSQL connection string> (future)
```

## Known Limitations (MVP)
- Mock authentication (localStorage-based)
- In-memory storage (data lost on restart)
- No persistent user sessions
- Admin panel uses mock data
- PDF parsing uses basic text extraction (needs pdf.js integration)

## File Structure
```
client/
  src/
    components/      # Reusable UI components
    pages/          # Route pages (Home, Dashboard, Analyze, etc.)
    lib/            # Utilities (auth, queryClient)
server/
  gemini.ts         # Gemini AI integration
  routes.ts         # Express API routes
  storage.ts        # Storage interface & MemStorage
shared/
  schema.ts         # Drizzle ORM schemas & types
```

## Design System
- Dark theme by default (class="dark" on html)
- Space Grotesk for headings, Inter for body
- Hover/active elevations using custom Tailwind utilities
- Shadcn UI components throughout
- Responsive design (mobile-first)