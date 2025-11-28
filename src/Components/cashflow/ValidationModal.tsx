import { useState, useEffect } from "react";

// Ikon Sampah untuk tombol hapus
const IconTrash = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" />
    </svg>
);

interface ValidationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (data: any) => void;
    data: any;
}

export default function ValidationModal({ isOpen, onClose, onConfirm, data }: ValidationModalProps) {
    const [editedData, setEditedData] = useState<any>(null);

    useEffect(() => {
        if (data) {
            // Clone deep data untuk menghindari mutasi langsung pada props
            setEditedData(JSON.parse(JSON.stringify(data)));
        }
    }, [data]);

    if (!isOpen || !editedData) return null;

    const handleSave = () => {
        onConfirm(editedData);
        onClose();
    };

    const isListMode = editedData.mode === "list";
    // Jika list mode, gunakan array items. Jika tidak, bungkus object total ke dalam array agar bisa di-map.
    const items = isListMode ? editedData.items : (editedData.total ? [editedData.total] : []);

    const updateItem = (index: number, field: string, value: any) => {
        if (isListMode) {
            const newItems = [...editedData.items];
            newItems[index] = { ...newItems[index], [field]: value };
            setEditedData({ ...editedData, items: newItems });
        } else {
            setEditedData({ ...editedData, total: { ...editedData.total, [field]: value } });
        }
    };

    // Fungsi baru untuk menghapus item
    const deleteItem = (index: number) => {
        if (isListMode) {
            // Filter keluar item berdasarkan index yang diklik
            const newItems = editedData.items.filter((_: any, i: number) => i !== index);
            setEditedData({ ...editedData, items: newItems });
        }
        // Kita tidak mengizinkan penghapusan jika mode "total" (single item)
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm transition-opacity">
            <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                {/* Header Modal */}
                <div className="p-5 border-b border-gray-100 flex-shrink-0">
                    <h3 className="text-xl font-bold text-slate-800">Validasi Data AI</h3>
                    <p className="text-sm text-gray-500 mt-1">AI mendeteksi {items.length} transaksi. Periksa, koreksi, atau hapus sebelum disimpan.</p>
                </div>

                {/* Body Modal (Scrollable) */}
                <div className="p-5 space-y-4 overflow-y-auto flex-grow bg-gray-50/50">
                    {items.length === 0 ? (
                        <div className="text-center py-8 text-gray-500 italic bg-white rounded-xl border border-dashed border-gray-300">
                            Tidak ada data transaksi tersisa.
                        </div>
                    ) : (
                        items.map((item: any, idx: number) => (
                            <div key={idx} className="border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden transition-all hover:shadow-md">
                                {/* Header Item (Baris ini baru ditambahkan untuk tempat tombol hapus) */}
                                <div className="bg-gray-50 px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Transaksi #{idx + 1}
                                    </span>
                                    {/* Tombol Hapus hanya muncul jika mode List */}
                                    {isListMode && (
                                        <button
                                            onClick={() => deleteItem(idx)}
                                            className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                                            title="Hapus transaksi ini"
                                        >
                                            <IconTrash />
                                        </button>
                                    )}
                                </div>

                                {/* Form Input */}
                                <div className="p-4 grid gap-4">
                                    <div>
                                        <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Tipe Transaksi</label>
                                        <div className="relative">
                                            <select
                                                value={item.tipe}
                                                onChange={(e) => updateItem(idx, "tipe", e.target.value)}
                                                // UPDATED: Menambahkan text-slate-800 dan font-medium agar lebih jelas
                                                className="w-full p-2.5 pl-3 pr-10 rounded-lg border border-gray-300 bg-white text-sm text-slate-800 font-medium focus:ring-2 focus:ring-[#8E44AD]/20 focus:border-[#8E44AD] transition-all appearance-none"
                                                style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 0.5rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em` }}
                                            >
                                                <option value="revenue">Pemasukan (Revenue)</option>
                                                <option value="expense">Pengeluaran (Expense)</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Deskripsi</label>
                                        <input
                                            type="text"
                                            value={item.desc || ""}
                                            onChange={(e) => updateItem(idx, "desc", e.target.value)}
                                            placeholder="Contoh: Jual 2 baju"
                                            // UPDATED: Menambahkan text-slate-800 dan font-medium
                                            className="w-full p-2.5 rounded-lg border border-gray-300 text-sm text-slate-800 font-medium focus:ring-2 focus:ring-[#8E44AD]/20 focus:border-[#8E44AD] transition-all placeholder:text-gray-400/80"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Jumlah (Rp)</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm">Rp</span>
                                            <input
                                                type="number"
                                                value={item.amount}
                                                onChange={(e) => updateItem(idx, "amount", Number(e.target.value))}
                                                // UPDATED: Menambahkan text-slate-800 dan font-medium, serta padding kiri untuk "Rp"
                                                className="w-full p-2.5 pl-9 rounded-lg border border-gray-300 text-sm text-slate-800 font-medium focus:ring-2 focus:ring-[#8E44AD]/20 focus:border-[#8E44AD] transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer Modal */}
                <div className="p-5 border-t border-gray-100 flex gap-3 flex-shrink-0 bg-white">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 px-4 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all focus:ring-2 focus:ring-gray-200 active:scale-[0.98]"
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={items.length === 0 && isListMode}
                        className={`flex-1 py-3 px-4 rounded-xl text-white font-semibold transition-all focus:ring-2 focus:ring-[#8E44AD]/40 active:scale-[0.98] shadow-sm
                            ${items.length === 0 && isListMode
                                ? 'bg-gray-300 cursor-not-allowed'
                                : 'bg-[#8E44AD] hover:bg-[#7a3a8e] hover:shadow-md'
                            }`}
                    >
                        Konfirmasi {items.length > 0 ? `(${items.length})` : ''}
                    </button>
                </div>
            </div>
        </div>
    );
}