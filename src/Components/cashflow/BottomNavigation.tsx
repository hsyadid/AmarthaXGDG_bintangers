import React from 'react';

export default function BottomNavigation() {
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-between items-center px-6 py-3 max-w-screen-sm mx-auto">
            <button className="flex flex-col items-center gap-1 flex-1 py-2">
                <div className="text-xl">🏠</div>
                <span className="text-[#8E44AD] text-xs font-normal">Home</span>
            </button>
            <button className="flex flex-col items-center gap-1 flex-1 py-2">
                <div className="text-xl">➕</div>
                <span className="text-gray-500 text-xs font-normal">Add Cashflow</span>
            </button>
        </div>
    );
}
