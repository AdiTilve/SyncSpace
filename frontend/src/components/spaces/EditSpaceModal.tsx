import { useState } from "react"
import { useSpaceStore } from "@/store/SpaceStore"
import { Button } from "@/components/ui/button"
import type { Space } from "@/types/space"
import { useTheme } from "@/hooks/ThemeContext" // Injects your global theme state engine

interface EditSpaceModalProps {
    space: Space
    onClose: () => void
}

export default function EditSpaceModal({ space, onClose }: EditSpaceModalProps) {
    const [name, setName] = useState(space.name)
    const [loading, setLoading] = useState(false)
    const { editSpace } = useSpaceStore()
    const { theme } = useTheme() // Consume light/dark theme context

    async function handleSubmit() {
        if (!name.trim()) return
        setLoading(true)
        try {
            await editSpace(space.id, name.trim())
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
                        Edit Space
                    </h2>

                    {/* Input Block Wrapper */}
                    <div className="space-y-2">
                        <label className={`text-xs font-semibold uppercase tracking-wider transition-colors ${
                            theme === "dark" ? "text-slate-400" : "text-blue-600/80"
                        }`}>
                            Space Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                            placeholder="Enter space name..."
                            className={`w-full border rounded-xl px-4 py-3 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                                theme === "dark" 
                                    ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-blue-500" 
                                    : "bg-blue-50/30 border-blue-100 text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:bg-white"
                            }`}
                        />
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
                            disabled={!name.trim() || loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl px-5 shadow-sm disabled:opacity-50"
                        >
                            {loading ? "Saving..." : "Save"}
                        </Button>
                    </div>

                </div>
            </div>
        </>
    )
}