import { IconEdit, IconDelete } from "./Icons";

interface Transaction {
    id: string;
    type: string;
    amount: number;
    description: string;
}

interface TransactionListProps {
    transactions: Transaction[];
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
}

export default function TransactionList({ transactions, onEdit, onDelete }: TransactionListProps) {
    return (
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-300">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-300">
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 w-24">Tipe</th>

                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 w-28">Jumlah</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 flex-1">Keterangan</th>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 w-16">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-300">
                        {transactions.map((tx) => (
                            <tr key={tx.id} className="hover:bg-gray-50">
                                <td className="px-4 py-4">
                                    <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${tx.type.includes("Pemasukan")
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                        }`}>
                                        {tx.type.includes("Pemasukan") ? "Pemasukan" : "Pengeluaran"}
                                    </span>
                                </td>

                                <td className="px-4 py-4 text-sm text-slate-700 font-medium">Rp {tx.amount.toLocaleString('id-ID')}</td>
                                <td className="px-4 py-4 text-sm text-gray-600">{tx.description}</td>
                                <td className="px-4 py-4 text-center flex gap-2 justify-center">
                                    <button onClick={() => onEdit?.(tx.id)} className="text-cyan-600 hover:text-cyan-700 text-lg">✏️</button>
                                    <button onClick={() => onDelete?.(tx.id)} className="text-red-600 hover:text-red-700 text-lg">🗑</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
