"use client";

import { useState, useEffect } from 'react';

import BorrowerHeader from "@/Components/cashflow/BorrowerHeader";
import RiskScoreCard from "@/Components/cashflow/RiskScoreCard";
import GroupInfoCard from "@/Components/cashflow/GroupInfoCard";
import MembersRiskList from "@/Components/cashflow/MembersRiskList";
import InputCallToAction from "@/Components/cashflow/InputCallToAction";
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
      <div className="w-full h-72 bg-[#8E44AD]" />

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
          <GroupInfoCard
            majelisName={data?.majelis?.name}
            memberCount={data?.majelis?.memberCount}
            avgRisk={data?.majelis?.avgRisk}
            trend={data?.majelis?.trend}
          />
          <MembersRiskList
            members={data?.members}
          />
          <InputCallToAction />
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}
