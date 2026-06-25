import { create } from "zustand"
import api from "@/api/axios"

interface User {
    id: string
    first_name: string
    last_name: string
    email: string
}

interface UserStore {
    user: User | null
    fetchUser: () => Promise<void>
}

export const useUserStore = create<UserStore>((set) => ({
    user: null,

    fetchUser: async () => {
        try {
            const response = await api.get("/users/me")
            set({ user: response.data.data })
        } catch {
            // token invalid - axios interceptor handles redirect
        }
    }
}))