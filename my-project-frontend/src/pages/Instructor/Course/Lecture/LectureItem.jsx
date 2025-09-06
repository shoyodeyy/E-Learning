import {useState} from "react";

import {ArrowUp, ArrowDown, X, Plus, Pencil, Trash, Book,} from "lucide-react";

export default function LectureItem({sectionId, itemId, lec, setCourse, isEditingSectionId, handleRemoveItem}) {
    const [editedNameLecture, setEditedNameLecture] = useState("");
    const [isEditingLectureId, setIsEditingLectureId] = useState(null);
    const [youtubeInput, setYoutubeInput] = useState("");

    const isEditingLectureLocal = isEditingLectureId === lec.id;
    const isAddingVideoLocal = lec.isAddingVideo;

    const hasVideoFile = lec.videoFile;
    const hasVideoUrl = lec.videoUrl;

    function handleRenameLecture(sectionId, itemId, newTitle) {
        setCourse((prev) => ({
            ...prev,
            sections: prev.sections.map((sec) =>
                sec.id === sectionId
                    ? {
                        ...sec,
                        items: sec.items.map((it) =>
                            it.id === itemId && it.type === "Lecture"
                                ? {
                                    ...it,
                                    title: newTitle
                                } : it
                        ),
                    }
                    : sec
            ),
        }));

        setIsEditingLectureId(null);
        setEditedNameLecture("");
    }

    function toggleAddVideo(sectionId, itemId) {
        setCourse(prev => ({
            ...prev,
            sections: prev.sections.map(sec =>
                sec.id === sectionId
                    ? {
                        ...sec,
                        items: sec.items.map(it =>
                            (it.id === itemId && it.type === "Lecture")
                                ? {
                                    ...it,
                                    isAddingVideo: !it.isAddingVideo
                                } : it
                        )
                    } : sec
            )
        }))
    }

    function extractVideoThumbnail(file, seekTo = 0.1) {
        return new Promise((resolve, reject) => {
            const video = document.createElement("video");
            const url = URL.createObjectURL(file);

            video.preload = "metadata";
            video.muted = true;
            video.playsInline = true;
            video.src = url;

            video.onloadedmetadata = () => {
                const duration = video.duration; // thời gian video (giây)

                const canvas = document.createElement("canvas");
                canvas.width = video.videoWidth || 1280;
                canvas.height = video.videoHeight || 720;
                const ctx = canvas.getContext("2d");

                const safeTime = Math.min(
                    Math.max(seekTo, 0.01),
                    isFinite(duration) ? Math.max(duration - 0.01, 0.01) : 0.1
                );

                video.currentTime = safeTime;

                video.onseeked = () => {
                    try {
                        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                        const dataUrl = canvas.toDataURL("image/png");

                        resolve({
                            thumbnail: dataUrl,
                            duration,
                        });
                    } catch (err) {
                        reject(err);
                    } finally {
                        URL.revokeObjectURL(url);
                    }
                };
            };

            video.onerror = () => {
                URL.revokeObjectURL(url);
                reject(new Error("Không đọc được video hoặc codec không hỗ trợ."));
            };
        });
    }

    function formatDuration(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs.toString().padStart(2, "0")}`;
    }

    async function handleUploadVideoFile(sectionId, itemId, file) {
        try {
            const {thumbnail, duration} = await extractVideoThumbnail(file);

            setCourse(prev => ({
                ...prev,
                sections: prev.sections.map(sec =>
                    sec.id === sectionId
                        ? {
                            ...sec,
                            items: sec.items.map(it =>
                                it.id === itemId
                                    ? {
                                        ...it,
                                        videoFile: file,
                                        thumbnail,
                                        duration,
                                    }
                                    : it
                            )
                        }
                        : sec
                )
            }));
        } catch (err) {
            console.error("Generate thumbnail failed:", err);
        }
    }

    async function handleEmbedVideo(sectionId, itemId, url) {
        const videoId = getYoutubeVideoId(url);
        if (!videoId) {
            alert("Invalid Youtube URL");
            return;
        }

        const thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

        // Nếu có API key, bạn có thể gọi YouTube Data API để lấy title + duration
        // Ở đây demo gán tạm title = url, duration = null
        const duration = null;

        setCourse(prev => ({
            ...prev,
            sections: prev.sections.map(sec =>
                sec.id === sectionId
                    ? {
                        ...sec,
                        items: sec.items.map(it =>
                            it.id === itemId
                                ? {
                                    ...it,
                                    videoFile: null,  // clear file nếu trước đó đã upload
                                    videoUrl: url,
                                    thumbnail,
                                    duration,
                                }
                                : it
                        )
                    }
                    : sec
            )
        }));

        setYoutubeInput("");
    }

    function handleReplaceVideo(sectionId, itemId) {
        setCourse(prev => ({
            ...prev,
            sections: prev.sections.map(sec =>
                sec.id === sectionId
                    ? {
                        ...sec,
                        items: sec.items.map(it =>
                            it.id === itemId
                                ? {
                                    ...it,
                                    videoFile: null,
                                    videoUrl: null,
                                }
                                : it
                        )
                    }
                    : sec
            )
        }));

        setYoutubeInput("");
    }

    function getYoutubeVideoId(url) {
        const regExp = /^.*(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return match && match[1].length === 11 ? match[1] : null;
    }

    return (
        <div className="w-full border">
            {/* Lecture Item */}
            {!isEditingLectureLocal && (
                <div className="flex items-center justify-start space-x-3 cursor-move w-full group bg-white px-3 py-3">
                    {/* Lecture Index */}
                    <Book className="w-3"/>
                    <p className="font-bold">
                        {lec.type} {lec.index}:
                    </p>

                    {/* Lecture Title */}
                    <div className="flex items-center space-x-2">
                        {/* Title */}
                        {!isEditingSectionId && (
                            lec.videoFile ? (
                                <div className="flex items-center space-x-2">
                                    <FilePlay className="w-3 cursor-pointer"/>
                                    <p>{lec.title}</p>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-2">
                                    <Book className="w-3 cursor-pointer" />
                                    <p>{lec.title}</p>
                                </div>
                            )
                        )}

                        {/* Pencil Icon */}
                        <div
                            onClick={() => {
                                setEditedNameLecture(lec.title);
                                setIsEditingLectureId(lec.id);
                            }}
                            className="p-1.5 rounded-md bg-transparent hover:bg-gray-200 transition-colors duration-200">
                            <Pencil
                                className="w-3 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            />
                        </div>

                        {/* Trash Icon */}
                        <div
                            onClick={() => {
                                handleRemoveItem(sectionId, itemId);
                            }}
                            className="p-1.5 rounded-md bg-transparent hover:bg-gray-200 transition-colors duration-200">
                            <Trash
                                className="w-3 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            />
                        </div>
                    </div>

                    {/* Add Video Toggle */}
                    <div className="flex-1 flex justify-end">
                        {/* Plus Icon + Add Video */}
                        {(!isAddingVideoLocal && !(lec.videoFile || lec.videoUrl)) && (
                            <button
                                onClick={() => toggleAddVideo(sectionId, itemId)}
                                className="flex items-center gap-x-2 px-5 py-1.5 cursor-pointer border bg-transparent text-purple-800 text-sm font-bold rounded-md hover:bg-gray-100">
                                <Plus className="w-3"/>
                                Add Video
                            </button>
                        )}

                        {/* Add Video + Cancle Icon */}
                        {(isAddingVideoLocal && !(lec.videoFile || lec.videoUrl)) && (
                            <div className="relative">
                                <div
                                    className="bg-white w-32 h-8 px-2 flex items-center justify-center gap-x-2 border border-b-0 absolute right-0 -top-[0.45rem]">
                                    <p className="cursor-text">
                                        Add Video
                                    </p>
                                    <div
                                        onClick={() => {
                                            toggleAddVideo(sectionId, itemId)

                                            if (lec.videoFile == null || lec.videoUrl == null) {
                                                setYoutubeInput("");
                                            }
                                        }}
                                        className="hover:bg-gray-200 p-0.5 rounded-sm cursor-pointer">
                                        <X className="w-5"/>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Arrow Up Button */}
                        {((lec.videoFile || lec.videoUrl) && isAddingVideoLocal) && (
                            <div>
                                <div className=" w-32 h-8 px-2 flex items-center justify-end gap-x-2">
                                    <div
                                        onClick={() => toggleAddVideo(sectionId, itemId)}
                                        className="hover:bg-gray-200 p-1 rounded-sm cursor-pointer">
                                        <ArrowUp className="w-3"/>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Arrow Down Button */}
                        {((lec.videoFile || lec.videoUrl) && !isAddingVideoLocal) && (
                            <div>
                                <div className=" w-32 h-8 px-2 flex items-center justify-end gap-x-2">
                                    <div
                                        onClick={() => toggleAddVideo(sectionId, itemId)}
                                        className="hover:bg-gray-200 p-0 rounded-sm cursor-pointer">
                                        <ArrowDown className="w-5"/>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Edit Lecture Mode */}
            {isEditingLectureLocal && (
                <div className="flex flex-col items-center justify-start w-full space-y-5 px-2 py-5 bg-white">
                    <div className="flex items-center space-x-3 cursor-move w-full group">
                        {/* Lecture Index*/}
                        <p className="font-bold w-21">
                            Lecture {lec.index}:
                        </p>

                        {/* Input Rename Lecture */}
                        {isEditingLectureLocal && (
                            <div className="flex items-center space-x-2 w-full">
                                <input
                                    type="text"
                                    autoFocus
                                    onChange={(e) => setEditedNameLecture(e.target.value)}
                                    value={editedNameLecture}
                                    className="px-4 py-1 w-full border border-gray-400 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-800 focus:border-purple-800"
                                />
                            </div>
                        )}
                    </div>

                    {/* Cancel and Save button */}
                    <div className="flex items-center justify-end w-full space-x-5">
                        <button
                            onClick={() => {
                                setIsEditingLectureId(null);
                                setEditedNameLecture("");
                            }}
                            className="px-5 py-1.5 cursor-pointer bg-transparent hover:bg-gray-100 transition text-purple-800 font-bold rounded-md"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                handleRenameLecture(sectionId, itemId, editedNameLecture)
                            }}
                            className="px-5 py-1.5 cursor-pointer bg-purple-800 text-white font-bold rounded-md shadow hover:bg-purple-800 disabled:opacity-30 disabled:cursor-not-allowed"
                            disabled={!editedNameLecture.trim()}
                        >
                            Save Lecture
                        </button>
                    </div>
                </div>
            )}

            {/* Add Video Container */}
            {isAddingVideoLocal && (
                <div className="flex flex-col pb-5 w-full border-t bg-white">
                    {/* Upload File */}
                    <div className="flex gap-x-5 px-3 py-4 pb-0">
                        {!(hasVideoFile || hasVideoUrl) && (
                            <input
                                id={`fileInput-${lec.id}`}
                                type="file"
                                accept="video/*"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (!file) return;

                                    handleUploadVideoFile(sectionId, itemId, file);
                                }}
                                className="px-4 py-2.5 w-full bg-transparent border border-gray-400 rounded-sm focus:outline-none cursor-pointer"
                            />
                        )}

                        {/* Select Video Button */}
                        {!(hasVideoFile || hasVideoUrl) && (
                            <label
                                htmlFor={`fileInput-${lec.id}`}
                                className="w-40 h-[11.5] px-5 py-1.5 border bg-transparent text-purple-800 text-sm font-bold rounded-md hover:bg-gray-100 flex items-center justify-center cursor-pointer"
                            >
                                Select Video
                            </label>
                        )}
                    </div>

                    {/* Note */}
                    {!(hasVideoFile || hasVideoUrl) && (
                        <div className="px-3 py-2">
                            <p className="text-sm text-gray-500">
                                <span className="font-semibold text-gray-700">Note</span>
                                : All files should be at least 720p and less than 4.0 GB.
                            </p>
                        </div>
                    )}

                    {/* --- or --- */}
                    {!(hasVideoFile || hasVideoUrl) && (
                        <div className="flex items-center pt-5 px-3 w-full">
                            {/* Vertical Line 1 */}
                            <hr className="flex-grow border-t border-gray-400"/>

                            {/* Or text*/}
                            <span className="px-3 text-gray-600">
                                Or
                            </span>

                            {/* Vertical Line 2 */}
                            <hr className="flex-grow border-t border-gray-400"/>
                        </div>
                    )}

                    {/* Upload URL */}
                    {!(hasVideoFile || hasVideoUrl) && (
                        <div className="flex gap-x-5 px-3 py-4 pb-0">
                            <input
                                type="text"
                                placeholder="Enter Youtube video URL"
                                onChange={(e) => {
                                    setYoutubeInput(e.target.value);
                                }}
                                value={youtubeInput}
                                className="px-4 py-2.5 w-full border border-gray-400 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-800 focus:border-purple-800"
                            />

                            {/* Embed Button */}
                            <button
                                onClick={() => handleEmbedVideo(sectionId, itemId, youtubeInput)}
                                className="w-40 px-5 py-1.5 border bg-transparent text-purple-800 text-sm font-bold rounded-md hover:bg-gray-100 flex items-center justify-center cursor-pointer"
                            >
                                Embed Video
                            </button>
                        </div>
                    )}

                    {/* Video Preview */}
                    {(hasVideoFile || hasVideoUrl) && (
                        <div className="flex w-full font-bold px-3">
                            {/* Thumbnail */}
                            <div>
                                {lec.thumbnail ? (
                                    <img
                                        src={lec.thumbnail}
                                        alt="video-thumbnail-preview"
                                        className="min-w-40 h-20 object-cover"
                                    />
                                ) : (
                                    <div
                                        className="min-w-40 h-24 flex items-center justify-center text-xs text-gray-500">
                                        No thumbnail
                                    </div>
                                )}
                            </div>

                            {/* Summary Video */}
                            <div className="px-4 flex flex-col flex-grow">
                                {/* Title Video */}
                                <p className="w-full flex flex-wrap flex-col text-md font-bold">
                                    {hasVideoFile
                                        ? lec.videoFile.name
                                        : lec.videoUrl
                                    }
                                </p>

                                {/* Duration Video */}
                                <p className="text-lg font-normal">
                                    {lec.duration ? formatDuration(lec.duration) : "00:00"}
                                </p>

                                {/* Edit Video */}
                                <div
                                    className="w-19 flex items-center space-x-2 font-normal text-[16px] text-purple-800 hover:font-semibold py-1.5 cursor-pointer">
                                    {/* Pencil Icon */}
                                    <Pencil
                                        className="w-3"
                                    />

                                    {/* Select Video Button */}
                                    <button
                                        onClick={() => {
                                            handleReplaceVideo(sectionId, itemId)
                                        }}
                                        className="min-w-24 py-1.5  text-purple-800 text-sm font-bold rounded-md hover:text-purple-600 cursor-pointer"
                                    >
                                        Replace Video
                                    </button>

                                    {/* Input File Hidden */}
                                    <input
                                        id={`fileInput-${lec.id}`}
                                        type="file"
                                        accept="video/*"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (!file) return;

                                            handleUploadVideoFile(sectionId, itemId, file);
                                        }}
                                        className="hidden px-4 py-2.5 w-full bg-transparent border border-gray-400 rounded-sm focus:outline-none cursor-pointer"
                                    />
                                </div>
                            </div>

                            {/* Preview Button */}
                            <label
                                className="w-25 h-10 px-5 border bg-purple-800 text-white text-sm font-bold rounded-md hover:bg-purple-700 flex items-center justify-center cursor-pointer"
                            >
                                Preview
                            </label>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
