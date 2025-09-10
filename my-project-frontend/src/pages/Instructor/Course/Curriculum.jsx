import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from 'axios';
import { X, File, Pencil, Trash, Plus } from "lucide-react";
import {toast} from "react-toastify";

import SidebarCourseManage from "./SidebarCourseManage.jsx";
import HeaderCourseManage from "./HeaderCourseManage.jsx";
import LectureItem from "./Lecture/LectureItem.jsx";
import QuizItem from "./Quiz/QuizItem.jsx";
import { apiUrl } from "../../../services/http.jsx";

export default function Curriculum() {
    const {courseID} = useParams();
    const navigate = useNavigate();

    const [course, setCourse] = useState({
        id: crypto.randomUUID(),
        title: "",
        description: "",
        category: "",
        status: "",
        price: 0,
        level: "",
        badge: "",
        instructor: "",
        approvedBy: "",
        avgRating: "",
        totalStudents: 0,
        totalDuration: 0,
        sections: []
    });

    // fetch data by axios
    useEffect(() => {
        async function fetchCourse() {
            try {
                const res = await fetch(`${apiUrl}/courses/${courseID}`);
                const data = await res.json();

                const sections = (data.data.sections || []).map(sec => ({
                    id: sec.sectionId,
                    title: sec.sectionTitle,
                    index: sec.sectionIndex,
                    totalDuration: sec.totalDuration,
                    items: (sec.items || []).map(it => ({
                        id: it.itemId,
                        type: it.type,
                        index: it.itemIndex,
                        title: it.itemTitle,
                        videoUrl: it.videoUrl,
                        videoFile: it.videoFile,
                        videoName: it.videoName,
                        thumbnail: it.thumbnail,
                        duration: it.duration,
                        isAddingVideo: false,

                        questions: it.questions || [],
                        hasMultipleQuestion: it.questions && it.questions.length > 0,
                        isAddingQuestion: false,
                    }))
                }));

                setCourse(prev => ({
                    ...prev,
                    id: courseID,
                    title: data.data.courseTitle,
                    category: data.data.category?.categoryName || "",
                    status: data.data.status?.statusName || "",
                    totalDuration: data.data.totalDuration || 0,
                    sections
                }));
            } catch (error) {
                console.error("Error load course: ", error);
            }
        }

        fetchCourse();
    }, [courseID]);

    // auto scroll to top
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [courseID]);

    const [addingToSectionId, setAddingToSectionId] = useState(null);

    // state Section
    const [editedSectionName, setEditedSectionName] = useState("");
    const [isEditingSectionId, setIsEditingSectionId] = useState(null);

    // state Lecture
    const [newLectureTitle, setNewLectureTitle] = useState("");
    const [isNewLecture, setIsNewLecture] = useState(false);

    // state Quiz
    const [newQuizTitle, setNewQuizTitle] = useState("");
    const [isNewQuiz, setIsNewQuiz] = useState(false);

    async function handleRenameSection(sectionId, newTitle) {
        if (!newTitle.trim()) return;

        try {
            const res = await axios.put(`${apiUrl}/courses/${courseID}/sections/${sectionId}`, {
                sectionTitle: newTitle
            });

            const updatedSection = res.data.section;

            // Cập nhật lại state với dữ liệu mới từ backend
            setCourse(prev => ({
                ...prev,
                sections: prev.sections.map(sec =>
                    sec.id === sectionId
                        ? {
                            ...sec,
                            title: updatedSection.sectionTitle,
                            index: updatedSection.sectionIndex
                        }
                        : sec
                ),
            }));

            // Reset state edit
            setIsEditingSectionId(null);
            setEditedSectionName("");

        } catch (error) {
            console.error("Error updating section:", error);
        }
    }

    async function handleAddSection() {
        try {
            const res = await axios.post(`${apiUrl}/courses/${courseID}/sections`, {
                sectionTitle: `New Section ${course.sections.length + 1}`
            });

            const savedSection = {
                id: res.data.section.sectionId,
                title: res.data.section.sectionTitle,
                index: res.data.section.sectionIndex,
                totalDuration: 0,
                items: []
            };

            setCourse(prev => ({
                ...prev,
                sections: [...prev.sections, savedSection]
            }));

        } catch (error) {
            console.error("Error adding section:", error);
        }
    }

    async function handleAddLecture(sectionId) {
        if (!newLectureTitle.trim()) return;

        try {
            const res = await axios.post(`${apiUrl}/sections/${sectionId}/lectures`, {
                lectureTitle: newLectureTitle
            });

            const savedLecture = {
                id: res.data.lecture.lectureId,
                type: "Lecture",
                index: res.data.lecture.lectureIndex,
                title: res.data.lecture.lectureTitle,
                videoUrl: res.data.lecture.videoUrl,
                videoFile: res.data.lecture.videoFile,
                thumbnail: res.data.lecture.thumbnail,
                duration: res.data.lecture.lectureDuration,
                isAddingVideo: false,
            };

            setCourse(prev => ({
                ...prev,
                sections: prev.sections.map(sec =>
                    sec.id === sectionId
                        ? { ...sec, items: [...sec.items, savedLecture] }
                        : sec
                )
            }));

            setNewLectureTitle("");
            setAddingToSectionId(null);

        } catch (error) {
            console.error("Error adding lecture: ", error);
        }
    }

    async function handleAddQuiz(sectionId, itemId) {
        if (!newQuizTitle.trim()) return;

        try {
            // 1. Gửi request tạo quiz lên backend
            const res = await axios.post(`${apiUrl}/sections/${sectionId}/quizzes`, {
                quizTitle: newQuizTitle
            });

            const backendQuiz = res.data.quiz; // quiz trả về từ backend, có quizId và quizIndex

            setCourse(prev => ({
                ...prev,
                sections: prev.sections.map(sec => {
                    if (sec.id !== sectionId) return sec;

                    const oldItems = sec.items || [];

                    // Tạo quiz mới dựa trên backend trả về
                    const newQuiz = {
                        id: backendQuiz.quizId, // lấy quizId thật
                        type: "Quiz",
                        title: backendQuiz.quizTitle,
                        description: backendQuiz.description || "",
                        index: backendQuiz.quizIndex,
                        questions: [],
                        isAddingQuestion: false,
                        hasMultipleQuestion: false
                    };

                    let newItems;
                    if (itemId) {
                        // Chèn quiz theo sau item có id = itemId
                        const insertIndex = oldItems.findIndex(it => it.id === itemId);
                        if (insertIndex === -1) {
                            newItems = [...oldItems, newQuiz];
                        } else {
                            newItems = [
                                ...oldItems.slice(0, insertIndex + 1),
                                newQuiz,
                                ...oldItems.slice(insertIndex + 1)
                            ];
                        }
                    } else {
                        // Nếu không có itemId thì push vào cuối
                        newItems = [...oldItems, newQuiz];
                    }

                    // Cập nhật lại index cho tất cả quiz trong section
                    let quizCounter = 0;
                    newItems = newItems.map(it => {
                        if (it.type === "Quiz") {
                            quizCounter++;
                            return { ...it, index: quizCounter };
                        }
                        return it;
                    });

                    return {
                        ...sec,
                        items: newItems
                    };
                })
            }));

            setNewQuizTitle("");
            setIsNewQuiz(false);
            setAddingToSectionId(null);

        } catch (error) {
            console.error("Error adding quiz:", error);
            toast.error("Failed to add quiz");
        }
    }

    async function handleRemoveSection(sectionId) {
        // confirm
        const confirmed = window.confirm("Are you sure you want to remove this section?");
        if (!confirmed) return;

        try {
            // gọi API xoá ở backend
            await axios.delete(`${apiUrl}/courses/${courseID}/sections/${sectionId}`);

            // xoá ở frontend state
            setCourse(prev => {
                const updatedSections = prev.sections
                    .filter(sec => sec.id !== sectionId)
                    // re-index
                    .map((sec, idx) => ({
                        ...sec,
                        index: idx + 1
                    }));

                return {
                    ...prev,
                    sections: updatedSections
                };
            });

        } catch (error) {
            console.error("Error deleting section:", error);
            toast.error("Failed to delete section. Please try again.");
        }
    }

    async function handleRemoveItem(sectionId, itemId, itemType) {
        const confirmed = window.confirm(
            "You are about to remove a curriculum item. Are you sure you want to continue?"
        );
        if (!confirmed) return;

        try {
            // remove Lecture
            if (itemType === "Lecture") {
                await axios.delete(`${apiUrl}/sections/${sectionId}/lectures/${itemId}`);
            }

            // remove Quiz
            if (itemType === "Quiz") {
                await axios.delete(`${apiUrl}/sections/${sectionId}/quizzes/${itemId}`);
            }

        } catch (err) {
            console.error("Delete failed:", err);
            toast.error("Failed to delete item on server");
            return;
        }

        // Nếu xoá backend thành công thì update state
        setCourse(prev => ({
            ...prev,
            sections: prev.sections.map(sec => {
                if (sec.id !== sectionId) return sec;

                const newItems = sec.items.filter(it => it.id !== itemId);

                return {
                    ...sec,
                    items: reindexItemsByType(newItems),
                };
            }),
        }));
    }

    function reindexItemsByType(items) {
        let lectureCounter = 0;
        let quizCounter = 0;

        return items.map(it => {
            if (it.type === "Lecture") {
                lectureCounter++;
                return {
                    ...it,
                    index: lectureCounter
                };
            }
            if (it.type === "Quiz") {
                quizCounter++;
                return {
                    ...it,
                    index: quizCounter
                }
            }

            return it;
        });
    }

    function SectionItem({section}) {
        return (
            <div className="flex flex-col space-y-5 w-full">
                {section.items.map((item) => (
                    item.type === "Lecture" ? (
                        <LectureItem
                            key={item.id}
                            sectionId={section.id}
                            itemId={item.id}
                            lec={item}
                            setCourse={setCourse}
                            isEditingSectionId={isEditingSectionId}
                            handleRemoveItem={handleRemoveItem}
                        />
                    ) : (
                        <QuizItem
                            key={item.id}
                            sectionId={section.id}
                            itemId={item.id}
                            quiz={item}
                            setCourse={setCourse}
                            handleRemoveItem={handleRemoveItem}
                        />
                    )
                ))}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* Header */}
            <HeaderCourseManage
                course={course}
                title={course.title}
                status={course.status}
            />

            <main className="pt-20 max-w-7xl mx-auto w-full flex flex-1 bg-white p-7">
                <div className="flex w-full space-y-10 space-x-10">
                    {/* Sidebar */}
                    {<SidebarCourseManage/>}

                    {/* Content */}
                    <div className="bg-white flex-1 shadow-[0_0_20px_rgba(0,0,0,0.15)]">
                        {/* Title */}
                        <div className="py-10 px-12 border-b-1 border-gray-300">
                            <p className="text-2xl font-bold">Curriculum</p>
                        </div>

                        <div className="flex flex-col space-y-13 w-full h-full py-10 px-12">
                            {/* Notice */}
                            <div className="flex flex-col gap-y-2">
                                <p>
                                    Start putting together your course by creating sections, lectures and practice
                                    (quizzes, coding exercises and assignments).
                                </p>
                                <p>
                                    Start putting together your course by creating sections, lectures and practice
                                    activities (<span className="font-semibold text-purple-800">quizzes, coding exercises and assignments</span>).
                                    Use your <span className="font-semibold text-purple-800">course outline</span> to
                                    structure your content and label your sections and lectures clearly. If you’re
                                    intending to offer your course for free, the total length of video content must be
                                    less than 2 hours.
                                </p>
                            </div>

                            {/* Section */}
                            <div className="w-full flex flex-col gap-y-18">
                                {course.sections.map((section) => (
                                    <div key={section.id} className="flex flex-col gap-y-5">
                                        <div className="flex flex-col gap-y-10 w-full px-2 py-5 bg-gray-100 border">
                                            {/* Title Section */}
                                            <div>
                                                {isEditingSectionId !== section.id && (
                                                    <div
                                                        className="flex items-center justify-start space-x-3 cursor-move w-full group">
                                                        {/* Section Index*/}
                                                        <p className="font-bold">
                                                            Section {section.index}:
                                                        </p>

                                                        <div className="flex items-center space-x-2">
                                                            {/* Section Title */}
                                                            {isEditingSectionId !== section.id && (
                                                                <div className="flex items-center space-x-2">
                                                                    <File className="w-3 cursor-pointer"/>
                                                                    <p>{section.title}</p>
                                                                </div>
                                                            )}

                                                            {/* Pencil Icon */}
                                                            <div
                                                                onClick={() => {
                                                                    setEditedSectionName(section.title);
                                                                    setIsEditingSectionId(section.id);
                                                                }}
                                                                className="p-1.5 rounded-md bg-transparent hover:bg-gray-200 transition-colors duration-200">
                                                                < Pencil
                                                                    className="w-3 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-200"/>
                                                            </div>

                                                            {/* Trash Icon */}
                                                            <div
                                                                onClick={() => handleRemoveSection(section.id)}
                                                                className="p-1.5 rounded-md bg-transparent hover:bg-gray-200 transition-colors duration-200">
                                                                <Trash
                                                                    className="w-3 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-200"/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Edit Section */}
                                                {isEditingSectionId === section.id && (
                                                    <div
                                                        className="flex flex-col items-center justify-start w-full space-y-5 px-2 py-5 bg-white border">
                                                        <div
                                                            className="flex items-center space-x-3 cursor-move w-full group">
                                                            {/* Section Index*/}
                                                            <p className="font-bold w-21">
                                                                Section {section.index}:
                                                            </p>

                                                            {/* Input Rename Section */}
                                                            {isEditingSectionId === section.id && (
                                                                <div className="flex items-center space-x-2 w-full">
                                                                    <input
                                                                        type="text"
                                                                        autoFocus
                                                                        onChange={(e) => setEditedSectionName(e.target.value)}
                                                                        value={editedSectionName}
                                                                        className="px-4 py-1 w-full border border-gray-400 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-800 focus:border-purple-800"
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Cancel and Save button */}
                                                        <div className="flex items-center justify-end w-full space-x-5">
                                                            <button
                                                                onClick={() => setIsEditingSectionId(null)}
                                                                className="px-5 py-1.5 cursor-pointer bg-transparent hover:bg-gray-100 transition text-purple-800 font-bold rounded-md"
                                                            >
                                                                Cancel
                                                            </button>
                                                            <button
                                                                onClick={() => handleRenameSection(section.id, editedSectionName)}
                                                                className="px-5 py-1.5 cursor-pointer bg-purple-800 text-white font-bold rounded-md shadow hover:bg-purple-800 disabled:opacity-30 disabled:cursor-not-allowed"
                                                                disabled={!editedSectionName.trim()}
                                                            >
                                                                Save Section
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Curriculum */}
                                            <div
                                                className="flex flex-col items-center justify-start space-y-5 w-full pl-14">
                                                {/* Curriculum Item */}
                                                <SectionItem
                                                    section={section}
                                                />

                                                {/* Add more curriculum  */}
                                                <div
                                                    className="w-full flex flex-col items-start justify-start flex-1 space-x-2 h-14">
                                                    {/* Curriculum item button */}
                                                    {addingToSectionId !== section.id && (
                                                        <button
                                                            onClick={() => setAddingToSectionId(section.id)}
                                                            className="flex items-center justify-center gap-x-2 px-5 py-2 cursor-pointer border bg-white text-purple-800 text-sm font-bold rounded-md hover:bg-gray-200">
                                                            <Plus className="w-3"/>
                                                            Curriculum item
                                                        </button>
                                                    )}

                                                    {addingToSectionId === section.id && (
                                                        <div className="w-full">
                                                            {/* Select item */}
                                                            <div className="flex w-full bg-white">
                                                                {!(isNewLecture || isNewQuiz) && (
                                                                    <div
                                                                        className="flex border border-dashed px-3 py-2 w-full">
                                                                        {/* Lecture */}
                                                                        <div
                                                                            onClick={() => setIsNewLecture(true)}
                                                                            className="flex items-center justify-center gap-x-2 hover:bg-purple-100 text-purple-800 font-bold px-2 rounded-sm cursor-pointer">
                                                                            <Plus className="w-3"/>
                                                                            Lecture
                                                                        </div>

                                                                        {/* Quiz */}
                                                                        <div
                                                                            onClick={() => setIsNewQuiz(true)}
                                                                            className="flex items-center justify-center gap-x-2 hover:bg-purple-100 text-purple-800 font-bold p-1.5 rounded-sm cursor-pointer">
                                                                            <Plus className="w-3"/>
                                                                            Quiz
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {/* Cancel select item */}
                                                                <div
                                                                    className="p-0.5 rounded-sm cursor-pointer relative">
                                                                    <X
                                                                        onClick={() => {
                                                                            setIsNewLecture(false);
                                                                            setIsNewQuiz(false);
                                                                            setAddingToSectionId(null);
                                                                        }}
                                                                        className="flex items-center min-w-5 w-5 absolute right-198 -top-5 rounded-sm hover:bg-gray-200"
                                                                    />
                                                                </div>
                                                            </div>

                                                            {/* When selected Lecture */}
                                                            {isNewLecture && (
                                                                <div
                                                                    className="flex flex-col items-center justify-start w-full space-y-5 px-2 py-3 bg-white border">
                                                                    <div
                                                                        className="flex items-center space-x-3 cursor-move w-full group">
                                                                        {/* Title Lecture */}
                                                                        <p className="font-bold w-30">
                                                                            New Lecture:
                                                                        </p>

                                                                        {/* Input New Lecture Title */}
                                                                        <div
                                                                            className="flex items-center space-x-2 w-full">
                                                                            <input
                                                                                type="text"
                                                                                autoFocus
                                                                                placeholder="Enter a title"
                                                                                onChange={(e) => setNewLectureTitle(e.target.value)}
                                                                                value={newLectureTitle}
                                                                                className="px-4 py-1 w-full border border-gray-400 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-800 focus:border-purple-800"
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    {/* Cancel and Save button */}
                                                                    <div
                                                                        className="flex items-center justify-end w-full space-x-5">
                                                                        <button
                                                                            onClick={() => {
                                                                                setIsNewLecture(false);
                                                                                setNewLectureTitle("");
                                                                            }}
                                                                            className="px-5 py-1.5 cursor-pointer bg-transparent hover:bg-gray-100 transition text-purple-800 font-bold rounded-md"
                                                                        >
                                                                            Cancel
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleAddLecture(section.id)}
                                                                            className="px-5 py-1.5 cursor-pointer bg-purple-800 text-white font-bold rounded-md shadow hover:bg-purple-800 disabled:opacity-30 disabled:cursor-not-allowed"
                                                                            disabled={!newLectureTitle.trim()}
                                                                        >
                                                                            Add Lecture
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* When selected Quiz */}
                                                            {isNewQuiz && (
                                                                <div
                                                                    className="flex flex-col items-center justify-start w-full space-y-5 px-2 py-3 bg-white border">
                                                                    <div
                                                                        className="flex items-center space-x-3 cursor-move w-full group">
                                                                        {/* Title Quiz */}
                                                                        <p className="font-bold w-23">
                                                                            New Quiz:
                                                                        </p>

                                                                        {/* Input New Quiz Title */}
                                                                        <div
                                                                            className="flex items-center space-x-2 w-full">
                                                                            <input
                                                                                type="text"
                                                                                autoFocus
                                                                                placeholder="Enter a title"
                                                                                onChange={(e) => setNewQuizTitle(e.target.value)}
                                                                                value={newQuizTitle}
                                                                                className="px-4 py-1 w-full border border-gray-400 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-800 focus:border-purple-800"
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    {/* Cancel and Save button */}
                                                                    <div
                                                                        className="flex items-center justify-end w-full space-x-5">
                                                                        <button
                                                                            onClick={() => {
                                                                                setIsNewQuiz(false);
                                                                                setNewQuizTitle("");
                                                                            }}
                                                                            className="px-5 py-1.5 cursor-pointer bg-transparent hover:bg-gray-100 transition text-purple-800 font-bold rounded-md"
                                                                        >
                                                                            Cancel
                                                                        </button>
                                                                        <button
                                                                            onClick={() => {
                                                                                handleAddQuiz(section.id)
                                                                            }}
                                                                            className="px-5 py-1.5 cursor-pointer bg-purple-800 text-white font-bold rounded-md shadow hover:bg-purple-800 disabled:opacity-30 disabled:cursor-not-allowed"
                                                                            disabled={!newQuizTitle.trim()}
                                                                        >
                                                                            Add Quiz
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* Cancel select item */}
                                                            {(isNewLecture || isNewQuiz) && (
                                                                <div
                                                                    className="p-0.5 rounded-sm cursor-pointer relative">
                                                                    <X
                                                                        onClick={() => {
                                                                            setIsNewLecture(false);
                                                                            setIsNewQuiz(false);
                                                                            setAddingToSectionId(null);
                                                                        }}
                                                                        className="flex items-center min-w-5 w-5 absolute right-198 -top-34.5 rounded-sm hover:bg-gray-200"
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Add more section */}
                                <div className="flex items-center justify-start space-x-2">
                                    <button
                                        onClick={handleAddSection}
                                        className="flex items-center justify-center gap-x-2 px-5 py-2 cursor-pointer border bg-white text-purple-800 text-sm font-bold rounded-md hover:bg-gray-200">
                                        <Plus className="w-3"/>
                                        Section
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}