import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import PrivateLayout from "@/layouts/PrivateLayout"
import { Button } from "@/components/ui/button"
import { useDocumentStore } from "@/store/DocumentStore"
import NewDocumentModal from "@/components/documents/NewDocumentModal"
import EditDocumentModal from "@/components/documents/EditDocumentModal"
import DeleteDocumentModal from "@/components/documents/DeleteDocumentModal"
import DocumentCard from "@/components/documents/DocumentCard"
import SkeletonCard from "@/components/ui/SkeletonCard"
import type { Document } from "@/types/document"
import { useSpaceStore } from "@/store/SpaceStore"
import { useTheme } from "@/hooks/ThemeContext"

export default function Documents() {
    const [newModalOpen, setNewModalOpen] = useState(false)
    const [editDoc, setEditDoc] = useState<Document | null>(null)
    const [deleteDoc, setDeleteDoc] = useState<Document | null>(null)
    const { documents, loading, fetchDocuments } = useDocumentStore()
    const { space_id } = useParams()
    const { spaces } = useSpaceStore()
    const { theme } = useTheme()
    const navigate = useNavigate()

    const currentSpace = spaces.find((s) => s.id === space_id)

    useEffect(() => {
        fetchDocuments(space_id!)
    }, [space_id])

    const handleRefresh = () => {
        fetchDocuments(space_id!)
    }

    return (
        <PrivateLayout>
            <div className="p-6 sm:p-8 space-y-8">

                {/* Header */}
                <div className="space-y-1">
                    {/* Breadcrumb */}
                    <p className="text-sm font-medium select-none text-slate-500">
                        <span
                            onClick={() => navigate("/home")}
                            className={`cursor-pointer transition-colors ${
                                theme === "dark" ? "hover:text-slate-300" : "hover:text-blue-600"
                            }`}
                        >
                            My Spaces
                        </span>
                        {" "}→{" "}
                        <span
                            onClick={handleRefresh}
                            className={`cursor-pointer font-semibold transition-colors hover:underline ${
                                theme === "dark" ? "text-slate-300 hover:text-white" : "text-blue-700/80 hover:text-blue-800"
                            }`}
                            title="Refresh documents"
                        >
                            {currentSpace?.name ?? "..."}
                        </span>
                    </p>

                    {/* Page Title */}
                    <h1 className={`text-3xl sm:text-4xl font-bold tracking-tight transition-colors ${
                        theme === "dark" ? "text-white" : "text-slate-900"
                    }`}>
                        {currentSpace?.name ?? "Documents"}
                    </h1>
                </div>

                {/* Documents Sub-bar */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className={`text-sm transition-colors ${
                            theme === "dark" ? "text-slate-400" : "text-slate-500"
                        }`}>
                            {documents.length > 0
                                ? `${documents.length} document${documents.length !== 1 ? "s" : ""} in this space`
                                : "No documents yet"
                            }
                        </p>
                    </div>

                    <Button
                        onClick={() => setNewModalOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl px-5 py-2.5 transition-all shadow-sm shadow-blue-500/10"
                    >
                        + New Document
                    </Button>
                </div>

                {/* Documents List */}
                {loading ? (
                    <div className="space-y-3">
                        {[...Array(4)].map((_, i) => (
                            <SkeletonCard key={i} />
                        ))}
                    </div>
                ) : documents.length === 0 ? (
                    <div className={`rounded-2xl border border-dashed h-[400px] flex flex-col items-center justify-center gap-3 transition-colors ${
                        theme === "dark"
                            ? "border-slate-700 bg-slate-900/40"
                            : "border-blue-200/60 bg-white"
                    }`}>
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl ${
                            theme === "dark" ? "bg-slate-800" : "bg-blue-50"
                        }`}>
                            📄
                        </div>
                        <p className={`text-sm font-medium ${
                            theme === "dark" ? "text-slate-500" : "text-blue-500/60"
                        }`}>
                            No documents yet — create your first one!
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {documents.map((doc) => (
                            <DocumentCard
                                key={doc.id}
                                doc={doc}
                                onEdit={(doc) => setEditDoc(doc)}
                                onDelete={(doc) => setDeleteDoc(doc)}
                            />
                        ))}
                    </div>
                )}

            </div>

            {/* Modals */}
            <NewDocumentModal
                open={newModalOpen}
                onClose={() => setNewModalOpen(false)}
            />

            {editDoc && (
                <EditDocumentModal
                    doc={editDoc}
                    onClose={() => setEditDoc(null)}
                />
            )}

            {deleteDoc && (
                <DeleteDocumentModal
                    doc={deleteDoc}
                    onClose={() => setDeleteDoc(null)}
                />
            )}

        </PrivateLayout>
    )
}