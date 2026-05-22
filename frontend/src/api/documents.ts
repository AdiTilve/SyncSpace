import api from "./axios"
import type { DocumentResponse, DocumentListResponse } from "@/types/document"

// Get all documents
export const getDocuments = async (space_id: string): Promise<DocumentListResponse> => {
    const response = await api.get(`/spaces/${space_id}/documents`)
    return response.data
}

// Create document
export const createDocument = async (space_id: string, title: string, type:"note" | "task", content:Record<string, any> | null): Promise<DocumentResponse> => {
    const response = await api.post(`/spaces/${space_id}/documents`, {title, type, content})
    return response.data
}

// Update document
export const updateDocument = async (space_id: string, document_id: string, title: string, content: Record<string, any> | null): Promise<DocumentResponse> => {
    const response = await api.patch(`/spaces/${space_id}/documents/${document_id}`, { title, content })
    return response.data
}

// Delete document
export const deleteDocument = async (space_id: string, document_id: string): Promise<void> => {
    await api.delete(`/spaces/${space_id}/documents/${document_id}`)
}