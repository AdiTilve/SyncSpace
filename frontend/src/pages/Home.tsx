import { useEffect, useState } from "react"
import PrivateLayout from "@/layouts/PrivateLayout"
import { Button } from "@/components/ui/button"
import { useSpaceStore } from "@/store/SpaceStore"
import NewSpaceModal from "@/components/spaces/NewSpaceModal"
import EditSpaceModal from "@/components/spaces/EditSpaceModal"
import DeleteSpaceModal from "@/components/spaces/DeleteSpaceModal"
import SpaceCard from "@/components/spaces/SpaceCard"
import type { Space } from "@/types/space"
import { useTheme } from "@/hooks/ThemeContext" // Injects your global theme state engine

export default function Home() {
    const [newModalOpen, setNewModalOpen] = useState(false)
    const [editSpace, setEditSpace] = useState<Space | null>(null)
    const [deleteSpace, setDeleteSpace] = useState<Space | null>(null)
    const { spaces, loading, fetchSpaces } = useSpaceStore()
    const { theme } = useTheme() // Consume light/dark theme context

    useEffect(() => {
        fetchSpaces()
    }, [])

    return (
        <PrivateLayout>
            <div className="p-6 sm:p-8 space-y-8">

                {/* Welcome Section */}
                <div>
                    <h1 className={`text-3xl sm:text-4xl font-bold tracking-tight transition-colors ${
                        theme === "dark" ? "text-white" : "text-slate-900"
                    }`}>
                        Welcome, <span className={theme === "dark" ? "text-blue-400" : "text-blue-700"}>Aditya</span>
                    </h1>
                    <p className={`mt-3 text-sm sm:text-base max-w-2xl transition-colors ${
                        theme === "dark" ? "text-slate-400" : "text-slate-600"
                    }`}>
                        Manage your collaborative spaces and shared documents seamlessly in one workspace.
                    </p>
                </div>

                {/* Spaces Header Controls */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className={`text-2xl font-semibold transition-colors ${
                            theme === "dark" ? "text-white" : "text-slate-800"
                        }`}>
                            Spaces
                        </h2>
                        <p className={`text-sm mt-1 transition-colors ${
                            theme === "dark" ? "text-slate-400" : "text-slate-500"
                        }`}>
                            Create and organize your workspaces.
                        </p>
                    </div>

                    <Button
                        onClick={() => setNewModalOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl px-5 py-2.5 transition-all shadow-sm shadow-blue-500/10"
                    >
                        + New Space
                    </Button>
                </div>

                {/* Spaces Workspace List Pipeline */}
                {loading ? (
                    <div className={`rounded-2xl border border-dashed h-[400px] flex items-center justify-center text-sm font-medium tracking-wide transition-colors ${
                        theme === "dark" 
                            ? "border-slate-700 bg-slate-900/40 text-slate-500" 
                            : "border-blue-200/60 bg-white text-blue-500/70"
                    }`}>
                        Loading spaces...
                    </div>
                ) : spaces.length === 0 ? (
                    <div className={`rounded-2xl border border-dashed h-[400px] flex items-center justify-center text-sm font-medium tracking-wide text-center px-4 transition-colors ${
                        theme === "dark" 
                            ? "border-slate-700 bg-slate-900/40 text-slate-500" 
                            : "border-blue-200/60 bg-white text-blue-500/60"
                    }`}>
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

            {/* Config System Modals */}
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