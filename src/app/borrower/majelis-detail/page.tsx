"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import MembersRiskList from '@/Components/majelis/MembersRiskList';

interface MemberRisk {
  name: string;
  risk: number;
  riskChange: number;
}

interface MajelisData {
  majelis: {
    name: string;
    id: string;
    averageRisk: string;
    trend: string;
  };
  userPosition: {
    rank: number;
    total: number;
    riskScore: string;
  };
  performance: {
    low: number;
    moderate: number;
    high: number;
  };
  members: MemberRisk[];
}

export default function MajelisDetailPage() {
  const [data, setData] = useState<MajelisData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/majelis');
        const json = await res.json();
        if (json.majelis) {
          setData(json);
        }
      } catch (error) {
        console.error("Failed to fetch majelis data", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  if (!data) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Failed to load data</div>;
  }

  // Helper for Pie Chart Color
  const getRiskColor = (score: number) => {
    if (score < 10) return '#22c55e'; // Green
    if (score < 20) return '#eab308'; // Yellow
    return '#ef4444'; // Red
  };

  const avgRisk = parseFloat(data.majelis.averageRisk);
  const strokeColor = getRiskColor(avgRisk);

  // Pie Chart Config
  const circleSize = 60;
  const strokeWidth = 6;
  const radius = (circleSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(avgRisk, 100) / 100) * circumference;

  return (
    <div className="w-full min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="w-full h-64 bg-[#8E44AD]" />

      {/* Back button and title */}
      <div className="relative -mt-48 px-6">
        <Link href="/borrower" className="w-24 h-9 rounded-md bg-transparent text-white relative block">
          <div className="w-4 h-4 left-3 top-2 absolute overflow-hidden">
            <div className="w-1 h-2.5 left-[3.33px] top-[3.33px] absolute outline outline-[1.33px] outline-offset-[-0.67px] outline-white" />
            <div className="w-2.5 h-0 left-[3.33px] top-[8px] absolute outline outline-[1.33px] outline-offset-[-0.67px] outline-white" />
          </div>
          <div className="absolute left-11 top-2 text-white text-sm font-medium">Back</div>
        </Link>

        <div className="mt-4">
          <h1 className="text-3xl font-bold text-white">{data.majelis.name}</h1>
          <div className="text-base text-white/90">{data.majelis.id} • Majelis Kamu</div>
        </div>
      </div>

      {/* Content area */}
      <div className="px-6 mt-6 space-y-6">
        {/* Top stats */}
        <div className="space-y-4">

          {/* Rata-rata Persentase Majelis (Pie Chart) */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div className="relative" style={{ width: circleSize, height: circleSize }}>
                <svg width={circleSize} height={circleSize} className="transform -rotate-90 origin-center">
                  <circle
                    stroke="#e5e7eb"
                    fill="transparent"
                    strokeWidth={strokeWidth}
                    r={radius}
                    cx={circleSize / 2}
                    cy={circleSize / 2}
                  />
                  <circle
                    stroke={strokeColor}
                    fill="transparent"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    r={radius}
                    cx={circleSize / 2}
                    cy={circleSize / 2}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-700">{avgRisk.toFixed(0)}%</span>
                </div>
              </div>
              <div>
                <div className="text-gray-600 text-lg font-semibold">Rata-rata Persentase Majelis</div>
                <div className="text-slate-700 text-base font-bold" style={{ color: strokeColor }}>{data.majelis.averageRisk}%</div>
                {/* Removed "Membaik/Memburuk" as requested */}
              </div>
            </div>
          </div>

          {/* Posisimu */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#8E44AD]/10 rounded-full flex justify-center items-center">
                <span className="text-[#8E44AD] font-bold">#</span>
              </div>
              <div>
                <div className="text-gray-600 text-lg font-semibold">Posisimu</div>
                <div className="text-slate-700 text-base">
                  <span className="font-bold text-[#8E44AD]">#{data.userPosition.rank}</span> of {data.userPosition.total}
                </div>
                <div className="text-gray-500 text-sm">Diurutkan berdasarkan risiko terendah</div>
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
              <div className="text-green-600 font-bold">{data.performance.low} members</div>
            </div>
            <div className="bg-yellow-50 rounded-2xl px-3 py-3 flex justify-between">
              <div className="text-gray-700">Moderate (10-20%)</div>
              <div className="text-yellow-600 font-bold">{data.performance.moderate} members</div>
            </div>
            <div className="bg-red-50 rounded-2xl px-3 py-3 flex justify-between">
              <div className="text-gray-700">High Risk (&gt;20%)</div>
              <div className="text-red-600 font-bold">{data.performance.high} member</div>
            </div>
          </div>
        </div>

        {/* Members list table - Replaced with Component */}
        <MembersRiskList members={data.members} />

      </div>
    </div>
  );
}
