import { useState, useRef, useEffect } from "react"
import type { Document } from "@/types/document"

interface DocumentCardProps {
    doc: Document
    onEdit: (space: Document) => void
    onDelete: (space: Document) => void
}

export default function DocumentCard({ doc, onEdit,onDelete }: DocumentCardProps) {
    const [menuOpen, setMenuOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

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
        <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-2xl px-6 py-4 hover:border-slate-700 transition-colors">

            {/* Left - Name */}
            <div className="flex flex-col">
                <span className="text-white font-medium text-base">
                    {doc.title}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                    doc.type === "note" 
                    ? "bg-blue-500/10 text-blue-400" 
                    : "bg-purple-500/10 text-purple-400"
                }`}>
                    {doc.type}
                </span>
                {doc.role && (
                    <span className="text-xs text-slate-500 mt-0.5 capitalize">
                        {doc.role}
                    </span>
                )}
            </div>

            {/* Right - Date + Menu */}
            <div className="flex items-center gap-6">

                {/* Created At */}
                <span className="text-sm text-slate-400 hidden sm:block">
                    {formatDate(doc.created_at)}
                </span>

                {/* Three Dots Menu */}
                <div className="relative" ref={menuRef}>
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
                                    onEdit(doc)
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
                                    onDelete(doc)
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