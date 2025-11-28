import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCustomerByCustomerNumber } from '@/actions/customer';
import { getRiskCustomerByCustomerAndDate } from '@/actions/risk';

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

        // 2. Fetch Customer Risk (Today & Last Week)
        const today = new Date();
        const lastWeek = new Date(today);
        lastWeek.setDate(today.getDate() - 7);

        // Helper to get risk or default
        const getRisk = async (date: Date) => {
            const res = await getRiskCustomerByCustomerAndDate(customerNumber, date);
            return res.success && res.data ? res.data.risk : null;
        };

        const currentRisk = await getRisk(today) ?? 0; // Default to 0 if not found
        const previousRisk = await getRisk(lastWeek) ?? 0;
        const riskChange = currentRisk - previousRisk;

        // 3. Find Majelis
        // We need to find a risk_majelis record where customer_numbers array contains our customerNumber
        // Since we don't have a direct method, we'll use prisma directly.
        // Assuming risk_majelis table exists as per risk.ts
        const majelisRecord = await prisma.risk_majelis.findFirst({
            where: {
                customer_number: { // Changed to customer_number (singular) to match schema/risk.ts
                    has: customerNumber
                }
            },
            orderBy: {
                date: 'desc'
            }
        });

        let majelisData = null;
        let membersData: any[] = [];

        if (majelisRecord) {
            // Calculate Majelis Stats
            // Average risk of the majelis for the same date
            // We can use the risk field from the record which seems to be the majelis risk

            // Fetch members details
            const memberNumbers = majelisRecord.customer_number; // Changed to customer_number (singular)

            // Fetch names and risks for all members
            // We'll do this in parallel
            membersData = await Promise.all(memberNumbers.map(async (num: string) => {
                const cRes = await getCustomerByCustomerNumber(num);
                const rRes = await getRiskCustomerByCustomerAndDate(num, today);
                const prevRRes = await getRiskCustomerByCustomerAndDate(num, lastWeek);

                const cRisk = rRes.success && rRes.data ? rRes.data.risk : 0;
                const cPrevRisk = prevRRes.success && prevRRes.data ? prevRRes.data.risk : 0;

                return {
                    // Checking schema again: Customer model has no 'name' field. 
                    // It has: customer_number, date_of_birth, marital_status, religion, purpose, preference.
                    // The UI shows names like "Siti Rahayu". 
                    // The user said "jika data yang perlu ditampilkan di frontendnya tidak tersedia dari database, maka gunakna dummy saja seperit nama, dsb"
                    // So I will generate a dummy name based on the customer number or just use a placeholder.
                    name: `Anggota ${num.substring(0, 4)}`,
                    risk: cRisk,
                    riskChange: cRisk - cPrevRisk
                };
            }));

            majelisData = {
                name: "Majelis Sejahtera", // Dummy name as per instructions if not available
                memberCount: memberNumbers.length,
                avgRisk: majelisRecord.risk, // Assuming this is the pre-calculated avg risk
                trend: "Membaik" // Logic to calculate trend could be added here
            };
        } else {
            // Dummy data if no majelis found, to avoid breaking UI
            majelisData = {
                name: "Majelis Belum Terdaftar",
                memberCount: 0,
                avgRisk: 0,
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
                level: currentRisk < 5 ? "Low" : currentRisk < 20 ? "Moderate" : "High",
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
