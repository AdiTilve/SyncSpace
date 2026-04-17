import { useNavigate } from "react-router-dom"

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 flex flex-col items-center justify-center text-white px-4">
            
   
            <div className="text-center mb-8 sm:mb-10 max-w-xl">
                <h1 
                    className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 tracking-tight cursor-pointer hover:opacity-80 transition"
                    onClick={() => navigate("/")}
                >
                    Sync<span className="text-blue-400">Space</span>
                </h1>

                <p className="text-sm sm:text-base md:text-lg text-slate-400">
                    Plan together, in real-time.
                </p>
            </div>
            <div className="w-full max-w-md bg-slate-800/60 backdrop-blur-md border border-slate-700 rounded-2xl shadow-xl p-6 sm:p-8">
                {children}
            </div>

            <p className="mt-10 sm:mt-14 text-slate-500 text-xs sm:text-sm text-center">
                © 2026 SyncSpace
            </p>
        </div>
    )
}