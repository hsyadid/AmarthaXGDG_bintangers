"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

import BorrowerHeader from "@/Components/borrower/BorrowerHeader";
import RiskScoreCard from "@/Components/borrower/RiskScoreCard";
import GroupInfoCard from "@/Components/borrower/GroupInfoCard";
import MembersRiskList from "@/Components/majelis/MembersRiskList";
import InputCallToAction from "@/Components/borrower/InputCallToAction";
import BottomNavigation from "@/Components/cashflow/BottomNavigation";

export default function BorrowerPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/borrower');
        if (res.ok) {
          const json = await res.json();
          console.log(json);
          setData(json);
        }
      } catch (error) {
        console.error("Failed to fetch borrower data", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-[#8E44AD] font-semibold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 pb-24">
      {/* Header Background */}
      <div className="w-full h-72 bg-[#8E44AD] relative">
        {/* Back Button */}
        <div className="absolute top-6 left-6">
          <Link href="/" className="inline-flex items-center gap-2 text-white hover:text-white/80 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            <span className="font-medium">Back</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative -mt-56">
        <BorrowerHeader
          name={data?.customer?.name}
          job={data?.customer?.job}
          majelisName={data?.customer?.majelisName}
        />

        {/* Content Cards */}
        <div className="px-6 space-y-7">
          <RiskScoreCard
            riskScore={data?.riskScore?.current}
            riskLevel={data?.riskScore?.level}
            previousRisk={data?.riskScore?.previous}
            riskChange={data?.riskScore?.change}
          />
          <InputCallToAction />
          <GroupInfoCard
            majelisName={data?.majelis?.name}
            highRiskCount={data?.majelis?.highRiskCount}
            trend={data?.majelis?.trend}
          />
          {/* <MembersRiskList
            members={data?.members}
          /> */}
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}
