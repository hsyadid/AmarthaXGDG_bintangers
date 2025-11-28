"use client";

import { useState } from "react";
import Link from "next/link";
import CashflowInputSection from "@/Components/cashflow/CashflowInputSection";

// Icon components
const IconArrowLeft = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>;
const IconHome = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-3m0 0l7-4 7 4M5 9v7a1 1 0 001 1h12a1 1 0 001-1V9m-9 4l4 2m-8-2l4-2" /></svg>;
const IconPlus = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>;

export default function ManualInputPage() {
  const [selectedDay, setSelectedDay] = useState<number>(4);

  const days = [
    { label: "Sen", date: 17 },
    { label: "Sel", date: 18 },
    { label: "Rab", date: 19 },
    { label: "Kam", date: 20 },
    { label: "Jum", date: 21 },
    { label: "Sab", date: 22 },
    { label: "Min", date: 23 },
  ];

  return (
    <div className="w-full min-h-screen bg-gray-50 pb-20">
      <div className="w-full h-48 bg-[#8E44AD]" />

      <div className="relative -mt-40 px-6">
        <Link href="/borrower" className="inline-flex items-center gap-2 text-slate-700 mb-4">
          <IconArrowLeft />
          <span className="text-sm font-medium">Back</span>
        </Link>

        <div className="text-white mb-6">
          <h1 className="text-3xl font-bold">Cashflow Harian</h1>
          <p className="text-base opacity-90">Catat transaksi bisnismu hari ini!</p>
        </div>

        <div className="space-y-4">
          {/* Week overview card */}
          <div className="bg-white rounded-2xl shadow-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <button className="text-[#8E44AD]">‹</button>
              <div className="text-center flex-1">
                <h2 className="text-xl font-semibold text-[#8E44AD]">Minggu ke-47</h2>
                <p className="text-xs text-gray-500">Nov 17 - Nov 23, 2025</p>
              </div>
              <button className="text-[#8E44AD]">›</button>
            </div>

            <div className="flex justify-between items-center gap-1 mb-4">
              {days.map((day, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedDay(idx)}
                  className={`w-12 h-12 rounded-full flex flex-col items-center justify-center text-xs transition ${idx === selectedDay
                    ? 'bg-white border-2 border-[#8E44AD] text-[#8E44AD] font-semibold'
                    : 'bg-cyan-50 border border-cyan-200 text-gray-600'
                    }`}
                >
                  <div>{day.label}</div>
                  <div className="text-[10px]">{day.date}</div>
                </button>
              ))}
            </div>

            <div className="flex justify-center mb-3">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
            </div>

            <div className="border-t pt-3 flex gap-3">
              <div className="flex-1 bg-cyan-50 rounded-lg p-3">
                <div className="text-xs text-gray-600">Total Revenue</div>
                <div className="text-base text-cyan-600 font-medium">Rp 2.160.000</div>
              </div>
              <div className="flex-1 bg-[#8E44AD]/5 rounded-lg p-3">
                <div className="text-xs text-gray-600">Total Expense</div>
                <div className="text-base text-[#8E44AD] font-medium">Rp 1.490.000</div>
              </div>
            </div>
          </div>

          {/* Date and edit section */}
          <CashflowInputSection />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-between items-center px-6 py-3">
        <button className="flex flex-col items-center gap-1 flex-1 text-gray-500 hover:text-slate-700">
          <IconHome />
          <span className="text-gray-500 text-xs">Home</span>
        </button>
        <button className="flex flex-col items-center gap-1 flex-1 text-[#8E44AD] hover:text-[#7a3a8e]">
          <IconPlus />
          <span className="text-[#8E44AD] text-xs font-medium">Add Cashflow</span>
        </button>
      </div>
    </div>
  );
}
