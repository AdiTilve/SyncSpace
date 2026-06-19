import { useState } from "react"
import { useSpaceStore } from "@/store/SpaceStore"
import { Button } from "@/components/ui/button"
import type { Space } from "@/types/space"
import { useTheme } from "@/hooks/ThemeContext" // Injects your global theme state engine

interface DeleteSpaceModalProps {
    space: Space
    onClose: () => void
}

export default function DeleteSpaceModal({ space, onClose }: DeleteSpaceModalProps) {
    const [loading, setLoading] = useState(false)
    const { removeSpace } = useSpaceStore()
    const { theme } = useTheme() // Consume light/dark theme context

    async function handleSubmit() {
        setLoading(true)
        try {
            await removeSpace(space.id)
            onClose()
        } catch {
            // error handled in store via toast
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

                    <h2 className={`text-xl font-bold tracking-tight transition-colors ${
                        theme === "dark" ? "text-white" : "text-slate-900"
                    }`}>
                        Delete Space
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <p className={`text-xs font-semibold uppercase tracking-wider transition-colors ${
                                theme === "dark" ? "text-slate-400" : "text-slate-400"
                            }`}>
                                Space Name
                            </p>

                            <p className={`text-lg font-medium mt-1 transition-colors ${
                                theme === "dark" ? "text-white" : "text-slate-800"
                            }`}>
                                {space.name}
                            </p>
                        </div>

                        {/* Danger Banner Warning Section */}
                        <div className={`rounded-xl p-3.5 border text-sm leading-relaxed ${
                            theme === "dark"
                                ? "bg-red-500/5 border-red-500/10 text-red-400"
                                : "bg-red-50/50 border-red-100 text-red-600"
                        }`}>
                            <strong>Warning:</strong> Are you sure you want to delete this space? This action cannot be undone.
                        </div>
                    </div>

                    {/* Action Form Footer */}
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
                            disabled={loading}
                            className="bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl px-5 transition-colors shadow-sm disabled:opacity-50"
                        >
                            {loading ? "Deleting..." : "Delete"}
                        </Button>
                    </div>

                </div>
            </div>
        </>
    )
}