# CSV Data Directory

Letakkan file CSV Anda di directory ini untuk seeding database.

## File CSV yang Dibutuhkan

1. **customers.csv**

   - `customer_number` (string): Unique customer identifier (hash)
   - `date_of_birth` (date): Tanggal lahir (YYYY-MM-DD)
   - `marital_status` (string): Status pernikahan (MARRIED, WIDOWED, etc.)
   - `religion` (string): Agama
   - `purpose` (string): Tujuan pinjaman

2. **tasks.csv**

   - `task_id` (string): Unique task identifier (hash)
   - `task_type` (string): Jenis task (REPAYMENT, etc.)
   - `task_status` (string): Status task (COMPLETED, PENDING, etc.)
   - `start_datetime` (datetime): Waktu mulai (YYYY-MM-DD HH:MM:SS)
   - `end_datetime` (datetime): Waktu selesai (YYYY-MM-DD HH:MM:SS)
   - `actual_datetime` (datetime): Waktu actual (YYYY-MM-DD HH:MM:SS.mmm)
   - `latitude` (float): Koordinat latitude
   - `longitude` (float): Koordinat longitude
   - `branch_id` (string): ID cabang (hash)

3. **task_participants.csv**

   - `task_id` (string): Hash task ID dari tasks.csv
   - `customer_number` (string): Hash customer number dari customers.csv

4. **loan_snapshots.csv**
   - `customer_number` (string): Hash customer number
   - `loan_id` (string): Hash loan ID
   - `principal_amount` (decimal): Jumlah pinjaman awal
   - `outstanding_amount` (decimal): Sisa pinjaman
   - `dpd` (integer): Days Past Due (hari keterlambatan)

## Cara Menggunakan

### 1. Copy File CSV

Copy file CSV dari folder HACKATHON_2025_DATA ke directory ini:

```bash
# Windows (PowerShell)
Copy-Item "..\..\..\HACKATHON_2025_DATA\*.csv" -Destination "." -Force

# Windows (Command Prompt)
xcopy "..\..\..\HACKATHON_2025_DATA\*.csv" "." /Y

# Bash/Linux/Mac
cp ../../../HACKATHON_2025_DATA/*.csv .
```

### 2. Verify Files

Check apakah semua file sudah ada:

```bash
# PowerShell
Get-ChildItem *.csv

# Bash
ls -la *.csv
```

Expected files:

- customers.csv
- tasks.csv
- task_participants.csv
- loan_snapshots.csv

### 3. Run Seeding

```bash
npm run db:seed
```

### 4. Custom Data Directory (Optional)

Jika file CSV ada di lokasi lain:

```bash
DATA_DIR=/path/to/your/csvs npm run db:seed
```

## Format Data

### Date Format

- Format: `YYYY-MM-DD` atau `YYYY-MM-DD HH:MM:SS`
- Contoh: `2025-06-09` atau `2025-06-09 09:00:00`

### Number Format

- Decimal: menggunakan titik (`.`) bukan koma
- Contoh: `7000000.0` bukan `7.000.000,0`

### String Format

- Hash IDs: lowercase hexadecimal strings
- Contoh: `bfcd935f8d85aa0bf65ba718ca61c475...`

## Troubleshooting

### Error: File not found

```bash
# Check current directory
pwd

# Check files in directory
ls -la

# Make sure you're in prisma/data directory
cd prisma/data
```

### Error: Invalid date format

Pastikan format date adalah `YYYY-MM-DD` atau `YYYY-MM-DD HH:MM:SS`.

### Error: Foreign key constraint

Seeding dilakukan dengan urutan:

1. Customers (tidak ada dependency)
2. Tasks (tidak ada dependency)
3. Task Participants (butuh customers dan tasks)
4. Loan Snapshots (butuh customers)

Pastikan semua customer_number di tasks, task_participants, dan loan_snapshots sudah ada di customers.csv.

## Verifikasi Data

Setelah seeding, verifikasi dengan Prisma Studio:

```bash
npm run db:studio
```

Atau query manual:

```typescript
import { prisma } from "@/lib/db";

const count = await prisma.customer.count();
console.log("Total customers:", count);
```
