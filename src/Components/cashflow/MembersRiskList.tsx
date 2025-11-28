import React from 'react';

export default function MembersRiskList() {
    return (
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
    );
}
