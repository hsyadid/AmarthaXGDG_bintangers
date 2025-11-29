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
            console.log(`No majelis found for customer ${customerNumber}`);
            // Return empty state structure
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
        const memberIds = currentMajelis.customer_number; // This is the array of member IDs

        interface MemberData {
            id: string;
            name: string;
            riskScore: number;
            riskChange: number;
            riskLevel: string;
        }

        // 2. Fetch Member Details and Risk with Trend
        const dummyNames = [
            "Siti Rahayu", "Budi Santoso", "Rina Wulan", "Dewi Sartika",
            "Agus Pratama", "Sri Wahyuni", "Eko Saputra", "Nurul Hidayah",
            "Indah Permata", "Rizky Ramadhan"
        ];

        const membersData: MemberData[] = await Promise.all(memberIds.map(async (id: string, index: number) => {
            // Use dummy name based on index
            const customerName = dummyNames[index % dummyNames.length];

            // Fetch Current Risk
            const riskRes = await getRiskCustomerByCustomerAndDate(id, today);
            const riskRaw = riskRes.success && riskRes.data ? riskRes.data.risk : 0;
            const riskScore = riskRaw * 100;

            // Fetch Previous Risk (1 week ago) for Risk Change
            let prevRiskRaw = 0;
            // Calculate date 7 days before the *effective* date of the current risk record
            if (riskRes.success && riskRes.data) {
                const effectiveDate = new Date(riskRes.data.date);
                const prevDate = new Date(effectiveDate);
                prevDate.setDate(prevDate.getDate() - 7);

                const prevRiskRes = await getRiskCustomerByCustomerAndDate(id, prevDate);
                prevRiskRaw = prevRiskRes.success && prevRiskRes.data ? prevRiskRes.data.risk : 0;
            }

            const prevRiskScore = prevRiskRaw * 100;
            const riskChange = parseFloat((riskScore - prevRiskScore).toFixed(1));

            return {
                id: id,
                name: customerName,
                riskScore: riskScore,
                riskChange: riskChange,
                riskLevel: riskRaw < 0.1 ? 'Low' : riskRaw < 0.2 ? 'Moderate' : 'High'
            };
        }));

        // Sort members by risk score (lowest risk first)
        membersData.sort((a, b) => a.riskScore - b.riskScore);

        // 3. Calculate Stats
        const lowRiskCount = membersData.filter(m => m.riskLevel === 'Low').length;
        const modRiskCount = membersData.filter(m => m.riskLevel === 'Moderate').length;
        const highRiskCount = membersData.filter(m => m.riskLevel === 'High').length;

        // 4. Determine Current User Position
        const currentUserIndex = membersData.findIndex(m => m.id === customerNumber);
        const currentUser = currentUserIndex !== -1 ? membersData[currentUserIndex] : null;

        // 5. Calculate Majelis Trend
        let majelisTrend = 'stable';
        const oneWeekAgo = new Date(currentMajelis.date);
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const prevMajelisRes = await getRiskMajelisByCustomerAndDate(customerNumber, oneWeekAgo);

        if (prevMajelisRes.success && prevMajelisRes.data) {
            const diff = currentMajelis.risk - prevMajelisRes.data.risk;
            if (Math.abs(diff) >= 0.01) { // 1% threshold
                majelisTrend = diff > 0 ? 'up' : 'down';
            }
        }

        return NextResponse.json({
            majelis: {
                name: "Majelis Sejahtera",
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
            members: membersData.map(m => ({
                name: m.name,
                risk: parseFloat(m.riskScore.toFixed(1)),
                riskChange: m.riskChange
            }))
        });

    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
