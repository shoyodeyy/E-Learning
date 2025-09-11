import { useEffect, useState } from "react"

import { getProfile } from "../api/profileApi.js";
import { User } from "lucide-react";

export default function Avatar({ size = 40 }) {
    const [user, setUser] = useState(null)

    useEffect(() => {
        getProfile().then(setUser).catch(() => setUser(null))
    }, [])

    if (!user) {
        return (
            <div
                className="flex items-center justify-center rounded-full bg-gray-400 text-white font-semibold"
                style={{ width: size, height: size }}
            >
                <User />
            </div>
        )
    }

    return user.avatar ? (
        <img
            src={`http://localhost:8000/storage/${user.avatar}`}
            alt={user.name}
            className="rounded-full object-cover"
            style={{ width: size, height: size }}
        />
    ) : (
        <div
            className="flex items-center justify-center rounded-full bg-black text-white font-semibold"
            style={{ width: size, height: size }}
        >
            {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
        </div>
    )
}
