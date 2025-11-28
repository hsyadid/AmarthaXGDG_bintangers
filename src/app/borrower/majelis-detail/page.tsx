"use client";

export default function MajelisDetailPage() {
  return (
    <div className="w-full min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="w-full h-64 bg-[#8E44AD]" />

      {/* Back button and title */}
      <div className="relative -mt-48 px-6">
        <div className="w-24 h-9 rounded-md bg-transparent text-white relative">
          <div className="w-4 h-4 left-3 top-2 absolute overflow-hidden">
            <div className="w-1 h-2.5 left-[3.33px] top-[3.33px] absolute outline outline-[1.33px] outline-offset-[-0.67px] outline-white" />
            <div className="w-2.5 h-0 left-[3.33px] top-[8px] absolute outline outline-[1.33px] outline-offset-[-0.67px] outline-white" />
          </div>
          <div className="absolute left-11 top-2 text-white text-sm font-medium">Back</div>
        </div>

        <div className="mt-4">
          <h1 className="text-3xl font-bold text-white">Majelis Sejahtera</h1>
          <div className="text-base text-white/90">MJS-001 • Majelis Kamu</div>
        </div>
      </div>

      {/* Content area */}
      <div className="px-6 mt-6 space-y-6">
        {/* Top stats */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 relative">
                <div className="w-3 h-[5px] left-[1.67px] top-[12.50px] absolute outline outline-[1.67px] outline-offset-[-0.83px] outline-cyan-600" />
                <div className="w-[2.50px] h-1.5 left-[13.33px] top-[2.61px] absolute outline outline-[1.67px] outline-offset-[-0.83px] outline-cyan-600" />
                <div className="w-[2.50px] h-[4.89px] left-[15.83px] top-[12.61px] absolute outline outline-[1.67px] outline-offset-[-0.83px] outline-cyan-600" />
                <div className="w-1.5 h-1.5 left-[4.17px] top-[2.50px] absolute outline outline-[1.67px] outline-offset-[-0.83px] outline-cyan-600" />
              </div>
              <div>
                <div className="text-gray-600 text-lg font-semibold">Total Anggota</div>
                <div className="text-slate-700 text-base">15 Members</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 relative">
                <div className="w-[5px] h-[5px] left-[13.33px] top-[5.83px] absolute outline outline-[1.67px] outline-offset-[-0.83px] outline-cyan-600" />
                <div className="w-4 h-2 left-[1.67px] top-[5.83px] absolute outline outline-[1.67px] outline-offset-[-0.83px] outline-cyan-600" />
              </div>
              <div>
                <div className="text-gray-600 text-lg font-semibold">Rata-rata Persentase Majelis</div>
                <div className="text-yellow-600 text-base">13.7%</div>
                <div className="text-green-600 text-sm">↓ Membaik</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-[#8E44AD]/10 rounded flex justify-center items-center">
                <div className="text-[#8E44AD] text-xs">%</div>
              </div>
              <div>
                <div className="text-gray-600 text-lg font-semibold">Posisimu</div>
                <div className="text-slate-700 text-base">#3 of 15</div>
                <div className="text-gray-500 text-sm">By health score</div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance / trend */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-xl font-semibold text-[#8E44AD] mb-3">Majelis Performance</h3>
          <div className="space-y-3">
            <div className="bg-green-50 rounded-2xl px-3 py-3 flex justify-between">
              <div className="text-gray-700">Low Risk (&lt;10%)</div>
              <div className="text-green-600">8 members</div>
            </div>
            <div className="bg-yellow-50 rounded-2xl px-3 py-3 flex justify-between">
              <div className="text-gray-700">Moderate (10-20%)</div>
              <div className="text-yellow-600">5 members</div>
            </div>
            <div className="bg-red-50 rounded-2xl px-3 py-3 flex justify-between">
              <div className="text-gray-700">High Risk (&gt;20%)</div>
              <div className="text-red-600">2 member</div>
            </div>
          </div>
        </div>

        {/* Members list table */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-xl font-semibold text-[#8E44AD] mb-3">Persentase Anggota Majelis</h3>
          <p className="text-sm text-gray-600 mb-4">Detail cashflow anggota bersifat privat. Anda melihat persentase risiko dan trend.</p>

          <div className="space-y-3">
            {/* Member row example */}
            <div className="flex justify-between items-center border-b border-gray-200 pb-3">
              <div>
                <div className="text-slate-700">Siti Rahayu</div>
                <div className="text-gray-500 text-sm">Member</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-green-50 rounded-full px-3 py-1 text-green-600 text-sm">7.2%</div>
                <div className="text-green-500 text-xs">-1.3%</div>
                <div className="bg-green-100 rounded-md px-2 py-1 text-green-700 text-xs">Low Risk</div>
              </div>
            </div>

            <div className="flex justify-between items-center border-b border-gray-200 pb-3">
              <div>
                <div className="text-slate-700">Ani Susanti</div>
                <div className="text-gray-500 text-sm">Toko Sayur</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-red-50 rounded-full px-3 py-1 text-red-600 text-sm">28.3%</div>
                <div className="text-red-500 text-xs">+3.2%</div>
                <div className="bg-red-600/60 rounded-md px-2 py-1 text-white text-xs">High Risk</div>
              </div>
            </div>

            {/* More rows can be added similarly */}
          </div>
        </div>
      </div>
    </div>
  );
}
