"use client";

import { useState } from "react";
import InputMethodTabs from "./InputMethodTabs";
import ManualSection from "./ManualSection";
import PhotoSection from "./PhotoSection";
import VoiceSection from "./VoiceSection";

interface Transaction {
    id: string;
    type: string;
    category: string;
    amount: number;
    description: string;
}

export default function CashflowInputSection() {
    const [revenue, setRevenue] = useState<string>("450000");
    const [expense, setExpense] = useState<string>("280000");
    const [inputType, setInputType] = useState<string>("total");
    const [inputMethod, setInputMethod] = useState<string>("manual");
    const [photoUploaded, setPhotoUploaded] = useState<boolean>(false);
    const [voiceInputted, setVoiceInputted] = useState<boolean>(false);
    const [transactions, setTransactions] = useState<Transaction[]>([
        {
            id: "1",
            type: "Pemasukan (Credit)",
            category: "Penjualan Jasa",
            amount: 300000,
            description: "Jahit 2 baju",
        },
        {
            id: "2",
            type: "Pemasukan (Credit)",
            category: "Penjualan Jasa",
            amount: 150000,
            description: "Perbaikan 3 celana",
        },
    ]);

    const netIncome = Number(revenue) - Number(expense);

    function handleSave() {
        console.log("Save cashflow", { revenue, expense, inputType, transactions });
        alert("Cashflow disimpan (demo): Rp " + revenue + " / Rp " + expense);
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
                category: "Penjualan Jasa",
                amount: 0,
                description: "",
            },
        ]);
    }

    const totalIncome = transactions.reduce((sum, t) => {
        if (t.type === "Pemasukan (Credit)") return sum + t.amount;
        return sum;
    }, 0);

    const totalExpense = transactions.reduce((sum, t) => {
        if (t.type === "Pengeluaran (Debit)") return sum + t.amount;
        return sum;
    }, 0);

    const perTransactionIncome = Math.max(totalIncome, Number(revenue));
    const perTransactionNetIncome = perTransactionIncome - totalExpense;

    return (
        <div className="bg-white rounded-2xl shadow-lg p-5">
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
                    perTransactionIncome={perTransactionIncome}
                    totalExpense={totalExpense}
                    perTransactionNetIncome={perTransactionNetIncome}
                />
            ) : inputMethod === "foto" ? (
                <PhotoSection photoUploaded={photoUploaded} setPhotoUploaded={setPhotoUploaded} />
            ) : (
                <VoiceSection voiceInputted={voiceInputted} setVoiceInputted={setVoiceInputted} />
            )}

            <button onClick={handleSave} className="w-full bg-[#8E44AD] text-white py-3 rounded-2xl font-medium">
                Simpan Cashflow
            </button>
        </div>
    );
}
