import React from 'react';

interface BorrowerHeaderProps {
    name?: string;
    job?: string;
    majelisName?: string;
}

export default function BorrowerHeader({
    name = "Dewi Kartika",
    job = "Penjahit",
    majelisName = "Majelis Berkah"
}: BorrowerHeaderProps) {
    return (
        <div className="px-6 pt-8 pb-8 text-white">
            <div className="text-base font-normal opacity-80 mb-2">Selamat Datang,</div>
            <div className="text-3xl font-bold mb-2">{name}</div>
            <div className="text-base font-normal opacity-90">{job} • {majelisName}</div>
        </div>
    );
}
