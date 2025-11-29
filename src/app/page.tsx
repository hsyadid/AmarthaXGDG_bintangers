import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 to-cyan-50">
      <main className="flex flex-col items-center gap-8 p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#8E44AD] mb-2">
            Amartha x GDG
          </h1>
          <p className="text-gray-600">
            Pilih role untuk melanjutkan
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-6">
          {/* Admin Card */}
          <Link href="/admin">
            <div className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 w-64 cursor-pointer border-2 border-transparent hover:border-[#8E44AD]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#8E44AD]/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-300" />
              <div className="relative z-10">
                <div className="w-16 h-16 bg-[#8E44AD] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Admin</h2>
                <p className="text-gray-600 text-sm">
                  Kelola sistem dan monitoring
                </p>
              </div>
            </div>
          </Link>

          {/* Borrower Card */}
          <Link href="/borrower">
            <div className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 w-64 cursor-pointer border-2 border-transparent hover:border-cyan-500">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-300" />
              <div className="relative z-10">
                <div className="w-16 h-16 bg-cyan-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Borrower</h2>
                <p className="text-gray-600 text-sm">
                  Dashboard peminjam
                </p>
              </div>
            </div>
          </Link>
        </div>

        <p className="text-gray-500 text-sm mt-8">
          Powered by Amartha x GDG Bintangers
        </p>
      </main>
    </div>
  );
}
