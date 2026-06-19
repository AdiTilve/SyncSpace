import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom" // Imported useNavigate for routing links
import PrivateLayout from "@/layouts/PrivateLayout"
import { Button } from "@/components/ui/button"
import { useDocumentStore } from "@/store/DocumentStore"
import NewDocumentModal from "@/components/documents/NewDocumentModal"
import EditDocumentModal from "@/components/documents/EditDocumentModal"
import DeleteDocumentModal from "@/components/documents/DeleteDocumentModal"
import DocumentCard from "@/components/documents/DocumentCard"
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
    const navigate = useNavigate() // Initialize navigation hooks
    
    const currentSpace = spaces.find((s) => s.id === space_id)

    useEffect(() => {
        fetchDocuments(space_id!)
    }, [space_id])

    // Re-trigger document fetching to act as a seamless workspace component refresh
    const handleRefresh = () => {
        fetchDocuments(space_id!)
    }

    return (
        <PrivateLayout>
            <div className="p-6 sm:p-8 space-y-8">

                {/* Header */}
                <div>
                    {/* Interactive Breadcrumb */}
                    <p className={`text-sm mb-1 font-medium select-none transition-colors ${
                        theme === "dark" ? "text-slate-500" : "text-slate-500"
                    }`}>
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
                    
                    <h1 className={`text-3xl sm:text-4xl font-bold tracking-tight transition-colors ${
                        theme === "dark" ? "text-white" : "text-slate-900"
                    }`}>
                        {currentSpace?.name ?? "Documents"}
                    </h1>
                </div>

                {/* Documents Header Sub-bar */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className={`text-2xl font-semibold transition-colors ${
                            theme === "dark" ? "text-white" : "text-slate-800"
                        }`}>
                            Documents
                        </h2>
                        <p className={`text-sm mt-1 transition-colors ${
                            theme === "dark" ? "text-slate-400" : "text-slate-500"
                        }`}>
                            {documents.length} document{documents.length !== 1 ? "s" : ""} in this space
                        </p>
                    </div>

                    <Button
                        onClick={() => setNewModalOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl px-5 py-2.5 transition-all shadow-sm shadow-blue-500/10"
                    >
                        + New Document
                    </Button>
                </div>

                {/* Documents Data State Area */}
                {loading ? (
                    <div className={`rounded-2xl border border-dashed h-[400px] flex items-center justify-center text-sm font-medium tracking-wide transition-colors ${
                        theme === "dark" 
                            ? "border-slate-700 bg-slate-900/40 text-slate-500" 
                            : "border-blue-200/60 bg-white text-blue-500/70"
                    }`}>
                        Loading documents...
                    </div>
                ) : documents.length === 0 ? (
                    <div className={`rounded-2xl border border-dashed h-[400px] flex items-center justify-center text-sm font-medium tracking-wide text-center px-4 transition-colors ${
                        theme === "dark" 
                            ? "border-slate-700 bg-slate-900/40 text-slate-500" 
                            : "border-blue-200/60 bg-white text-blue-500/60"
                    }`}>
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

            {/* Modals Config Containers */}
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