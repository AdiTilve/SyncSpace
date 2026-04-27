import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { Zap,Lock, Smartphone } from 'lucide-react'

export default function Landing() {
    const navigate = useNavigate()
    const token=localStorage.getItem("token")
     function handleLoginNavigation() {
        if(token){
        navigate('/home')
        }
        else{
        navigate('/login')
        }

     }
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 flex flex-col items-center justify-center text-white px-4">
            
            {/* Logo and Title */}
            <div className="text-center mb-8 sm:mb-12 max-w-xl">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 tracking-tight">
                    Sync<span className="text-blue-400">Space</span>
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-md mx-auto">
                    Plan together, in real-time. Share notes and tasks instantly across any device.
                </p>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12">
                <span className="flex items-center gap-2 bg-slate-700 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm">
                    <Zap size={16} className="text-yellow-400" /> Real-time sync
                </span>
                <span className="flex items-center gap-2 bg-slate-700 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm">
                    <Lock size={16} className="text-green-400" /> Secure
                </span>
                <span className="flex items-center gap-2 bg-slate-700 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm">
                    <Smartphone size={16} className='text-blue-400' /> Any device
                </span>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button 
                    className="bg-blue-500 hover:bg-blue-600 transition px-6 py-4 sm:px-8 sm:py-6 text-base sm:text-lg rounded-xl"
                    onClick={() => handleLoginNavigation()}
                >
                    Login
                </Button>
                <Button 
                    variant="outline" 
                    className="border-slate-400 text-white hover:bg-slate-700 px-6 py-4 sm:px-8 sm:py-6 text-base sm:text-lg rounded-xl"
                    onClick={() => navigate('/register')}
                >
                    Get Started →
                </Button>
            </div>

            {/* Footer */}
            <p className="mt-12 sm:mt-16 text-slate-500 text-xs sm:text-sm text-center">
                © 2026 SyncSpace. Built for real-time collaboration.
            </p>
        </div>
    )
}