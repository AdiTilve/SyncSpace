import { useState } from "react"
import { useSpaceStore } from "@/store/SpaceStore"
import { Button } from "@/components/ui/button"
import type { Space } from "@/types/space"

interface EditSpaceModalProps {
    space: Space
    onClose: () => void
}

export default function EditSpaceModal({ space, onClose }: EditSpaceModalProps) {
    const [name, setName] = useState(space.name)
    const [loading, setLoading] = useState(false)
    const { editSpace } = useSpaceStore()

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
            <div className="fixed inset-0 bg-black/60 z-50" onClick={onClose} />

            <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md">
                <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-5">

                    <h2 className="text-xl font-semibold text-white">
                        Edit Space
                    </h2>

                    <div className="space-y-2">
                        <label className="text-sm text-slate-400">
                            Space Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button
                            onClick={onClose}
                            className="bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl px-5"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={!name.trim() || loading}
                            className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl px-5 disabled:opacity-50"
                        >
                            {loading ? "Saving..." : "Save"}
                        </Button>
                    </div>

                </div>
            </div>
        </>
    )
}