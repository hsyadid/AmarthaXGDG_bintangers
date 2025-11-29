import { IconMicrophone } from "./Icons";
import { useState, useRef, useEffect } from "react";

interface VoiceSectionProps {
    voiceInputted: boolean;
    setVoiceInputted: (inputted: boolean) => void;
    onAnalyze: (blob: Blob, category: "revenue" | "expense") => void;
}

export default function VoiceSection({ voiceInputted, setVoiceInputted, onAnalyze }: VoiceSectionProps) {
    const [isRecording, setIsRecording] = useState(false);
    const [recordingCategory, setRecordingCategory] = useState<"revenue" | "expense" | null>(null);
    const [visualizerData, setVisualizerData] = useState<number[]>(new Array(5).fill(10));

    // Audio Refs
    const audioContextRef = useRef<AudioContext | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const processorRef = useRef<ScriptProcessorNode | null>(null);
    const audioInputRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const audioDataRef = useRef<Float32Array[]>([]);
    const animationFrameRef = useRef<number | null>(null);

    const startRecording = async (category: "revenue" | "expense") => {
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

            audioDataRef.current = [];
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
            setRecordingCategory(category);
            visualize();
        } catch (err) {
            console.error("Error accessing microphone:", err);
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

        if (recordingCategory) {
            onAnalyze(wavBlob, recordingCategory);
        }
        setRecordingCategory(null);
    };

    return (
        <>
            <div className="mb-5">
                <label className="text-sm font-medium text-slate-700 block mb-3">Voice Input</label>

                {isRecording ? (
                    <div className="flex flex-col items-center justify-center p-8 border-2 border-red-500 rounded-2xl bg-red-50 animate-pulse">
                        <div className="text-red-600 font-bold mb-2">Sedang Merekam...</div>
                        <div className="text-sm text-gray-600 mb-4">Kategori: {recordingCategory === "revenue" ? "Pemasukan" : "Pengeluaran"}</div>

                        {/* Visualizer */}
                        <div className="flex items-end justify-center space-x-1 h-12 mb-4">
                            {visualizerData.map((height, i) => (
                                <div
                                    key={i}
                                    className="w-2 bg-red-500 rounded-t-sm transition-all duration-75"
                                    style={{ height: `${height}px` }}
                                />
                            ))}
                        </div>

                        <button
                            onClick={stopRecording}
                            className="px-6 py-2 bg-red-600 text-white rounded-full font-medium hover:bg-red-700"
                        >
                            Stop & Analisis
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* Input Pemasukan */}
                        <div>
                            <div className="text-sm font-semibold text-slate-700 mb-3">Input Pemasukan</div>
                            <button
                                onClick={() => startRecording("revenue")}
                                className="w-full border-2 border-green-300 bg-green-50/30 rounded-2xl p-8 hover:bg-green-50/50 transition flex flex-col items-center justify-center gap-4 cursor-pointer"
                            >
                                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white">
                                    <IconMicrophone />
                                </div>
                                <div className="text-center">
                                    <div className="text-slate-700 font-medium">Tap untuk bicara</div>
                                    <div className="text-gray-500 text-xs mt-1">Sebutkan total atau jelaskan setiap transaksi hari ini.</div>
                                </div>
                            </button>
                        </div>

                        {/* Input Pengeluaran */}
                        <div>
                            <div className="text-sm font-semibold text-slate-700 mb-3">Input Pengeluaran</div>
                            <button
                                onClick={() => startRecording("expense")}
                                className="w-full border-2 border-red-300 bg-red-50/30 rounded-2xl p-8 hover:bg-red-50/50 transition flex flex-col items-center justify-center gap-4 cursor-pointer"
                            >
                                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-white">
                                    <IconMicrophone />
                                </div>
                                <div className="text-center">
                                    <div className="text-slate-700 font-medium">Tap untuk bicara</div>
                                    <div className="text-gray-500 text-xs mt-1">Sebutkan total atau jelaskan setiap transaksi hari ini.</div>
                                </div>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
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
