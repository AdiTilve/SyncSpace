export interface Space {
    id: string
    name: string
    created_at: string
    is_owner: boolean | null
    role: string | null
}

export interface SpaceResponse {
    status_code: number
    message: string
    data: Space
}

export interface SpaceListResponse {
    status_code: number
    message: string
    data: Space[]
}