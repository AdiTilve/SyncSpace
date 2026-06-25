import { useTheme } from "@/hooks/ThemeContext"

export default function SkeletonCard() {
    const { theme } = useTheme()

    return (
        <div className={`flex items-center justify-between border rounded-2xl px-6 py-4 animate-pulse ${
            theme === "dark"
                ? "bg-slate-900 border-slate-800"
                : "bg-white border-blue-100/60"
        }`}>
            {/* Left */}
            <div className="space-y-2">
                <div className={`h-4 w-40 rounded-full ${
                    theme === "dark" ? "bg-slate-800" : "bg-slate-200"
                }`} />
                <div className={`h-3 w-20 rounded-full ${
                    theme === "dark" ? "bg-slate-800" : "bg-slate-200"
                }`} />
            </div>

            {/* Right */}
            <div className={`h-4 w-24 rounded-full ${
                theme === "dark" ? "bg-slate-800" : "bg-slate-200"
            }`} />
        </div>
    )
}