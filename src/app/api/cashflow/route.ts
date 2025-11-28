import { NextRequest, NextResponse } from "next/server";
import { createCashFlow, createCashFlowTotal, CashFlowType } from "@/actions/cashflow";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { mode, items, total } = body;
        const CUSTOMER_NUMBER = process.env.CUSTOMER_NUMBER;

        if (!mode || (mode !== "list" && mode !== "total")) {
            return NextResponse.json(
                { error: "Invalid or missing mode. Must be 'list' or 'total'." },
                { status: 400 }
            );
        }

        if (mode === "list") {
            if (!items || !Array.isArray(items)) {
                return NextResponse.json(
                    { error: "Invalid or missing items for list mode." },
                    { status: 400 }
                );
            }

            const results = [];
            for (const item of items) {
                // Map lowercase tipe to uppercase CashFlowType
                const type: CashFlowType = item.tipe === "revenue" ? "REVENUE" : "EXPENSE";

                const result = await createCashFlow({
                    type,
                    amount: item.amount,
                    description: item.desc || "",
                    customer_number: CUSTOMER_NUMBER,
                    date: new Date()
                });
                results.push(result);
            }

            // Check if any failed? For now, we return success if processed.
            // Ideally we might want to return partial success or all results.
            return NextResponse.json({ success: true, results });

        } else if (mode === "total") {
            if (!total || typeof total !== "object") {
                return NextResponse.json(
                    { error: "Invalid or missing total object for total mode." },
                    { status: 400 }
                );
            }

            const type: CashFlowType = total.tipe === "revenue" ? "REVENUE" : "EXPENSE";

            const result = await createCashFlowTotal({
                type,
                amount: total.amount,
                customer_number: CUSTOMER_NUMBER,
                date: new Date()
            });

            return NextResponse.json(result);
        }

    } catch (error) {
        console.error("Error in cashflow route:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
