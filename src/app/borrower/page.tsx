"use client";

import { useState, useEffect } from 'react';

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
