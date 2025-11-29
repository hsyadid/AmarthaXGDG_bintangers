# Integrasi Vertex AI untuk Prediksi

Dokumentasi ini menjelaskan cara mengintegrasikan aplikasi dengan Google Cloud Vertex AI untuk prediksi risiko pelanggan dan majelis.

## 📋 Prerequisites

1. **Google Cloud Account** dengan Vertex AI API enabled
2. **Service Account** dengan permissions:
   - `aiplatform.endpoints.predict`
   - `aiplatform.models.predict`
3. **Credentials JSON** dari service account
4. **Vertex AI Model** yang sudah di-deploy

## 🔧 Setup Environment

### 1. Install Dependencies

Tambahkan dependencies untuk Google Cloud:

```bash
npm install @google-cloud/aiplatform
```

### 2. Konfigurasi Environment Variables

Tambahkan ke file `.env`:

```env
# Google Cloud Vertex AI Configuration
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_CLOUD_LOCATION=us-central1  # atau region Anda
VERTEX_AI_ENDPOINT_ID=your-endpoint-id
GOOGLE_APPLICATION_CREDENTIALS=./path/to/credentials.json
```

### 3. Upload Credentials

Copy file `credentials.json` dari Google Cloud Console ke root project:

```
amartha_gdg/
├── credentials.json  <-- Letakkan di sini
├── .env
├── package.json
└── ...
```

**PENTING:** Pastikan `credentials.json` sudah ada di `.gitignore`!

## 📊 Struktur Data

### Input untuk Vertex AI

Data yang dikirim ke Vertex AI memiliki struktur:

```typescript
{
  customer_info: {
    customer_number: string,
    date_of_birth: Date,
    marital_status: string,
    religion: string,
    purpose: string
  },
  financial_metrics: {
    total_revenue: number,
    total_expense: number,
    net_cash_flow: number,
    latest_loan: {
      principal_amount: number,
      outstanding_amount: number,
      dpd: number
    }
  },
  behavioral_metrics: {
    task_completion_rate: number,
    total_tasks: number,
    completed_tasks: number
  },
  cash_flow_history: Array<{
    type: string,
    amount: number,
    date: Date,
    description: string
  }>,
  loan_history: Array<{
    principal_amount: number,
    outstanding_amount: number,
    dpd: number,
    created_at: Date
  }>
}
```

### Output dari Vertex AI

Expected output format dari model Anda:

```json
{
  "predictions": [
    {
      "risk_score": 0.75,
      "risk_category": "high",
      "confidence": 0.92
    }
  ]
}
```

## 🚀 Implementasi

### Step 1: Buat Vertex AI Client

Buat file `src/lib/vertex-ai.ts`:

```typescript
import { PredictionServiceClient } from "@google-cloud/aiplatform";
import { google } from "@google-cloud/aiplatform/build/protos/protos";

const client = new PredictionServiceClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

export async function predictWithVertexAI(data: any) {
  const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
  const location = process.env.GOOGLE_CLOUD_LOCATION;
  const endpointId = process.env.VERTEX_AI_ENDPOINT_ID;

  const endpoint = `projects/${projectId}/locations/${location}/endpoints/${endpointId}`;

  const instanceValue = google.protobuf.Value.create({
    structValue: {
      fields: {
        input: {
          structValue: {
            fields: Object.entries(data).reduce((acc, [key, value]) => {
              acc[key] = { stringValue: JSON.stringify(value) };
              return acc;
            }, {} as any),
          },
        },
      },
    },
  });

  const request = {
    endpoint,
    instances: [instanceValue],
  };

  try {
    const [response] = await client.predict(request);
    return {
      success: true,
      predictions: response.predictions,
    };
  } catch (error) {
    console.error("Vertex AI prediction error:", error);
    return {
      success: false,
      error: "Prediction failed",
    };
  }
}

export default client;
```

### Step 2: Buat Server Action untuk Prediksi

Update atau buat file `src/actions/vertex-prediction.ts`:

```typescript
"use server";

import { predictWithVertexAI } from "@/lib/vertex-ai";
import { prepareCustomerDataForPrediction } from "./data-processing";
import { createPrediction } from "./prediction";

export async function predictCustomerRisk(customer_number: string) {
  // 1. Ambil dan olah data dari database
  const dataResult = await prepareCustomerDataForPrediction(customer_number);

  if (!dataResult.success) {
    return { success: false, error: dataResult.error };
  }

  // 2. Kirim ke Vertex AI
  const predictionResult = await predictWithVertexAI(dataResult.data);

  if (!predictionResult.success) {
    return { success: false, error: predictionResult.error };
  }

  // 3. Parse hasil prediksi
  const riskScore = predictionResult.predictions?.[0]?.risk_score || 0;

  // 4. Simpan ke database
  const saveResult = await createPrediction({
    customer_number,
    prediction: riskScore,
  });

  return {
    success: true,
    data: {
      customer_number,
      risk_score: riskScore,
      saved: saveResult.success,
    },
  };
}
```

### Step 3: Buat Server Action untuk Prediksi Majelis

Buat file `src/actions/vertex-prediction-majelis.ts`:

```typescript
"use server";

import { predictWithVertexAI } from "@/lib/vertex-ai";
import { prepareMajelisDataForPrediction } from "./data-processing";
import { createPredictionMajelis } from "./prediction-majelis";

export async function predictMajelisRisk(
  id_majelis: string,
  customer_numbers: string[]
) {
  // 1. Ambil dan olah data majelis dari database
  const dataResult = await prepareMajelisDataForPrediction(customer_numbers);

  if (!dataResult.success) {
    return { success: false, error: dataResult.error };
  }

  // 2. Kirim ke Vertex AI
  const predictionResult = await predictWithVertexAI(dataResult.data);

  if (!predictionResult.success) {
    return { success: false, error: predictionResult.error };
  }

  // 3. Parse hasil prediksi
  const riskScore = predictionResult.predictions?.[0]?.risk_score || 0;

  // 4. Simpan ke database
  const saveResult = await createPredictionMajelis({
    id_majelis,
    id_user: customer_numbers,
    prediction: riskScore,
  });

  return {
    success: true,
    data: {
      id_majelis,
      risk_score: riskScore,
      members_count: customer_numbers.length,
      saved: saveResult.success,
    },
  };
}
```

## 🔄 Workflow Lengkap

### Untuk Prediksi Customer Individual

```typescript
// Di component atau page
import { predictCustomerRisk } from "@/actions/vertex-prediction";

async function handlePredict() {
  const result = await predictCustomerRisk("CUSTOMER123");

  if (result.success) {
    console.log("Risk Score:", result.data.risk_score);
  }
}
```

### Untuk Prediksi Majelis (Group)

```typescript
// Di component atau page
import { predictMajelisRisk } from "@/actions/vertex-prediction-majelis";
import { getCustomersByBranch } from "@/actions/data-processing";

async function handlePredictMajelis() {
  // 1. Ambil customers di branch tertentu
  const customersResult = await getCustomersByBranch("BRANCH001");

  if (!customersResult.success) return;

  // 2. Lakukan prediksi
  const result = await predictMajelisRisk("MAJELIS001", customersResult.data);

  if (result.success) {
    console.log("Majelis Risk Score:", result.data.risk_score);
  }
}
```

## 📝 Batch Processing

Untuk memproses banyak prediksi sekaligus:

```typescript
import { getHighRiskCustomers } from "@/actions/data-processing";
import { predictCustomerRisk } from "@/actions/vertex-prediction";

async function batchPrediction() {
  // Ambil customers berisiko tinggi
  const result = await getHighRiskCustomers();

  if (!result.success) return;

  // Proses satu per satu (atau gunakan Promise.all untuk parallel)
  for (const customerNumber of result.data) {
    await predictCustomerRisk(customerNumber);
    // Add delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}
```

## 🔍 Membaca Hasil Prediksi

### Ambil Prediksi Terbaru untuk Customer

```typescript
import { getLatestPrediction } from "@/actions/prediction";

const result = await getLatestPrediction("CUSTOMER123");
if (result.success) {
  console.log("Latest prediction:", result.data);
}
```

### Ambil Prediksi Terbaru untuk Majelis

```typescript
import { getLatestPredictionMajelis } from "@/actions/prediction-majelis";

const result = await getLatestPredictionMajelis("MAJELIS001");
if (result.success) {
  console.log("Latest majelis prediction:", result.data);
}
```

### Ambil Semua Prediksi dengan Filter

```typescript
import { getPredictions } from "@/actions/prediction";

const result = await getPredictions({
  customer_number: "CUSTOMER123",
  startDate: new Date("2025-01-01"),
  endDate: new Date("2025-12-31"),
  limit: 50,
});
```

## ⚠️ Error Handling

Selalu handle error dengan baik:

```typescript
try {
  const result = await predictCustomerRisk(customerNumber);

  if (!result.success) {
    console.error("Prediction failed:", result.error);
    // Show error to user
    return;
  }

  // Process successful result
  console.log("Prediction:", result.data);
} catch (error) {
  console.error("Unexpected error:", error);
}
```

## 🎯 Testing

### Test dengan Data Mock

Sebelum menggunakan Vertex AI, test dengan mock data:

```typescript
// src/lib/vertex-ai-mock.ts
export async function predictWithVertexAI(data: any) {
  // Mock implementation for testing
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    success: true,
    predictions: [
      {
        risk_score: Math.random(),
        risk_category: "medium",
        confidence: 0.85,
      },
    ],
  };
}
```

## 📚 Resources

- [Vertex AI Documentation](https://cloud.google.com/vertex-ai/docs)
- [Google Cloud Node.js Client](https://github.com/googleapis/nodejs-ai-platform)
- [Prediction Service Client](https://cloud.google.com/nodejs/docs/reference/aiplatform/latest)

## 🔐 Security Notes

1. **JANGAN** commit `credentials.json` ke Git
2. Gunakan environment variables untuk semua credentials
3. Set proper IAM permissions di Google Cloud
4. Rotate credentials secara berkala
5. Monitor API usage dan costs

## 📊 Monitoring

Track prediction metrics:

```typescript
// Tambahkan logging untuk monitoring
console.log("Prediction request:", {
  customer_number,
  timestamp: new Date(),
  input_data_size: JSON.stringify(data).length,
});

console.log("Prediction response:", {
  customer_number,
  risk_score,
  processing_time_ms: Date.now() - startTime,
});
```
