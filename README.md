# Amartha GDG - Cash Flow Management System

A scalable Next.js application for managing cash flows, predictions, and customer data with Google Cloud SQL integration.

## 🚀 Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL (Google Cloud SQL)
- **ORM:** Prisma
- **Authentication:** Ready for NextAuth.js integration

## 📁 Project Structure

```
amartha_gdg/
├── public/                 # Static assets
├── prisma/                 # Database schema & seeds
│   ├── schema.prisma       # Prisma schema definition
│   ├── seed.ts             # CSV data seeding script
│   └── data/               # CSV files for seeding
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── api/            # REST API routes (if needed)
│   │   ├── (auth)/         # Authentication route group
│   │   ├── dashboard/      # Dashboard pages
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Homepage
│   ├── actions/            # Server Actions
│   │   ├── cashflow.ts     # CashFlow CRUD operations
│   │   └── prediction.ts   # Prediction CR operations
│   ├── components/         # React components
│   │   ├── ui/             # Atomic UI components
│   │   ├── layout/         # Layout components
│   │   └── features/       # Feature-specific components
│   ├── lib/
│   │   ├── db.ts           # Prisma client singleton
│   │   ├── utils.ts        # Utility functions
│   │   └── auth.ts         # Auth configuration
│   ├── hooks/              # Custom React hooks
│   ├── types/              # TypeScript type definitions
│   └── middleware.ts       # Next.js middleware
├── .env                    # Environment variables
├── .env.example            # Environment variables template
└── package.json
```

## 🗄️ Database Models

### Core Models

- **CashFlow**: Track expenses and revenue
- **CashFlowTotal**: Aggregated cash flow totals
- **Prediction**: Financial predictions

### Hackathon Data Models

- **Customer**: Customer information and preferences
- **Bill**: Customer billing information
- **Task**: Task management
- **TaskParticipant**: Task-customer associations
- **LoanSnapshot**: Loan status snapshots

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy the example environment file and update with your database credentials:

```bash
cp .env.example .env
```

Edit `.env` and set your DATABASE_URL:

```env
# For local development with Cloud SQL Proxy
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
```

### 3. Start Cloud SQL Proxy (if using Google Cloud SQL)

```bash
./cloud-sql-proxy your-project:your-region:your-instance --port=5432
```

### 4. Generate Prisma Client

```bash
npm run db:generate
```

### 5. Push Database Schema

```bash
npm run db:push
```

Or use migrations:

```bash
npm run db:migrate
```

### 6. Seed Database with CSV Data

Place your CSV files in `prisma/data/` directory, then run:

```bash
npm run db:seed
```

Expected CSV files:

- `customers.csv`
- `bills.csv`
- `tasks.csv`
- `task_participants.csv`
- `loan_snapshots.csv`

See `prisma/data/README.md` for CSV format details.

### 7. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint

# Database
npm run db:generate      # Generate Prisma Client
npm run db:push          # Push schema to database
npm run db:migrate       # Run database migrations
npm run db:seed          # Seed database from CSV files
npm run db:studio        # Open Prisma Studio
```

## 🔌 Server Actions API

### CashFlow Actions (`src/actions/cashflow.ts`)

```typescript
import {
  createCashFlow,
  getCashFlows,
  getCashFlowById,
  updateCashFlow,
  deleteCashFlow,
  getCashFlowSummary,
} from "@/actions/cashflow";

// Create
await createCashFlow({
  type: "REVENUE",
  amount: 1000,
  description: "Payment received",
  customer_number: "CUST001",
});

// Read
await getCashFlows({ customer_number: "CUST001" });

// Update
await updateCashFlow("id", { amount: 1500 });

// Delete
await deleteCashFlow("id");
```

### Prediction Actions (`src/actions/prediction.ts`)

```typescript
import {
  createPrediction,
  getPredictions,
  getPredictionById,
  getLatestPrediction,
  getPredictionHistory,
} from "@/actions/prediction";

// Create
await createPrediction({
  customer_number: "CUST001",
  prediction: 0.85,
});

// Read
await getPredictions({ customer_number: "CUST001" });
await getLatestPrediction("CUST001");
```

## 🔒 Security Notes

- Never commit `.env` file
- Use environment variables for sensitive data
- Implement proper authentication before production
- Review and update Prisma schema security settings
- Use prepared statements (Prisma handles this automatically)

## 📦 Production Deployment

1. Set production DATABASE_URL
2. Run migrations: `npm run db:migrate`
3. Build application: `npm run build`
4. Start server: `npm run start`

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

Private - Amartha GDG Project

---

Built with ❤️ using Next.js and Prisma

# AmarthaXGDG_bintangers
