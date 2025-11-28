import React from 'react';
import Link from "next/link";

interface GroupInfoCardProps {
    majelisName?: string;
    memberCount?: number;
    avgRisk?: number;
    trend?: string;
}

export default function GroupInfoCard({
    majelisName = "Majelis Sejahtera",
    memberCount = 15,
    avgRisk = 13.7,
    trend = "Membaik"
}: GroupInfoCardProps) {
    const isGoodTrend = trend === "Membaik";
    const trendColor = isGoodTrend ? "text-green-600" : "text-red-600";
    const trendIcon = isGoodTrend ? "↓" : "↑";

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-[#8E44AD]">{majelisName}</h2>
                <Link href="/borrower/majelis-detail" className="text-slate-700 text-sm font-medium">
                    View Details →
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="space-y-4">
                {/* Total Members */}
                <div className="bg-gradient-to-br from-cyan-600/10 to-cyan-600/5 rounded-2xl p-4">
                    <div className="text-gray-600 text-sm mb-2">📊 Total Anggota</div>
                    <div className="text-slate-700 text-base font-normal">{memberCount} Members</div>
                </div>

                {/* Average Risk */}
                <div className="bg-gradient-to-br from-yellow-100/50 to-yellow-50/30 rounded-2xl p-4">
                    <div className="text-gray-600 text-sm mb-2">📈 Rata-rata Kemungkinan Gagal Bayar</div>
                    <div className="text-yellow-600 text-base font-normal">{avgRisk.toFixed(1)}%</div>
                </div>

                {/* Trend */}
                <div className="bg-gradient-to-br from-green-100/50 to-green-50/30 rounded-2xl p-4">
                    <div className="text-gray-600 text-sm mb-2">📉 Tren</div>
                    <div className={`${trendColor} text-base font-normal`}>{trendIcon} {trend}</div>
                </div>
            </div>
        </div>
    );
}
