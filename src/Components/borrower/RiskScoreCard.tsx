import React from 'react';
import { getRiskScoreBgColor, getRiskScoreTextColor } from '@/lib/risk-utils';

// Helper sederhana untuk mendapatkan warna HEX berdasarkan level untuk stroke SVG
// Anda bisa sesuaikan kode warna ini dengan konfigurasi tailwind Anda jika perlu
const getRiskStrokeColor = (level: string) => {
    switch (level.toLowerCase()) {
        case 'low': return '#22c55e'; // tailwind green-500
        case 'moderate': return '#eab308'; // tailwind yellow-500
        case 'high': return '#ef4444'; // tailwind red-500
        default: return '#eab308';
    }
};

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
    // const changeText = isImprovement ? `↓ ${Math.abs(riskChange)}%` : `↑ ${Math.abs(riskChange)}%`; // Tidak dipakai di desain baru
    const changeColor = isImprovement ? "text-green-600" : "text-red-600";
    // Menambahkan tanda + atau - secara eksplisit
    const sign = riskChange > 0 ? "+ " : "";
    const changeMessage = `${sign}${riskChange.toFixed(1)} % dari minggu lalu`;

    const riskColorBg = getRiskScoreBgColor(riskScore);
    const riskColorText = getRiskScoreTextColor(riskScore);
    const strokeColorHex = getRiskStrokeColor(riskLevel);

    // --- Konfigurasi Lingkaran SVG ---
    const circleSize = 220; // Diperbesar dari 180
    const strokeWidth = 16; // Diperbesar dari 12
    const radius = (circleSize - strokeWidth) / 2;
    const centerX = circleSize / 2;
    const centerY = circleSize / 2;
    const circumference = 2 * Math.PI * radius;

    // Menghitung offset: Semakin besar score, semakin kecil offset (semakin panjang garisnya)
    // Kita batasi max score 100 untuk perhitungan lingkaran
    const cappedScore = Math.min(Math.max(riskScore, 0), 100);
    const strokeDashoffset = circumference - (cappedScore / 100) * circumference;


    return (
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-[#8E44AD] text-center">Persentase Risiko Gagal Bayar Anda</h2>

            {/* --- BAGIAN LINGKARAN PROGRES --- */}
            <div className="flex flex-col items-center justify-center space-y-4">
                <div className="relative" style={{ width: circleSize, height: circleSize }}>
                    {/* SVG Progress Bar */}
                    {/* transform -rotate-90 agar mulai dari posisi jam 12 */}
                    <svg width={circleSize} height={circleSize} className="transform -rotate-90 origin-center">
                        {/* Lingkaran Latar Belakang (Track) */}
                        <circle
                            stroke="#e5e7eb" // tailwind gray-200
                            fill="transparent"
                            strokeWidth={strokeWidth}
                            r={radius}
                            cx={centerX}
                            cy={centerY}
                        />
                        {/* Lingkaran Progres Berwarna */}
                        <circle
                            stroke={strokeColorHex}
                            fill="transparent"
                            strokeWidth={strokeWidth}
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round" // Ujung bulat seperti di gambar
                            r={radius}
                            cx={centerX}
                            cy={centerY}
                            className="transition-all duration-1000 ease-out" // Animasi halus saat dimuat
                        />
                    </svg>

                    {/* Teks di Tengah Lingkaran */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-6xl md:text-7xl font-extrabold text-slate-700">
                            {riskScore.toFixed(1)} <span className="text-4xl md:text-5xl">%</span>
                        </span>
                    </div>
                </div>

                {/* Improvement indicator (Dipindah ke bawah lingkaran) */}
                <div className={`flex items-center gap-2 ${changeColor} font-semibold text-xl md:text-2xl`}>
                    {/* Ikon panah kecil */}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-8 h-8 ${isImprovement ? "rotate-180" : ""}`}>
                        <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 11.586 15.293 7.293A1 1 0 0116 7h-4z" clipRule="evenodd" />
                    </svg>
                    <span>{changeMessage}</span>
                </div>
            </div>


            <div className="space-y-6">
                {/* Detail Info Section */}
                <div className="space-y-4 pt-6 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-lg md:text-xl font-medium">Risk Level</span>
                        {/* Menggunakan utility color yang sudah ada untuk badge */}
                        <span className={`${riskColorBg} ${riskColorText} text-base md:text-lg font-bold px-4 py-2 rounded-full`}>{riskLevel}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-lg md:text-xl font-medium">Minggu Lalu</span>
                        <span className="text-gray-500 text-lg md:text-xl font-bold">{previousRisk}%</span>
                    </div>
                </div>

                {/* Tip Box */}
                <div className="bg-cyan-600/10 rounded-2xl p-6">
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl md:text-3xl">💡</span>
                            <span className="font-bold text-slate-700 text-lg md:text-xl">{isImprovement ? "Bagus!" : "Perhatian Diperlukan"}</span>
                        </div>
                        <p className="text-slate-700 text-base md:text-lg leading-relaxed font-medium">
                            {isImprovement
                                ? "Risk score Anda menurun. Terus jaga konsistensi cashflow untuk mempertahankan performa ini."
                                : "Risk score Anda meningkat. Tinjau kembali pengeluaran dan pastikan pembayaran tepat waktu untuk menghindari gagal bayar."}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}