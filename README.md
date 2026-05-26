# EduFind – College Discovery Platform

EduFind is a full-stack college discovery and comparison platform built using Next.js 15, TypeScript, Prisma, PostgreSQL, Clerk Authentication, Zustand, and TailwindCSS.

The platform helps students explore engineering colleges, compare institutions side-by-side, and save shortlisted colleges for later review.

---

## Features

### College Discovery
- Browse engineering colleges
- Search colleges by name or specialization
- Filter colleges by:
  - location
  - annual fees

### College Comparison
- Compare up to 3 colleges side-by-side
- View:
  - fees
  - ratings
  - placements
  - locations
  - courses

### Saved Colleges
- Save/unsave colleges
- Personalized shortlist page
- Clerk-based authentication

### College Detail Pages
- Detailed overview for each college
- Placement information
- Course offerings
- Fee structure
- Responsive layouts

### Error Handling & UX
- Loading skeletons
- Empty states
- Graceful invalid route handling
- Compare limit validation
- Database fallback support

---

## Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js 15 |
| Language | TypeScript |
| Styling | TailwindCSS |
| State Management | Zustand |
| Database | PostgreSQL |
| ORM | Prisma |
| Authentication | Clerk |
| Deployment | Vercel + Neon |

---

## Project Structure

```bash
app/
components/
lib/
prisma/
store/
```

---

## Local Setup

### 1. Clone Repository

```bash
git clone <your-repo-url>
cd College-Discovery-Platform
```

### 2. Setup Environment Variables

Create a `.env` file using `.env.example`.

```env
DATABASE_URL=

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```

---

### 3. Install Dependencies

```bash
npm install
```

---

### 4. Generate Prisma Client

```bash
npx prisma generate
```

---

### 5. Push Database Schema

```bash
npx prisma db push
```

---

### 6. Seed Database

```bash
npx prisma db seed
```

---

### 7. Run Development Server

```bash
npm run dev
```

Open:
```txt
http://localhost:3000
```

---

## Production Build

```bash
npm run build
```

---

## Deployment

The project is deployment-ready for:

- Vercel
- Neon PostgreSQL

Environment variables required in production:

```env
DATABASE_URL
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
NEXT_PUBLIC_CLERK_SIGN_IN_URL
NEXT_PUBLIC_CLERK_SIGN_UP_URL
```

---

## Notes

The application includes a fallback data layer for local development.  
If the PostgreSQL database is unavailable, mock college data is used automatically to keep the application functional during testing.

---

## Future Improvements

- Admission predictor
- Placement analytics
- College reviews
- Advanced filtering
- Scholarship information
- Mobile optimization improvements
