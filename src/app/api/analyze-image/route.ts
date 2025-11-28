import { NextRequest, NextResponse } from "next/server";
import { analyzeImage } from "@/lib/gemini";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { base64Image } = body;

        if (!base64Image || typeof base64Image !== "string") {
            return NextResponse.json(
                { error: "Invalid or missing base64Image" },
                { status: 400 }
            );
        }


        const result = await analyzeImage(base64Image);

        console.log("Result:", result);
        return NextResponse.json({ result });
    } catch (error) {
        console.error("Error in analyze-image route:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
