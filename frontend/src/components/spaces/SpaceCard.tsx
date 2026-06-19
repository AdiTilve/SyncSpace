import { useState, useRef, useEffect } from "react"
import type { Space } from "@/types/space"
import { useNavigate } from "react-router-dom"
import { useTheme } from "@/hooks/ThemeContext" // Injects your global theme state engine

interface SpaceCardProps {
    space: Space
    onEdit: (space: Space) => void
    onDelete: (space: Space) => void
}

export default function SpaceCard({ space, onEdit, onDelete }: SpaceCardProps) {
    const [menuOpen, setMenuOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)
    const navigate = useNavigate()
    const { theme } = useTheme() // Consume light/dark theme context

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    function formatDate(dateStr: string) {
        return new Date(dateStr).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric"
        })
    }

    return (
        <div  
            onClick={() => navigate(`/spaces/${space.id}/documents`)}
            className={`flex items-center justify-between border rounded-2xl px-6 py-4 cursor-pointer transition-all duration-200 ${
                theme === "dark" 
                    ? "bg-slate-900 border-slate-800 hover:border-slate-700 shadow-sm" 
                    : "bg-white border-blue-100/60 hover:border-blue-200 shadow-[0_2px_8px_rgba(59,130,246,0.04)]"
            }`}
        >

            {/* Left - Name & Info */}
            <div className="flex flex-col">
                <span className={`font-medium text-base transition-colors ${
                    theme === "dark" ? "text-white" : "text-slate-900"
                }`}>
                    {space.name}
                </span>
                {space.role && (
                    <span className={`text-xs mt-0.5 capitalize ${
                        theme === "dark" ? "text-slate-500" : "text-slate-400"
                    }`}>
                        {space.role}
                    </span>
                )}
            </div>

            {/* Right - Date + Options Dropdown */}
            <div className="flex items-center gap-6">

                {/* Created At Timestamp */}
                <span className={`text-sm hidden sm:block transition-colors ${
                    theme === "dark" ? "text-slate-400" : "text-slate-500"
                }`}>
                    {formatDate(space.created_at)}
                </span>

                {/* Three Dots Config Menu Wrapper */}
                <div className="relative" ref={menuRef} onClick={(e) => e.stopPropagation()}>
                    <button
                        onClick={() => setMenuOpen((prev) => !prev)}
                        className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors text-lg font-bold ${
                            theme === "dark" 
                                ? "text-slate-400 hover:text-white hover:bg-slate-800" 
                                : "text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                        }`}
                    >
                        ···
                    </button>

                    {menuOpen && (
                        <div className={`absolute right-0 mt-2 w-44 border rounded-2xl shadow-2xl overflow-hidden z-10 transition-all ${
                            theme === "dark" 
                                ? "bg-slate-900 border-slate-700" 
                                : "bg-white border-blue-100"
                        }`}>

                            <button
                                onClick={() => {
                                    onEdit(space)
                                    setMenuOpen(false)
                                }}
                                className={`w-full text-left px-4 py-3 transition-colors text-sm border-b ${
                                    theme === "dark" 
                                        ? "text-slate-200 border-slate-800 hover:bg-slate-800" 
                                        : "text-slate-700 border-blue-50 hover:bg-blue-50/50 hover:text-blue-600"
                                }`}
                            >
                                ✏️ Edit
                            </button>

                            <button
                                onClick={() => {
                                    setMenuOpen(false)
                                }}
                                className={`w-full text-left px-4 py-3 transition-colors text-sm border-b ${
                                    theme === "dark" 
                                        ? "text-slate-200 border-slate-800 hover:bg-slate-800" 
                                        : "text-slate-700 border-blue-50 hover:bg-blue-50/50 hover:text-blue-600"
                                }`}
                            >
                                🔗 Share
                            </button>

                            <button
                                onClick={async () => {
                                    setMenuOpen(false)
                                    onDelete(space)
                                }}
                                className={`w-full text-left px-4 py-3 transition-colors text-sm ${
                                    theme === "dark" 
                                        ? "text-red-400 hover:bg-red-500/10" 
                                        : "text-red-500 hover:bg-red-50/60"
                                }`}
                            >
                                🗑️ Delete
                            </button>

                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}