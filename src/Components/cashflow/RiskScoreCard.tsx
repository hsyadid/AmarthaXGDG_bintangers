import React from 'react';

interface RiskScoreCardProps {
    riskScore?: number;
    riskLevel?: string;
    previousRisk?: number;
    riskChange?: number;
}

export default function RiskScoreCard({
    riskScore = 16.5,
    riskLevel = "Moderate",
    previousRisk = 18.4,
    riskChange = -2
}: RiskScoreCardProps) {
    const isImprovement = riskChange < 0;
    const changeText = isImprovement ? `↓ ${Math.abs(riskChange).toFixed(1)}%` : `↑ ${Math.abs(riskChange).toFixed(1)}%`;
    const changeColor = isImprovement ? "text-green-600" : "text-red-600";
    const changeMessage = isImprovement ? `${Math.abs(riskChange).toFixed(0)} dari minggu lalu` : `${Math.abs(riskChange).toFixed(0)} dari minggu lalu`;

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold text-[#8E44AD]">% Risiko Gagal Bayar Anda</h2>

            {/* Improvement indicator */}
            <div className={`flex items-center gap-2 ${changeColor} text-sm`}>
                <span>{isImprovement ? "↓" : "↑"}</span>
                <span>{changeMessage}</span>
            </div>

            <div className="space-y-6">
                {/* Default Risk Section */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-slate-700">Default Risk</span>
                        <div className="bg-yellow-50 rounded-full px-4 py-1">
                            <span className="text-yellow-600 font-normal text-sm">{riskScore.toFixed(1)}%</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between items-start">
                            <span className="text-gray-600 text-sm">Risk Level</span>
                            <span className="bg-[#8E44AD] text-white text-xs font-medium px-2 py-1 rounded">{riskLevel}</span>
                        </div>
                        <div className="flex justify-between items-start">
                            <span className="text-gray-600 text-sm">Minggu Lalu</span>
                            <span className="text-gray-500 text-sm">{previousRisk.toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between items-start">
                            <span className="text-gray-600 text-sm">Perubahan</span>
                            <span className={`${changeColor} text-sm`}>{changeText}</span>
                        </div>
                    </div>
                </div>

                {/* Tip Box */}
                <div className="bg-cyan-600/10 rounded-2xl p-4">
                    <div className="space-y-1">
                        <div className="flex items-start gap-2">
                            <span className="text-base">💡</span>
                            <span className="font-bold text-slate-700">{isImprovement ? "Bagus!" : "Hati-hati!"}</span>
                        </div>
                        <p className="text-slate-700 text-sm leading-6">
                            {isImprovement
                                ? "Risk score Anda menurun. Terus jaga konsistensi cashflow untuk menurunkan persentase gagal bayar-mu."
                                : "Risk score Anda meningkat. Perhatikan cashflow Anda untuk menghindari gagal bayar."}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
