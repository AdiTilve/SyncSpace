import { useState } from "react"
import { useParams } from "react-router-dom"
import { useDocumentStore } from "@/store/DocumentStore"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/hooks/ThemeContext" // Injects your global theme state engine

interface NewDocumentModalProps {
    open: boolean
    onClose: () => void
}

export default function NewDocumentModal({ open, onClose }: NewDocumentModalProps) {
    const [title, setTitle] = useState("")
    const [type, setType] = useState<"note" | "task">("note")
    const [loading, setLoading] = useState(false)
    const { addDocument } = useDocumentStore()
    const { space_id } = useParams()
    const { theme } = useTheme() // Consume light/dark theme context

    if (!open) return null

    async function handleSubmit() {
        if (!title.trim()) return
        setLoading(true)
        try {
            await addDocument(space_id!, title.trim(), type, null)
            setTitle("")
            setType("note")
            onClose()
        } catch {
            // error already handled in store via toast
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            {/* Backdrop Overlay */}
            <div 
                className={`fixed inset-0 z-50 transition-opacity backdrop-blur-[2px] ${
                    theme === "dark" ? "bg-black/60" : "bg-slate-900/40"
                }`} 
                onClick={onClose} 
            />

            {/* Modal Dialog Body Container */}
            <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md p-4 animate-in fade-in-50 zoom-in-95 duration-150">
                <div className={`border rounded-2xl p-6 shadow-2xl space-y-5 transition-all ${
                    theme === "dark" 
                        ? "bg-slate-900 border-slate-700 shadow-black/80" 
                        : "bg-white border-blue-100 shadow-blue-900/10"
                }`}>

                    {/* Header */}
                    <h2 className={`text-xl font-bold tracking-tight transition-colors ${
                        theme === "dark" ? "text-white" : "text-slate-900"
                    }`}>
                        Create New Document
                    </h2>

                    {/* Title Input Block */}
                    <div className="space-y-2">
                        <label className={`text-xs font-semibold uppercase tracking-wider transition-colors ${
                            theme === "dark" ? "text-slate-400" : "text-blue-600/80"
                        }`}>
                            Document Title
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                            placeholder="e.g. Meeting Notes"
                            className={`w-full border rounded-xl px-4 py-3 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                                theme === "dark" 
                                    ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-blue-500" 
                                    : "bg-blue-50/30 border-blue-100 text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:bg-white"
                            }`}
                        />
                    </div>

                    {/* Type Segmented Controller */}
                    <div className="space-y-2">
                        <label className={`text-xs font-semibold uppercase tracking-wider transition-colors ${
                            theme === "dark" ? "text-slate-400" : "text-blue-600/80"
                        }`}>
                            Document Type
                        </label>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setType("note")}
                                className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                                    type === "note"
                                        ? theme === "dark"
                                            ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                                            : "bg-blue-50 text-blue-600 border-blue-200 shadow-xs"
                                        : theme === "dark"
                                            ? "bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-300"
                                            : "bg-slate-50 text-slate-500 border-slate-200/80 hover:bg-slate-100 hover:text-slate-700"
                                }`}
                            >
                                📝 Note
                            </button>
                            <button
                                onClick={() => setType("task")}
                                className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                                    type === "task"
                                        ? theme === "dark"
                                            ? "bg-purple-500/20 text-purple-400 border-purple-500/30"
                                            : "bg-purple-50 text-purple-600 border-purple-200 shadow-xs"
                                        : theme === "dark"
                                            ? "bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-300"
                                            : "bg-slate-50 text-slate-500 border-slate-200/80 hover:bg-slate-100 hover:text-slate-700"
                                }`}
                            >
                                ✅ Task
                            </button>
                        </div>
                    </div>

                    {/* Action Form Footer Buttons */}
                    <div className="flex justify-end gap-3 pt-2">
                        <Button
                            onClick={onClose}
                            className={`rounded-xl px-5 transition-all font-medium ${
                                theme === "dark" 
                                    ? "bg-slate-800 hover:bg-slate-700 text-slate-300" 
                                    : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                            }`}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={!title.trim() || loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl px-5 shadow-sm disabled:opacity-50"
                        >
                            {loading ? "Creating..." : "Create"}
                        </Button>
                    </div>

                </div>
            </div>
        </>
    )
}