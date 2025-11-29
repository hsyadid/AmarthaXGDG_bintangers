import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCustomerByCustomerNumber } from '@/actions/customer';
import { getRiskCustomerByCustomerAndDate, getRiskMajelisByCustomerAndDate } from '@/actions/risk';
import { getRiskLevel } from '@/lib/risk-utils';

export function getWIBDate(): Date {
    const now = new Date(); // Ini mengambil waktu asli (misal: UTC 20:15)

    // Kita paksa tambah 7 jam (dalam milidetik)
    // 7 jam x 60 menit x 60 detik x 1000 ms
    const sevenHoursInMillis = 7 * 60 * 60 * 1000;

    // Buat Date baru yang waktunya sudah digeser
    // Jadi: 20:15 + 7 jam = 03:15
    const fakeWIB = new Date(now.getTime() + sevenHoursInMillis);
    fakeWIB.setHours(0, 0, 0, 0);
    return fakeWIB;
}

export async function GET() {
    try {
        const customerNumber = process.env.CUSTOMER_NUMBER;

        if (!customerNumber) {
            return NextResponse.json({ error: 'Customer number not configured' }, { status: 500 });
        }

        // 1. Fetch Customer Details
        const customerRes = await getCustomerByCustomerNumber(customerNumber);
        if (!customerRes.success || !customerRes.data) {
            return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
        }
        const customer = customerRes.data;

        // 2. Fetch Customer Risk (Smart Logic)
        const today = getWIBDate();

        // getRiskCustomerByCustomerAndDate handles fallback logic internally
        const currentRiskRes = await getRiskCustomerByCustomerAndDate(customerNumber, today);
        const currentRiskRaw = currentRiskRes.success && currentRiskRes.data ? currentRiskRes.data.risk : 0;
        const currentRisk = currentRiskRaw * 100; // Convert to percentage

        // Determine previous risk based on the date of the current risk record
        let previousRiskRaw = 0;
        if (currentRiskRes.success && currentRiskRes.data) {
            const effectiveDate = new Date(currentRiskRes.data.date);
            const prevDate = new Date(effectiveDate);
            prevDate.setDate(prevDate.getDate() - 7);

            const prevRiskRes = await getRiskCustomerByCustomerAndDate(customerNumber, prevDate);
            previousRiskRaw = prevRiskRes.success && prevRiskRes.data ? prevRiskRes.data.risk : 0;
        }
        const previousRisk = previousRiskRaw * 100; // Convert to percentage

        const riskChange = currentRisk - previousRisk;

        // 3. Find Majelis (Smart Logic)
        const majelisRes = await getRiskMajelisByCustomerAndDate(customerNumber, today);

        let majelisData = null;
        let membersData: any[] = [];

        if (majelisRes.success && majelisRes.data) {
            const majelisRecord = majelisRes.data;

            // Fetch members details
            const memberNumbers = majelisRecord.customer_number; // Array of customer numbers

            // Fetch names and risks for all members
            membersData = await Promise.all(memberNumbers.map(async (num: string) => {
                // Fetch member risk with same smart logic
                const cRes = await getRiskCustomerByCustomerAndDate(num, today);
                const cRiskRaw = cRes.success && cRes.data ? cRes.data.risk : 0;
                const cRisk = cRiskRaw * 100; // Convert to percentage

                // Calculate member previous risk
                let cPrevRiskRaw = 0;
                if (cRes.success && cRes.data) {
                    const cEffectiveDate = new Date(cRes.data.date);
                    const cPrevDate = new Date(cEffectiveDate);
                    cPrevDate.setDate(cPrevDate.getDate() - 7);

                    const cPrevRes = await getRiskCustomerByCustomerAndDate(num, cPrevDate);
                    cPrevRiskRaw = cPrevRes.success && cPrevRes.data ? cPrevRes.data.risk : 0;
                }
                const cPrevRisk = cPrevRiskRaw * 100; // Convert to percentage

                return {
                    name: `Anggota ${num.substring(0, 4)}`, // Dummy name
                    risk: cRisk,
                    riskChange: cRisk - cPrevRisk
                };
            }));

            // Calculate high risk count (risk > 20%)
            const highRiskCount = membersData.filter((m: any) => m.risk > 20).length;

            majelisData = {
                name: "Majelis Sejahtera", // Dummy name
                memberCount: memberNumbers.length,
                avgRisk: majelisRecord.risk * 100, // Convert to percentage
                highRiskCount: highRiskCount, // Add highRiskCount
                trend: "Membaik"
            };
        } else {
            // Dummy data if no majelis found
            majelisData = {
                name: "Majelis Belum Terdaftar",
                memberCount: 0,
                avgRisk: 0,
                highRiskCount: 0,
                trend: "-"
            };
        }

        // Construct Response
        const responseData = {
            customer: {
                name: "Dewi Kartika", // Dummy name as requested
                job: customer.purpose || "Pedagang", // Use purpose as job or dummy
                majelisName: majelisData.name
            },
            riskScore: {
                current: currentRisk,
                level: getRiskLevel(currentRisk), // getRiskLevel handles 0-100 range correctly
                previous: previousRisk,
                change: riskChange
            },
            majelis: majelisData,
            members: membersData
        };

        return NextResponse.json(responseData);

    } catch (error) {
        console.error('Error in borrower API:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
