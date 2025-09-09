import { useState } from "react";
import axios from 'axios';

import { FilePlay, X, Plus, Pencil, Trash, Book } from "lucide-react";
import { apiUrl } from "../../../../services/http.jsx";
import {toast} from "react-toastify";

export default function LectureItem({sectionId, itemId, lec, setCourse, isEditingSectionId, handleRemoveItem}) {
    const [editedNameLecture, setEditedNameLecture] = useState("");
    const [isEditingLectureId, setIsEditingLectureId] = useState(null);
    const [youtubeInput, setYoutubeInput] = useState("");

    const isEditingLectureLocal = isEditingLectureId === lec.id;
    const isAddingVideoLocal = lec.isAddingVideo;

    const hasVideoFile = lec.videoFile;
    const hasVideoUrl = lec.videoUrl;

    async function handleRenameLecture(sectionId, itemId, newTitle) {
        try {
            // 1. Gửi request lên backend
            const res = await axios.put(
                `${apiUrl}/sections/${sectionId}/lectures/${itemId}`,
                { lectureTitle: newTitle }
            );

            const updatedLecture = mapLectureFromBackend(res.data.lecture);

            // 2. Update state từ backend trả về
            setCourse((prev) => ({
                ...prev,
                sections: prev.sections.map((sec) =>
                    sec.id === sectionId
                        ? {
                            ...sec,
                            items: sec.items.map((it) =>
                                it.id === itemId && it.type === "Lecture"
                                    ? { ...it, ...updatedLecture }
                                    : it
                            ),
                        }
                        : sec
                ),
            }));

            // 3. Reset UI
            setIsEditingLectureId(null);
            setEditedNameLecture("");

        } catch (err) {
            console.error("Rename lecture failed:", err);
            toast.error("Failed to rename lecture");
        }
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

    function mapLectureFromBackend(lec) {
        const baseUrl = "http://localhost:8000/storage/"; // hoặc lấy từ .env

        let thumbnail = null;
        if (lec.thumbnail) {
            if (lec.thumbnail.startsWith("http")) {
                thumbnail = lec.thumbnail;
            } else {
                thumbnail = `${baseUrl}${lec.thumbnail}`;
            }
            thumbnail += `?t=${Date.now()}`;
        }

        return {
            id: lec.lectureId,
            type: lec.type,
            title: lec.lectureTitle,
            index: lec.lectureIndex,
            videoUrl: lec.videoUrl,
            videoFile: lec.videoFile,
            videoName: lec.videoName,
            thumbnail,
            duration: lec.lectureDuration,
        };
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
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);

        if (hrs > 0) {
            return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
        } else {
            return `${mins}:${secs.toString().padStart(2, "0")}`;
        }
    }

    async function handleEmbedVideo(sectionId, itemId, url) {
        const videoId = getYoutubeVideoId(url);
        if (!videoId) {
            toast.error("Invalid Youtube URL");
            return;
        }

        const API_KEY = "AIzaSyBc6QXWCnZrNe-PS8BE1b76njIOVDOfk2o";

        try {
            // 1. Lấy thông tin video từ Youtube API
            const res = await fetch(
                `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}&key=${API_KEY}`
            );
            const data = await res.json();

            if (!data.items || data.items.length === 0) {
                toast.error("Video not found");
                return;
            }

            const snippet = data.items[0].snippet;
            const contentDetails = data.items[0].contentDetails;

            const videoName = snippet.title;
            const thumbnail = snippet.thumbnails.high.url;
            const duration = parseYoutubeDuration(contentDetails.duration);

            // 2. Gửi request update lecture lên backend
            const backendRes = await axios.put(
                `${apiUrl}/sections/${sectionId}/lectures/${itemId}`,
                {
                    videoUrl: url,
                    thumbnail,
                    lectureDuration: duration,
                    videoName,
                }
            );

            const updatedLecture = mapLectureFromBackend(backendRes.data.lecture);

            // 3. Update state bằng dữ liệu backend trả về
            setCourse(prev => ({
                ...prev,
                sections: prev.sections.map(sec =>
                    sec.id === sectionId
                        ? {
                            ...sec,
                            items: sec.items.map(it =>
                                it.id === itemId
                                    ? {
                                        ...it, ...updatedLecture, videoName
                                    }
                                    : it
                            ),
                        }
                        : sec
                ),
            }));

            // reset

        } catch (err) {
            console.error(err);
            toast.error("Failed to embed video");
        }

        setYoutubeInput("");
    }

    async function handleUploadVideoFile(sectionId, itemId, file) {
        let videoUrl = null;

        try {
            videoUrl = URL.createObjectURL(file);

            // 1. Lấy duration
            const duration = await new Promise((resolve, reject) => {
                const video = document.createElement("video");
                video.preload = "metadata";
                video.src = videoUrl;
                video.onloadedmetadata = () => resolve(video.duration);
                video.onerror = reject;
            });

            // 2. Extract thumbnail từ video
            const { thumbnail } = await extractVideoThumbnail(file, 0.1);

            // 3. Convert base64 thumbnail thành File (blob)
            const blob = await (await fetch(thumbnail)).blob();
            const thumbFile = new File([blob], "thumbnail.png", { type: "image/png" });

            // 4. Tạo formData
            const formData = new FormData();
            formData.append("videoFile", file);
            formData.append("thumbnail", thumbFile);   // 👈 gửi file ảnh thay vì base64
            formData.append("lectureDuration", Math.floor(duration));
            formData.append("videoName", file.name);

            // 5. Gọi API
            const res = await axios.post(
                `${apiUrl}/sections/${sectionId}/lectures/${itemId}?_method=PUT`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            const updatedLecture = mapLectureFromBackend(res.data.lecture);

            // 6. Update state
            setCourse(prev => ({
                ...prev,
                sections: prev.sections.map(sec =>
                    sec.id === sectionId
                        ? {
                            ...sec,
                            items: sec.items.map(it =>
                                it.id === itemId ? { ...it, ...updatedLecture } : it
                            ),
                        }
                        : sec
                ),
            }));
        } catch (err) {
            console.error("Upload video error:", err);
            toast.error("Upload failed");
        } finally {
            if (videoUrl) URL.revokeObjectURL(videoUrl);
        }
    }

    async function handleReplaceVideo(sectionId, itemId) {
        try {
            // 1. Gọi API update lecture, clear video info
            const res = await axios.put(
                `${apiUrl}/sections/${sectionId}/lectures/${itemId}`,
                {
                    videoUrl: null,
                    videoFile: null,
                    thumbnail: null,
                    lectureDuration: null,
                    videoName: null,
                }
            );

            const updatedLecture = mapLectureFromBackend(res.data.lecture);

            // 2. Update state
            setCourse(prev => ({
                ...prev,
                sections: prev.sections.map(sec =>
                    sec.id === sectionId
                        ? {
                            ...sec,
                            items: sec.items.map(it =>
                                it.id === itemId ? { ...it, ...updatedLecture } : it
                            ),
                        }
                        : sec
                ),
            }));

        } catch (err) {
            console.error("Replace video failed:", err);
            toast.error("Failed to replace video");
        } finally {
            setYoutubeInput("");
        }
    }

    function getYoutubeVideoId(url) {
        const regExp = /^.*(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return match && match[1].length === 11 ? match[1] : null;
    }

    function parseYoutubeDuration(duration) {
        const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
        const hours = match[1] ? parseInt(match[1].replace("H", "")) : 0;
        const minutes = match[2] ? parseInt(match[2].replace("M", "")) : 0;
        const seconds = match[3] ? parseInt(match[3].replace("S", "")) : 0;
        return hours * 3600 + minutes * 60 + seconds;
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
                            <div className="flex items-center space-x-2">
                                {lec.videoFile ? (
                                    <FilePlay className="w-3 cursor-pointer"/>
                                ) : (
                                    <Book className="w-3 cursor-pointer" />
                                )}
                                <p>{lec.title}</p>
                            </div>
                        )}

                        {/* Pencil Icon */}
                        <div
                            onClick={() => {
                                setEditedNameLecture(lec.title || lec.videoFile?.name || lec.videoUrl);
                                setIsEditingLectureId(lec.id);
                            }}
                            className="p-1 rounded-md bg-transparent hover:bg-gray-200 transition-colors duration-200">
                            <Pencil
                                className="w-3 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            />
                        </div>

                        {/* Trash Icon */}
                        <div
                            onClick={() => {
                                handleRemoveItem(sectionId, itemId, "Lecture");
                            }}
                            className="p-1.5 rounded-md bg-transparent hover:bg-gray-200 transition-colors duration-200">
                            <Trash
                                className="w-3 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            />
                        </div>
                    </div>

                    {/* Add Video Toggle */}
                    <div className="flex-1 flex justify-end">
                        {(!isAddingVideoLocal && !(lec.videoFile || lec.videoUrl)) && (
                            <button
                                onClick={() => toggleAddVideo(sectionId, itemId)}
                                className="flex items-center gap-x-2 px-5 py-1.5 cursor-pointer border bg-transparent text-purple-800 text-sm font-bold rounded-md hover:bg-gray-100">
                                <Plus className="w-3"/>
                                Add Video
                            </button>
                        )}

                        {(isAddingVideoLocal && !(lec.videoFile || lec.videoUrl)) && (
                            <div className="relative">
                                <div
                                    className="bg-white w-32 h-8 px-2 flex items-center justify-center gap-x-2 border border-b-0 absolute right-0 -top-[0.10rem]">
                                    <p className="cursor-text">
                                        Add Video
                                    </p>
                                    <div
                                        onClick={() => {
                                            toggleAddVideo(sectionId, itemId)
                                            if (!lec.videoFile && !lec.videoUrl) {
                                                setYoutubeInput("");
                                            }
                                        }}
                                        className="hover:bg-gray-200 p-0.5 rounded-sm cursor-pointer">
                                        <X className="w-5"/>
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
            {(isAddingVideoLocal && (!hasVideoFile && !hasVideoUrl)) && (
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
                            <hr className="flex-grow border-t border-gray-400"/>
                            <span className="px-3 text-gray-600">Or</span>
                            <hr className="flex-grow border-t border-gray-400"/>
                        </div>
                    )}

                    {/* Upload URL */}
                    {!(hasVideoFile || hasVideoUrl) && (
                        <div className="flex gap-x-5 px-3 py-4 pb-0">
                            <input
                                type="text"
                                placeholder="Enter Youtube video URL"
                                onChange={(e) => setYoutubeInput(e.target.value)}
                                value={youtubeInput}
                                className="px-4 py-2.5 w-full border border-gray-400 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-800 focus:border-purple-800"
                            />

                            <button
                                onClick={() => handleEmbedVideo(sectionId, itemId, youtubeInput)}
                                className="w-40 px-5 py-1.5 border bg-transparent text-purple-800 text-sm font-bold rounded-md hover:bg-gray-100 flex items-center justify-center cursor-pointer"
                            >
                                Embed Video
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Video Preview */}
            {(hasVideoFile || hasVideoUrl) && (
                <div className="flex w-full font-bold px-3 py-3 bg-white border-t">
                    <div>
                        {lec.thumbnail ? (
                            <img
                                src={lec.thumbnail}
                                alt="video-thumbnail-preview"
                                className="min-w-40 h-20 object-cover"
                            />
                        ) : (
                            <div className="min-w-40 h-24 flex items-center justify-center text-xs text-gray-500">
                                No thumbnail
                            </div>
                        )}
                    </div>

                    <div className="px-4 flex flex-col flex-grow">
                        {/* Title Video */}
                        <p className="w-full flex flex-wrap flex-col text-md font-bold">
                            {lec.videoName || "Untitled Video"}
                        </p>

                        {/* Duration Video */}
                        <p className="text-lg font-normal">
                            {lec.duration ? formatDuration(lec.duration) : "00:00"}
                        </p>

                        {/* Edit / Replace Video */}
                        <div className="w-19 flex items-center space-x-2 font-normal text-[16px] text-purple-800 hover:font-semibold py-1.5 cursor-pointer">
                            <Pencil className="w-3"/>
                            <button
                                onClick={() => handleReplaceVideo(sectionId, itemId)}
                                className="min-w-24 py-1.5 text-purple-800 text-sm font-bold rounded-md hover:text-purple-600 cursor-pointer"
                            >
                                Replace Video
                            </button>

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
                    <label className="w-25 h-10 px-5 border bg-purple-800 text-white text-sm font-bold rounded-md hover:bg-purple-700 flex items-center justify-center cursor-pointer">
                        Preview
                    </label>
                </div>
            )}
        </div>
    )
}
