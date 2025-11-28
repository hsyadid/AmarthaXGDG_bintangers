"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import CashflowInputSection from "@/Components/cashflow/CashflowInputSection";
import { getCashFlowTotal } from "@/actions/cashflow";

// Icon components
const IconArrowLeft = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>;
const IconHome = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-3m0 0l7-4 7 4M5 9v7a1 1 0 001 1h12a1 1 0 001-1V9m-9 4l4 2m-8-2l4-2" /></svg>;
const IconPlus = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>;

export default function ManualInputPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [weekDates, setWeekDates] = useState<Date[]>([]);
  const [weekData, setWeekData] = useState<any[]>([]);
  const [weekRevenue, setWeekRevenue] = useState(0);
  const [weekExpense, setWeekExpense] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Helper to get Monday of the current week
  const getMonday = (d: Date) => {
    d = new Date(d);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff));
  };

  useEffect(() => {
    const today = new Date();
    setSelectedDate(today); // Set selectedDate on client side only

    const monday = getMonday(today);
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const nextDay = new Date(monday);
      nextDay.setDate(monday.getDate() + i);
      dates.push(nextDay);
    }
    setWeekDates(dates);
    fetchWeekData(dates[0], dates[6]);
  }, []);

  const fetchWeekData = async (start: Date, end: Date) => {
    setIsLoading(true);
    try {
      // Normalize start and end dates to cover the full range
      const startDate = new Date(start);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(end);
      endDate.setHours(23, 59, 59, 999);

      const res = await getCashFlowTotal({
        startDate: startDate,
        endDate: endDate,
        customer_number: process.env.CUSTOMER_NUMBER // Hardcoded for now as per previous context
      });

      if (res.success && res.data) {
        setWeekData(res.data);

        // Calculate weekly totals
        let rev = 0;
        let exp = 0;
        res.data.forEach((item: any) => {
          const amount = parseFloat(item.amount.toString());
          if (item.type === "REVENUE") rev += amount;
          if (item.type === "EXPENSE") exp += amount;
        });
        setWeekRevenue(rev);
        setWeekExpense(exp);
      }
    } catch (error) {
      console.error("Failed to fetch week data", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  const isSelected = (date: Date) => {
    if (!selectedDate) return false;
    return date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear();
  };

  const hasData = (date: Date) => {
    return weekData.some((item: any) => {
      const itemDate = new Date(item.date);
      return itemDate.getDate() === date.getDate() &&
        itemDate.getMonth() === date.getMonth() &&
        itemDate.getFullYear() === date.getFullYear();
    });
  };

  const isFuture = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(date);
    target.setHours(0, 0, 0, 0);
    return target > today;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
  };

  const dayLabels = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

  // Prevent hydration mismatch by not rendering until mounted (selectedDate is set)
  if (!selectedDate) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-[#8E44AD] animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 pb-20">
      <div className="w-full h-48 bg-[#8E44AD]" />

      <div className="relative -mt-40 px-6">
        <Link href="/borrower" className="inline-flex items-center gap-2 text-slate-700 mb-4">
          <IconArrowLeft />
          <span className="text-sm font-medium text-white">Back</span>
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
                <h2 className="text-xl font-semibold text-[#8E44AD]">Minggu ini</h2>
                {weekDates.length > 0 && (
                  <p className="text-xs text-gray-500">
                    {weekDates[0].toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })} - {weekDates[6].toLocaleDateString('id-ID', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                )}
              </div>
              <button className="text-[#8E44AD]">›</button>
            </div>

            <div className="flex justify-between items-center gap-1 mb-4">
              {weekDates.map((date, idx) => {
                const _isToday = isToday(date);
                const _hasData = hasData(date);
                const _isSelected = isSelected(date);

                let bgClass = "bg-gray-50 border-gray-200 text-gray-400"; // Default empty

                if (_isToday) {
                  bgClass = "bg-[#8E44AD] border-[#8E44AD] text-white shadow-md transform scale-105";
                } else if (_isSelected) {
                  bgClass = "bg-white border-2 border-[#8E44AD] text-[#8E44AD] font-semibold";
                } else if (_hasData) {
                  bgClass = "bg-cyan-50 border-cyan-200 text-cyan-700";
                }

                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedDate(date)}
                    className={`w-12 h-12 rounded-full flex flex-col items-center justify-center text-xs transition-all duration-200 border ${bgClass}`}
                  >
                    <div>{dayLabels[idx]}</div>
                    <div className="text-[10px]">{date.getDate()}</div>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-center mb-3">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
            </div>

            <div className="border-t pt-3 flex gap-3">
              <div className="flex-1 bg-cyan-50 rounded-lg p-3">
                <div className="text-xs text-gray-600">Total Revenue</div>
                <div className="text-base text-cyan-600 font-medium">{formatCurrency(weekRevenue)}</div>
              </div>
              <div className="flex-1 bg-[#8E44AD]/5 rounded-lg p-3">
                <div className="text-xs text-gray-600">Total Expense</div>
                <div className="text-base text-[#8E44AD] font-medium">{formatCurrency(weekExpense)}</div>
              </div>
            </div>
          </div>

          {/* Date and edit section */}
          <CashflowInputSection
            date={selectedDate}
            readOnly={!isToday(selectedDate)}
          />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-between items-center px-6 py-3 z-20">
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
