import api from "./axios"
import type { SpaceResponse, SpaceListResponse } from "@/types/space"

// Get all spaces
export const getSpaces = async (): Promise<SpaceListResponse> => {
    const response = await api.get("/spaces/")
    return response.data
}

// Create space
export const createSpace = async (name: string): Promise<SpaceResponse> => {
    const response = await api.post("/spaces/", { name })
    return response.data
}

// Update space
export const updateSpace = async (space_id: string, name: string): Promise<SpaceResponse> => {
    const response = await api.patch(`/spaces/${space_id}`, { name })
    return response.data
}

// Delete space
export const deleteSpace = async (space_id: string): Promise<void> => {
    await api.delete(`/spaces/${space_id}`)
}