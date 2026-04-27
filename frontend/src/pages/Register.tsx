import { useState } from "react"
import { Link } from "react-router-dom"
import PublicLayout from "@/layouts/PublicLayout"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"
import { useNavigate } from 'react-router-dom'
import axios from "axios"

export default function Register() {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [first_name, setFirstName] = useState("")
    const [last_name, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [errors, setErrors] = useState<{
        first_name?: string
        last_name?: string
        email?: string
        password?: string
        confirmPassword?: string
    }>({})
    const [message, setMessage] = useState("")
    const [messageType, setMessageType] = useState("")
    const navigate = useNavigate()

    function validateRegister() {
        const nextErrors: {
            first_name?: string
            last_name?: string
            email?: string
            password?: string
            confirmPassword?: string
        } = {}
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        if (!first_name.trim()) {
            nextErrors.first_name = "First name is required."
        }

        if (!last_name.trim()) {
            nextErrors.last_name = "Last name is required."
        }

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

        if (!confirmPassword) {
            nextErrors.confirmPassword = "Please confirm your password."
        } else if (confirmPassword !== password) {
            nextErrors.confirmPassword = "Passwords do not match."
        }

        setErrors(nextErrors)
        return Object.keys(nextErrors).length === 0
    }

    async function handleSubmit() {
    if (!validateRegister()) return

    try {
        console.log("User Submitted")
        const response= await axios.post("http://127.0.0.1:8000/users/register", {
                first_name,
                last_name,
                email,
                password,
            })
        setMessage(response.data.message)
        setMessageType("success")

    } catch (error:any) {
        setMessage(error.response.data.detail)
        setMessageType("error")
    }
}

    return (
        <PublicLayout>
            <form
                className="space-y-5"
                onSubmit={(event) => {
                    event.preventDefault()
                    handleSubmit()
                }}
                noValidate
            >
                <p
                    className={`text-sm text-center ${
                    messageType === "success" ? "text-green-400" : "text-red-400"
                    }`}
                >
                    {message}
                </p>
                {/* Heading */}
                <h2 className="text-xl sm:text-2xl font-semibold text-center">Register</h2>

                {/* First Name */}
                <div className="space-y-2">
                    <Label>First Name</Label>
                    <Input
                        type="text"
                        placeholder="Enter your first name"
                        value={first_name}
                        onChange={(event) => {
                            setFirstName(event.target.value)
                            if (errors.first_name) setErrors((prev) => ({ ...prev, first_name: undefined }))
                        }}
                        className={`rounded-lg bg-slate-900 border text-white placeholder:text-slate-400 ${
                            errors.first_name ? "border-red-500 focus-visible:ring-red-500" : "border-slate-600"
                        }`}
                    />
                    {errors.first_name ? <p className="text-xs text-red-400">{errors.first_name}</p> : null}
                </div>

                {/* Last Name */}
                <div className="space-y-2">
                    <Label>Last Name</Label>
                    <Input
                        type="text"
                        placeholder="Enter your last name"
                        value={last_name}
                        onChange={(event) => {
                            setLastName(event.target.value)
                            if (errors.last_name) setErrors((prev) => ({ ...prev, last_name: undefined }))
                        }}
                        className={`rounded-lg bg-slate-900 border text-white placeholder:text-slate-400 ${
                            errors.last_name ? "border-red-500 focus-visible:ring-red-500" : "border-slate-600"
                        }`}
                    />
                    {errors.last_name ? <p className="text-xs text-red-400">{errors.last_name}</p> : null}
                </div>

                {/* Email */}
                <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
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

                {/* Password */}
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

                {/* Confirm Password */}
                <div className="space-y-2">
                    <Label>Confirm Password</Label>
                    <div className="relative">
                        <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(event) => {
                                setConfirmPassword(event.target.value)
                                if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: undefined }))
                            }}
                            className={`rounded-lg bg-slate-900 border text-white placeholder:text-slate-400 pr-10 ${
                                errors.confirmPassword ? "border-red-500 focus-visible:ring-red-500" : "border-slate-600"
                            }`}
                        />
                        <button
                            type="button"
                            aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                            className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-slate-200 transition-colors"
                        >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                    {errors.confirmPassword ? <p className="text-xs text-red-400">{errors.confirmPassword}</p> : null}
                </div>

                <div className="flex justify-center">
                    <Button
                        type="submit"
                        className="w-full max-w-sm py-3 rounded-lg bg-blue-500 hover:bg-blue-600 transition"
                    >
                        Create Account
                    </Button>
                </div>

                {/* Login link */}
                <p className="text-sm text-center text-slate-400">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-400 cursor-pointer hover:underline">
                        Login
                    </Link>
                </p>

            </form>
        </PublicLayout>
    )
}
