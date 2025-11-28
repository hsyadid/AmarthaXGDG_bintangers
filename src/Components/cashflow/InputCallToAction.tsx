import React from 'react';

export default function InputCallToAction() {
    return (
        <div className="bg-gradient-to-b from-[#8E44AD] to-[#8E44AD] rounded-2xl shadow-lg p-6 text-white">
            <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">Sudah input cashflow-mu hari ini?</h3>
                    <p className="text-white/80 text-sm">Jaga konsistensi untuk mengurangi risk score Anda</p>
                </div>
                <button className="bg-white text-[#8E44AD] font-medium text-sm px-4 py-2 rounded whitespace-nowrap">
                    + Tambah
                </button>
            </div>
        </div>
    );
}
