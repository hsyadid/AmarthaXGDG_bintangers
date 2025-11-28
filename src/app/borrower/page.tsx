"use client";

import Link from "next/link";

export default function BorrowerPage() {
  return (
    <div className="w-full min-h-screen bg-gray-50 pb-24">
      {/* Header Background */}
      <div className="w-full h-72 bg-[#8E44AD]" />
      
      {/* Main Content */}
      <div className="relative -mt-56">
        {/* Greeting Section */}
        <div className="px-6 pt-8 pb-8 text-white">
          <div className="text-base font-normal opacity-80 mb-2">Selamat Datang,</div>
          <div className="text-3xl font-bold mb-2">Dewi Kartika</div>
          <div className="text-base font-normal opacity-90">Penjahit • Majelis Berkah</div>
        </div>

        {/* Content Cards */}
        <div className="px-6 space-y-7">
          {/* Risk Card */}
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

          {/* Group Info Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-[#8E44AD]">Majelis Sejahtera</h2>
              <Link href="/borrower/majelis-detail" className="text-slate-700 text-sm font-medium">
                View Details →
              </Link>
            </div>

            {/* Stats Grid */}
            <div className="space-y-4">
              {/* Total Members */}
              <div className="bg-gradient-to-br from-cyan-600/10 to-cyan-600/5 rounded-2xl p-4">
                <div className="text-gray-600 text-sm mb-2">📊 Total Anggota</div>
                <div className="text-slate-700 text-base font-normal">15 Members</div>
              </div>

              {/* Average Risk */}
              <div className="bg-gradient-to-br from-yellow-100/50 to-yellow-50/30 rounded-2xl p-4">
                <div className="text-gray-600 text-sm mb-2">📈 Rata-rata Kemungkinan Gagal Bayar</div>
                <div className="text-yellow-600 text-base font-normal">13.7%</div>
              </div>

              {/* Trend */}
              <div className="bg-gradient-to-br from-green-100/50 to-green-50/30 rounded-2xl p-4">
                <div className="text-gray-600 text-sm mb-2">📉 Tren</div>
                <div className="text-green-600 text-base font-normal">↓ Membaik</div>
              </div>
            </div>
          </div>

          {/* Members Risk Percentage */}
          <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-[#8E44AD]">Persentase Anggota Majelis</h2>
              <p className="text-gray-600 text-sm mt-1">Transparansi risiko pembayaran antar anggota</p>
            </div>

            {/* Members List */}
            <div className="space-y-3">
              {/* Siti Rahayu */}
              <div className="bg-gray-50 rounded-2xl border border-gray-200 p-4 flex justify-between items-center">
                <div>
                  <p className="text-slate-700 font-normal text-base">Siti Rahayu</p>
                  <p className="text-green-500 text-sm mt-1">-1.3%</p>
                </div>
                <div className="bg-green-50 rounded-full px-3 py-1 whitespace-nowrap">
                  <span className="text-green-600 text-xs">Risk: 7.2%</span>
                </div>
              </div>

              {/* Ani Susanti */}
              <div className="bg-gray-50 rounded-2xl border border-gray-200 p-4 flex justify-between items-center">
                <div>
                  <p className="text-slate-700 font-normal text-base">Ani Susanti</p>
                  <p className="text-red-500 text-xs mt-1">+3.2%</p>
                </div>
                <div className="bg-red-50 rounded-full px-3 py-1 whitespace-nowrap">
                  <span className="text-red-600 text-xs">Risk: 28.3%</span>
                </div>
              </div>

              {/* Rina Wulan */}
              <div className="bg-gray-50 rounded-2xl border border-gray-200 p-4 flex justify-between items-center">
                <div>
                  <p className="text-slate-700 font-normal text-base">Rina Wulan</p>
                  <div className="bg-green-50 rounded-full px-3 py-1 w-fit mt-1">
                    <span className="text-green-600 text-xs">Risk: 5.1%</span>
                  </div>
                </div>
                <span className="text-gray-400 text-xs">~</span>
              </div>

              {/* Putri Yani */}
              <div className="bg-gray-50 rounded-2xl border border-gray-200 p-4 flex justify-between items-center">
                <div>
                  <p className="text-slate-700 font-normal text-base">Putri Yani</p>
                  <div className="bg-yellow-50 rounded-full px-3 py-1 w-fit mt-1">
                    <span className="text-yellow-600 text-xs">Risk: 11.2%</span>
                  </div>
                </div>
                <p className="text-green-500 text-xs">-2.3%</p>
              </div>
            </div>
          </div>

          {/* Cashflow Summary */}
          <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-[#8E44AD]">Ringkasan Cashflow</h2>
              <button className="text-slate-700 text-sm">→</button>
            </div>

            {/* Cashflow Entries */}
            <div className="space-y-4">
              {/* Entry 1 */}
              <div className="border-l-4 border-cyan-600 pl-4 py-2">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-500 text-sm">2025-11-21 • 09:30</span>
                  <span className="border border-gray-200 rounded px-2 py-1 text-xs whitespace-nowrap">Voice Input</span>
                </div>
                <div className="flex gap-6">
                  <div>
                    <p className="text-gray-500 text-xs">Revenue</p>
                    <p className="text-green-600 text-base font-normal">Rp 650,000</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Expense</p>
                    <p className="text-red-600 text-base font-normal">Rp 440,000</p>
                  </div>
                </div>
              </div>

              {/* Entry 2 */}
              <div className="border-l-4 border-cyan-600 pl-4 py-2">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-500 text-sm">2025-11-20 • 10:15</span>
                  <span className="border border-gray-200 rounded px-2 py-1 text-xs whitespace-nowrap">Manual Entry</span>
                </div>
                <div className="flex gap-6">
                  <div>
                    <p className="text-gray-500 text-xs">Revenue</p>
                    <p className="text-green-600 text-base font-normal">Rp 580,000</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Expense</p>
                    <p className="text-red-600 text-base font-normal">Rp 410,000</p>
                  </div>
                </div>
              </div>

              {/* Entry 3 */}
              <div className="border-l-4 border-cyan-600 pl-4 py-2">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-500 text-sm">2025-11-19 • 08:45</span>
                  <span className="border border-gray-200 rounded px-2 py-1 text-xs whitespace-nowrap">OCR Upload</span>
                </div>
                <div className="flex gap-6">
                  <div>
                    <p className="text-gray-500 text-xs">Revenue</p>
                    <p className="text-green-600 text-base font-normal">Rp 490,000</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Expense</p>
                    <p className="text-red-600 text-base font-normal">Rp 350,000</p>
                  </div>
                </div>
              </div>

              {/* Entry 4 */}
              <div className="border-l-4 border-cyan-600 pl-4 py-2">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-500 text-sm">2025-11-18 • 11:20</span>
                  <span className="border border-gray-200 rounded px-2 py-1 text-xs whitespace-nowrap">Manual Entry</span>
                </div>
                <div className="flex gap-6">
                  <div>
                    <p className="text-gray-500 text-xs">Revenue</p>
                    <p className="text-green-600 text-base font-normal">Rp 610,000</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Expense</p>
                    <p className="text-red-600 text-base font-normal">Rp 420,000</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action Card */}
          <div className="bg-gradient-to-b from-[#8E44AD] to-[#8E44AD] rounded-2xl shadow-lg p-6 text-white">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">Sudah input cashflow-mu hari ini?</h3>
                <p className="text-white/80 text-sm">Jaga konsistensi untuk mengurangi risk score Anda</p>
              </div>
              <button className="bg-white text-[#8E44AD] font-medium text-sm px-4 py-2 rounded whitespace-nowrap">
                + Tambah
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-between items-center px-6 py-3 max-w-screen-sm mx-auto">
        <button className="flex flex-col items-center gap-1 flex-1 py-2">
          <div className="text-xl">🏠</div>
          <span className="text-[#8E44AD] text-xs font-normal">Home</span>
        </button>
        <button className="flex flex-col items-center gap-1 flex-1 py-2">
          <div className="text-xl">➕</div>
          <span className="text-gray-500 text-xs font-normal">Add Cashflow</span>
        </button>
      </div>
    </div>
  );
}
