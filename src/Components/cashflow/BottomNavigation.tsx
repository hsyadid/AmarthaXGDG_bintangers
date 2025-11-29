import React from 'react';
import Link from 'next/link';

export default function BottomNavigation() {
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-between items-center px-6 py-3 z-50">
            <Link href="/borrower" className="flex flex-col items-center gap-1 flex-1 py-2">
                <div className="text-xl">🏠</div>
                <span className="text-gray-500 text-xs">Home</span>
            </Link>
            <Link href="/borrower/input" className="flex flex-col items-center gap-1 flex-1 py-2">
                <div className="text-xl">➕</div>
                <span className="text-[#8E44AD] text-xs font-medium">Add Cashflow</span>
            </Link>

        </div>
    );
}
