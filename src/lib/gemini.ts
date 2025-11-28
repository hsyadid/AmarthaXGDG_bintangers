import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

export interface TransactionResponse {
  status: "success" | "mismatch";
  mode?: "total" | "list" | null;
  total?: {
    tipe: "expense" | "revenue";
    desc?: string;
    amount: number;
  } | null;
  items?: Array<{
    tipe: "expense" | "revenue";
    desc: string;
    amount: number;
  }> | null;
}

type TransactionType = "revenue" | "expense";

// Helper Enum untuk Schema agar tidak typo
const TRANSACTION_TYPES = ["expense", "revenue"];

export async function analyzeImage(base64Image: string): Promise<any> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined in environment variables.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const { data, mimeType } = parseBase64Image(base64Image);

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-pro",
      generationConfig: {
        temperature: 0,
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            status: {
              type: SchemaType.STRING,
              format: "enum",
              enum: ["success", "mismatch"]
            },
            mode: {
              type: SchemaType.STRING,
              format: "enum",
              enum: ["total", "list"]
            },
            total: {
              type: SchemaType.OBJECT,
              properties: {
                tipe: { type: SchemaType.STRING, format: "enum", enum: ["expense", "revenue"] },
                desc: { type: SchemaType.STRING },
                amount: { type: SchemaType.NUMBER }
              },
              required: ["tipe", "amount"] // desc optional
            },
            items: {
              type: SchemaType.ARRAY,
              items: {
                type: SchemaType.OBJECT,
                properties: {
                  tipe: { type: SchemaType.STRING, format: "enum", enum: ["expense", "revenue"] },
                  desc: { type: SchemaType.STRING },
                  amount: { type: SchemaType.NUMBER }
                },
                required: ["tipe", "desc", "amount"]
              }
            }
          },
          required: ["mode"],
        }
      }
    });

    const prompt = `
Analisis gambar struk transaksi.

Logika identifikasi:
1. Lakukan OCR pada gambar dan baca seluruh teks.
2. Tentukan apakah struk memiliki daftar item (contoh: beberapa baris produk + harga).
3. Jika struk memiliki daftar item:
   - mode = "list"
   - hasil ditempatkan dalam array "items"
   - setiap item memiliki:
        tipe = expense atau revenue
        desc = nama atau deskripsi item
        amount = angka final item

4. Jika struk hanya menampilkan satu nilai total tanpa daftar item:
   - mode = "total"
   - tempatkan hasil dalam objek "total"
   - isi field:
        tipe = expense atau revenue
        amount = angka total
        desc = optional
        Jika tidak ada nama toko atau deskripsi yang jelas, isi desc dengan string kosong ""

Aturan format angka:
- Hanya angka numerik.
- Hilangkan simbol mata uang.
- Hilangkan titik/koma pemisah ribuan.
- Jika ada decimal, gunakan titik.

Output harus JSON valid sesuai schema.
Jangan tambahkan penjelasan lain.`

    const result = await model.generateContent([
      { text: prompt },
      {
        inlineData: {
          data,
          mimeType
        }
      }
    ]);

    return JSON.parse(result.response.text().trim());

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to process image with Gemini");
  }
}

export async function analyzeVoiceText(text: string, category: TransactionType): Promise<any> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined in environment variables.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-pro",
      generationConfig: {
        temperature: 0,
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            // Status validasi: apakah kalimat sesuai dengan kategori
            status: {
              type: SchemaType.STRING,
              format: "enum",
              enum: ["success", "mismatch"]
            },

            // Mode data (hanya diisi jika status = success)
            mode: {
              type: SchemaType.STRING,
              format: "enum",
              enum: ["total", "list"],
              nullable: true
            },

            // Struktur Object Total (Sesuai analyzeImage)
            total: {
              type: SchemaType.OBJECT,
              nullable: true,
              properties: {
                tipe: { type: SchemaType.STRING, format: "enum", enum: ["expense", "revenue"] },
                desc: { type: SchemaType.STRING },
                amount: { type: SchemaType.NUMBER }
              },
              required: ["tipe", "amount"]
            },

            // Struktur Array Items (Sesuai analyzeImage)
            items: {
              type: SchemaType.ARRAY,
              nullable: true,
              items: {
                type: SchemaType.OBJECT,
                properties: {
                  tipe: { type: SchemaType.STRING, format: "enum", enum: ["expense", "revenue"] },
                  desc: { type: SchemaType.STRING },
                  amount: { type: SchemaType.NUMBER }
                },
                required: ["tipe", "desc", "amount"]
              }
            }
          },
          required: ["status"], // Message dihapus dari required
        }
      }
    });

    // --- PROMPT DINAMIS ---
    let validationInstruction = "";

    // Tentukan target tipe untuk konsistensi data
    const targetType = category === "revenue" ? "revenue" : "expense";

    if (category === "revenue") {
      validationInstruction = `
      KONTEKS WAJIB: PEMASUKAN (REVENUE).
      1. Validasi:
         - Jika teks tentang MENGELUARKAN uang (beli, bayar, tagihan, jajan) -> set status="mismatch".
         - Jika teks tentang MENDAPATKAN uang (jual, laku, terima, gaji) -> set status="success".
      `;
    } else {
      validationInstruction = `
      KONTEKS WAJIB: PENGELUARAN (EXPENSE).
      1. Validasi:
         - Jika teks tentang MENDAPATKAN uang (jual, laku, untung, terima) -> set status="mismatch".
         - Jika teks tentang MENGELUARKAN uang (beli, bayar, belanja, ongkos) -> set status="success".
      `;
    }

    const finalPrompt = `
    Analisis transkripsi suara keuangan berikut.
    Input Teks: "${text}"

    ${validationInstruction}

    INSTRUKSI EKSTRAKSI DATA (Jalankan HANYA jika status="success"):
    
    1. Tentukan Mode:
       - "list": Jika menyebutkan rincian beberapa item berbeda. Masukkan ke array 'items'.
       - "total": Jika hanya menyebutkan satu item atau total akumulasi. Masukkan ke object 'total'.
    
    2. Isi Field Data:
       - tipe: WAJIB diisi dengan "${targetType}".
       - desc: Nama barang atau aktivitas.
       - amount: Nominal angka (konversi teks bilangan ke integer, cth: "lima puluh ribu" -> 50000).

    CATATAN: 
    - Jika status="mismatch", biarkan field mode, total, dan items bernilai null.
    `;

    const result = await model.generateContent(finalPrompt);
    const responseText = result.response.text();
    console.log("Gemini Raw Response:", responseText);
    return JSON.parse(responseText);

  } catch (error) {
    console.error("Gemini API Error (Voice Analysis):", error);
    throw new Error("Failed to process voice text with Gemini");
  }
}


/**
 * Helper to normalize a base64 image string.
 * Supports both pure base64 and data URLs (data:image/...;base64,...).
 */
function parseBase64Image(base64Image: string): { data: string; mimeType: string } {
  const dataUrlMatch = base64Image.match(/^data:(.+);base64,(.*)$/);

  if (dataUrlMatch) {
    const [, mimeType, data] = dataUrlMatch;
    return { data, mimeType };
  }

  // Fallback assumption if only raw base64 is provided
  return { data: base64Image, mimeType: "image/jpeg" };
}
