import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import Landing from "@/pages/Landing"
import Login from "@/pages/Login"
import Register from "@/pages/Register"
import Home from "@/pages/Home"
import Documents from "@/pages/Documents"
import ProtectedRoute from "@/components/ProtectedRoute"
import PublicRoute from "@/components/PublicRoute"
import DocumentEditor from "@/pages/DocumentEditor"

function App() {
    return (
        <BrowserRouter>
            <Toaster
                position="top-center"
                toastOptions={{
                    duration: 2000,
                    style: {
                        background: "#1f2937",
                        color: "#fff",
                        padding: "10px 16px",
                        borderRadius: "8px",
                    },
                }}
            />
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={
                    <PublicRoute>
                        <Login />
                    </PublicRoute>
                } />
                <Route path="/register" element={<Register />} />
                <Route path="/home" element={
                    <ProtectedRoute>
                        <Home />
                    </ProtectedRoute>
                } />
                <Route path="/spaces/:space_id/documents" element={
                    <ProtectedRoute>
                        <Documents />
                    </ProtectedRoute>
                } />
                <Route path="/spaces/:space_id/documents/:document_id" element={
                    <ProtectedRoute>
                        <DocumentEditor />
                    </ProtectedRoute>
                } />
            </Routes>
        </BrowserRouter>
    )
}

export default App