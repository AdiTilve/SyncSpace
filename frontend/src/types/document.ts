export interface Document {
    id: string
    title: string
    type: "note" | "task"
    content: Record<string, any> | null
    created_at: string
    is_owner: boolean | null
    role: string | null
    parent_document_id: string | null
}

export interface DocumentResponse {
    status_code: number
    message: string
    data: Document
}

export interface DocumentListResponse {
    status_code: number
    message: string
    data: Document[]
}