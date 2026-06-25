import { useNavigate } from "react-router-dom"

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    const navigate = useNavigate()

    return (
        <div className="relative min-h-screen bg-[radial-gradient(ellipse_at_top,_#1e3a5f_0%,_#0f172a_50%,_#020617_100%)] flex flex-col items-center justify-center text-white px-4 overflow-hidden">

            {/* Background orbs - matches Landing page */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-400/5 rounded-full blur-3xl pointer-events-none" />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center w-full max-w-md">

                {/* Logo */}
                <div className="text-center mb-8">
                    <h1
                        className="text-3xl sm:text-4xl font-bold tracking-tight cursor-pointer transition-all hover:scale-[1.02]"
                        onClick={() => navigate("/")}
                    >
                        Sync
                        <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                            Space
                        </span>
                    </h1>
                    <p className="text-sm sm:text-base text-slate-400 mt-2">
                        Plan together, in real-time.
                    </p>
                </div>

                {/* Card */}
                <div className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl shadow-black/40 p-6 sm:p-8">
                    {children}
                </div>

                {/* Footer */}
                <p className="mt-8 text-slate-600 text-xs text-center">
                    © 2026 SyncSpace™ · Plan together, in real-time
                </p>

            </div>

        </div>
    )
}