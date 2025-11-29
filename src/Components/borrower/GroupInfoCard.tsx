import React from 'react';
import Link from "next/link";

interface GroupInfoCardProps {
    majelisName?: string;
    highRiskCount?: number;
    trend?: "Membaik" | "Memburuk" | "Stabil" | string;
}

export default function GroupInfoCard({
    majelisName = "Majelis Sejahtera",
    highRiskCount = 0,
    trend = "Membaik"
}: GroupInfoCardProps) {
    // LOGIKA TREN:
    // Membaik = Risiko Turun (Panah Bawah, Warna Hijau)
    // Memburuk = Risiko Naik (Panah Atas, Warna Merah)
    const isGoodTrend = trend === "Membaik";

    // Konfigurasi Visual Tren
    const trendConfig = isGoodTrend
        ? {
            color: "text-emerald-600",
            bg: "bg-emerald-50",
            border: "border-emerald-100",
            icon: "📉",
            label: "Risiko Menurun",
            desc: "Performa majelis semakin baik"
        }
        : {
            color: "text-rose-600",
            bg: "bg-rose-50",
            border: "border-rose-100",
            icon: "📈",
            label: "Risiko Meningkat",
            desc: "Perlu perhatian khusus"
        };

    // Jika statusnya Stabil
    if (trend === "Stabil") {
        trendConfig.color = "text-blue-600";
        trendConfig.bg = "bg-blue-50";
        trendConfig.border = "border-blue-100";
        trendConfig.icon = "➡️";
        trendConfig.label = "Risiko Stabil";
        trendConfig.desc = "Pertahankan performa";
    }

    // Logic High Risk Display
    const hasHighRisk = highRiskCount > 0;

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col h-full">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-[#8E44AD]">{majelisName}</h2>
                    <p className="text-slate-500 text-sm mt-1">Dashboard monitoring kesehatan majelis</p>
                </div>

                <Link
                    href="/borrower/majelis-detail"
                    className="group flex items-center gap-2 px-5 py-2.5 bg-[#8E44AD] text-white rounded-xl text-sm font-semibold hover:bg-[#732d91] transition-all duration-200 shadow-md hover:shadow-lg w-full md:w-auto justify-center"
                >
                    Detail Majelis
                    <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow">

                {/* 1. High Risk Indicator */}
                <div className={`relative overflow-hidden rounded-2xl p-6 border ${hasHighRisk ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'} flex flex-col items-center justify-center text-center transition-all duration-300`}>
                    {hasHighRisk ? (
                        <>
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-3xl mb-3 shadow-sm animate-pulse">
                                ⚠️
                            </div>
                            <div className="text-red-800 text-4xl font-bold mb-1">{highRiskCount}</div>
                            <div className="text-red-600 font-semibold text-lg">Anggota Berisiko Tinggi</div>
                            <p className="text-red-500 text-sm mt-2">Segera lakukan pendampingan</p>
                        </>
                    ) : (
                        <>
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-3xl mb-3 shadow-sm">
                                🛡️
                            </div>
                            <div className="text-green-700 font-bold text-xl mb-1">Semua Aman</div>
                            <div className="text-green-600 text-sm">Tidak ada anggota berisiko tinggi</div>
                        </>
                    )}
                </div>

                {/* 2. Trend Indicator (Enhanced) */}
                <div className={`${trendConfig.bg} ${trendConfig.border} border rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-3`}>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-slate-600 font-medium text-sm uppercase tracking-wider">Tren Risiko</span>
                    </div>

                    <div className="flex flex-col items-center">
                        <div className="text-5xl mb-2 filter drop-shadow-sm">{trendConfig.icon}</div>
                        <div className={`${trendConfig.color} font-bold text-2xl`}>{trend}</div>
                    </div>

                    <div className={`px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-sm ${trendConfig.color} text-sm font-medium shadow-sm`}>
                        {trendConfig.desc}
                    </div>
                </div>
            </div>
        </div>
    );
}