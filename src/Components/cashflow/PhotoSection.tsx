import { IconUpload, IconImage } from "./Icons";
import TransactionList from "./TransactionList";
import SummaryCard from "./SummaryCard";
import { useRef } from "react";

interface PhotoSectionProps {
    photoUploaded: boolean;
    setPhotoUploaded: (uploaded: boolean) => void;
    onAnalyze: (file: File) => void;
}

export default function PhotoSection({ photoUploaded, setPhotoUploaded, onAnalyze }: PhotoSectionProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onAnalyze(e.target.files[0]);
        }
    };

    return (
        <>
            <div className="mb-5">
                <label className="text-sm font-medium text-slate-700 block mb-3">Upload Foto</label>
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                />

                {!photoUploaded ? (
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-[#8E44AD] rounded-2xl p-8 cursor-pointer hover:bg-[#8E44AD]/5 transition flex flex-col items-center justify-center gap-4"
                    >
                        <IconUpload />
                        <div className="text-center">
                            <div className="text-[#8E44AD] font-medium mb-1">Upload foto catatan bisnis Anda</div>
                            <div className="text-gray-500 text-sm">Ambil foto yang jelas dengan pencahayaan yang cukup</div>
                        </div>
                    </div>
                ) : (
                    <div className="border-2 border-[#8E44AD] rounded-2xl p-6 space-y-4">
                        <div className="flex justify-center">
                            <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center border-2 border-gray-400">
                                <div className="text-center text-gray-500">
                                    <div className="mb-2" style={{ color: '#999' }}>
                                        <IconImage />
                                    </div>
                                    <div className="text-sm">Foto berhasil diproses!</div>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                setPhotoUploaded(false);
                                if (fileInputRef.current) fileInputRef.current.value = "";
                            }}
                            className="w-full bg-gray-200 text-slate-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-300"
                        >
                            Ganti Foto
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
