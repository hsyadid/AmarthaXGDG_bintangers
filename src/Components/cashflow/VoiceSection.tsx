import { IconMicrophone } from "./Icons";
import TransactionList from "./TransactionList";
import SummaryCard from "./SummaryCard";

interface VoiceSectionProps {
    voiceInputted: boolean;
    setVoiceInputted: (inputted: boolean) => void;
}

export default function VoiceSection({ voiceInputted, setVoiceInputted }: VoiceSectionProps) {
    return (
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
