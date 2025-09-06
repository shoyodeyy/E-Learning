// Avatar.jsx
export default function Avatar({ name, avatarUrl, size = 40 }) {
    // ✅ Nếu có avatarUrl thì ưu tiên hiển thị ảnh từ backend
    if (avatarUrl) {
        return (
            <img
                src={avatarUrl}
                alt={name || "User"}
                className="rounded-full object-cover"
                style={{ width: size, height: size }}
            />
        );
    }

    // ❌ Nếu không có avatar thì hiển thị code cũ (initials)
    const initials = name
        ? name
            .trim()
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
        : "U";

    return (
        <div
            className="flex items-center justify-center rounded-full bg-black text-white font-semibold"
            style={{ width: size, height: size }}
        >
            {initials}
        </div>
    );
}
