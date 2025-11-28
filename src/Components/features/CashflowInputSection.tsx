"use client";

import { useState } from "react";

interface Transaction {
    id: string;
    type: string;
    category: string;
    amount: number;
    description: string;
}

// Icon components
const IconPlus = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>;
const IconDelete = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const IconEdit = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>;
const IconUpload = () => <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>;
const IconMicrophone = () => <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 15a3 3 0 100-6 3 3 0 000 6z" /><path fillRule="evenodd" d="M12 2a1 1 0 01.993.883l.007.117v2.5a1 1 0 01-2 0V2.883A1 1 0 0112 2zm0 16a1 1 0 01.993.883l.007.117v2.5a1 1 0 01-2 0v-2.5a1 1 0 01.993-.883z" clipRule="evenodd" /><path fillRule="evenodd" d="M3.172 3.172a1 1 0 011.414 0l1.768 1.768a1 1 0 01-1.414 1.414L3.172 4.586a1 1 0 010-1.414z" clipRule="evenodd" /><path fillRule="evenodd" d="M16.56 16.56a1 1 0 011.414 0l1.768 1.768a1 1 0 11-1.414 1.414l-1.768-1.768a1 1 0 010-1.414z" clipRule="evenodd" /><path fillRule="evenodd" d="M3.172 16.56a1 1 0 011.414-1.414l1.768 1.768a1 1 0 01-1.414 1.414L3.172 16.56z" clipRule="evenodd" /><path fillRule="evenodd" d="M16.56 3.172a1 1 0 011.414 1.414l-1.768 1.768a1 1 0 11-1.414-1.414l1.768-1.768z" clipRule="evenodd" /></svg>;
const IconImage = () => <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;

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

            <div className="mb-5">
                <label className="text-sm font-medium text-slate-700 block mb-3">Pilih Metode Input</label>
                <div className="flex gap-3">
                    <button
                        onClick={() => setInputMethod("manual")}
                        className={`flex-1 py-3 rounded-2xl border-2 transition flex flex-col items-center gap-1 ${inputMethod === "manual"
                                ? 'bg-[#8E44AD]/10 border-[#8E44AD] text-[#8E44AD]'
                                : 'border-gray-300 text-gray-600'
                            }`}
                    >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" /></svg>
                        <span className="text-xs font-medium">Manual</span>
                    </button>
                    <button
                        onClick={() => setInputMethod("foto")}
                        className={`flex-1 py-3 rounded-2xl border-2 transition flex flex-col items-center gap-1 ${inputMethod === "foto"
                                ? 'bg-[#8E44AD]/10 border-[#8E44AD] text-[#8E44AD]'
                                : 'border-gray-300 text-gray-600'
                            }`}
                    >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" /></svg>
                        <span className="text-xs font-medium">Foto</span>
                    </button>
                    <button
                        onClick={() => setInputMethod("suara")}
                        className={`flex-1 py-3 rounded-2xl border-2 transition flex flex-col items-center gap-1 ${inputMethod === "suara"
                                ? 'bg-[#8E44AD]/10 border-[#8E44AD] text-[#8E44AD]'
                                : 'border-gray-300 text-gray-600'
                            }`}
                    >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z" /></svg>
                        <span className="text-xs font-medium">Suara</span>
                    </button>
                </div>
            </div>

            {inputMethod === "manual" ? (
                <>
                    <div className="mb-5">
                        <label className="text-sm font-medium text-slate-700 block mb-3">Tipe Input Manual</label>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setInputType("total")}
                                className={`flex-1 py-3 rounded-2xl border-2 transition flex flex-col items-center gap-1 ${inputType === "total"
                                        ? 'bg-[#8E44AD]/10 border-[#8E44AD] text-[#8E44AD]'
                                        : 'border-gray-300 text-gray-600'
                                    }`}
                            >
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" /></svg>
                                <span className="text-xs font-medium">Total Hari Ini</span>
                            </button>
                            <button
                                onClick={() => setInputType("perTransaksi")}
                                className={`flex-1 py-3 rounded-2xl border-2 transition flex flex-col items-center gap-1 ${inputType === "perTransaksi"
                                        ? 'bg-[#8E44AD]/10 border-[#8E44AD] text-[#8E44AD]'
                                        : 'border-gray-300 text-gray-600'
                                    }`}
                            >
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5-7l-3 3.72L9 13l-3 4h12L14 10z" /></svg>
                                <span className="text-xs font-medium">Per Transaksi</span>
                            </button>
                        </div>
                    </div>

                    {inputType === "total" ? (
                        <>
                            <div className="space-y-3 mb-4">
                                <div>
                                    <label className="text-sm text-slate-700 font-medium block mb-2">Total Revenue (Rp)</label>
                                    <input
                                        type="text"
                                        value={revenue}
                                        onChange={(e) => setRevenue(e.target.value.replace(/[^0-9]/g, ''))}
                                        className="w-full p-3 rounded-md bg-gray-100 border border-gray-300 text-slate-700"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm text-slate-700 font-medium block mb-2">Total Expense (Rp)</label>
                                    <input
                                        type="text"
                                        value={expense}
                                        onChange={(e) => setExpense(e.target.value.replace(/[^0-9]/g, ''))}
                                        className="w-full p-3 rounded-md bg-gray-100 border border-gray-300 text-slate-700"
                                    />
                                </div>
                            </div>

                            <div className="bg-cyan-50 rounded-lg p-3 mb-4">
                                <div className="text-sm text-gray-600">Ringkasan Harian</div>
                                <div className="text-base text-cyan-600 font-medium mt-1">Net Income: Rp {netIncome.toLocaleString('id-ID')}</div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-sm font-medium text-slate-700">Detail Transaksi</h4>
                                <button
                                    onClick={handleAddTransaction}
                                    className="px-3 py-1 rounded-md bg-gray-100 text-slate-700 text-sm flex items-center gap-1 hover:bg-gray-200"
                                >
                                    <IconPlus />
                                    Tambah Transaksi
                                </button>
                            </div>

                            <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
                                {transactions.map((tx) => (
                                    <div key={tx.id} className="border border-gray-300 rounded-2xl p-4">
                                        <div className="space-y-2 mb-3">
                                            <div>
                                                <label className="text-xs text-gray-600 font-medium block mb-1">Tipe</label>
                                                <select className="w-full p-2 rounded-md bg-gray-100 border border-gray-300 text-sm text-slate-700">
                                                    <option>Pemasukan (Credit)</option>
                                                    <option>Pengeluaran (Debit)</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="text-xs text-gray-600 font-medium block mb-1">Kategori</label>
                                                <select className="w-full p-2 rounded-md bg-gray-100 border border-gray-300 text-sm text-slate-700">
                                                    <option>Penjualan Jasa</option>
                                                    <option>Penjualan Produk</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="text-xs text-gray-600 font-medium block mb-1">Jumlah (Rp)</label>
                                                <input
                                                    type="text"
                                                    value={tx.amount}
                                                    className="w-full p-2 rounded-md bg-gray-100 border border-gray-300 text-sm text-slate-700"
                                                />
                                            </div>

                                            <div>
                                                <label className="text-xs text-gray-600 font-medium block mb-1">Keterangan</label>
                                                <input
                                                    type="text"
                                                    value={tx.description}
                                                    className="w-full p-2 rounded-md bg-gray-100 border border-gray-300 text-sm text-slate-700"
                                                />
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleDeleteTransaction(tx.id)}
                                            className="text-red-500 text-sm font-medium flex items-center gap-1"
                                        >
                                            <IconDelete />
                                            Hapus
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-cyan-50 rounded-lg p-3 mb-4">
                                <div className="text-sm text-gray-600 mb-2">Ringkasan dari {transactions.length} transaksi</div>
                                <div className="flex justify-between mb-2">
                                    <div className="text-xs text-gray-500">Total Pemasukan</div>
                                    <div className="text-sm text-green-600 font-medium">Rp {perTransactionIncome.toLocaleString('id-ID')}</div>
                                </div>
                                <div className="flex justify-between">
                                    <div className="text-xs text-gray-500">Total Pengeluaran</div>
                                    <div className="text-sm text-red-600 font-medium">Rp {totalExpense.toLocaleString('id-ID')}</div>
                                </div>
                            </div>

                            <div className="bg-cyan-50 rounded-lg p-3 mb-4">
                                <div className="text-sm text-gray-600 mb-2">Ringkasan Harian</div>
                                <div className="flex justify-between">
                                    <div className="text-sm text-slate-700">Net Income:</div>
                                    <div className="text-sm text-cyan-600 font-medium">Rp {perTransactionNetIncome.toLocaleString('id-ID')}</div>
                                </div>
                            </div>
                        </>
                    )}
                </>
            ) : inputMethod === "foto" ? (
                <>
                    <div className="mb-5">
                        <label className="text-sm font-medium text-slate-700 block mb-3">Upload Foto</label>
                        {!photoUploaded ? (
                            <div
                                onClick={() => setPhotoUploaded(true)}
                                className="border-2 border-[#8E44AD] rounded-2xl p-8 cursor-pointer hover:bg-[#8E44AD]/5 transition flex flex-col items-center justify-center gap-4"
                            >
                                <IconUpload />
                                <div className="text-center">
                                    <div className="text-[#8E44AD] font-medium mb-1">Upload foto catatan bisnis Anda</div>
                                    <div className="text-gray-500 text-sm">Ambil foto yang jelas dengan pencahayaan yang cukup</div>
                                </div>
                            </div>
                        ) : (
                            <div className="border-2 border-[#8E44AD] rounded-2xl p-6 space-y-4">
                                <div className="flex justify-center">
                                    <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center border-2 border-gray-400">
                                        <div className="text-center text-gray-500">
                                            <div className="mb-2" style={{ color: '#999' }}>
                                                <IconImage />
                                            </div>
                                            <div className="text-sm">Foto berhasil diproses!</div>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setPhotoUploaded(false)}
                                    className="w-full bg-gray-200 text-slate-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-300"
                                >
                                    Tambah Foto
                                </button>
                            </div>
                        )}
                    </div>

                    {photoUploaded && (
                        <>
                            <div className="mb-5">
                                <label className="text-sm font-medium text-slate-700 block mb-3">Detail Transaksi Terdeteksi</label>
                                <div className="bg-white rounded-2xl overflow-hidden border border-gray-300">
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="bg-gray-50 border-b border-gray-300">
                                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 w-24">Tipe</th>
                                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 w-32">Kategori</th>
                                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 w-28">Jumlah</th>
                                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 flex-1">Keterangan</th>
                                                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 w-16">Aksi</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-300">
                                                <tr className="hover:bg-gray-50">
                                                    <td className="px-4 py-4">
                                                        <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">Pemasukan</span>
                                                    </td>
                                                    <td className="px-4 py-4 text-sm text-gray-600">Penjualan Jasa</td>
                                                    <td className="px-4 py-4 text-sm text-slate-700 font-medium">Rp 250.000</td>
                                                    <td className="px-4 py-4 text-sm text-gray-600">Jahit baju - Ibu Ani</td>
                                                    <td className="px-4 py-4 text-center flex gap-2 justify-center">
                                                        <button className="text-cyan-600 hover:text-cyan-700"><IconEdit /></button>
                                                        <button className="text-red-600 hover:text-red-700"><IconDelete /></button>
                                                    </td>
                                                </tr>
                                                <tr className="hover:bg-gray-50">
                                                    <td className="px-4 py-4">
                                                        <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">Pemasukan</span>
                                                    </td>
                                                    <td className="px-4 py-4 text-sm text-gray-600">Penjualan Jasa</td>
                                                    <td className="px-4 py-4 text-sm text-slate-700 font-medium">Rp 150.000</td>
                                                    <td className="px-4 py-4 text-sm text-gray-600">Perbaikan celana - Pak Budi</td>
                                                    <td className="px-4 py-4 text-center flex gap-2 justify-center">
                                                        <button className="text-cyan-600 hover:text-cyan-700"><IconEdit /></button>
                                                        <button className="text-red-600 hover:text-red-700"><IconDelete /></button>
                                                    </td>
                                                </tr>
                                                <tr className="hover:bg-gray-50">
                                                    <td className="px-4 py-4">
                                                        <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">Pemasukan</span>
                                                    </td>
                                                    <td className="px-4 py-4 text-sm text-gray-600">Penjualan Jasa</td>
                                                    <td className="px-4 py-4 text-sm text-slate-700 font-medium">Rp 200.000</td>
                                                    <td className="px-4 py-4 text-sm text-gray-600">Jahit kebaya - Ibu Siti</td>
                                                    <td className="px-4 py-4 text-center flex gap-2 justify-center">
                                                        <button className="text-cyan-600 hover:text-cyan-700"><IconEdit /></button>
                                                        <button className="text-red-600 hover:text-red-700"><IconDelete /></button>
                                                    </td>
                                                </tr>
                                                <tr className="hover:bg-gray-50">
                                                    <td className="px-4 py-4">
                                                        <span className="inline-block bg-red-100 text-red-700 text-xs font-semibold px-2.5 py-1 rounded-full">Pengeluaran</span>
                                                    </td>
                                                    <td className="px-4 py-4 text-sm text-gray-600">Bahan Baku</td>
                                                    <td className="px-4 py-4 text-sm text-slate-700 font-medium">Rp 180.000</td>
                                                    <td className="px-4 py-4 text-sm text-gray-600">Kain katun dan benang</td>
                                                    <td className="px-4 py-4 text-center flex gap-2 justify-center">
                                                        <button className="text-cyan-600 hover:text-cyan-700"><IconEdit /></button>
                                                        <button className="text-red-600 hover:text-red-700"><IconDelete /></button>
                                                    </td>
                                                </tr>
                                                <tr className="hover:bg-gray-50">
                                                    <td className="px-4 py-4">
                                                        <span className="inline-block bg-red-100 text-red-700 text-xs font-semibold px-2.5 py-1 rounded-full">Pengeluaran</span>
                                                    </td>
                                                    <td className="px-4 py-4 text-sm text-gray-600">Operasional</td>
                                                    <td className="px-4 py-4 text-sm text-slate-700 font-medium">Rp 50.000</td>
                                                    <td className="px-4 py-4 text-sm text-gray-600">Listrik dan air</td>
                                                    <td className="px-4 py-4 text-center flex gap-2 justify-center">
                                                        <button className="text-cyan-600 hover:text-cyan-700"><IconEdit /></button>
                                                        <button className="text-red-600 hover:text-red-700"><IconDelete /></button>
                                                    </td>
                                                </tr>
                                                <tr className="hover:bg-gray-50">
                                                    <td className="px-4 py-4">
                                                        <span className="inline-block bg-red-100 text-red-700 text-xs font-semibold px-2.5 py-1 rounded-full">Pengeluaran</span>
                                                    </td>
                                                    <td className="px-4 py-4 text-sm text-gray-600">Transportasi</td>
                                                    <td className="px-4 py-4 text-sm text-slate-700 font-medium">Rp 30.000</td>
                                                    <td className="px-4 py-4 text-sm text-gray-600">Ongkos beli bahan</td>
                                                    <td className="px-4 py-4 text-center flex gap-2 justify-center">
                                                        <button className="text-cyan-600 hover:text-cyan-700"><IconEdit /></button>
                                                        <button className="text-red-600 hover:text-red-700"><IconDelete /></button>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-cyan-50 rounded-lg p-3 mb-4">
                                <div className="text-sm text-gray-600 mb-2">Ringkasan dari 6 transaksi</div>
                                <div className="flex justify-between mb-2">
                                    <div className="text-xs text-gray-500">Total Pemasukan</div>
                                    <div className="text-sm text-green-600 font-medium">Rp 600.000</div>
                                </div>
                                <div className="flex justify-between">
                                    <div className="text-xs text-gray-500">Total Pengeluaran</div>
                                    <div className="text-sm text-red-600 font-medium">Rp 100.000</div>
                                </div>
                            </div>

                            <div className="bg-cyan-50 rounded-lg p-3 mb-4">
                                <div className="text-sm text-gray-600 mb-2">Ringkasan Harian</div>
                                <div className="flex justify-between">
                                    <div className="text-sm text-slate-700">Net Income:</div>
                                    <div className="text-sm text-cyan-600 font-medium">Rp 500.000</div>
                                </div>
                            </div>
                        </>
                    )}
                </>
            ) : (
                <>
                    <div className="mb-5">
                        <label className="text-sm font-medium text-slate-700 block mb-3">Voice Input</label>
                        <div className="space-y-4">
                            {/* Input Pemasukan */}
                            <div>
                                <div className="text-sm font-semibold text-slate-700 mb-3">Input Pemasukan</div>
                                <button
                                    onClick={() => setVoiceInputted(true)}
                                    className="w-full border-2 border-green-300 bg-green-50/30 rounded-2xl p-8 hover:bg-green-50/50 transition flex flex-col items-center justify-center gap-4 cursor-pointer"
                                >
                                    <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white">
                                        <IconMicrophone />
                                    </div>
                                    <div className="text-center">
                                        <div className="text-slate-700 font-medium">Tap untuk bicara</div>
                                        <div className="text-gray-500 text-xs mt-1">Sebutkan total atau jelaskan setiap transaksi hari ini.</div>
                                    </div>
                                </button>
                            </div>

                            {/* Input Pengeluaran */}
                            <div>
                                <div className="text-sm font-semibold text-slate-700 mb-3">Input Pengeluaran</div>
                                <button
                                    onClick={() => setVoiceInputted(true)}
                                    className="w-full border-2 border-red-300 bg-red-50/30 rounded-2xl p-8 hover:bg-red-50/50 transition flex flex-col items-center justify-center gap-4 cursor-pointer"
                                >
                                    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-white">
                                        <IconMicrophone />
                                    </div>
                                    <div className="text-center">
                                        <div className="text-slate-700 font-medium">Tap untuk bicara</div>
                                        <div className="text-gray-500 text-xs mt-1">Sebutkan total atau jelaskan setiap transaksi hari ini.</div>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>

                    {voiceInputted && (
                        <>
                            <div className="mb-5">
                                <label className="text-sm font-medium text-slate-700 block mb-3">Detail Transaksi Terdeteksi</label>
                                <div className="bg-white rounded-2xl overflow-hidden border border-gray-300">
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="bg-gray-50 border-b border-gray-300">
                                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 w-24">Tipe</th>
                                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 w-32">Kategori</th>
                                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 w-28">Jumlah</th>
                                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 flex-1">Keterangan</th>
                                                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 w-16">Aksi</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-300">
                                                <tr className="hover:bg-gray-50">
                                                    <td className="px-4 py-4">
                                                        <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">Pemasukan</span>
                                                    </td>
                                                    <td className="px-4 py-4 text-sm text-gray-600">Penjualan Jasa</td>
                                                    <td className="px-4 py-4 text-sm text-slate-700 font-medium">Rp 250.000</td>
                                                    <td className="px-4 py-4 text-sm text-gray-600">Jahit baju - Ibu Ani</td>
                                                    <td className="px-4 py-4 text-center flex gap-2 justify-center">
                                                        <button className="text-cyan-600 hover:text-cyan-700 text-lg">✏️</button>
                                                        <button className="text-red-600 hover:text-red-700 text-lg">🗑</button>
                                                    </td>
                                                </tr>
                                                <tr className="hover:bg-gray-50">
                                                    <td className="px-4 py-4">
                                                        <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">Pemasukan</span>
                                                    </td>
                                                    <td className="px-4 py-4 text-sm text-gray-600">Penjualan Jasa</td>
                                                    <td className="px-4 py-4 text-sm text-slate-700 font-medium">Rp 150.000</td>
                                                    <td className="px-4 py-4 text-sm text-gray-600">Perbaikan celana - Pak Budi</td>
                                                    <td className="px-4 py-4 text-center flex gap-2 justify-center">
                                                        <button className="text-cyan-600 hover:text-cyan-700 text-lg">✏️</button>
                                                        <button className="text-red-600 hover:text-red-700 text-lg">🗑</button>
                                                    </td>
                                                </tr>
                                                <tr className="hover:bg-gray-50">
                                                    <td className="px-4 py-4">
                                                        <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">Pemasukan</span>
                                                    </td>
                                                    <td className="px-4 py-4 text-sm text-gray-600">Penjualan Jasa</td>
                                                    <td className="px-4 py-4 text-sm text-slate-700 font-medium">Rp 200.000</td>
                                                    <td className="px-4 py-4 text-sm text-gray-600">Jahit kebaya - Ibu Siti</td>
                                                    <td className="px-4 py-4 text-center flex gap-2 justify-center">
                                                        <button className="text-cyan-600 hover:text-cyan-700 text-lg">✏️</button>
                                                        <button className="text-red-600 hover:text-red-700 text-lg">🗑</button>
                                                    </td>
                                                </tr>
                                                <tr className="hover:bg-gray-50">
                                                    <td className="px-4 py-4">
                                                        <span className="inline-block bg-red-100 text-red-700 text-xs font-semibold px-2.5 py-1 rounded-full">Pengeluaran</span>
                                                    </td>
                                                    <td className="px-4 py-4 text-sm text-gray-600">Bahan Baku</td>
                                                    <td className="px-4 py-4 text-sm text-slate-700 font-medium">Rp 180.000</td>
                                                    <td className="px-4 py-4 text-sm text-gray-600">Kain katun dan benang</td>
                                                    <td className="px-4 py-4 text-center flex gap-2 justify-center">
                                                        <button className="text-cyan-600 hover:text-cyan-700 text-lg">✏️</button>
                                                        <button className="text-red-600 hover:text-red-700 text-lg">🗑</button>
                                                    </td>
                                                </tr>
                                                <tr className="hover:bg-gray-50">
                                                    <td className="px-4 py-4">
                                                        <span className="inline-block bg-red-100 text-red-700 text-xs font-semibold px-2.5 py-1 rounded-full">Pengeluaran</span>
                                                    </td>
                                                    <td className="px-4 py-4 text-sm text-gray-600">Operasional</td>
                                                    <td className="px-4 py-4 text-sm text-slate-700 font-medium">Rp 50.000</td>
                                                    <td className="px-4 py-4 text-sm text-gray-600">Listrik dan air</td>
                                                    <td className="px-4 py-4 text-center flex gap-2 justify-center">
                                                        <button className="text-cyan-600 hover:text-cyan-700 text-lg">✏️</button>
                                                        <button className="text-red-600 hover:text-red-700 text-lg">🗑</button>
                                                    </td>
                                                </tr>
                                                <tr className="hover:bg-gray-50">
                                                    <td className="px-4 py-4">
                                                        <span className="inline-block bg-red-100 text-red-700 text-xs font-semibold px-2.5 py-1 rounded-full">Pengeluaran</span>
                                                    </td>
                                                    <td className="px-4 py-4 text-sm text-gray-600">Transportasi</td>
                                                    <td className="px-4 py-4 text-sm text-slate-700 font-medium">Rp 30.000</td>
                                                    <td className="px-4 py-4 text-sm text-gray-600">Ongkos beli bahan</td>
                                                    <td className="px-4 py-4 text-center flex gap-2 justify-center">
                                                        <button className="text-cyan-600 hover:text-cyan-700 text-lg">✏️</button>
                                                        <button className="text-red-600 hover:text-red-700 text-lg">🗑</button>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-cyan-50 rounded-lg p-3 mb-4">
                                <div className="text-sm text-gray-600 mb-2">Ringkasan dari 6 transaksi</div>
                                <div className="flex justify-between mb-2">
                                    <div className="text-xs text-gray-500">Total Pemasukan</div>
                                    <div className="text-sm text-green-600 font-medium">Rp 600.000</div>
                                </div>
                                <div className="flex justify-between">
                                    <div className="text-xs text-gray-500">Total Pengeluaran</div>
                                    <div className="text-sm text-red-600 font-medium">Rp 100.000</div>
                                </div>
                            </div>

                            <div className="bg-cyan-50 rounded-lg p-3 mb-4">
                                <div className="text-sm text-gray-600 mb-2">Ringkasan Harian</div>
                                <div className="flex justify-between">
                                    <div className="text-sm text-slate-700">Net Income:</div>
                                    <div className="text-sm text-cyan-600 font-medium">Rp 500.000</div>
                                </div>
                            </div>
                        </>
                    )}
                </>
            )}

            <button onClick={handleSave} className="w-full bg-[#8E44AD] text-white py-3 rounded-2xl font-medium">
                Simpan Cashflow
            </button>
        </div>
    );
}
