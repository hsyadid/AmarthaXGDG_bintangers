import React from "react";
import Link from "next/link";
import {
  getHighRiskMajelisCount,
  getHighRiskBorrowersCount,
  getMajelisRiskAnalytics,
  getBorrowerRiskAnalytics
} from "@/actions/risk";
import { getRiskScoreBgColor, getRiskScoreTextColor } from "@/lib/risk-utils";

export default async function RiskAnalyticsPage() {
  // Fetch data from database
  const highRiskMajelisData = await getHighRiskMajelisCount();
  const highRiskBorrowersData = await getHighRiskBorrowersCount();
  const majelisAnalyticsData = await getMajelisRiskAnalytics();
  const borrowerAnalyticsData = await getBorrowerRiskAnalytics();

  const highRiskMajelisCount = highRiskMajelisData.success ? highRiskMajelisData.highRiskCount : 0;
  const totalMajelisCount = highRiskMajelisData.success ? highRiskMajelisData.totalCount : 0;
  const highRiskBorrowersCount = highRiskBorrowersData.success ? highRiskBorrowersData.highRiskCount : 0;
  const majelisList = majelisAnalyticsData.success ? majelisAnalyticsData.data : [];
  const borrowersList = borrowerAnalyticsData.success ? borrowerAnalyticsData.data : [];

  const getTrendIcon = (trend: string) => {
    if (trend === "up")
      return (
        <svg
          className="w-4 h-4 text-green-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
          />
        </svg>
      );
    if (trend === "down")
      return (
        <svg
          className="w-4 h-4 text-red-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v7"
          />
        </svg>
      );
    return (
      <svg
        className="w-4 h-4 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14" />
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content (sidebar removed) */}
      <div className="w-full overflow-auto">
        <div className="p-8">
          {/* Back Button */}
          <div className="mb-6">
            <Link href="/" className="inline-flex items-center gap-2 text-slate-700 hover:text-[#8E44AD] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              <span className="font-medium">Back</span>
            </Link>
          </div>

          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-slate-700 mb-2">
              Risk Analytics Overview
            </h1>
            <p className="text-base text-gray-600">
              Monitor and manage borrower risk across all majelis
            </p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 gap-6 mb-12">
            {/* High-Risk Majelis Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-cyan-600/10 rounded-2xl flex items-center justify-center mb-8">
                <svg
                  className="w-6 h-6 text-cyan-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#8E44AD] mb-3">
                High-Risk Majelis
              </h3>
              <p className="text-3xl font-bold text-slate-700 mb-1">{highRiskMajelisCount}</p>
              <p className="text-sm text-gray-500">Out of {totalMajelisCount} total</p>
            </div>

            {/* High-Risk Borrowers Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-cyan-600/10 rounded-2xl flex items-center justify-center mb-8">
                <svg
                  className="w-6 h-6 text-cyan-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 8.646 4 4 0 010-8.646M9 9H3v10a6 6 0 006 6h6a6 6 0 006-6V9h-6a4 4 0 01-4-4z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#8E44AD] mb-3">
                High-Risk Borrowers
              </h3>
              <p className="text-3xl font-bold text-slate-700 mb-1">{highRiskBorrowersCount}</p>
              <p className="text-sm text-gray-500">Requires attention</p>
            </div>
          </div>

          {/* Majelis Risk Overview Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-8 overflow-hidden">
            <div className="px-6 pt-6 pb-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-[#8E44AD] mb-1">
                Majelis Risk Overview
              </h2>
              <p className="text-sm text-gray-600">Group-level risk assessment</p>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-bold text-gray-600">
                      Majelis
                    </th>
                    <th className="text-left px-6 py-3 text-sm font-bold text-gray-600">
                      Members
                    </th>
                    <th className="text-left px-6 py-3 text-sm font-bold text-gray-600">
                      Risk Score
                    </th>
                    <th className="text-left px-6 py-3 text-sm font-bold text-gray-600">
                      Trend
                    </th>
                    <th className="text-left px-6 py-3 text-sm font-bold text-gray-600">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {majelisList.map((majelis, index) => (
                    <tr key={majelis.id_majelis} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-normal text-base text-slate-700">
                          {majelis.id_majelis}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-base text-slate-700">
                        {majelis.members}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 max-w-xs">
                            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                              <div
                                className="bg-cyan-600 h-full"
                                style={{
                                  width: `${Math.min(majelis.riskScore * 100, 100)}%`,
                                }}
                              />
                            </div>
                          </div>
                          <div
                            className={`px-3 py-1 rounded-full text-sm font-normal ${getRiskScoreBgColor(majelis.riskScore * 100)}`}
                          >
                            <span className={getRiskScoreTextColor(majelis.riskScore * 100)}>
                              {(majelis.riskScore * 100)}%
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-left">
                          {getTrendIcon(majelis.trend)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button className="px-4 py-2 bg-gray-100 text-gray-900 rounded-md text-sm font-medium hover:bg-gray-200 transition">
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-4 py-4 border-t border-gray-200 flex justify-between items-center">
              <p className="text-sm text-gray-600">Showing {majelisList.length} of {totalMajelisCount} majelis</p>
              <div className="flex gap-2">
                <button className="px-3 py-2 bg-gray-100 text-gray-900 rounded-md text-sm font-medium hover:bg-gray-200 transition">
                  Previous
                </button>
                <button className="px-3 py-2 bg-gray-100 text-gray-900 rounded-md text-sm font-medium hover:bg-gray-200 transition">
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* Borrower-Level Risk Assessment Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 pt-6 pb-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-[#8E44AD] mb-1">
                Borrower-Level Risk Assessment
              </h2>
              <p className="text-sm text-gray-600">Individual borrower monitoring</p>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-bold text-gray-600">
                      Borrower Name
                    </th>
                    <th className="text-left px-6 py-3 text-sm font-bold text-gray-600">
                      Business Type
                    </th>
                    <th className="text-left px-6 py-3 text-sm font-bold text-gray-600">
                      Risk Score
                    </th>
                    <th className="text-left px-6 py-3 text-sm font-bold text-gray-600">
                      Trend
                    </th>
                    <th className="text-left px-6 py-3 text-sm font-bold text-gray-600">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {borrowersList.map((borrower) => (
                    <tr key={borrower.customer_number} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4 text-base text-slate-700">
                        {borrower.customer_number}
                      </td>
                      <td className="px-6 py-4 text-base text-gray-600">
                        {borrower.business}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 max-w-xs">
                            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                              <div
                                className="bg-cyan-600 h-full"
                                style={{
                                  width: `${Math.min(borrower.riskScore * 100, 100)}%`,
                                }}
                              />
                            </div>
                          </div>
                          <div
                            className={`px-3 py-1 rounded-full text-sm font-normal ${getRiskScoreBgColor(borrower.riskScore * 100)}`}
                          >
                            <span className={getRiskScoreTextColor(borrower.riskScore * 100)}>
                              {(borrower.riskScore * 100).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-left">
                          {getTrendIcon(borrower.trend)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button className="px-4 py-2 bg-gray-100 text-gray-900 rounded-md text-sm font-medium hover:bg-gray-200 transition">
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-4 py-4 border-t border-gray-200 flex justify-between items-center">
              <p className="text-sm text-gray-600">Showing {borrowersList.length} borrowers</p>
              <div className="flex gap-2">
                <button className="px-3 py-2 bg-gray-100 text-gray-900 rounded-md text-sm font-medium hover:bg-gray-200 transition">
                  Previous
                </button>
                <button className="px-3 py-2 bg-gray-100 text-gray-900 rounded-md text-sm font-medium hover:bg-gray-200 transition">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
