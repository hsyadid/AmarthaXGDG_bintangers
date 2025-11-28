import React from "react";

export default function RiskAnalyticsPage() {
  const majelisList = [
    {
      id: 1,
      name: "Majelis Sejahtera",
      code: "MJS-001",
      members: 15,
      riskScore: 8.5,
      trend: "up",
      status: "good",
    },
    {
      id: 2,
      name: "Majelis Berkah",
      code: "MJB-002",
      members: 12,
      riskScore: 24.8,
      trend: "down",
      status: "bad",
    },
    {
      id: 3,
      name: "Majelis Maju Bersama",
      code: "MMB-003",
      members: 18,
      riskScore: 32.8,
      trend: "down",
      status: "bad",
    },
    {
      id: 4,
      name: "Majelis Harmoni",
      code: "MJH-004",
      members: 10,
      riskScore: 5.5,
      trend: "stable",
      status: "good",
    },
    {
      id: 5,
      name: "Majelis Bahagia",
      code: "MJB-005",
      members: 14,
      riskScore: 18.5,
      trend: "down",
      status: "warning",
    },
  ];

  const borrowersList = [
    {
      id: 1,
      name: "Ani Susanti",
      business: "Toko Sayur",
      riskScore: 8.5,
      trend: "up",
      status: "good",
    },
    {
      id: 2,
      name: "Rina Wulandari",
      business: "Katering",
      riskScore: 18.5,
      trend: "down",
      status: "warning",
    },
    {
      id: 3,
      name: "Sri Mulyani",
      business: "Salon Kecantikan",
      riskScore: 18.5,
      trend: "down",
      status: "warning",
    },
    {
      id: 4,
      name: "Putri Handayani",
      business: "Warung Makan",
      riskScore: 18.5,
      trend: "down",
      status: "warning",
    },
    {
      id: 5,
      name: "Siti Rahayu",
      business: "Warung Kelontong",
      riskScore: 8.5,
      trend: "up",
      status: "good",
    },
    {
      id: 6,
      name: "Dewi Kartika",
      business: "Penjahit",
      riskScore: 18.5,
      trend: "down",
      status: "warning",
    },
  ];

  const getRiskScoreBgColor = (score: number) => {
    if (score < 10) return "bg-green-50";
    if (score < 20) return "bg-yellow-50";
    return "bg-red-50";
  };

  const getRiskScoreTextColor = (score: number) => {
    if (score < 10) return "text-green-600";
    if (score < 20) return "text-yellow-600";
    return "text-red-600";
  };

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
              <p className="text-3xl font-bold text-slate-700 mb-1">24</p>
              <p className="text-sm text-gray-500">Out of 156 total</p>
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
              <p className="text-3xl font-bold text-slate-700 mb-1">187</p>
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
                      Avg Risk Score
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
                  {majelisList.map((majelis) => (
                    <tr key={majelis.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-normal text-base text-slate-700">
                          {majelis.name}
                        </div>
                        <div className="text-sm text-gray-500">{majelis.code}</div>
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
                                  width: `${Math.min(majelis.riskScore * 5, 100)}%`,
                                }}
                              />
                            </div>
                          </div>
                          <div
                            className={`px-3 py-1 rounded-full text-sm font-normal ${getRiskScoreBgColor(majelis.riskScore)}`}
                          >
                            <span className={getRiskScoreTextColor(majelis.riskScore)}>
                              {majelis.riskScore}%
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
              <p className="text-sm text-gray-600">Showing 5 of 156 majelis</p>
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
                    <tr key={borrower.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4 text-base text-slate-700">
                        {borrower.name}
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
                                  width: `${Math.min(borrower.riskScore * 5, 100)}%`,
                                }}
                              />
                            </div>
                          </div>
                          <div
                            className={`px-3 py-1 rounded-full text-sm font-normal ${getRiskScoreBgColor(borrower.riskScore)}`}
                          >
                            <span className={getRiskScoreTextColor(borrower.riskScore)}>
                              {borrower.riskScore}%
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
              <p className="text-sm text-gray-600">Showing 6 of 1,247 borrowers</p>
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
