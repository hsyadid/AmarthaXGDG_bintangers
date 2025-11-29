'use client';

import React from 'react';
import Link from 'next/link';

export default function LenderDashboard() {
  return (
    <div className="w-full min-h-screen bg-gray-50 pb-24">
      {/* Header Background */}
      <div className="w-full h-64 bg-[#8E44AD]" />

      {/* Main Content */}
      <div className="relative -mt-48">
        {/* Header Section */}
        <div className="px-6 pt-8 pb-8 text-white">
          <div className="text-base font-normal opacity-80 mb-2">Lender Dashboard</div>
          <div className="text-3xl font-bold">Lender Dashboard</div>
          <div className="text-base font-normal opacity-90 mt-2">Monitor your lending portfolio and borrower performance</div>
        </div>

        {/* Content Cards */}
        <div className="px-6 space-y-7">
          {/* Portfolio Summary Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold text-[#8E44AD]">Portfolio Summary</h2>

            {/* Stats Grid */}
            <div className="space-y-3">
              {/* Total Investment & Active Loans */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#8E44AD]/5 rounded-2xl p-4 flex flex-col justify-start">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-5 h-5 text-[#8E44AD]">
                      <svg fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
                      </svg>
                    </div>
                    <span className="text-gray-600 text-xs font-medium">Total Investment</span>
                  </div>
                  <div className="text-base font-semibold text-slate-700">Rp 45.000.000</div>
                </div>

                <div className="bg-cyan-600/5 rounded-2xl p-4 flex flex-col justify-start">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-5 h-5 text-cyan-600">
                      <svg fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
                      </svg>
                    </div>
                    <span className="text-gray-600 text-xs font-medium">Active Loans</span>
                  </div>
                  <div className="text-base font-semibold text-slate-700">12 Borrowers</div>
                </div>
              </div>

              {/* Expected Return */}
              <div className="bg-cyan-600/5 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 text-cyan-600">
                    <svg fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
                    </svg>
                  </div>
                  <span className="text-xs text-gray-600 font-medium">Expected Return</span>
                </div>
                <div className="text-lg font-semibold text-cyan-600">Rp 4.300.000</div>
                <div className="text-xs text-gray-500">Bulan Ini</div>
              </div>

              {/* Portfolio Risk */}
              <div className="bg-yellow-100/50 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 text-yellow-600">
                    <svg fill="currentColor" viewBox="0 0 24 24">
                      <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
                    </svg>
                  </div>
                  <span className="text-xs text-gray-600 font-medium">Portfolio Avg Risk Score</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-lg font-semibold text-yellow-600">13.8%</div>
                  <span className="bg-[#8E44AD] text-white text-xs font-medium px-2 py-1 rounded">Moderate Risk</span>
                </div>
              </div>
            </div>
          </div>

          {/* Related Majelis Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h2 className="text-xl font-semibold text-[#8E44AD]">Related Majelis</h2>
                <p className="text-sm text-gray-600 mt-1">Majelis groups where you have invested</p>
              </div>
            </div>

            <div className="space-y-3">
              {/* Majelis 1 */}
              <div className="border border-gray-200 rounded-2xl p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-700">Majelis Sejahtera</h3>
                      <span className="text-xs text-gray-500">MJS-001</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">5/15 borrowers</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-600">My Investment</div>
                    <div className="text-base font-semibold text-cyan-600">Rp 18.000.000</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Avg Risk:</span>
                  <span className="text-base font-semibold text-green-600">8.5%</span>
                  <span className="text-base text-green-500">↘</span>
                </div>
                <div className="w-full h-2 bg-[#8E44AD]/20 rounded-full overflow-hidden mt-3">
                  <div className="h-full bg-[#8E44AD]" style={{width: '42.5%'}}></div>
                </div>
              </div>

              {/* Majelis 2 */}
              <div className="border border-gray-200 rounded-2xl p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-700">Majelis Berkah</h3>
                      <span className="text-xs text-gray-500">MJB-002</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">4/12 borrowers</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-600">My Investment</div>
                    <div className="text-base font-semibold text-cyan-600">Rp 15.000.000</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Avg Risk:</span>
                  <span className="text-base font-semibold text-yellow-600">15.2%</span>
                  <span className="text-base text-gray-400">~</span>
                </div>
                <div className="w-full h-2 bg-[#8E44AD]/20 rounded-full overflow-hidden mt-3">
                  <div className="h-full bg-[#8E44AD]" style={{width: '37.5%'}}></div>
                </div>
              </div>

              {/* Majelis 3 */}
              <div className="border border-gray-200 rounded-2xl p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-700">Majelis Harmoni</h3>
                      <span className="text-xs text-gray-500">MJH-004</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">3/10 borrowers</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-600">My Investment</div>
                    <div className="text-base font-semibold text-cyan-600">Rp 12.000.000</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Avg Risk:</span>
                  <span className="text-base font-semibold text-red-600">21.5%</span>
                  <span className="text-base text-red-500">↗</span>
                </div>
                <div className="w-full h-2 bg-[#8E44AD]/20 rounded-full overflow-hidden mt-3">
                  <div className="h-full bg-[#8E44AD]" style={{width: '53.75%'}}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Borrowers Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-[#8E44AD]">Related Borrowers</h2>
              <p className="text-sm text-gray-600 mt-1">Detailed view of your investment portfolio</p>
            </div>

            <div className="space-y-4">
              {/* Borrower 1 */}
              <div className="border border-gray-200 rounded-2xl p-4 space-y-3">
                <div className="space-y-1">
                  <h3 className="font-semibold text-slate-700">Siti Rahayu</h3>
                  <p className="text-sm text-gray-600">Warung Kelontong</p>
                  <p className="text-xs text-gray-500">Majelis Sejahtera</p>
                </div>
                <button className="text-[#8E44AD] text-sm font-medium flex items-center gap-1">
                  View Details →
                </button>

                <div className="bg-gray-50 rounded p-3 space-y-2">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Jumlah Pinjaman</div>
                      <div className="text-sm font-semibold text-slate-700">Rp 5.000.000</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Telah Dibayar</div>
                      <div className="text-sm font-semibold text-slate-700">Rp 3.200.000</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Payment Progress</span>
                    <span className="text-sm text-slate-700">8/12 weeks</span>
                  </div>
                  <div className="w-full h-2 bg-[#8E44AD]/20 rounded-full overflow-hidden">
                    <div className="h-full bg-[#8E44AD]" style={{width: '66.67%'}}></div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Risk Score:</span>
                    <span className="text-base font-semibold text-green-600">7.8%</span>
                  </div>
                  <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded">Low</span>
                </div>
              </div>

              {/* Borrower 2 */}
              <div className="border border-gray-200 rounded-2xl p-4 space-y-3">
                <div className="space-y-1">
                  <h3 className="font-semibold text-slate-700">Dewi Kartika</h3>
                  <p className="text-sm text-gray-600">Penjahit</p>
                  <p className="text-xs text-gray-500">Majelis Berkah</p>
                </div>
                <button className="text-[#8E44AD] text-sm font-medium flex items-center gap-1">
                  View Details →
                </button>

                <div className="bg-gray-50 rounded p-3 space-y-2">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Jumlah Pinjaman</div>
                      <div className="text-sm font-semibold text-slate-700">Rp 5.000.000</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Telah Dibayar</div>
                      <div className="text-sm font-semibold text-slate-700">Rp 2.800.000</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Payment Progress</span>
                    <span className="text-sm text-slate-700">7/12 weeks</span>
                  </div>
                  <div className="w-full h-2 bg-[#8E44AD]/20 rounded-full overflow-hidden">
                    <div className="h-full bg-[#8E44AD]" style={{width: '58.33%'}}></div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Risk Score:</span>
                    <span className="text-base font-semibold text-yellow-600">16.5%</span>
                  </div>
                  <span className="bg-[#8E44AD] text-white text-xs font-medium px-2 py-1 rounded">Moderate</span>
                </div>
              </div>

              {/* Borrower 3 */}
              <div className="border border-gray-200 rounded-2xl p-4 space-y-3">
                <div className="space-y-1">
                  <h3 className="font-semibold text-slate-700">Ani Susanti</h3>
                  <p className="text-sm text-gray-600">Toko Sayur</p>
                  <p className="text-xs text-gray-500">Majelis Berkah</p>
                </div>
                <button className="text-[#8E44AD] text-sm font-medium flex items-center gap-1">
                  View Details →
                </button>

                <div className="bg-gray-50 rounded p-3 space-y-2">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Jumlah Pinjaman</div>
                      <div className="text-sm font-semibold text-slate-700">Rp 3.000.000</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Telah Dibayar</div>
                      <div className="text-sm font-semibold text-slate-700">Rp 2.100.000</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Payment Progress</span>
                    <span className="text-sm text-slate-700">6/12 weeks</span>
                  </div>
                  <div className="w-full h-2 bg-[#8E44AD]/20 rounded-full overflow-hidden">
                    <div className="h-full bg-[#8E44AD]" style={{width: '50%'}}></div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Risk Score:</span>
                    <span className="text-base font-semibold text-red-600">28.3%</span>
                  </div>
                  <span className="bg-red-600/60 text-white text-xs font-medium px-2 py-1 rounded">High</span>
                </div>
              </div>
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
          <span className="text-gray-500 text-xs font-normal">Add Investment</span>
        </button>
      </div>
    </div>
  );
}
