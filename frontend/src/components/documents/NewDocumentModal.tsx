import { useState } from "react"
import { useParams } from "react-router-dom"
import { useDocumentStore } from "@/store/DocumentStore"
import { Button } from "@/components/ui/button"

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
            {/* Overlay */}
            <div className="fixed inset-0 bg-black/60 z-50" onClick={onClose} />

            {/* Modal */}
            <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md">
                <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-5">

                    {/* Title */}
                    <h2 className="text-xl font-semibold text-white">
                        Create New Document
                    </h2>

                    {/* Title Input */}
                    <div className="space-y-2">
                        <label className="text-sm text-slate-400">
                            Document Title
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                            placeholder="e.g. Meeting Notes"
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>

                    {/* Type Selector */}
                    <div className="space-y-2">
                        <label className="text-sm text-slate-400">
                            Document Type
                        </label>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setType("note")}
                                className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
                                    type === "note"
                                        ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                                        : "bg-slate-800 text-slate-400 border border-slate-700"
                                }`}
                            >
                                📝 Note
                            </button>
                            <button
                                onClick={() => setType("task")}
                                className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
                                    type === "task"
                                        ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                                        : "bg-slate-800 text-slate-400 border border-slate-700"
                                }`}
                            >
                                ✅ Task
                            </button>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3">
                        <Button
                            onClick={onClose}
                            className="bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl px-5"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={!title.trim() || loading}
                            className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl px-5 disabled:opacity-50"
                        >
                            {loading ? "Creating..." : "Create"}
                        </Button>
                    </div>

                </div>
            </div>
        </>
    )
}