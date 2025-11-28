interface InputMethodTabsProps {
    inputMethod: string;
    setInputMethod: (method: string) => void;
}

export default function InputMethodTabs({ inputMethod, setInputMethod }: InputMethodTabsProps) {
    return (
        <div className="mb-5">
            <label className="text-sm font-medium text-slate-700 block mb-3">Pilih Metode Input</label>
            <div className="flex gap-3">
                <button
                    onClick={() => setInputMethod("manual")}
                    className={`flex-1 py-3 rounded-2xl border-2 transition flex flex-col items-center gap-1 ${inputMethod === "manual"
                            ? 'bg-[#8E44AD]/10 border-[#8E44AD] text-[#8E44AD]'
                            : 'border-gray-300 text-gray-600'
                        }`}
                >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" /></svg>
                    <span className="text-xs font-medium">Manual</span>
                </button>
                <button
                    onClick={() => setInputMethod("foto")}
                    className={`flex-1 py-3 rounded-2xl border-2 transition flex flex-col items-center gap-1 ${inputMethod === "foto"
                            ? 'bg-[#8E44AD]/10 border-[#8E44AD] text-[#8E44AD]'
                            : 'border-gray-300 text-gray-600'
                        }`}
                >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" /></svg>
                    <span className="text-xs font-medium">Foto</span>
                </button>
                <button
                    onClick={() => setInputMethod("suara")}
                    className={`flex-1 py-3 rounded-2xl border-2 transition flex flex-col items-center gap-1 ${inputMethod === "suara"
                            ? 'bg-[#8E44AD]/10 border-[#8E44AD] text-[#8E44AD]'
                            : 'border-gray-300 text-gray-600'
                        }`}
                >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z" /></svg>
                    <span className="text-xs font-medium">Suara</span>
                </button>
            </div>
        </div>
    );
}
