# ResumeAI — AI Resume Builder & Analyzer SaaS

A full-stack production-ready SaaS web application for building, analyzing, and optimizing resumes with AI. Built with Next.js, OpenAI, Clerk, PostgreSQL, and Cloudinary.

![ResumeAI](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-green?style=flat-square)
![Clerk](https://img.shields.io/badge/Auth-Clerk-purple?style=flat-square)

## Features

- **Resume Builder** — Step-by-step builder with live preview and AI content generation
- **Resume Analyzer** — Upload PDF, extract text, get ATS score (0–100) with detailed feedback
- **Job Match System** — Compare resume against job descriptions
- **Cover Letter Generator** — AI-generated professional cover letters (Pro plan)
- **Dashboard** — Stats, history, and subscription management
- **Export** — Download resumes and analysis reports as PDF

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16 (App Router), JavaScript, Tailwind CSS, ShadCN-style UI, Framer Motion, React Hook Form |
| Backend | Next.js API Routes |
| AI | OpenAI API (gpt-4o-mini) |
| Database | PostgreSQL + Prisma ORM |
| Auth | Clerk |
| Storage | Cloudinary |
| PDF | pdf-parse (extract), Puppeteer (generate) |

## Project Structure

```
├── app/
│   ├── (auth)/              # Sign in / Sign up pages
│   ├── dashboard/           # Protected dashboard pages
│   │   ├── analyzer/
│   │   ├── builder/
│   │   ├── cover-letter/
│   │   ├── history/
│   │   ├── job-match/
│   │   ├── settings/
│   │   └── upload/
│   └── api/                 # Backend API routes
│       ├── analyze/
│       ├── cover-letter/
│       ├── dashboard/
│       ├── export/
│       ├── generate-content/
│       ├── generate-resume/
│       ├── job-match/
│       ├── resumes/
│       └── subscription/
├── components/
│   ├── analysis/            # ATS score, results display
│   ├── dashboard/           # Sidebar, navbar, stats
│   ├── resume/              # Builder, preview, uploader
│   └── ui/                  # Reusable UI components
├── lib/                     # Utilities (OpenAI, Prisma, Cloudinary, PDF)
├── prisma/schema.prisma     # Database models
└── middleware.js            # Clerk route protection
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- [Clerk](https://clerk.com) account
- [OpenAI](https://platform.openai.com) API key
- [Cloudinary](https://cloudinary.com) account (optional, for PDF storage)

### 1. Clone & Install

```bash
cd "AI Resume"
npm install
```

### 2. Environment Variables

Copy the example env file and fill in your credentials:

```bash
cp .env.example .env.local
```

Required variables:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/ai_resume"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
OPENAI_API_KEY=sk-...
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Database Setup

```bash
npx prisma db push
# or for migrations:
npx prisma migrate dev --name init
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Clerk Setup

1. Create a Clerk application at [clerk.com](https://clerk.com)
2. Add your publishable and secret keys to `.env.local`
3. Set redirect URLs in Clerk dashboard:
   - Sign-in URL: `/sign-in`
   - Sign-up URL: `/sign-up`
   - After sign-in: `/dashboard`

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/analyze` | Upload PDF, extract text, AI analysis |
| POST | `/api/generate-resume` | AI resume generation from structured data |
| POST | `/api/cover-letter` | Generate cover letter (Pro) |
| POST | `/api/job-match` | Compare resume with job description |
| POST | `/api/generate-content` | AI-assisted builder content |
| POST | `/api/export/pdf` | Export resume as PDF |
| POST | `/api/export/analysis` | Export analysis report as PDF |
| GET | `/api/dashboard` | Dashboard stats and history |
| GET/POST | `/api/resumes` | List/create resumes |
| POST | `/api/subscription` | Update subscription plan |

## AI Response Format

All analysis endpoints return structured JSON:

```json
{
  "atsScore": 85,
  "strengths": [],
  "weaknesses": [],
  "missingKeywords": [],
  "matchingSkills": [],
  "improvements": [],
  "careerSuggestions": [],
  "interviewQuestions": []
}
```

## Subscription Plans

| Feature | Free | Pro |
|---------|------|-----|
| AI Analyses | 5/month | Unlimited |
| Resume Builder | ✅ | ✅ |
| ATS Scoring | ✅ | ✅ Advanced |
| Job Matching | ✅ | ✅ |
| Cover Letters | ❌ | ✅ |
| PDF Export | ✅ | ✅ |

## Production Deployment

1. Deploy to [Vercel](https://vercel.com) or any Node.js host
2. Set all environment variables in your hosting dashboard
3. Use a managed PostgreSQL (Neon, Supabase, Railway)
4. For Puppeteer in production, consider `@sparticuz/chromium` for serverless environments

```bash
npm run build
npm start
```

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run db:push      # Push schema to database
npm run db:studio    # Open Prisma Studio
npm run db:migrate   # Run migrations
```

## License

MIT — Built for educational purposes. Feel free to use and modify.
