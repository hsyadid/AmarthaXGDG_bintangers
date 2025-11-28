"use client";

import { useState } from "react";
import InputMethodTabs from "./InputMethodTabs";
import ManualSection from "./ManualSection";
import PhotoSection from "./PhotoSection";
import VoiceSection from "./VoiceSection";
import ValidationModal from "./ValidationModal";

interface Transaction {
    id: string;
    type: string;
    amount: number;
    description: string;
}

export default function CashflowInputSection() {
    const [revenue, setRevenue] = useState<string>("0");
    const [expense, setExpense] = useState<string>("0");
    const [inputType, setInputType] = useState<string>("total");
    const [inputMethod, setInputMethod] = useState<string>("manual");
    const [photoUploaded, setPhotoUploaded] = useState<boolean>(false);
    const [voiceInputted, setVoiceInputted] = useState<boolean>(false);
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pendingData, setPendingData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    const netIncome = Number(revenue) - Number(expense);

    async function handleSave() {
        setIsLoading(true);
        try {
            let payload: any = {};

            if (inputMethod === "manual" && inputType === "total") {
                // Manual Total Mode - We need to send two requests if both exist, or handle in backend
                // For simplicity, let's just send one if only one exists, or handle logic here.
                // Actually, the backend supports "total" mode which takes one total object.
                // We might need to send two requests here or update backend to accept array of totals.
                // Let's just use the list mode for manual transactions if we have them, 
                // but for manual total, we might need to call API twice or adjust.

                // Strategy: Call API for Revenue if > 0, then Expense if > 0
                if (Number(revenue) > 0) {
                    await fetch("/api/cashflow", {
                        method: "POST",
                        body: JSON.stringify({
                            mode: "total",
                            total: { tipe: "revenue", amount: Number(revenue), desc: "Manual Total Revenue" }
                        })
                    });
                }
                if (Number(expense) > 0) {
                    await fetch("/api/cashflow", {
                        method: "POST",
                        body: JSON.stringify({
                            mode: "total",
                            total: { tipe: "expense", amount: Number(expense), desc: "Manual Total Expense" }
                        })
                    });
                }
            } else {
                // List Mode (Manual Transaction List OR AI Result List)
                // Convert UI transactions to API format
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
            // Reset state
            setRevenue("0");
            setExpense("0");
            setTransactions([]);
            setPhotoUploaded(false);
            setVoiceInputted(false);
        } catch (error) {
            console.error("Error saving cashflow:", error);
            alert("Gagal menyimpan cashflow.");
        } finally {
            setIsLoading(false);
        }
    }

    function handleDeleteTransaction(id: string) {
        setTransactions(transactions.filter((t) => t.id !== id));
    }

    function handleAddTransaction() {
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
                    setPhotoUploaded(true); // Show success state in UI
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

    async function handleAnalyzeVoice(blob: Blob) {
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append("file", blob, "recording.wav");
            // Defaulting to 'revenue' for now, ideally UI allows selection before recording or AI infers
            // But the API requires category. Let's assume 'revenue' or add UI for it.
            // For this demo, let's default to 'revenue' but maybe we can make it dynamic?
            // The VoiceSection UI has separate buttons for Income/Expense! 
            // We need to pass that info up.
            // For now let's assume 'revenue' and fix in VoiceSection integration.
            formData.append("category", "revenue");

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

    // Special handler for voice that takes category
    async function handleAnalyzeVoiceWithCategory(blob: Blob, category: "revenue" | "expense") {
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
        // Merge validated data into transactions list
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

        // Switch to manual per-transaction view to show results
        setInputMethod("manual");
        setInputType("perTransaksi");
    }

    function handleUpdateTransaction(id: string, field: keyof Transaction, value: any) {
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

    return (
        <div className="bg-white rounded-2xl shadow-lg p-5 relative">
            {isLoading && (
                <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center rounded-2xl">
                    <div className="text-[#8E44AD] font-medium animate-pulse">Memproses...</div>
                </div>
            )}

            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-[#8E44AD]">Jumat, 21 November</h3>
                    <p className="text-sm text-gray-500">Edit cashflow Anda</p>
                </div>
                <button className="text-slate-700 text-sm">Cancel</button>
            </div>

            <InputMethodTabs inputMethod={inputMethod} setInputMethod={setInputMethod} />

            {inputMethod === "manual" ? (
                <ManualSection
                    inputType={inputType}
                    setInputType={setInputType}
                    revenue={revenue}
                    setRevenue={setRevenue}
                    expense={expense}
                    setExpense={setExpense}
                    netIncome={netIncome}
                    transactions={transactions}
                    handleAddTransaction={handleAddTransaction}
                    handleDeleteTransaction={handleDeleteTransaction}
                    handleUpdateTransaction={handleUpdateTransaction}
                    perTransactionIncome={perTransactionIncome}
                    totalExpense={totalExpenseCalc}
                    perTransactionNetIncome={perTransactionNetIncome}
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

            <button onClick={handleSave} className="w-full bg-[#8E44AD] text-white py-3 rounded-2xl font-medium mt-4">
                Simpan Cashflow
            </button>

            <ValidationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmValidation}
                data={pendingData}
            />
        </div>
    );
}
