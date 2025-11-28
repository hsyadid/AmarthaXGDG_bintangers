import { NextResponse } from 'next/server';
import PipelineSingleton from '@/lib/pipeline';
import { WaveFile } from 'wavefile';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
        }

        console.log(`Processing file: ${file.name}, size: ${file.size}, type: ${file.type}`);

        // Convert Blob/File to Buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Decode WAV
        let audioData: Float32Array;
        try {
            const wav = new WaveFile(buffer);
            console.log('Original WAV info:', wav.container, wav.chunkSize, wav.fmt);

            wav.toBitDepth('32f');
            wav.toSampleRate(16000);

            let samples = wav.getSamples();
            if (Array.isArray(samples)) {
                // If stereo, take the first channel
                console.log('Stereo/Multi-channel detected, using first channel');
                audioData = samples[0] as unknown as Float32Array;
            } else {
                audioData = samples as unknown as Float32Array;
            }

            // DEBUG: Check audio statistics
            let maxVal = 0;
            let sum = 0;
            for (let i = 0; i < audioData.length; i++) {
                const val = Math.abs(audioData[i]);
                if (val > maxVal) maxVal = val;
                sum += val;
            }
            const avg = sum / audioData.length;
            console.log(`Audio Stats - Length: ${audioData.length}, Max: ${maxVal}, Avg: ${avg}`);

            if (maxVal === 0) {
                console.warn('WARNING: Audio appears to be completely silent.');
            }

        } catch (decodeError) {
            console.error('WAV decoding error:', decodeError);
            return NextResponse.json(
                { error: 'Failed to decode audio. Please ensure it is a valid WAV file.' },
                { status: 400 }
            );
        }

        // Get pipeline instance
        console.log('Getting pipeline instance...');
        const transcriber = await PipelineSingleton.getInstance();

        // Transcribe
        console.log('Running transcription...');
        // Force English for testing, or let it auto-detect. 
        // Adding chunk_length_s and stride_length_s can help with silence.
        // const result = await transcriber(audioData, {
        //     chunk_length_s: 30,
        //     stride_length_s: 5,
        //     language: 'id', // Let's try forcing English first to rule out detection issues
        //     task: 'transcribe',
        //     temperature: 0,    
        //     return_timestamps: true
        // });
        const result = await transcriber(audioData, {
            task: "transcribe",
            language: "id",
            return_timestamps: false
        });
        console.log('Transcription result:', result);

        const text = Array.isArray(result) ? result.map(r => r.text).join(' ') : result.text;

        return NextResponse.json({ text: text });
    } catch (error) {
        console.error('Transcription API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
