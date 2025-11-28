interface SummaryCardProps {
    title: string;
    value: string;
    label: string;
    valueColor?: string;
}

export default function SummaryCard({ title, value, label, valueColor = "text-cyan-600" }: SummaryCardProps) {
    return (
        <div className="bg-cyan-50 rounded-lg p-3 mb-4">
            <div className="text-sm text-gray-600 mb-2">{title}</div>
            <div className="flex justify-between">
                <div className="text-sm text-slate-700">{label}</div>
                <div className={`text-sm ${valueColor} font-medium`}>{value}</div>
            </div>
        </div>
    );
}
