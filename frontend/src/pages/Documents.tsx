import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import PrivateLayout from "@/layouts/PrivateLayout"
import { Button } from "@/components/ui/button"
import { useDocumentStore } from "@/store/DocumentStore"
import NewDocumentModal from "@/components/documents/NewDocumentModal"
import EditDocumentModal from "@/components/documents/EditDocumentModal"
import DeleteDocumentModal from "@/components/documents/DeleteDocumentModal"
import DocumentCard from "@/components/documents/DocumentCard"
import type { Document } from "@/types/document"
import { useSpaceStore } from "@/store/SpaceStore"

export default function Documents() {
    const [newModalOpen, setNewModalOpen] = useState(false)
    const [editDoc, setEditDoc] = useState<Document | null>(null)
    const [deleteDoc, setDeleteDoc] = useState<Document | null>(null)
    const { documents, loading, fetchDocuments } = useDocumentStore()
    const { space_id } = useParams()
    const { spaces } = useSpaceStore()
    const currentSpace = spaces.find((s) => s.id === space_id)

    useEffect(() => {
        fetchDocuments(space_id!)
    }, [space_id])

    return (
        <PrivateLayout>
            <div className="p-6 sm:p-8 space-y-8">

               {/* Header */}
<div>
    {/* Breadcrumb */}
    <p className="text-sm text-slate-500 mb-1">
        My Spaces → <span className="text-slate-300">{currentSpace?.name ?? "..."}</span>
    </p>
    
    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
        {currentSpace?.name ?? "Documents"}
    </h1>
</div>

{/* Documents Header */}
<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div>
        <h2 className="text-2xl font-semibold text-white">
            Documents
        </h2>
        <p className="text-sm text-slate-400 mt-1">
            {documents.length} document{documents.length !== 1 ? "s" : ""} in this space
        </p>
    </div>

    <Button
        onClick={() => setNewModalOpen(true)}
        className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl px-5 py-2 transition-colors"
    >
        + New Document
    </Button>
</div>

                {/* Documents List */}
                {loading ? (
                    <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 h-[400px] flex items-center justify-center text-slate-500">
                        Loading documents...
                    </div>
                ) : documents.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 h-[400px] flex items-center justify-center text-slate-500">
                        No documents yet — create your first one!
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