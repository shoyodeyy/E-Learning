import {useState, useRef} from "react"
import {toast} from "react-toastify"
import {EyeIcon, EyeSlashIcon} from "@heroicons/react/24/outline"
import {useAuth} from "../context/AuthContext.jsx"
import api from "../api/axios.js"

export default function ChangePassword() {
    const {user, token} = useAuth()

    const [form, setForm] = useState({
        current_password: "",
        new_password: "",
        new_password_confirmation: ""
    })
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})
    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false
    })

    const currentPasswordRef = useRef(null)
    const newPasswordRef = useRef(null)
    const confirmPasswordRef = useRef(null)

    const handleChange = (e) => {
        const {name, value} = e.target
        setForm({...form, [name]: value})

        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = {...prev}
                delete newErrors[name]
                return newErrors
            })
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setErrors({})

        try {
            const res = await api.post("/user/change-password", form, {
                headers: {Authorization: `Bearer ${token}`},
            })

            toast.success(res.data.message || "Password updated successfully")

            setForm({
                current_password: "",
                new_password: "",
                new_password_confirmation: ""
            })
        } catch (err) {
            if (err.response?.status === 422) {
                const fieldErrors = err.response.data.errors || {}
                setErrors(fieldErrors)

                if (fieldErrors.current_password) {
                    currentPasswordRef.current?.focus()
                } else if (fieldErrors.new_password) {
                    newPasswordRef.current?.focus()
                } else if (fieldErrors.new_password_confirmation) {
                    confirmPasswordRef.current?.focus()
                }
            } else {
                toast.error(err.response?.data?.message || "Something went wrong")
            }
        } finally {
            setLoading(false)
        }
    }

    const renderPasswordField = (label, name, ref, showKey) => (
        <div>
            <label className="block text-sm font-medium mb-1">{label}</label>
            <div className="relative">
                <input
                    type={showPassword[showKey] ? "text" : "password"}
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    placeholder={`Enter ${label}`}
                    ref={ref}
                    className="w-full border rounded-lg p-2 pr-10"
                    required
                />
                {form[name] && (
                    <button
                        type="button"
                        onClick={() =>
                            setShowPassword((prev) => ({
                                ...prev,
                                [showKey]: !prev[showKey],
                            }))
                        }
                        className="absolute inset-y-0 right-2 flex items-center cursor-pointer text-gray-500 hover:text-gray-700"
                    >
                        {showPassword[showKey] ? (
                            <EyeSlashIcon className="h-5 w-5"/>
                        ) : (
                            <EyeIcon className="h-5 w-5"/>
                        )}
                    </button>
                )}
            </div>
            {errors[name] && (
                <p className="text-sm text-red-500 mt-1">{errors[name][0]}</p>
            )}
        </div>
    )

    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow">
            <h2 className="text-xl font-semibold mb-4">Change Password</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                {user?.has_password &&
                    renderPasswordField(
                        "Current Password",
                        "current_password",
                        currentPasswordRef,
                        "current"
                    )}

                {renderPasswordField(
                    "New Password",
                    "new_password",
                    newPasswordRef,
                    "new"
                )}

                {renderPasswordField(
                    "Confirm New Password",
                    "new_password_confirmation",
                    confirmPasswordRef,
                    "confirm"
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
                >
                    {loading ? "Changing..." : "Change Password"}
                </button>
            </form>
        </div>
    )
}
