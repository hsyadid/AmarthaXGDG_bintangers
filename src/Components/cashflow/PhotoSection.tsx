import { IconUpload, IconImage } from "./Icons";
import TransactionList from "./TransactionList";
import SummaryCard from "./SummaryCard";

interface PhotoSectionProps {
    photoUploaded: boolean;
    setPhotoUploaded: (uploaded: boolean) => void;
}

export default function PhotoSection({ photoUploaded, setPhotoUploaded }: PhotoSectionProps) {
    return (
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
                        <TransactionList
                            transactions={[
                                { id: "1", type: "Pemasukan", category: "Penjualan Jasa", amount: 250000, description: "Jahit baju - Ibu Ani" },
                                { id: "2", type: "Pemasukan", category: "Penjualan Jasa", amount: 150000, description: "Perbaikan celana - Pak Budi" },
                                { id: "3", type: "Pemasukan", category: "Penjualan Jasa", amount: 200000, description: "Jahit kebaya - Ibu Siti" },
                                { id: "4", type: "Pengeluaran", category: "Bahan Baku", amount: 180000, description: "Kain katun dan benang" },
                                { id: "5", type: "Pengeluaran", category: "Operasional", amount: 50000, description: "Listrik dan air" },
                                { id: "6", type: "Pengeluaran", category: "Transportasi", amount: 30000, description: "Ongkos beli bahan" },
                            ]}
                        />
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

                    <SummaryCard
                        title="Ringkasan Harian"
                        label="Net Income:"
                        value="Rp 500.000"
                    />
                </>
            )}
        </>
    );
}
