import React from 'react';

export default function InputCallToAction() {
    return (
        <div className="bg-gradient-to-b from-[#8E44AD] to-[#8E44AD] rounded-2xl shadow-lg p-6 text-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-8">
                <div className="flex-1 w-full">
                    <h3 className="text-xl md:text-2xl font-bold mb-2">Sudah input cashflow-mu hari ini?</h3>
                    <p className="text-white/90 text-base md:text-lg">Jaga konsistensi untuk mengurangi risk score Anda</p>
                </div>
                <a href="/borrower/input" className="w-full md:w-auto bg-white text-[#8E44AD] font-bold text-base md:text-lg px-6 py-3 rounded-lg shadow-md hover:bg-gray-100 transition-colors text-center inline-block">
                    + Tambah
                </a>
            </div>
        </div>
    );
}
