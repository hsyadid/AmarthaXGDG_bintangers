import React from 'react';

export default function RiskScoreCard() {
    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold text-[#8E44AD]">% Risiko Gagal Bayar Anda</h2>

            {/* Improvement indicator */}
            <div className="flex items-center gap-2 text-green-600 text-sm">
                <span>↓</span>
                <span>-2 dari minggu lalu</span>
            </div>

            <div className="space-y-6">
                {/* Default Risk Section */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-slate-700">Default Risk</span>
                        <div className="bg-yellow-50 rounded-full px-4 py-1">
                            <span className="text-yellow-600 font-normal text-sm">16.5%</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between items-start">
                            <span className="text-gray-600 text-sm">Risk Level</span>
                            <span className="bg-[#8E44AD] text-white text-xs font-medium px-2 py-1 rounded">Moderate</span>
                        </div>
                        <div className="flex justify-between items-start">
                            <span className="text-gray-600 text-sm">Minggu Lalu</span>
                            <span className="text-gray-500 text-sm">18.4%</span>
                        </div>
                        <div className="flex justify-between items-start">
                            <span className="text-gray-600 text-sm">Perubahan</span>
                            <span className="text-green-600 text-sm">↓ -2%</span>
                        </div>
                    </div>
                </div>

                {/* Tip Box */}
                <div className="bg-cyan-600/10 rounded-2xl p-4">
                    <div className="space-y-1">
                        <div className="flex items-start gap-2">
                            <span className="text-base">💡</span>
                            <span className="font-bold text-slate-700">Bagus!</span>
                        </div>
                        <p className="text-slate-700 text-sm leading-6">
                            Risk score Anda menurun. Terus jaga konsistensi cashflow untuk menurunkan persentase gagal bayar-mu.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
