import { useState, useRef, useEffect } from "react"
import type { Space } from "@/types/space"
import { useSpaceStore } from "@/store/SpaceStore"
import { useNavigate } from "react-router-dom"
interface SpaceCardProps {
    space: Space
    onEdit: (space: Space) => void
    onDelete: (space: Space) => void
}

export default function SpaceCard({ space, onEdit,onDelete }: SpaceCardProps) {
    const [menuOpen, setMenuOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)
    const navigate = useNavigate()

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
        <div  onClick={() => navigate(`/spaces/${space.id}/documents`)}
            className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-2xl px-6 py-4 hover:border-slate-700 transition-colors cursor-pointer">

            {/* Left - Name */}
            <div className="flex flex-col">
                <span className="text-white font-medium text-base">
                    {space.name}
                </span>
                {space.role && (
                    <span className="text-xs text-slate-500 mt-0.5 capitalize">
                        {space.role}
                    </span>
                )}
            </div>

            {/* Right - Date + Menu */}
            <div className="flex items-center gap-6">

                {/* Created At */}
                <span className="text-sm text-slate-400 hidden sm:block">
                    {formatDate(space.created_at)}
                </span>

                {/* Three Dots Menu */}
                <div className="relative" ref={menuRef} onClick={(e) => e.stopPropagation()}>
                    <button
                        onClick={() => setMenuOpen((prev) => !prev)}
                        className="text-slate-400 hover:text-white w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-800 transition-colors text-lg"
                    >
                        ···
                    </button>

                    {menuOpen && (
                        <div className="absolute right-0 mt-2 w-44 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-10">

                            <button
                                onClick={() => {
                                    onEdit(space)
                                    setMenuOpen(false)
                                }}
                                className="w-full text-left px-4 py-3 text-slate-200 hover:bg-slate-800 transition-colors text-sm border-b border-slate-800"
                            >
                                ✏️ Edit
                            </button>

                            <button
                                onClick={() => {
                                    setMenuOpen(false)
                                }}
                                className="w-full text-left px-4 py-3 text-slate-200 hover:bg-slate-800 transition-colors text-sm border-b border-slate-800"
                            >
                                🔗 Share
                            </button>

                            <button
                                onClick={async () => {
                                    setMenuOpen(false)
                                    onDelete(space)
                                }}
                                className="w-full text-left px-4 py-3 text-red-400 hover:bg-red-500/10 transition-colors text-sm"
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