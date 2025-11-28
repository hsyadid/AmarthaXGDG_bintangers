import React from 'react';

interface MemberRisk {
    name: string;
    risk: number;
    riskChange: number;
}

interface MembersRiskListProps {
    members?: MemberRisk[];
}

export default function MembersRiskList({ members = [] }: MembersRiskListProps) {
    // Default dummy data if no members provided
    const displayMembers = members.length > 0 ? members : [
        { name: "Siti Rahayu", risk: 7.2, riskChange: -1.3 },
        { name: "Ani Susanti", risk: 28.3, riskChange: 3.2 },
        { name: "Rina Wulan", risk: 5.1, riskChange: 0 },
        { name: "Putri Yani", risk: 11.2, riskChange: -2.3 },
    ];

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
            <div className="mb-4">
                <h2 className="text-xl font-semibold text-[#8E44AD]">Persentase Anggota Majelis</h2>
                <p className="text-gray-600 text-sm mt-1">Transparansi risiko pembayaran antar anggota</p>
            </div>

            {/* Members List */}
            <div className="space-y-3">
                {displayMembers.map((member, index) => {
                    const isImprovement = member.riskChange < 0;
                    const isWorsening = member.riskChange > 0;
                    const changeColor = isImprovement ? "text-green-500" : isWorsening ? "text-red-500" : "text-gray-400";
                    const changeText = isImprovement
                        ? `${member.riskChange.toFixed(1)}%`
                        : isWorsening
                            ? `+${member.riskChange.toFixed(1)}%`
                            : "~";

                    const riskColorBg = member.risk < 10 ? "bg-green-50" : member.risk < 20 ? "bg-yellow-50" : "bg-red-50";
                    const riskColorText = member.risk < 10 ? "text-green-600" : member.risk < 20 ? "text-yellow-600" : "text-red-600";

                    return (
                        <div key={index} className="bg-gray-50 rounded-2xl border border-gray-200 p-4 flex justify-between items-center">
                            <div>
                                <p className="text-slate-700 font-normal text-base">{member.name}</p>
                                {member.riskChange !== 0 && (
                                    <p className={`${changeColor} text-xs mt-1`}>{changeText}</p>
                                )}
                                {member.riskChange === 0 && (
                                    <div className={`${riskColorBg} rounded-full px-3 py-1 w-fit mt-1`}>
                                        <span className={`${riskColorText} text-xs`}>Risk: {member.risk.toFixed(1)}%</span>
                                    </div>
                                )}
                            </div>
                            {member.riskChange !== 0 ? (
                                <div className={`${riskColorBg} rounded-full px-3 py-1 whitespace-nowrap`}>
                                    <span className={`${riskColorText} text-xs`}>Risk: {member.risk.toFixed(1)}%</span>
                                </div>
                            ) : (
                                <span className="text-gray-400 text-xs">~</span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
