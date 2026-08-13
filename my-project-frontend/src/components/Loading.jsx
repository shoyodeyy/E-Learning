const Loading = () => {
    return (
        <div className="flex flex-col items-center justify-center py-20">
            <div
                className="w-12 h-12 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-purple-600 font-semibold">Loading events...</p>
        </div>
    )
}
export default Loading
