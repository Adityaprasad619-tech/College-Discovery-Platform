# EduFind - College Discovery & Comparison Platform MVP

EduFind is a high-fidelity, modern College Discovery Platform designed for students to explore, bookmark, and evaluate top-tier engineering institutions across India. Built with Next.js 15, TypeScript, Tailwind CSS, Prisma, and Clerk, this application offers an intuitive portal for academic decision-making.

---

## 🚀 Key Features

1. **College Listings & Keywords Search**
   - Search across 20 pre-seeded premier institutions (IITs, NITs, and elite private universities) by name or course specializations.
   - Filter listings dynamically using city/state locations and annual fees budget boundaries.
   - Fully optimized search experience utilizing input debouncing for maximum client performance.

2. **Side-by-Side College Comparison**
   - Compare up to 3 institutions side-by-side.
   - Dynamic comparison matrix lining up annual tuition budgets, career placements packages (average and highest LPA), locations, and specializations.
   - Instant visual triggers notifying users when comparison slot limits are exceeded.

3. **User Auth & Personalized Shortlist**
   - Authenticated bookmarks dashboard managing saved favorites.
   - Native account creation, sign-in, and sign-out controls utilizing Clerk.
   - Fault-tolerant database operations with automated mock user fallbacks when offline or unauthenticated.

4. **Dynamic Detail Profiles**
   - Immersive institutional pages displaying key academic parameters, placement packages, student overview descriptions, and course syllabus grids.
   - Graceful 404/invalid ID fallback modules and shimmering layout skeleton loaders.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 15 (App Router with dynamic dynamic layouts)
- **Language**: TypeScript (100% strict type-safe code compilation)
- **Styling**: Tailwind CSS with custom micro-animations and Google Geist typography
- **State Management**: Zustand (lightweight client state comparison slice)
- **Database Mapping**: Prisma ORM (v5.22.0 stable client compiler)
- **User Authentication**: Clerk (v7.4.1 App Router context provider)
- **Deployment Compatible**: Vercel + Neon PostgreSQL

---

## ⚡ Local Setup Instructions

Follow these commands to get your local environment running instantly:

### 1. Clone & Set Environment
Duplicate `.env.example` to create your active environment config:
```bash
cp .env.example .env
```

### 2. Configure Authentication Keys
Add your secure Clerk API keys inside `.env`:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```

### 3. Install Packages
Instantiate dependency packages:
```bash
npm install
```

### 4. Build Database Schema
Generate type-safe Prisma clients and apply local seeds:
```bash
npx prisma generate
# Optional: run db pushes if database connection URL is active in .env
npx prisma db push
npx prisma db seed
```
> [!NOTE]
> **No-Database Fallback System**:
> If a PostgreSQL server is unavailable, the application gracefully operates using built-in database handlers (`lib/colleges.ts`) that catch connection errors and dynamically fallback to high-fidelity mock data. All routes, searches, comparison cards, and shortlist clicks remain fully functional!

### 5. Launch local server
Start the Next.js local server:
```bash
npm run dev
```
Open `http://localhost:3000` inside your browser to start exploring!

---

## 🏗️ Production Build Instructions

Before pushing or submitting your repository, verify that the project builds flawlessly:
```bash
npm run build
```
This runs Turbopack optimizations, strictly compiles all dynamic App Router types, and generates static/dynamic pre-rendered pages.

---

## 🌐 Cloud Deployment (Vercel + Neon)

EduFind is pre-configured and completely ready for Vercel deployment:

1. **Deploy Neon DB**: Create a free PostgreSQL cluster at [Neon.tech](https://neon.tech) and copy your connection string.
2. **Setup Clerk**: Configure a new tenant in [Clerk Dashboard](https://dashboard.clerk.com) to generate authentication credentials.
3. **Deploy to Vercel**: Push your code to GitHub, link your repository on [Vercel Dashboard](https://vercel.com), and attach your environment variables:
   * `DATABASE_URL`
   * `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   * `CLERK_SECRET_KEY`
   * `NEXT_PUBLIC_CLERK_SIGN_IN_URL`
   * `NEXT_PUBLIC_CLERK_SIGN_UP_URL`
4. Run migrations: Run `npx prisma db push` from Vercel's console to establish standard tables.

---

## 📸 Interface Screenshots

*Add your visual screenshots of listings, compared matrices, and details inside this placeholder zone for submission review:*

| Main Listings Page | Dynamic Comparison Table | Details Profile Page |
| :--- | :--- | :--- |
| *[Add Browse Screenshot]* | *[Add Comparison Matrix Screenshot]* | *[Add College Profile Screenshot]* |

---

## 🔮 Future Enhancements

- **NIRF Placement Trends**: Charts illustrating salary trends and placement ratios over a 3-year period.
- **Dynamic Fee Estimator**: Direct tuition calculations showing total semester metrics based on specialized hostels/mess allocations.
- **Admission Eligibility Predictor**: Mock calculators matching cut-off thresholds for JEE Mains & Advanced rankings.
