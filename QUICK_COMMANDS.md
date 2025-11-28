# ⚡ Quick Commands - Copy & Paste

Command-command penting yang bisa langsung di-copy paste.

## 🚀 Initial Setup (Pertama Kali)

```bash
# 1. Install dependencies
npm install

# 2. Generate Prisma Client
npm run db:generate

# 3. Push schema ke database
npm run db:push
```

## 📊 Seeding Data

### Copy CSV Files

**Windows PowerShell:**

```powershell
Copy-Item "c:\Users\hsyad\Documents\Creative Moment\AMARTHAXGDG\HACKATHON_2025_DATA\*.csv" -Destination ".\prisma\data\" -Force
```

**Windows Command Prompt:**

```cmd
xcopy "c:\Users\hsyad\Documents\Creative Moment\AMARTHAXGDG\HACKATHON_2025_DATA\*.csv" ".\prisma\data\" /Y
```

**Bash/Linux/Mac:**

```bash
cp ../HACKATHON_2025_DATA/*.csv ./prisma/data/
```

### Verify Files Copied

**PowerShell:**

```powershell
Get-ChildItem .\prisma\data\*.csv | Select-Object Name
```

**Bash:**

```bash
ls -lh ./prisma/data/*.csv
```

### Run Seeding

```bash
npm run db:seed
```

## 🔧 Development

```bash
# Start dev server
npm run dev

# Open Prisma Studio
npm run db:studio

# Run linter
npm run lint
```

## 🗄️ Database Commands

```bash
# Generate Prisma Client (after schema changes)
npm run db:generate

# Push schema changes (no migration)
npm run db:push

# Create migration (with history)
npm run db:migrate

# Seed database
npm run db:seed

# Open Prisma Studio
npm run db:studio
```

## 🔄 After Schema Changes

```bash
# Always run these 2 commands after changing schema.prisma:
npm run db:generate
npm run db:push
```

## 🧪 Testing Commands

### Test Database Connection

```bash
npx prisma db execute --stdin <<< "SELECT 1"
```

### Count Records

```bash
npx tsx -e "import { prisma } from './src/lib/db'; (async()=>{const c=await prisma.customer.count();console.log('Customers:',c);await prisma.$disconnect();})();"
```

### Test Server Action

Create `test.ts`:

```typescript
import { getPredictions } from "./src/actions/prediction";

(async () => {
  const result = await getPredictions({ limit: 5 });
  console.log(result);
})();
```

Run:

```bash
npx tsx test.ts
```

## 🐛 Troubleshooting

### Fix PrismaClient Error

```bash
# Delete and reinstall
rm -rf node_modules package-lock.json  # Linux/Mac
# or
rmdir /s node_modules && del package-lock.json  # Windows

npm install
npm run db:generate
```

### Reset Database (DANGER!)

```bash
# This will delete ALL data!
npm run db:push -- --force-reset
npm run db:seed
```

### Clear Next.js Cache

```bash
rm -rf .next  # Linux/Mac
# or
rmdir /s .next  # Windows

npm run build
```

## 📦 Vertex AI Setup (Optional)

### Install Vertex AI Package

```bash
npm install @google-cloud/aiplatform
```

### Add to .env

```env
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_CLOUD_LOCATION=us-central1
VERTEX_AI_ENDPOINT_ID=your-endpoint-id
GOOGLE_APPLICATION_CREDENTIALS=./credentials.json
```

## 🔍 Useful Queries

### Check All Tables

```bash
npx prisma studio
# or
npx tsx -e "import {prisma} from './src/lib/db';(async()=>{console.log('Customers:',await prisma.customer.count());console.log('Tasks:',await prisma.task.count());console.log('Loans:',await prisma.loanSnapshot.count());await prisma.$disconnect();})();"
```

### Get Latest Predictions

```bash
npx tsx -e "import {getPredictions} from './src/actions/prediction';(async()=>{const r=await getPredictions({limit:10});console.log(r);})();"
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
npm run start
```

### Test Production Build Locally

```bash
npm run build && npm run start
```

## 📝 Git Commands

### Initial Commit

```bash
git add .
git commit -m "feat: setup project with Prisma and CSV seeding"
git push origin main
```

### After Schema Changes

```bash
git add prisma/
git commit -m "feat: update database schema"
git push
```

## 🎯 Complete Workflow

### From Scratch to Running

```bash
# 1. Install
npm install

# 2. Setup Prisma
npm run db:generate
npm run db:push

# 3. Copy CSV files (pick one based on your OS)
# PowerShell:
Copy-Item "c:\Users\hsyad\Documents\Creative Moment\AMARTHAXGDG\HACKATHON_2025_DATA\*.csv" -Destination ".\prisma\data\" -Force
# Bash:
cp ../HACKATHON_2025_DATA/*.csv ./prisma/data/

# 4. Seed database
npm run db:seed

# 5. Start dev server
npm run dev

# 6. Open another terminal and check data
npm run db:studio
```

### After Pulling from Git

```bash
# 1. Install new dependencies
npm install

# 2. Generate Prisma Client
npm run db:generate

# 3. Apply schema changes
npm run db:push

# 4. Run dev server
npm run dev
```

## 📚 Documentation Links

- **Quick Start:** `docs/QUICK_START.md`
- **All Commands:** `docs/COMMANDS.md`
- **Vertex AI:** `docs/VERTEX_AI_INTEGRATION.md`
- **Setup Summary:** `docs/SETUP_SUMMARY.md`

## 🆘 Need Help?

```bash
# Prisma help
npx prisma --help

# Next.js help
npx next --help

# Check versions
node --version
npm --version
npx prisma --version
```

---

**Pro Tips:**

1. Always run `npm run db:generate` after schema changes
2. Use `npm run db:studio` to visualize data
3. Keep Cloud SQL Proxy running during development
4. Check `.env` if connection fails
5. Run `npm run lint` before committing
