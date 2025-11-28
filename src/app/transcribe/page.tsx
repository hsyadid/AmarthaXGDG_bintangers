'use client';

import { useState, useRef, useEffect } from 'react';

type TransactionItem = {
    tipe: 'expense' | 'revenue';
    desc: string;
    amount: number;
};

type AnalysisResult = {
    mode: 'total' | 'list';
    total?: TransactionItem;
    items?: TransactionItem[];
};

export default function TranscribePage() {
    const [activeTab, setActiveTab] = useState<'voice-expense' | 'voice-revenue' | 'image'>('voice-expense');

    // Voice State
    const [isRecording, setIsRecording] = useState(false);
    const [voiceTranscription, setVoiceTranscription] = useState('');
    const [voiceStep, setVoiceStep] = useState<'idle' | 'recording' | 'transcribing' | 'analyzing' | 'done'>('idle');
    const [visualizerData, setVisualizerData] = useState<number[]>(new Array(5).fill(10));

    // Image State
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [imageStep, setImageStep] = useState<'idle' | 'analyzing' | 'done'>('idle');

    // Shared Result State
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [error, setError] = useState('');

    // Audio Refs
    const audioContextRef = useRef<AudioContext | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const processorRef = useRef<ScriptProcessorNode | null>(null);
    const audioInputRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const audioDataRef = useRef<Float32Array[]>([]);
    const animationFrameRef = useRef<number | null>(null);

    // --- Voice Logic ---

    const startRecording = async () => {
        setError('');
        setVoiceTranscription('');
        setAnalysisResult(null);
        setVoiceStep('recording');
        audioDataRef.current = [];

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            audioContextRef.current = audioContext;

            const source = audioContext.createMediaStreamSource(stream);
            audioInputRef.current = source;

            // Analyser for Visualizer
            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 32;
            analyserRef.current = analyser;
            source.connect(analyser);

            const processor = audioContext.createScriptProcessor(4096, 1, 1);
            processorRef.current = processor;

            processor.onaudioprocess = (e) => {
                const inputData = e.inputBuffer.getChannelData(0);
                audioDataRef.current.push(new Float32Array(inputData));
            };

            // Connect graph: Source -> Analyser -> Processor -> Gain (Mute) -> Dest
            analyser.connect(processor);

            const gainNode = audioContext.createGain();
            gainNode.gain.value = 0;
            processor.connect(gainNode);
            gainNode.connect(audioContext.destination);

            setIsRecording(true);
            visualize();
        } catch (err) {
            console.error('Error accessing microphone:', err);
            setError('Could not access microphone. Please check permissions.');
            setVoiceStep('idle');
        }
    };

    const visualize = () => {
        if (!analyserRef.current) return;

        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const update = () => {
            if (!analyserRef.current) return;
            analyserRef.current.getByteFrequencyData(dataArray);

            // Pick 5 representative bars
            const step = Math.floor(bufferLength / 5);
            const newData = [];
            for (let i = 0; i < 5; i++) {
                const val = dataArray[i * step];
                // Scale 0-255 to 10-40px height
                newData.push(10 + (val / 255) * 30);
            }
            setVisualizerData(newData);
            animationFrameRef.current = requestAnimationFrame(update);
        };
        update();
    };

    const stopRecording = async () => {
        if (!isRecording) return;

        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }
        setVisualizerData(new Array(5).fill(10)); // Reset visualizer

        if (processorRef.current && audioInputRef.current && streamRef.current && audioContextRef.current) {
            processorRef.current.disconnect();
            audioInputRef.current.disconnect();
            if (analyserRef.current) analyserRef.current.disconnect();

            streamRef.current.getTracks().forEach(track => track.stop());
            await audioContextRef.current.close();
        }

        setIsRecording(false);
        setVoiceStep('transcribing');

        const buffers = audioDataRef.current;
        const totalLength = buffers.reduce((acc, buf) => acc + buf.length, 0);
        const merged = new Float32Array(totalLength);
        let offset = 0;
        for (const buf of buffers) {
            merged.set(buf, offset);
            offset += buf.length;
        }

        const actualSampleRate = audioContextRef.current?.sampleRate || 16000;
        const wavBlob = encodeWAV(merged, actualSampleRate);

        await processAudio(wavBlob);
    };

    const processAudio = async (blob: Blob) => {
        const formData = new FormData();
        formData.append('file', blob, 'recording.wav');

        // Determine category based on active tab
        const category = activeTab === 'voice-revenue' ? 'revenue' : 'expense';
        formData.append('category', category);

        try {
            const res = await fetch('/api/analyze-voice', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Analysis failed');

            setVoiceTranscription(data.text);

            if (!data.text) {
                setError('No speech detected. Please try again.');
                setVoiceStep('idle');
                return;
            }

            setAnalysisResult(data.analysis);
            setVoiceStep('done');

        } catch (err: any) {
            console.error('Process error:', err);
            setError(err.message || 'An error occurred');
            setVoiceStep('idle');
        }
    };

    // --- Image Logic ---

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setError('');
        setAnalysisResult(null);
        setImageStep('analyzing');

        // Preview
        const reader = new FileReader();
        reader.onload = (e) => setSelectedImage(e.target?.result as string);
        reader.readAsDataURL(file);

        // Convert to Base64 for API
        const base64 = await new Promise<string>((resolve, reject) => {
            const r = new FileReader();
            r.readAsDataURL(file);
            r.onload = () => resolve(r.result as string);
            r.onerror = reject;
        });

        try {
            const res = await fetch('/api/analyze-image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ base64Image: base64 }),
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Image analysis failed');

            setAnalysisResult(data.result);
            setImageStep('done');
        } catch (err: any) {
            console.error('Image error:', err);
            setError(err.message || 'Failed to analyze image');
            setImageStep('idle');
        }
    };

    // --- Render Helpers ---

    const renderResultCard = (item: TransactionItem, index?: number) => (
        <div key={index} className={`p-4 rounded-lg border-l-4 shadow-sm mb-3 ${item.tipe?.toLowerCase() === 'expense' ? 'bg-red-50 border-red-500' : 'bg-green-50 border-green-500'
            }`}>
            <div className="flex justify-between items-start">
                <div>
                    <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-full ${item.tipe?.toLowerCase() === 'expense' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                        }`}>
                        {item.tipe}
                    </span>
                    <h3 className="font-semibold text-gray-800 mt-2 text-lg">{item.desc || 'No description'}</h3>
                </div>
                <div className={`text-xl font-bold ${item.tipe?.toLowerCase() === 'expense' ? 'text-red-600' : 'text-green-600'
                    }`}>
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.amount)}
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-6 font-sans">
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">

                {/* Header */}
                <div className="bg-indigo-600 p-6 text-white text-center">
                    <h1 className="text-2xl font-bold">AI Transaction Input</h1>
                    <p className="text-indigo-100 text-sm mt-1">Record voice or upload receipt</p>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('voice-expense')}
                        className={`flex-1 py-4 text-sm font-medium transition-colors ${activeTab === 'voice-expense' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Expense Voice
                    </button>
                    <button
                        onClick={() => setActiveTab('voice-revenue')}
                        className={`flex-1 py-4 text-sm font-medium transition-colors ${activeTab === 'voice-revenue' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Revenue Voice
                    </button>
                    <button
                        onClick={() => setActiveTab('image')}
                        className={`flex-1 py-4 text-sm font-medium transition-colors ${activeTab === 'image' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Scan Receipt
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100 flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            {error}
                        </div>
                    )}

                    {(activeTab === 'voice-expense' || activeTab === 'voice-revenue') && (
                        <div className="flex flex-col items-center">
                            <div className="relative">
                                <button
                                    onClick={isRecording ? stopRecording : startRecording}
                                    disabled={voiceStep === 'transcribing' || voiceStep === 'analyzing'}
                                    className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg mb-6 z-10 relative ${isRecording
                                        ? 'bg-red-500 hover:bg-red-600 ring-4 ring-red-200'
                                        : 'bg-indigo-600 hover:bg-indigo-700 hover:scale-105'
                                        } ${voiceStep === 'transcribing' || voiceStep === 'analyzing' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {isRecording ? (
                                        <div className="w-8 h-8 bg-white rounded-md" />
                                    ) : (
                                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                        </svg>
                                    )}
                                </button>

                                {/* Visualizer Rings */}
                                {isRecording && (
                                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-4 border-indigo-100 animate-ping opacity-75"></div>
                                )}
                            </div>

                            {/* Audio Visualizer Bars */}
                            {isRecording && (
                                <div className="flex items-end justify-center space-x-1 h-12 mb-4">
                                    {visualizerData.map((height, i) => (
                                        <div
                                            key={i}
                                            className="w-2 bg-indigo-500 rounded-t-sm transition-all duration-75"
                                            style={{ height: `${height}px` }}
                                        />
                                    ))}
                                </div>
                            )}

                            <p className="text-gray-500 font-medium mb-6">
                                {isRecording ? (activeTab === 'voice-expense' ? 'Listening for Expense...' : 'Listening for Revenue...') :
                                    voiceStep === 'transcribing' ? 'Processing audio...' :
                                        voiceStep === 'analyzing' ? 'Analyzing with AI...' :
                                            (activeTab === 'voice-expense' ? 'Tap to record expense' : 'Tap to record revenue')}
                            </p>

                            {voiceTranscription && (
                                <div className="w-full bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Raw Transcript</h4>
                                    <p className="text-gray-800 italic">"{voiceTranscription}"</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'image' && (
                        <div className="flex flex-col items-center">
                            <div className="w-full border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                {selectedImage ? (
                                    <img src={selectedImage} alt="Preview" className="max-h-64 mx-auto rounded-lg shadow-md" />
                                ) : (
                                    <div className="text-gray-400">
                                        <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        <p className="font-medium">Click or drop image here</p>
                                    </div>
                                )}
                            </div>
                            {imageStep === 'analyzing' && (
                                <p className="text-indigo-600 font-medium mt-4 animate-pulse">Analyzing receipt image...</p>
                            )}
                        </div>
                    )}

                    {/* Results Section */}
                    {analysisResult && (
                        <div className="mt-8 pt-8 border-t border-gray-100">
                            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                <svg className="w-6 h-6 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                                AI Analysis Result
                            </h2>

                            {analysisResult.mode === 'total' && analysisResult.total && (
                                renderResultCard(analysisResult.total)
                            )}

                            {analysisResult.mode === 'list' && analysisResult.items && (
                                <div className="space-y-3">
                                    {analysisResult.items.map((item, idx) => renderResultCard(item, idx))}
                                </div>
                            )}
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
