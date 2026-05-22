import { useEffect, useState } from "react"
import PrivateLayout from "@/layouts/PrivateLayout"
import { Button } from "@/components/ui/button"
import { useSpaceStore } from "@/store/SpaceStore"
import NewSpaceModal from "@/components/spaces/NewSpaceModal"
import EditSpaceModal from "@/components/spaces/EditSpaceModal"
import DeleteSpaceModal from "@/components/spaces/DeleteSpaceModal"
import SpaceCard from "@/components/spaces/SpaceCard"
import type { Space } from "@/types/space"

export default function Home() {
    const [newModalOpen, setNewModalOpen] = useState(false)
    const [editSpace, setEditSpace] = useState<Space | null>(null)
    const [deleteSpace, setDeleteSpace] = useState<Space | null>(null)
    const { spaces, loading, fetchSpaces } = useSpaceStore()

    useEffect(() => {
        fetchSpaces()
    }, [])

    return (
        <PrivateLayout>
            <div className="p-6 sm:p-8 space-y-8">

                {/* Welcome Section */}
                <div>
                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                        Welcome, <span className="text-blue-400">Aditya</span>
                    </h1>
                    <p className="mt-3 text-slate-400 text-sm sm:text-base max-w-2xl">
                        Manage your collaborative spaces and shared documents seamlessly in one workspace.
                    </p>
                </div>

                {/* Spaces Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-2xl font-semibold text-white">
                            Spaces
                        </h2>
                        <p className="text-sm text-slate-400 mt-1">
                            Create and organize your workspaces.
                        </p>
                    </div>

                    <Button
                        onClick={() => setNewModalOpen(true)}
                        className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl px-5 py-2 transition-colors"
                    >
                        + New Space
                    </Button>
                </div>

                {/* Spaces List */}
                {loading ? (
                    <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 h-[400px] flex items-center justify-center text-slate-500">
                        Loading spaces...
                    </div>
                ) : spaces.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 h-[400px] flex items-center justify-center text-slate-500">
                        No spaces yet — create your first one!
                    </div>
                ) : (
                    <div className="space-y-3">
                        {spaces.map((space) => (
                            <SpaceCard
                                key={space.id}
                                space={space}
                                onEdit={(space) => setEditSpace(space)}
                                onDelete={(space) => setDeleteSpace(space)}
                            />
                        ))}
                    </div>
                )}

            </div>

            {/* Modals */}
            <NewSpaceModal
                open={newModalOpen}
                onClose={() => setNewModalOpen(false)}
            />

            {editSpace && (
                <EditSpaceModal
                    space={editSpace}
                    onClose={() => setEditSpace(null)}
                />
            )}
            {deleteSpace && (
                <DeleteSpaceModal
                    space={deleteSpace}
                    onClose={() => setDeleteSpace(null)}
                />
            )}
        </PrivateLayout>
    )
}