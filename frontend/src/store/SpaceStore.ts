import { create } from "zustand"
import type { Space } from "@/types/space"
import { getSpaces, createSpace, updateSpace, deleteSpace } from "@/api/spaces"
import toast from "react-hot-toast"

interface SpaceStore {
    spaces: Space[]
    loading: boolean
    fetchSpaces: () => Promise<void>
    addSpace: (name: string) => Promise<void>
    editSpace: (space_id: string, name: string) => Promise<void>
    removeSpace: (space_id: string) => Promise<void>
}

export const useSpaceStore = create<SpaceStore>((set) => ({
    spaces: [],
    loading: false,

    fetchSpaces: async () => {
        set({ loading: true })
        try {
            const response = await getSpaces()
            set({ spaces: response.data })
        } catch {
            toast.error("Failed to fetch spaces")
        } finally {
            set({ loading: false })
        }
    },

    addSpace: async (name: string) => {
        try {
            const response = await createSpace(name)
            set((state) => ({
                spaces: [...state.spaces, response.data]
            }))
            toast.success("Space created successfully")
        } catch (error: any) {
            const message = error.response?.data?.detail || "Failed to create space"
            toast.error(message)
            throw error
        }
    },

    editSpace: async (space_id: string, name: string) => {
        try {
            const response = await updateSpace(space_id, name)
            set((state) => ({
                spaces: state.spaces.map((s) =>
                    s.id === space_id ? response.data : s
                )
            }))
            toast.success("Space updated successfully")
        } catch (error: any) {
            const message = error.response?.data?.detail || "Failed to update space"
            toast.error(message)
            throw error
        }
    },

    removeSpace: async (space_id: string) => {
        try {
            await deleteSpace(space_id)
            set((state) => ({
                spaces: state.spaces.filter((s) => s.id !== space_id)
            }))
            toast.success("Space deleted successfully")
        } catch (error: any) {
            const message = error.response?.data?.detail || "Failed to delete space"
            toast.error(message)
            throw error
        }
    }
}))