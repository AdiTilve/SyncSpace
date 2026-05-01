import PublicLayout from "@/layouts/PublicLayout"
import {Button} from "@/components/ui/button"
import { useNavigate } from 'react-router-dom'
import api from "../api/axios"
import toast from "react-hot-toast";

export default function Home() {

    const navigate=useNavigate()

    async function handleLogout(){
        const token = localStorage.getItem("token");
         const response = await api.post(

      "/auth/logout",

      {},
      {
        headers: {

          Authorization: `Bearer ${token}`,
        },
      }
    );
    toast.success(response.data.message)
    localStorage.removeItem("token")

        navigate("/login", { replace: true })
    }

    return (
                <PublicLayout>
                    <div className="space-y-6">
                         <h2 className="text-xl sm:text-2xl font-semibold text-center">
  Welcome to SyncSpace
</h2>
                    
                    <div className="flex justify-center">
                    <Button
                        onClick={handleLogout}
                        className="w-full max-w-sm py-3 rounded-lg bg-blue-500 hover:bg-blue-600 transition"
                    >
                        Logout
                    </Button>
                </div>
                </div>
                </PublicLayout>
    )
}