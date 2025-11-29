import { NextResponse } from 'next/server';
import PipelineSingleton from '@/lib/pipeline';
import { WaveFile } from 'wavefile';
import { analyzeVoiceText } from '@/lib/gemini';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const category = formData.get('category') as string;

        if (!file) {
            return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
        }

        if (category !== 'expense' && category !== 'revenue') {
            return NextResponse.json({ error: 'Invalid or missing category. Must be "expense" or "revenue".' }, { status: 400 });
        }

        console.log(`Processing file: ${file.name}, size: ${file.size}, type: ${file.type}, category: ${category}`);

        // Convert Blob/File to Buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Decode WAV
        let audioData: Float32Array;
        try {
            const wav = new WaveFile(buffer);
            wav.toBitDepth('32f');
            wav.toSampleRate(16000);

            let samples = wav.getSamples();
            if (Array.isArray(samples)) {
                // If stereo, take the first channel
                audioData = samples[0] as unknown as Float32Array;
            } else {
                audioData = samples as unknown as Float32Array;
            }
        } catch (decodeError) {
            console.error('WAV decoding error:', decodeError);
            return NextResponse.json(
                { error: 'Failed to decode audio. Please ensure it is a valid WAV file.' },
                { status: 400 }
            );
        }

        // Get pipeline instance
        const transcriber = await PipelineSingleton.getInstance();

        // Transcribe
        const result = await transcriber(audioData, {
            chunk_length_s: 30,
            stride_length_s: 5,
            language: 'id',
            task: 'transcribe',
            temperature: 0,
            return_timestamps: true
        });

        const text = Array.isArray(result) ? result.map(r => r.text).join(' ') : result.text;
        console.log('Transcription text:', text);

        // Analyze text with Gemini
        const analysisResult = await analyzeVoiceText(text, category as "revenue" | "expense");
        console.log("Result:", analysisResult);
        return NextResponse.json({
            text: text,
            analysis: analysisResult
        });

    } catch (error) {
        console.error('Analyze Voice API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
