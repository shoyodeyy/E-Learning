import { User } from "lucide-react";

import { useAuth } from "../context/AuthContext";

export default function Avatar({ size = 40 }) {
    const { user } = useAuth();

    if (!user) {
        return (
            <div className="flex items-center justify-center rounded-full bg-gray-400 text-white font-semibold" style={{ width: size, height: size }}>
                <User />
            </div>
        );
    }

    return user.avatar ? (
        <img
            src={`http://localhost:8000/storage/${user.avatar}`}
            alt={user.name}
            className="rounded-full object-cover"
            style={{ width: size, height: size }}
        />
    ) : (
        <div className="flex items-center justify-center rounded-full bg-black text-white font-semibold" style={{ width: size, height: size }}>
            {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
        </div>
    );
}
