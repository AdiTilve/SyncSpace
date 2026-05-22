import { create } from "zustand"
import type { Document} from "@/types/document"
import { getDocuments, createDocument, updateDocument, deleteDocument } from "@/api/documents"
import toast from "react-hot-toast"

interface DocumentStore {
    documents: Document[]
    loading: boolean
    fetchDocuments: (space_id: string) => Promise<void>
    addDocument: (space_id: string,title: string, type: "note" | "task", content:Record<string, any> | null) => Promise<void>
    editDocument: (space_id: string, document_id: string, title: string, content: Record<string, any> | null) => Promise<void>
    removeDocument: (space_id: string, document_id: string) => Promise<void>
}

export const useDocumentStore = create<DocumentStore>((set) => ({
    documents: [],
    loading: false,

    fetchDocuments: async (space_id: string) => {
        set({ loading: true })
        try {
            const response = await getDocuments(space_id)
            set({ documents: response.data })
        } catch {
            toast.error("Failed to fetch documents")
        } finally {
            set({ loading: false })
        }
    },

    addDocument: async (space_id: string,title: string, type: "note" | "task", content:Record<string, any> | null ) => {
        try {
            const response = await createDocument(space_id,title,type,content)
            set((state) => ({
                documents: [response.data, ...state.documents]
            }))
            toast.success("Document created successfully")
        } catch (error: any) {
            const message = error.response?.data?.detail || "Failed to create document"
            toast.error(message)
            throw error
        }
    },

    editDocument: async (space_id: string, document_id: string, title: string, content: Record<string, any> | null) => {
        try {
            const response = await updateDocument(space_id, document_id,title, content)
            set((state) => ({
                documents: state.documents.map((doc) =>
                    doc.id === document_id ? response.data : doc
                )
            }))
            toast.success("Document updated successfully")
        } catch (error: any) {
            const message = error.response?.data?.detail || "Failed to update document"
            toast.error(message)
            throw error
        }
    },

    removeDocument: async (space_id: string, document_id: string) => {
        try {
            await deleteDocument(space_id, document_id)
            set((state) => ({
                documents: state.documents.filter((doc) => doc.id !== document_id)
            }))
            toast.success("Document deleted successfully")
        } catch (error: any) {
            const message = error.response?.data?.detail || "Failed to delete document"
            toast.error(message)
            throw error
        }
    }
}))