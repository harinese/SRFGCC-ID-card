# SRFGCC Student ID Card Portal & Faculty Board

Official Identity Card Registration and Faculty Administration Portal for **Sangolli Rayanna First Grade Constituent College, Belagavi** (Affiliated with Rani Channamma University).

## Features

- **Interactive Student Registration**: Minimal, professional form with real-time input validation (mobile, Aadhaar, DOB, course, academic year).
- **Physical ID Card Replica**: Live-updating CR-80 card preview matching the physical college ID card, including official Kitturu Rani Channamma and Sangolli Rayanna emblems, acrylic holder bezel, concentric cyan/sky-blue graphics, and Principal signature.
- **Configured Courses**: B.Sc., B.Com., B.B.A., B.C.A., and B.A. with academic year selection (I Year, II Year, III Year).
- **Hidden Faculty Administrative Board**: Not visible from public student navigation. Accessible directly via authenticated link (`/faculty?key=...`) or passcode prompt.
- **Faculty Tools**: Real-time KPI metrics by course and year, search by name/regNo/phone/Aadhaar, individual ID card inspection modal, and record management.
- **Export & Production Engines**:
  - **CSV Export**: One-click download of Excel-ready UTF-8 BOM CSV.
  - **Batch Print Sheet**: Printable A4 layout with cutting guides for batch PVC/paper card production.

## Tech Stack

- **Framework**: Next.js 16 (App Router) & React 19
- **Language**: TypeScript (strict ES6+)
- **Database ORM**: Prisma (configured with local SQLite by default, with instant Supabase PostgreSQL migration ready)
- **Validation**: Zod
- **Styling**: Custom HSL design tokens, responsive layout, dark mode, and print media queries

## Setup & Running

### 1. Installation
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file based on `.env.example`:
```env
DATABASE_URL="postgresql://username:password@host:5432/postgres?pgbouncer=true&statement_cache_size=0"
DIRECT_URL="postgresql://username:password@host:5432/postgres"
FACULTY_ACCESS_KEY="srfgcc-faculty-pass-2026"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Database Options

#### Option A: Local Development (Default)
The repository is pre-configured with a zero-setup local SQLite database:
```bash
npm run db:push
npm run dev
```

#### Option B: Supabase (PostgreSQL)
1. Add your Supabase PostgreSQL credentials to `DATABASE_URL` and `DIRECT_URL` in `.env`.
2. Push the schema to your Supabase project:
```bash
npm run db:push:supabase
```

### 4. Running the Development Server
```bash
npm run dev
```
- Student Portal: `http://localhost:3000`
- Faculty Board: `http://localhost:3000/faculty?key=srfgcc-faculty-pass-2026`

### 5. Building for Production
```bash
npm run build
npm run start
```
