"use client";

import BorrowerHeader from "@/Components/cashflow/BorrowerHeader";
import RiskScoreCard from "@/Components/cashflow/RiskScoreCard";
import GroupInfoCard from "@/Components/cashflow/GroupInfoCard";
import MembersRiskList from "@/Components/cashflow/MembersRiskList";
import CashflowSummaryList from "@/Components/cashflow/CashflowSummaryList";
import InputCallToAction from "@/Components/cashflow/InputCallToAction";
import BottomNavigation from "@/Components/cashflow/BottomNavigation";

export default function BorrowerPage() {
  return (
    <div className="w-full min-h-screen bg-gray-50 pb-24">
      {/* Header Background */}
      <div className="w-full h-72 bg-[#8E44AD]" />

      {/* Main Content */}
      <div className="relative -mt-56">
        <BorrowerHeader />

        {/* Content Cards */}
        <div className="px-6 space-y-7">
          <RiskScoreCard />
          <GroupInfoCard />
          <MembersRiskList />
          <CashflowSummaryList />
          <InputCallToAction />
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}
