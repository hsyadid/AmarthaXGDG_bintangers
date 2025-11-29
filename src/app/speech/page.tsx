'use client';

import { useState, useRef } from 'react';

export default function SpeechPage() {
    const [isRecording, setIsRecording] = useState(false);
    const [transcription, setTranscription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const audioContextRef = useRef<AudioContext | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const processorRef = useRef<ScriptProcessorNode | null>(null);
    const audioInputRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const audioDataRef = useRef<Float32Array[]>([]);

    const startRecording = async () => {
        setError('');
        setTranscription('');
        audioDataRef.current = [];

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

            // Use default sample rate of the device to avoid resampling issues in browser
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            audioContextRef.current = audioContext;

            const source = audioContext.createMediaStreamSource(stream);
            audioInputRef.current = source;

            // Create a ScriptProcessorNode
            const processor = audioContext.createScriptProcessor(4096, 1, 1);
            processorRef.current = processor;

            processor.onaudioprocess = (e) => {
                const inputData = e.inputBuffer.getChannelData(0);
                const dataCopy = new Float32Array(inputData);
                audioDataRef.current.push(dataCopy);

                // DEBUG: Check if we are getting signal
                let max = 0;
                for (let i = 0; i < dataCopy.length; i++) {
                    if (Math.abs(dataCopy[i]) > max) max = Math.abs(dataCopy[i]);
                }
                if (Math.random() < 0.05) { // Log occasionally
                    console.log('Recording level:', max);
                }
            };

            source.connect(processor);

            // Connect to destination to keep process alive, but mute it to avoid feedback
            const gainNode = audioContext.createGain();
            gainNode.gain.value = 0;
            processor.connect(gainNode);
            gainNode.connect(audioContext.destination);

            setIsRecording(true);
        } catch (err) {
            console.error('Error accessing microphone:', err);
            setError('Could not access microphone. Please check permissions.');
        }
    };

    const stopRecording = async () => {
        if (!isRecording) return;

        if (processorRef.current && audioInputRef.current && streamRef.current && audioContextRef.current) {
            processorRef.current.disconnect();
            audioInputRef.current.disconnect();
            streamRef.current.getTracks().forEach(track => track.stop());
            await audioContextRef.current.close();
        }

        setIsRecording(false);
        setIsLoading(true);

        // Merge buffers
        const buffers = audioDataRef.current;
        const totalLength = buffers.reduce((acc, buf) => acc + buf.length, 0);
        const merged = new Float32Array(totalLength);
        let offset = 0;
        for (const buf of buffers) {
            merged.set(buf, offset);
            offset += buf.length;
        }

        // Encode to WAV
        // Use the actual sample rate from the AudioContext
        const actualSampleRate = audioContextRef.current?.sampleRate || 16000;
        console.log('Recording Sample Rate:', actualSampleRate);

        const wavBlob = encodeWAV(merged, actualSampleRate);

        // Send to API
        await sendAudio(wavBlob);
    };

    const sendAudio = async (blob: Blob) => {
        const formData = new FormData();
        formData.append('file', blob, 'recording.wav');

        try {
            const response = await fetch('/api/transcribe', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Transcription failed');
            }

            setTranscription(data.text);
        } catch (err: any) {
            console.error('Upload error:', err);
            setError(err.message || 'An error occurred during transcription');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg border border-gray-100">
                <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Speech to Text</h1>

                <div className="flex flex-col gap-6">
                    <div className="flex justify-center">
                        <button
                            onClick={isRecording ? stopRecording : startRecording}
                            className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${isRecording
                                    ? 'bg-red-500 hover:bg-red-600 ring-4 ring-red-200 scale-110'
                                    : 'bg-indigo-600 hover:bg-indigo-700 hover:scale-105'
                                }`}
                            title={isRecording ? "Stop Recording" : "Start Recording"}
                        >
                            {isRecording ? (
                                <div className="w-8 h-8 bg-white rounded-md animate-pulse" />
                            ) : (
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                </svg>
                            )}
                        </button>
                    </div>

                    <div className="text-center">
                        <p className={`text-sm font-medium ${isRecording ? 'text-red-500 animate-pulse' : 'text-gray-500'}`}>
                            {isRecording ? 'Recording in progress...' : 'Tap microphone to start'}
                        </p>
                    </div>

                    {isLoading && (
                        <div className="flex items-center justify-center space-x-2 text-indigo-600 bg-indigo-50 p-3 rounded-lg">
                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span className="font-medium">Processing on server...</span>
                        </div>
                    )}

                    {error && (
                        <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100 flex items-start">
                            <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {error}
                        </div>
                    )}

                    {transcription && (
                        <div className="mt-2">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Transcription</h3>
                            <div className="p-5 bg-gray-50 rounded-xl border border-gray-200 text-gray-800 leading-relaxed shadow-inner min-h-[100px]">
                                {transcription}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function encodeWAV(samples: Float32Array, sampleRate: number) {
    const buffer = new ArrayBuffer(44 + samples.length * 2);
    const view = new DataView(buffer);

    const writeString = (view: DataView, offset: number, string: string) => {
        for (let i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    };

    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + samples.length * 2, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(view, 36, 'data');
    view.setUint32(40, samples.length * 2, true);

    let offset = 44;
    for (let i = 0; i < samples.length; i++, offset += 2) {
        const s = Math.max(-1, Math.min(1, samples[i]));
        view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }

    return new Blob([view], { type: 'audio/wav' });
}
