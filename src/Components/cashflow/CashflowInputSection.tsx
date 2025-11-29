"use client";

import { useState, useEffect } from "react";
import InputMethodTabs from "./InputMethodTabs";
import ManualSection from "./ManualSection";
import PhotoSection from "./PhotoSection";
import VoiceSection from "./VoiceSection";
import ValidationModal from "./ValidationModal";
import { getCashFlows, getCashFlowTotal } from "@/actions/cashflow";
import { predictRiskScore } from "@/actions/data-processing";

interface Transaction {
    id: string;
    type: string;
    amount: number;
    description: string;
}

interface CashflowInputSectionProps {
    date?: Date;
    readOnly?: boolean;
}

export default function CashflowInputSection({ date = new Date(), readOnly = false }: CashflowInputSectionProps) {
    const [revenue, setRevenue] = useState<number>(0);
    const [expense, setExpense] = useState<number>(0);
    const [inputType, setInputType] = useState<string>("total");
    const [inputMethod, setInputMethod] = useState<string>("manual");
    const [photoUploaded, setPhotoUploaded] = useState<boolean>(false);
    const [voiceInputted, setVoiceInputted] = useState<boolean>(false);
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pendingData, setPendingData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    const netIncome = revenue - expense;

    // Fetch data when date changes
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            // Reset input method to manual to ensure we don't get stuck in hidden views
            setInputMethod("manual");

            try {
                // Calculate start and end of the selected date
                const startOfDay = new Date(date);
                startOfDay.setHours(0, 0, 0, 0);

                const endOfDay = new Date(date);
                endOfDay.setHours(23, 59, 59, 999);

                // Fetch totals
                const totalRes = await getCashFlowTotal({
                    startDate: startOfDay,
                    endDate: endOfDay,
                    customer_number: process.env.CUSTOMER_NUMBER
                });

                if (totalRes.success && totalRes.data) {
                    let rev = 0;
                    let exp = 0;
                    totalRes.data.forEach((item: any) => {
                        const amount = parseFloat(item.amount.toString());
                        if (item.type === "REVENUE") rev += amount;
                        if (item.type === "EXPENSE") exp += amount;
                    });
                    setRevenue(rev);
                    setExpense(exp);
                } else {
                    setRevenue(0);
                    setExpense(0);
                }

                // Fetch transactions list
                const listRes = await getCashFlows({
                    startDate: startOfDay,
                    endDate: endOfDay,
                    customer_number: process.env.CUSTOMER_NUMBER
                });

                if (listRes.success && listRes.data) {
                    const mapped = listRes.data.map((item: any) => ({
                        id: item.id,
                        type: item.type === "REVENUE" ? "Pemasukan (Credit)" : "Pengeluaran (Debit)",
                        amount: parseFloat(item.amount.toString()),
                        description: item.description
                    }));
                    setTransactions(mapped);

                    // If we have transactions, default to perTransaction view
                    if (mapped.length > 0) {
                        setInputType("perTransaksi");
                    } else {
                        setInputType("total");
                    }
                } else {
                    setTransactions([]);
                }

            } catch (err) {
                console.error("Error fetching daily data:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [date]);

    async function handleSave() {
        if (readOnly) return;
        setIsLoading(true);
        try {
            // ... (Existing save logic - needs update to include date)
            // Ideally we should pass the date to the API or actions.
            // The current API implementation uses new Date(). We might need to update API to accept date.
            // For now, let's assume we are only saving for TODAY as per requirements (readOnly for past).
            // But wait, the requirement says "jika hari ini maka warna ungu", implying we can only edit today?
            // "pengguna masihi bisa melihat bagian ringkasa ... tapi sudah tidak bsia menginput atau mengahapus data lagi"
            // So yes, editing is only for today. So new Date() in API is fine for now.

            let payload: any = {};

            if (inputMethod === "manual" && inputType === "total") {
                if (revenue > 0) {
                    await fetch("/api/cashflow", {
                        method: "POST",
                        body: JSON.stringify({
                            mode: "total",
                            total: { tipe: "revenue", amount: revenue, desc: "Manual Total Revenue" }
                        })
                    });
                }
                if (expense > 0) {
                    await fetch("/api/cashflow", {
                        method: "POST",
                        body: JSON.stringify({
                            mode: "total",
                            total: { tipe: "expense", amount: expense, desc: "Manual Total Expense" }
                        })
                    });
                }
            } else {
                const items = transactions.map(t => ({
                    tipe: t.type.toLowerCase().includes("pemasukan") ? "revenue" : "expense",
                    desc: t.description,
                    amount: t.amount
                }));

                if (items.length > 0) {
                    await fetch("/api/cashflow", {
                        method: "POST",
                        body: JSON.stringify({
                            mode: "list",
                            items: items
                        })
                    });
                }
            }

            alert("Cashflow berhasil disimpan!");
            // Refresh data? Or just let state update?
            // Ideally re-fetch or update local state.
            // For simplicity, let's trigger a re-fetch via window reload or callback?
            // Since we are using server actions and revalidatePath, a router refresh might be better.
            window.location.reload();

        } catch (error) {
            console.error("Error saving cashflow:", error);
            alert("Gagal menyimpan cashflow.");
        } finally {
            setIsLoading(false);
        }
    }

    async function handleCloseBook() {
        if (readOnly) return;
        setIsLoading(true);
        try {
            await handleSave();

            const customerNumber = process.env.CUSTOMER_NUMBER || "1234567890";

            const result = await predictRiskScore(customerNumber);

            if (result.success) {
                alert(`Prediction Success! Risk Score: ${JSON.stringify(result.data)}`);
            } else {
                alert(`Prediction Failed: ${result.error}`);
            }

            
        } catch (error) {
            console.error("Error closing book:", error);
            alert("Terjadi kesalahan saat tutup buku.");
        } finally {
            setIsLoading(false);
        }
    }

    function handleDeleteTransaction(id: string) {
        if (readOnly) return;
        setTransactions(transactions.filter((t) => t.id !== id));
    }

    function handleAddTransaction() {
        if (readOnly) return;
        const newId = String(transactions.length + 1);
        setTransactions([
            ...transactions,
            {
                id: newId,
                type: "Pemasukan (Credit)",
                amount: 0,
                description: "",
            },
        ]);
    }

    // --- AI Analysis Handlers ---

    async function handleAnalyzeImage(file: File) {
        if (readOnly) return;
        setIsLoading(true);
        try {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = async () => {
                const base64Image = reader.result as string;
                const response = await fetch("/api/analyze-image", {
                    method: "POST",
                    body: JSON.stringify({ base64Image }),
                });
                const data = await response.json();

                if (data.result) {
                    setPendingData(data.result);
                    setIsModalOpen(true);
                    setPhotoUploaded(true);
                } else {
                    alert("Gagal menganalisis gambar.");
                }
                setIsLoading(false);
            };
        } catch (error) {
            console.error("Error analyzing image:", error);
            setIsLoading(false);
            alert("Terjadi kesalahan saat memproses gambar.");
        }
    }

    async function handleAnalyzeVoiceWithCategory(blob: Blob, category: "revenue" | "expense") {
        if (readOnly) return;
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append("file", blob, "recording.wav");
            formData.append("category", category);

            const response = await fetch("/api/analyze-voice", {
                method: "POST",
                body: formData,
            });
            const data = await response.json();

            if (data.analysis) {
                setPendingData(data.analysis);
                setIsModalOpen(true);
                setVoiceInputted(true);
            } else {
                alert("Gagal menganalisis suara.");
            }
        } catch (error) {
            console.error("Error analyzing voice:", error);
            alert("Terjadi kesalahan saat memproses suara.");
        } finally {
            setIsLoading(false);
        }
    }


    function handleConfirmValidation(data: any) {
        const newTransactions: Transaction[] = [];

        if (data.mode === "list" && data.items) {
            data.items.forEach((item: any, idx: number) => {
                newTransactions.push({
                    id: `ai-${Date.now()}-${idx}`,
                    type: item.tipe === "revenue" ? "Pemasukan (Credit)" : "Pengeluaran (Debit)",
                    amount: item.amount,
                    description: item.desc
                });
            });
        } else if (data.mode === "total" && data.total) {
            newTransactions.push({
                id: `ai-${Date.now()}`,
                type: data.total.tipe === "revenue" ? "Pemasukan (Credit)" : "Pengeluaran (Debit)",
                amount: data.total.amount,
                description: data.total.desc || "Total dari AI"
            });
        }

        setTransactions([...transactions, ...newTransactions]);
        setInputMethod("manual");
        setInputType("perTransaksi");
    }

    function handleUpdateTransaction(id: string, field: keyof Transaction, value: any) {
        if (readOnly) return;
        setTransactions(transactions.map(t =>
            t.id === id ? { ...t, [field]: value } : t
        ));
    }

    const totalIncome = transactions.reduce((sum, t) => {
        if (t.type === "Pemasukan (Credit)") return sum + t.amount;
        return sum;
    }, 0);

    const totalExpenseCalc = transactions.reduce((sum, t) => {
        if (t.type === "Pengeluaran (Debit)") return sum + t.amount;
        return sum;
    }, 0);

    const perTransactionIncome = Math.max(totalIncome, Number(revenue));
    const perTransactionNetIncome = perTransactionIncome - totalExpenseCalc;

    const formattedDate = date.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' });

    return (
        <div className="bg-white rounded-2xl shadow-lg p-5 relative">
            {isLoading && (
                <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center rounded-2xl">
                    <div className="text-[#8E44AD] font-medium animate-pulse">Memuat Data...</div>
                </div>
            )}

            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-[#8E44AD]">{formattedDate}</h3>
                    <p className="text-sm text-gray-500">{readOnly ? "Ringkasan Transaksi" : "Edit cashflow Anda"}</p>
                </div>
                {!readOnly && <button className="text-slate-700 text-sm">Cancel</button>}
            </div>

            {!readOnly && (
                <InputMethodTabs inputMethod={inputMethod} setInputMethod={setInputMethod} />
            )}

            {inputMethod === "manual" ? (
                <ManualSection
                    inputType={inputType}
                    setInputType={readOnly ? () => { } : setInputType}
                    revenue={revenue}
                    setRevenue={readOnly ? () => { } : setRevenue}
                    expense={expense}
                    setExpense={readOnly ? () => { } : setExpense}
                    netIncome={netIncome}
                    transactions={transactions}
                    handleAddTransaction={handleAddTransaction}
                    handleDeleteTransaction={handleDeleteTransaction}
                    handleUpdateTransaction={handleUpdateTransaction}
                    perTransactionIncome={perTransactionIncome}
                    totalExpense={totalExpenseCalc}
                    perTransactionNetIncome={perTransactionNetIncome}
                    readOnly={readOnly}
                />
            ) : inputMethod === "foto" ? (
                <PhotoSection
                    photoUploaded={photoUploaded}
                    setPhotoUploaded={setPhotoUploaded}
                    onAnalyze={handleAnalyzeImage}
                />
            ) : (
                <VoiceSection
                    voiceInputted={voiceInputted}
                    setVoiceInputted={setVoiceInputted}
                    onAnalyze={handleAnalyzeVoiceWithCategory}
                />
            )}

            {!readOnly && (
                <button onClick={handleSave} className="w-full bg-[#8E44AD] text-white py-3 rounded-2xl font-medium mt-4">
                    Simpan Cashflow
                </button>
            )}

            {!readOnly && (
                <button onClick={handleCloseBook} className="w-full bg-[#8E44AD] text-white py-3 rounded-2xl font-medium mt-4">
                    Close Book
                </button>
            )}

            <ValidationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmValidation}
                data={pendingData}
            />
        </div>
    );
}
