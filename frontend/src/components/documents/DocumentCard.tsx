import { useState, useRef, useEffect } from "react"
import type { Document } from "@/types/document"
import { useNavigate, useParams } from "react-router-dom"
import { useTheme } from "@/hooks/ThemeContext" // Injects your global theme state engine

interface DocumentCardProps {
    doc: Document
    onEdit: (space: Document) => void
    onDelete: (space: Document) => void
}

export default function DocumentCard({ doc, onEdit, onDelete }: DocumentCardProps) {
    const [menuOpen, setMenuOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)
    const navigate = useNavigate()
    const { space_id } = useParams()
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
            onClick={() => navigate(`/spaces/${space_id}/documents/${doc.id}`)} 
            className={`flex items-center justify-between border rounded-2xl px-6 py-4 cursor-pointer transition-all duration-200 ${
                theme === "dark" 
                    ? "bg-slate-900 border-slate-800 hover:border-slate-700 shadow-sm" 
                    : "bg-white border-blue-100/60 hover:border-blue-200 shadow-[0_2px_8px_rgba(59,130,246,0.04)]"
            }`}
        >

            {/* Left - Name & Tags */}
            <div className="flex flex-col items-start gap-1">
                <span className={`font-medium text-base transition-colors ${
                    theme === "dark" ? "text-white" : "text-slate-900"
                }`}>
                    {doc.title}
                </span>
                
                <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        doc.type === "note" 
                            ? "bg-blue-500/10 text-blue-500" 
                            : "bg-purple-500/10 text-purple-500"
                    }`}>
                        {doc.type}
                    </span>
                    
                    {doc.role && (
                        <span className={`text-xs capitalize ${
                            theme === "dark" ? "text-slate-500" : "text-slate-400"
                        }`}>
                            • {doc.role}
                        </span>
                    )}
                </div>
            </div>

            {/* Right - Date + Options Menu */}
            <div className="flex items-center gap-6">

                {/* Created At Date */}
                <span className={`text-sm hidden sm:block transition-colors ${
                    theme === "dark" ? "text-slate-400" : "text-slate-500"
                }`}>
                    {formatDate(doc.created_at)}
                </span>

                {/* Three Dots Menu Wrapper */}
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
                                    onEdit(doc)
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
                                    onDelete(doc)
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