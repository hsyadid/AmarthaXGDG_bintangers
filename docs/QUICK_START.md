# 🚀 Quick Start Guide

Panduan singkat untuk memulai project dalam 5 menit.

## Prerequisites

- ✅ Node.js 18+ installed
- ✅ PostgreSQL database (Cloud SQL)
- ✅ Cloud SQL Proxy running
- ✅ File CSV dari HACKATHON_2025_DATA

## Step-by-Step Setup

### 1. Install Dependencies (2 menit)

```bash
cd amartha_gdg
npm install
```

### 2. Setup Environment (.env)

```bash
# Copy example
cp .env.example .env

# Edit .env dengan credentials Anda
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
```

### 3. Generate Prisma Client

```bash
npm run db:generate
```

### 4. Push Database Schema

```bash
npm run db:push
```

### 5. Copy & Seed Data (1 menit)

```bash
# Copy CSV files
# Windows PowerShell:
Copy-Item "..\HACKATHON_2025_DATA\*.csv" -Destination ".\prisma\data\" -Force

# Bash:
cp ../HACKATHON_2025_DATA/*.csv ./prisma/data/

# Seed database
npm run db:seed
```

Expected output:

```
🌱 Starting database seeding...
✓ Seeded 91 customers
✓ Seeded 35 tasks
✓ Seeded XX task participants
✓ Seeded 55 loan snapshots
✅ Database seeding completed successfully!
```

### 6. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000 🎉

## Verify Everything Works

### Check Database

```bash
npm run db:studio
```

Browser akan membuka Prisma Studio - Anda bisa lihat semua data.

### Check Tables

Harus ada data di:

- ✅ customers (91 records)
- ✅ tasks (35 records)
- ✅ task_participants
- ✅ loan_snapshots (55 records)

## Troubleshooting

### Error: PrismaClient not found

```bash
npm run db:generate
```

### Error: Can't connect to database

1. Check Cloud SQL Proxy running
2. Check DATABASE_URL in .env
3. Test connection:

```bash
npx prisma db execute --stdin <<< "SELECT 1"
```

### Error: File not found (seeding)

```bash
# Check files exist
ls -la ./prisma/data/*.csv

# Should show:
# customers.csv
# tasks.csv
# task_participants.csv
# loan_snapshots.csv
```

### Error: Foreign key constraint

Customer numbers in CSV files mungkin tidak match. Check:

```bash
# Count unique customers in each file
grep -v "^customer_number" ./prisma/data/customers.csv | wc -l
grep -v "^customer_number" ./prisma/data/loan_snapshots.csv | cut -d',' -f1 | sort -u | wc -l
```

## Next Steps

### 1. Explore Data

```bash
npm run db:studio
```

### 2. Test Server Actions

Create test file `test-actions.ts`:

```typescript
import { getPredictions } from "./src/actions/prediction";
import { getCashFlows } from "./src/actions/cashflow";

async function test() {
  const predictions = await getPredictions({ limit: 5 });
  console.log("Predictions:", predictions);
}

test();
```

Run:

```bash
npx tsx test-actions.ts
```

### 3. Setup Vertex AI (Optional)

Lihat `docs/VERTEX_AI_INTEGRATION.md` untuk setup Vertex AI.

### 4. Create Your First Page

Edit `src/app/page.tsx` atau buat page baru di `src/app/dashboard/`.

## Common Commands

```bash
# Development
npm run dev                    # Start dev server
npm run db:studio              # Open Prisma Studio

# Database
npm run db:generate            # Generate Prisma Client
npm run db:push                # Push schema changes
npm run db:seed                # Seed data

# Production
npm run build                  # Build for production
npm run start                  # Start production server
```

## File Structure

```
amartha_gdg/
├── prisma/
│   ├── schema.prisma         # Database schema
│   ├── seed.ts               # Seeding script
│   └── data/                 # CSV files here
├── src/
│   ├── actions/              # Server Actions
│   │   ├── cashflow.ts       # Cash flow CRUD
│   │   ├── prediction.ts     # Predictions CR
│   │   ├── prediction-majelis.ts
│   │   └── data-processing.ts
│   ├── lib/
│   │   ├── db.ts            # Prisma client
│   │   └── utils.ts         # Indonesian locale utils
│   └── app/                 # Next.js pages
├── docs/
│   ├── COMMANDS.md          # All commands
│   └── VERTEX_AI_INTEGRATION.md
└── .env                     # Your credentials
```

## Support

Jika ada masalah:

1. Check `docs/COMMANDS.md` untuk command lengkap
2. Check `docs/VERTEX_AI_INTEGRATION.md` untuk Vertex AI
3. Run `npm run lint` untuk check errors
4. Check Prisma logs: `npx prisma --version`

## Summary Checklist

- [ ] Dependencies installed
- [ ] .env configured
- [ ] Prisma Client generated
- [ ] Schema pushed to database
- [ ] CSV files copied
- [ ] Database seeded
- [ ] Dev server running
- [ ] Prisma Studio shows data

Selamat! Project Anda sudah siap digunakan 🎉
