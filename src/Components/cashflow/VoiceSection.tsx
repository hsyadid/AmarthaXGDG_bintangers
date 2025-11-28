import { IconMicrophone } from "./Icons";
import TransactionList from "./TransactionList";
import SummaryCard from "./SummaryCard";
import { useState, useRef } from "react";

interface VoiceSectionProps {
    voiceInputted: boolean;
    setVoiceInputted: (inputted: boolean) => void;
    onAnalyze: (blob: Blob, category: "revenue" | "expense") => void;
}

export default function VoiceSection({ voiceInputted, setVoiceInputted, onAnalyze }: VoiceSectionProps) {
    const [isRecording, setIsRecording] = useState(false);
    const [recordingCategory, setRecordingCategory] = useState<"revenue" | "expense" | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    const startRecording = async (category: "revenue" | "expense") => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            chunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: "audio/wav" });
                onAnalyze(blob, category);
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
            setRecordingCategory(category);
        } catch (err) {
            console.error("Error accessing microphone:", err);
            alert("Gagal mengakses mikrofon. Pastikan izin diberikan.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            setRecordingCategory(null);
        }
    };

    return (
        <>
            <div className="mb-5">
                <label className="text-sm font-medium text-slate-700 block mb-3">Voice Input</label>

                {isRecording ? (
                    <div className="flex flex-col items-center justify-center p-8 border-2 border-red-500 rounded-2xl bg-red-50 animate-pulse">
                        <div className="text-red-600 font-bold mb-2">Sedang Merekam...</div>
                        <div className="text-sm text-gray-600 mb-4">Kategori: {recordingCategory === "revenue" ? "Pemasukan" : "Pengeluaran"}</div>
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
