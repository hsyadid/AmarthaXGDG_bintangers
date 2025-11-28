import React from 'react';

export default function CashflowSummaryList() {
    return (
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
    );
}
