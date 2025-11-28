# 📝 Panduan Command dan Setup

Dokumen ini berisi semua command yang dibutuhkan untuk menjalankan project.

## 🚀 Initial Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

Copy file `.env.example` ke `.env`:

```bash
cp .env.example .env
```

Edit `.env` dan isi dengan credentials Anda:

```env
# Database Connection (via Cloud SQL Proxy)
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"

# Google Cloud Vertex AI
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_CLOUD_LOCATION=us-central1
VERTEX_AI_ENDPOINT_ID=your-endpoint-id
GOOGLE_APPLICATION_CREDENTIALS=./credentials.json

# Next.js
NODE_ENV=development
```

### 3. Start Cloud SQL Proxy

Jalankan Cloud SQL Proxy di terminal terpisah:

```bash
./cloud-sql-proxy your-project:your-region:your-instance --port=5432
```

Atau di Windows:

```bash
cloud-sql-proxy.exe your-project:your-region:your-instance --port=5432
```

**Tips:** Biarkan terminal ini tetap berjalan selama development.

## 📊 Database Setup

### 1. Generate Prisma Client

```bash
npm run db:generate
```

Command ini akan:

- Generate Prisma Client berdasarkan `schema.prisma`
- Create type definitions untuk TypeScript
- **Jalankan setiap kali mengubah schema!**

### 2. Push Schema ke Database

Untuk development (tanpa migration):

```bash
npm run db:push
```

Command ini akan:

- Sync schema.prisma dengan database
- Tidak membuat migration files
- Cocok untuk rapid prototyping

Untuk production (dengan migration):

```bash
npm run db:migrate
```

Command ini akan:

- Buat migration files di `prisma/migrations/`
- Apply migration ke database
- Update Prisma Client

### 3. Copy CSV Files ke Data Directory

Copy file CSV dari `HACKATHON_2025_DATA` ke `prisma/data/`:

```bash
# Windows (PowerShell)
Copy-Item "c:\Users\hsyad\Documents\Creative Moment\AMARTHAXGDG\HACKATHON_2025_DATA\*.csv" -Destination ".\prisma\data\"

# Windows (Command Prompt)
xcopy "c:\Users\hsyad\Documents\Creative Moment\AMARTHAXGDG\HACKATHON_2025_DATA\*.csv" ".\prisma\data\" /Y

# Bash/Linux/Mac
cp ../HACKATHON_2025_DATA/*.csv ./prisma/data/
```

Verify files copied:

```bash
# Windows (PowerShell)
Get-ChildItem .\prisma\data\

# Bash
ls -la ./prisma/data/
```

### 4. Seed Database

Import data CSV ke database:

```bash
npm run db:seed
```

Command ini akan:

- Baca file CSV dari `prisma/data/`
- Parse dan validate data
- Insert ke database
- Skip duplicates

Output yang expected:

```
🌱 Starting database seeding...

Using data directory: /path/to/prisma/data

Seeding customers...
✓ Seeded 91 customers
Seeding tasks...
✓ Seeded 35 tasks
Seeding task participants...
✓ Seeded XX task participants
Seeding loan snapshots...
✓ Seeded 55 loan snapshots

✅ Database seeding completed successfully!
```

### 5. Open Prisma Studio (Optional)

Untuk melihat dan edit data secara visual:

```bash
npm run db:studio
```

Browser akan terbuka di `http://localhost:5555` dengan Prisma Studio interface.

## 🔧 Development Commands

### Run Development Server

```bash
npm run dev
```

Server akan berjalan di `http://localhost:3000`

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm run start
```

### Run Linter

```bash
npm run lint
```

## 🗄️ Database Maintenance Commands

### Reset Database (DANGER!)

**WARNING:** Ini akan menghapus SEMUA data!

```bash
# Drop all tables
npm run db:push -- --force-reset

# Seed ulang
npm run db:seed
```

### Create New Migration

Setelah mengubah `schema.prisma`:

```bash
npm run db:migrate
```

Anda akan diminta memberi nama migration, misalnya:

```
Enter a name for the new migration: add_preference_column
```

### View Migration Status

```bash
npx prisma migrate status
```

### Apply Pending Migrations

```bash
npx prisma migrate deploy
```

## 🔄 Seeding Data Kustom

### Seed dari Directory Berbeda

```bash
DATA_DIR=/path/to/your/csv npm run db:seed
```

### Seed Specific Tables

Edit `prisma/seed.ts` dan comment functions yang tidak dibutuhkan:

```typescript
async function main() {
  await seedCustomers(dataDir);
  // await seedTasks(dataDir);  // Comment untuk skip
  await seedTaskParticipants(dataDir);
  await seedLoanSnapshots(dataDir);
}
```

## 🧪 Testing Commands

### Test Database Connection

Buat simple test script `test-db.ts`:

```typescript
import { prisma } from "./src/lib/db";

async function main() {
  const count = await prisma.customer.count();
  console.log("Total customers:", count);
}

main();
```

Run:

```bash
npx tsx test-db.ts
```

## 📦 Package Management

### Update All Dependencies

```bash
npm update
```

### Check Outdated Packages

```bash
npm outdated
```

### Install Specific Package

```bash
npm install package-name
npm install -D package-name  # Dev dependency
```

## 🐛 Troubleshooting Commands

### Fix PrismaClient Import Error

Jika mendapat error `Module '@prisma/client' has no exported member 'PrismaClient'`:

```bash
# 1. Delete node_modules dan package-lock.json
rm -rf node_modules package-lock.json  # Linux/Mac
# atau
rmdir /s node_modules  # Windows
del package-lock.json

# 2. Reinstall
npm install

# 3. Generate Prisma Client
npm run db:generate
```

### Clear Next.js Cache

```bash
# Delete .next directory
rm -rf .next  # Linux/Mac
# atau
rmdir /s .next  # Windows

# Rebuild
npm run build
```

### Check Prisma Client Location

```bash
# Should show installed prisma client
npm list @prisma/client
```

### Reset Prisma

```bash
npx prisma generate --force
```

## 📝 Git Commands

### Initial Commit

```bash
git add .
git commit -m "Initial setup with Prisma and CSV seeding"
git push origin main
```

### Commit After Schema Changes

```bash
git add prisma/schema.prisma prisma/migrations/
git commit -m "Update database schema"
git push
```

## 🔍 Useful Queries

### Check Database Tables

```bash
npx prisma db execute --stdin <<EOF
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public';
EOF
```

### Count Records

```bash
npx tsx -e "
import { prisma } from './src/lib/db';
async function main() {
  const stats = {
    customers: await prisma.customer.count(),
    tasks: await prisma.task.count(),
    loans: await prisma.loanSnapshot.count(),
  };
  console.log(stats);
}
main();
"
```

## 📊 Prisma Studio Commands

```bash
# Open Studio
npm run db:studio

# Open on specific port
npx prisma studio --port 5556

# Open with specific browser
npx prisma studio --browser chrome
```

## 🚀 Deployment Commands

### Build and Deploy

```bash
# Build
npm run build

# Test production build locally
npm run start

# Deploy (adjust based on your platform)
# Vercel:
vercel --prod

# Docker:
docker build -t amartha-gdg .
docker run -p 3000:3000 amartha-gdg
```

## 📚 Documentation Commands

### Generate Prisma ERD

```bash
# Install ERD generator
npm install -D prisma-erd-generator @mermaid-js/mermaid-cli

# Generate
npx prisma generate
```

### View Prisma Schema

```bash
npx prisma format
```

## ⚡ Quick Reference

```bash
# Full setup dari awal
npm install
npm run db:generate
npm run db:push
# Copy CSV files ke prisma/data/
npm run db:seed
npm run dev

# Setelah ubah schema
npm run db:generate
npm run db:push

# Sebelum commit
npm run lint
npm run build
```

## 🆘 Get Help

```bash
# Prisma help
npx prisma --help

# Specific command help
npx prisma migrate --help
npx prisma db --help

# Next.js help
npx next --help
```
