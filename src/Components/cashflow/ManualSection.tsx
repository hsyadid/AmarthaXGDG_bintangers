import { IconPlus, IconDelete } from "./Icons";
import SummaryCard from "./SummaryCard";

interface Transaction {
    id: string;
    type: string;
    amount: number;
    description: string;
}

interface ManualSectionProps {
    inputType: string;
    setInputType: (type: string) => void;
    revenue: string;
    setRevenue: (value: string) => void;
    expense: string;
    setExpense: (value: string) => void;
    netIncome: number;
    transactions: Transaction[];
    handleAddTransaction: () => void;
    handleDeleteTransaction: (id: string) => void;
    handleUpdateTransaction: (id: string, field: keyof Transaction, value: any) => void;
    perTransactionIncome: number;
    totalExpense: number;
    perTransactionNetIncome: number;
}

export default function ManualSection({
    inputType,
    setInputType,
    revenue,
    setRevenue,
    expense,
    setExpense,
    netIncome,
    transactions,
    handleAddTransaction,
    handleDeleteTransaction,
    handleUpdateTransaction,
    perTransactionIncome,
    totalExpense,
    perTransactionNetIncome,
}: ManualSectionProps) {
    return (
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

                    <SummaryCard
                        title="Ringkasan Harian"
                        label="Net Income:"
                        value={`Rp ${netIncome.toLocaleString('id-ID')}`}
                    />
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
                                        <select
                                            value={tx.type}
                                            onChange={(e) => handleUpdateTransaction(tx.id, "type", e.target.value)}
                                            className="w-full p-2 rounded-md bg-gray-100 border border-gray-300 text-sm text-slate-700"
                                        >
                                            <option>Pemasukan (Credit)</option>
                                            <option>Pengeluaran (Debit)</option>
                                        </select>
                                    </div>



                                    <div>
                                        <label className="text-xs text-gray-600 font-medium block mb-1">Jumlah (Rp)</label>
                                        <input
                                            type="number"
                                            value={tx.amount}
                                            onChange={(e) => handleUpdateTransaction(tx.id, "amount", Number(e.target.value))}
                                            className="w-full p-2 rounded-md bg-gray-100 border border-gray-300 text-sm text-slate-700"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs text-gray-600 font-medium block mb-1">Keterangan</label>
                                        <input
                                            type="text"
                                            value={tx.description}
                                            onChange={(e) => handleUpdateTransaction(tx.id, "description", e.target.value)}
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

                    <SummaryCard
                        title="Ringkasan Harian"
                        label="Net Income:"
                        value={`Rp ${perTransactionNetIncome.toLocaleString('id-ID')}`}
                    />
                </>
            )}
        </>
    );
}
