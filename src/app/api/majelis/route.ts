import { NextResponse } from 'next/server';
import { getRiskMajelisByCustomerAndDate, getRiskCustomerByCustomerAndDate } from '@/actions/risk';
import { getCustomerByCustomerNumber } from '@/actions/customer';

export function getWIBDate(): Date {
    const now = new Date();
    const sevenHoursInMillis = 7 * 60 * 60 * 1000;
    const fakeWIB = new Date(now.getTime() + sevenHoursInMillis);
    fakeWIB.setHours(0, 0, 0, 0);
    return fakeWIB;
}

export async function GET() {
    try {
        const customerNumber = process.env.CUSTOMER_NUMBER;

        if (!customerNumber) {
            console.error("CUSTOMER_NUMBER is not defined in environment variables");
            return NextResponse.json({ error: "Configuration Error" }, { status: 500 });
        }

        const today = getWIBDate();

        // 1. Get Majelis Data for the specific customer
        const majelisRes = await getRiskMajelisByCustomerAndDate(customerNumber, today);

        if (!majelisRes.success || !majelisRes.data) {
            // Fallback or Empty State if user has no majelis data
            // For now, returning a "Not Found" or empty structure might be appropriate,
            // but to keep the UI from breaking, we might want to return a safe empty state
            // or the dummy data if that's the desired fallback behavior.
            // Given the prompt implies connecting real data, let's return a clear error or empty state
            // so the frontend knows what's up.
            // However, to be safe and follow the pattern of "providing all necessary data",
            // let's return a structure with empty values if not found, or maybe the dummy data
            // if that was the previous behavior for "no data".
            // The previous code returned dummy data if `getMajelisRiskAnalytics` failed.
            // Let's stick to returning a valid structure but with empty/default values if not found,
            // OR return 404 if that's better.
            // Let's return the dummy data as a fallback for now to ensure the UI renders something,
            // but log the issue.
            console.log(`No majelis found for customer ${customerNumber}`);
            return NextResponse.json({
                majelis: {
                    name: "Belum Ada Majelis",
                    id: "-",
                    averageRisk: "0",
                    trend: "stable"
                },
                userPosition: {
                    rank: 0,
                    total: 0,
                    riskScore: "0"
                },
                performance: {
                    low: 0,
                    moderate: 0,
                    high: 0
                },
                members: []
            });
        }

        const currentMajelis = majelisRes.data;
        const memberIds = currentMajelis.customer_number;

        // 2. Fetch Member Details and Risk with Trend
        const membersData = await Promise.all(memberIds.map(async (id: string) => {
            const customer = await getCustomerByCustomerNumber(id);

            // Current Risk
            const riskRes = await getRiskCustomerByCustomerAndDate(id, today);
            const riskRaw = riskRes.success && riskRes.data ? riskRes.data.risk : 0;
            const riskScore = riskRaw * 100;

            // Previous Risk (1 week ago)
            let prevRiskRaw = 0;
            if (riskRes.success && riskRes.data) {
                const effectiveDate = new Date(riskRes.data.date);
                const prevDate = new Date(effectiveDate);
                prevDate.setDate(prevDate.getDate() - 7);

                const prevRiskRes = await getRiskCustomerByCustomerAndDate(id, prevDate);
                prevRiskRaw = prevRiskRes.success && prevRiskRes.data ? prevRiskRes.data.risk : 0;
            }
            const prevRiskScore = prevRiskRaw * 100;
            const riskChange = riskScore - prevRiskScore;

            return {
                id: id,
                name: customer.success && customer.data ? customer.data.purpose : `Anggota ${id.substring(0, 4)}`, // Fallback name
                role: "Member",
                riskScore: riskScore,
                riskChange: riskChange,
                riskLevel: riskRaw < 0.1 ? 'Low' : riskRaw < 0.2 ? 'Moderate' : 'High'
            };
        }));

        // Sort by risk (lowest risk first)
        membersData.sort((a: { riskScore: number; }, b: { riskScore: number; }) => a.riskScore - b.riskScore);

        // 3. Calculate Stats
        const lowRiskCount = membersData.filter((m: { riskLevel: string; }) => m.riskLevel === 'Low').length;
        const modRiskCount = membersData.filter((m: { riskLevel: string; }) => m.riskLevel === 'Moderate').length;
        const highRiskCount = membersData.filter((m: { riskLevel: string; }) => m.riskLevel === 'High').length;

        // 4. Determine Current User Position
        const currentUserIndex = membersData.findIndex((m: { id: string; }) => m.id === customerNumber);
        const currentUser = currentUserIndex !== -1 ? membersData[currentUserIndex] : null;

        // 5. Calculate Majelis Trend
        // We need previous majelis data to calculate trend
        let majelisTrend = 'stable';
        const oneWeekAgo = new Date(currentMajelis.date);
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        // We can't easily get the *exact* previous majelis record without a direct query by ID and date,
        // but `getRiskMajelisByCustomerAndDate` logic finds the "latest Saturday".
        // Let's try to find the record for 1 week ago using the same customer number.
        const prevMajelisRes = await getRiskMajelisByCustomerAndDate(customerNumber, oneWeekAgo);

        if (prevMajelisRes.success && prevMajelisRes.data) {
            const diff = currentMajelis.risk - prevMajelisRes.data.risk;
            if (Math.abs(diff) >= 0.01) {
                majelisTrend = diff > 0 ? 'up' : 'down';
            }
        }

        return NextResponse.json({
            majelis: {
                name: "Majelis Sejahtera", // This might need to be dynamic if we have Majelis names stored somewhere
                id: currentMajelis.id_majelis,
                averageRisk: (currentMajelis.risk * 100).toFixed(1),
                trend: majelisTrend
            },
            userPosition: {
                rank: currentUserIndex !== -1 ? currentUserIndex + 1 : 0,
                total: membersData.length,
                riskScore: currentUser ? currentUser.riskScore.toFixed(1) : "0"
            },
            performance: {
                low: lowRiskCount,
                moderate: modRiskCount,
                high: highRiskCount
            },
            members: membersData.map((m: { name: any; riskScore: any; riskChange: any; }) => ({
                name: m.name,
                risk: m.riskScore,
                riskChange: m.riskChange
            }))
        });

    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

