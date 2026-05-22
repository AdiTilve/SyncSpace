import { useState } from "react"
import { useSpaceStore } from "@/store/SpaceStore"
import { Button } from "@/components/ui/button"
import type { Space } from "@/types/space"

interface DeleteSpaceModalProps {
    space: Space
    onClose: () => void
}

export default function DeleteSpaceModal({ space, onClose }: DeleteSpaceModalProps) {
    const [loading, setLoading] = useState(false)
    const { removeSpace } = useSpaceStore()

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
            <div className="fixed inset-0 bg-black/60 z-50" onClick={onClose} />

            <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md">
                <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-5">

                    <h2 className="text-xl font-semibold text-white">
                        Delete Space
                    </h2>

                    <div className="space-y-4">

    <div>
        <p className="text-sm text-slate-400">
            Space Name
        </p>

        <p className="text-white text-lg font-medium mt-1">
            {space.name}
        </p>
    </div>

    <p className="text-sm text-red-400 leading-relaxed">
        Are you sure you want to delete this space?
        This action cannot be undone.
    </p>

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
                            disabled={loading}
                            className="bg-red-500 hover:bg-red-600 text-white rounded-xl px-5 disabled:opacity-50"
                        >
                            {loading ? "Deleting..." : "Delete"}
                        </Button>
                    </div>

                </div>
            </div>
        </>
    )
}