import { useState } from "react"
import { Link } from "react-router-dom"
import PublicLayout from "@/layouts/PublicLayout"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff } from "lucide-react"
import { useNavigate } from 'react-router-dom'
import api from "../api/axios"
import toast from "react-hot-toast";

export default function Login() {
    const [showPassword, setShowPassword] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errors, setErrors] = useState<{
        email?: string
        password?: string
    }>({})
    const navigate = useNavigate()

    // const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000"
    function validateLogin() {
        const nextErrors: {
            email?: string
            password?: string
        } = {}
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        if (!email.trim()) {
            nextErrors.email = "Email is required."
        } else if (!emailRegex.test(email.trim())) {
            nextErrors.email = "Enter a valid email address."
        }

        if (!password.trim()) {
            nextErrors.password = "Password is required."
        } else if (/\s/.test(password)) {
            nextErrors.password = "Password cannot contain spaces."
        } else if (password.length < 8) {
            nextErrors.password = "Password must be at least 8 characters."
        }

        setErrors(nextErrors)
        return Object.keys(nextErrors).length === 0
    }

    async function handleSubmit() {
        if (!validateLogin()) return
        try{

           const response= await api.post(
            "/auth/login",
        {
            email,
            password
        })
            // setMessage(response.data.message)
            // setMessageType("success")
            toast.success(response.data.message)
            localStorage.setItem("token",response.data.token)
            // console.log(localStorage.getItem("token"))
            navigate("/home")
        }
        catch(error:any){
            toast.error(error.response.data.detail)
            // setMessageType("error")
        }
    }

    return (
        <PublicLayout>
            <form
                className="space-y-5"
                onSubmit={(event) => {
                    event.preventDefault()
                    void handleSubmit()
                }}
                noValidate
            >
                {/* Heading */}
                <h2 className="text-xl sm:text-2xl font-semibold text-center">Login</h2>

                {/* Email */}
                <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(event) => {
                            setEmail(event.target.value)
                            if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }))
                        }}
                        className={`rounded-lg bg-slate-900 border text-white placeholder:text-slate-400 ${
                            errors.email ? "border-red-500 focus-visible:ring-red-500" : "border-slate-600"
                        }`}
                    />
                    {errors.email ? <p className="text-xs text-red-400">{errors.email}</p> : null}
                </div>

                <div className="space-y-2">
                    <Label>Password</Label>
                    <div className="relative">
                        <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a password"
                            value={password}
                            onChange={(event) => {
                                setPassword(event.target.value)
                                if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }))
                            }}
                            className={`rounded-lg bg-slate-900 border text-white placeholder:text-slate-400 pr-10 ${
                                errors.password ? "border-red-500 focus-visible:ring-red-500" : "border-slate-600"
                            }`}
                        />
                        <button
                            type="button"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-slate-200 transition-colors"
                        >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                    {errors.password ? <p className="text-xs text-red-400">{errors.password}</p> : null}
                </div>

                {/* Remember + Forgot */}
                <div className="flex flex-col items-center gap-2 text-sm min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between">

                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="remember"
                            className="border-slate-400 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                        />
                        <Label htmlFor="remember" className="text-slate-300 cursor-pointer">
                            Remember me
                        </Label>
                    </div>

                    <span className="text-blue-400 cursor-pointer hover:underline text-center min-[420px]:ml-auto">
                        Forgot password?
                    </span>
                </div>

                <div className="flex justify-center">
                    <Button
                        type="submit"
                        className="w-full max-w-sm py-3 rounded-lg bg-blue-500 hover:bg-blue-600 transition"
                    >
                        Login
                    </Button>
                </div>

                {/* Register link */}
                <p className="text-sm text-center text-slate-400">
                    Don’t have an account?{" "}
                    <Link to="/register" className="text-blue-400 cursor-pointer hover:underline">
                        Register
                    </Link>
                </p>

            </form>
        </PublicLayout>
    )
}
