import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { Zap, Lock, Smartphone, ArrowRight } from 'lucide-react'

export default function Landing() {
    const navigate = useNavigate()
    const token = localStorage.getItem("token")

    function handleLoginNavigation() {
        if (token) {
            navigate('/home')
        } else {
            navigate('/login')
        }
    }

    return (
        <div className="relative min-h-screen bg-[radial-gradient(ellipse_at_top,_#1e3a5f_0%,_#0f172a_50%,_#020617_100%)] flex flex-col items-center justify-center text-white px-4 overflow-hidden">

            {/* Background orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center">

                {/* Badge */}
                <div className="mb-6 flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                    <span className="text-xs font-semibold text-blue-300 tracking-wide uppercase">
                        Now in Beta
                    </span>
                </div>

                {/* Logo and Title */}
                <div className="text-center mb-8 sm:mb-12 max-w-2xl">
                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-none">
                        Sync
                        <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                            Space
                        </span>
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-md mx-auto leading-relaxed">
                        Plan together, in real-time. Share notes and tasks instantly across any device.
                    </p>
                </div>

                {/* Feature Pills */}
                <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10 sm:mb-14">
                    <span className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/50 backdrop-blur-sm px-4 py-2 rounded-full text-xs sm:text-sm font-medium">
                        <Zap size={14} className="text-yellow-400" />
                        Real-time sync
                    </span>
                    <span className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/50 backdrop-blur-sm px-4 py-2 rounded-full text-xs sm:text-sm font-medium">
                        <Lock size={14} className="text-green-400" />
                        End-to-end secure
                    </span>
                    <span className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/50 backdrop-blur-sm px-4 py-2 rounded-full text-xs sm:text-sm font-medium">
                        <Smartphone size={14} className="text-blue-400" />
                        Any device
                    </span>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <Button
                        onClick={() => navigate('/register')}
                        className="group bg-blue-600 hover:bg-blue-500 transition-all px-8 py-6 text-base sm:text-lg rounded-2xl font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02]"
                    >
                        Get Started Free
                        <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <Button
                        variant="outline"
                        className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white hover:border-slate-500 px-8 py-6 text-base sm:text-lg rounded-2xl font-semibold transition-all"
                        onClick={() => handleLoginNavigation()}
                    >
                        Sign In
                    </Button>
                </div>

                {/* Social proof */}
                <p className="mt-6 text-slate-500 text-xs sm:text-sm text-center">
                    No credit card required · Free forever plan
                </p>

            </div>

            {/* Footer */}
            <p className="absolute bottom-6 text-slate-600 text-xs text-center">
                © 2026 SyncSpace™ · Built for real-time collaboration
            </p>

        </div>
    )
}