import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import SidebarCourseManage from "../Instructor/SidebarCourseManage.jsx";
import HeaderCourseManage from "./HeaderCourseManage.jsx";
import LectureItem from "./LectureItem.jsx";
import QuizItem from "./QuizItem.jsx";

import DocumentIcon from "../../assets/images/icon/document.png";
import PencilIcon from "../../assets/images/icon/pencil.png";
import TrashIcon from "../../assets/images/icon/trash.png";
import PlusIcon from "../../assets/images/icon/plus.png";
import CancelIcon from "../../assets/images/icon/cross-small.png";

export default function Curriculum() {
    const { courseID } = useParams();
    const navigate = useNavigate();

    // fetch data by axios
    useEffect(() => {
        async function fetchCourse() {
            try {
                const res = await fetch(`http://localhost:8000/api/courses/${courseID}`);
                const data = await res.json();

                setCourse(prev => ({
                    ...prev,
                    id: courseID,
                    title: data.data.courseTitle,
                    category: data.data.category?.categoryName || "",
                    status: data.data.status?.statusName || ""
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

    const [ isAddingCurrItem, setIsAddingCurrItem ] = useState(false);

    const [ course, setCourse ] = useState({
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
        sections: [
            {
                id: crypto.randomUUID(),
                title: "Introduction",
                index: 1,
                totalDuration: 0,
                items: [
                    {
                        id: crypto.randomUUID(),
                        type: "Lecture",
                        index: 1,
                        title: "Introduction",
                        videoFile: null,
                        videoUrl: null,
                        thumbnail: null,
                        duration: null,
                        isAddingVideo: false,
                    }
                ]
            }
        ]
    });

    // state Section
    const [ editedSectionName, setEditedSectionName ] = useState("");
    const [ isEditingSectionId, setIsEditingSectionId ] = useState(null);

    // state Lecture
    const [ newLectureTitle, setNewLectureTitle ] = useState("");
    const [ isNewLecture, setIsNewLecture ] = useState(false);

    // state Quiz
    const [ newQuizTitle, setNewQuizTitle ] = useState("");
    const [ isNewQuiz, setIsNewQuiz ] = useState(false);

    function handleSaveRenamedSection(sectionId, newTitle) {
        setCourse(prev => ({
            ...prev,
            sections: prev.sections.map((sec) =>
                sec.id === sectionId
                    ? { ...sec, title: newTitle }
                    : sec
            ),
        }));

        setIsEditingSectionId(null);
        setEditedSectionName("");
    }

    function handleAddSection() {
        setCourse(prev => {
            // lấy số index tiếp theo
            const nextIndex = prev.sections.length + 1;

            const newSection = {
                id: crypto.randomUUID(),
                title: `New Section ${nextIndex}`,
                index: nextIndex,
                items: []
            };

            const updatedSections = [
                ...prev.sections,
                newSection
            ].map((sec, idx) => ({
                ...sec,
                index: idx + 1
            }));

            return {
                ...prev,
                sections: updatedSections
            }
        })
    }

    function handleAddLecture(sectionId, itemId) {
        if (!newLectureTitle.trim()) return;

        setCourse(prev => ({
            ...prev,
            sections: prev.sections.map(sec => {
                if (sec.id !== sectionId) return sec;

                const oldItems = sec.items || [];

                // create new item
                const newLecture = {
                    id: crypto.randomUUID(),
                    type: "Lecture",
                    title: newLectureTitle,
                    isAddingVideo: false
                };

                let newItems;
                if (itemId) {
                    // insert following the item has id = itemId
                    const insertIndex = oldItems.findIndex(it => it.id === itemId);
                    if (insertIndex === -1) {
                        // if not found itemId, push to the end
                        newItems = [
                            ...oldItems,
                            newLecture
                        ];
                    } else {
                        newItems = [
                            ...oldItems.slice(0, insertIndex + 1),
                            newLecture,
                            ...oldItems.slice(insertIndex + 1)
                        ];
                    }
                } else {
                    // no itemId passed, also push to the end
                    newItems = [
                        ...oldItems,
                        newLecture
                    ];
                }

                // Cật nhật lại index cho toàn bộ items có type là Lecture
                let lectureCounter = 0;
                newItems = newItems.map(it => {
                    if (it.type === "Lecture") {
                        lectureCounter++;
                        return {
                            ...it,
                            index: lectureCounter
                        };
                    }
                    return it;
                });

                return {
                    ...sec,
                    items: newItems
                };
            })
        }));

        setNewLectureTitle("");
        setIsNewLecture(false);
        setIsAddingCurrItem(false);
    }

    function handleAddQuiz(sectionId, itemId) {
        if (!newQuizTitle.trim()) return;

        setCourse(prev => ({
            ...prev,
            sections: prev.sections.map(sec => {
                if (sec.id !== sectionId) return sec;

                const oldItems = sec.items || [];

                // create new item
                const newQuiz = {
                    id: crypto.randomUUID(),
                    type: "Quiz",
                    title: newQuizTitle,
                    isAddingQuestion: false
                };

                let newItems;
                if (itemId) {
                    // insert following the item has id = itemId
                    const insertIndex = oldItems.findIndex(it => it.id === itemId);
                    if (insertIndex === -1) {
                        // if not found itemId, push to the end
                        newItems = [
                            ...oldItems,
                            newQuiz
                        ];
                    } else {
                        newItems = [
                            ...oldItems.slice(0, insertIndex + 1),
                            newQuiz,
                            ...oldItems.slice(insertIndex + 1)
                        ];
                    }
                } else {
                    // no itemId passed, also push to the end
                    newItems = [
                        ...oldItems,
                        newQuiz
                    ];
                }

                // Cật nhật lại index cho toàn bộ items có type là Quiz
                let quizCounter = 0;
                newItems = newItems.map(it => {
                    if (it.type === "Quiz") {
                        quizCounter++;
                        return {
                            ...it,
                            index: quizCounter
                        };
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
        setIsAddingCurrItem(false);
    }

    // function handleChangeOption(optionId, changes) {
    //     setOptions((prev) =>
    //         prev.map((opt) => {
    //             if (opt.id === optionId) {
    //                 return {
    //                     ...opt,
    //                     ...changes,
    //                     isCorrect: changes.isCorrect ? true : opt.isCorrect,
    //                 };
    //             }
    //             // Nếu có chọn correct, các option khác phải false
    //             if (changes.isCorrect && opt.isCorrect) {
    //                 return { ...opt, isCorrect: false }; // chỉ tạo object mới khi đang là correct
    //             }
    //             return opt; // ⚡ giữ nguyên object cũ
    //         })
    //     );
    // }

    // function handleChangeOption(optionId, changes) {
    //     setOptions(prevOptions => {
    //         // Nếu thay đổi là chọn đáp án đúng (isCorrect)
    //         if (changes.isCorrect) {
    //             return prevOptions.map(opt => ({
    //                 ...opt,
    //                 isCorrect: opt.id === optionId // Chỉ đặt `isCorrect` là true cho option được chọn
    //             }));
    //         }
    //         // Nếu thay đổi là nội dung text của option
    //         else {
    //             return prevOptions.map(opt =>
    //                 opt.id === optionId
    //                     ? { ...opt, ...changes } // Cập nhật text cho option cụ thể
    //                     : { ...opt } // Trả về một bản sao mới của các option khác
    //             );
    //         }
    //     });
    // }
    //
    // function handleDeleteOption(optionId) {
    //     setOptions(prev => prev.filter(opt => opt.id !== optionId));
    // }
    //
    // function handleAddOption() {
    //     setOptions(prev => [
    //         ...prev,
    //         {
    //             id: crypto.randomUUID(),
    //             optionText: "",
    //             explainText: "",
    //             isCorrect: false
    //         }
    //     ]);
    // }

    function handleRemoveSection(sectionId) {
        // confirm
        const confirmed = window.confirm("Are you sure you want to remove this section?");
        if (!confirmed) return;

        setCourse(prev => {
            // filter out section has id == sectionId
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
        })
    }

    function handleRemoveItem(sectionId, itemId) {
        const confirmed = window.confirm(
            "You are about to remove a curriculum item. Are you sure you want to continue?"
        );
        if (!confirmed) return;

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

    function SectionItem({ section }) {
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
                title={course.title}
                status={course.status}
            />

            <main className="pt-20 max-w-7xl mx-auto w-full flex flex-1 bg-white p-7">
                <div className="flex w-full space-y-10 space-x-10">
                    {/* Sidebar */}
                    {<SidebarCourseManage />}

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
                                    Start putting together your course by creating sections, lectures and practice (quizzes, coding exercises and assignments).
                                </p>
                                <p>
                                    Start putting together your course by creating sections, lectures and practice activities (<span className="font-semibold text-purple-800">quizzes, coding exercises and assignments</span>). Use your <span className="font-semibold text-purple-800">course outline</span> to structure your content and label your sections and lectures clearly. If you’re intending to offer your course for free, the total length of video content must be less than 2 hours.
                                </p>
                            </div>

                            {/* Section */}
                            <div className="w-full flex flex-col gap-y-18">
                                {course.sections.map((section) => (
                                    <div className="flex flex-col gap-y-5">
                                        <div className="flex flex-col gap-y-10 w-full px-2 py-5 bg-gray-100 border">
                                            {/* Title Section */}
                                            <div>
                                                {/* nhớ sửa đk chỗ này lại */}
                                                {!isEditingSectionId && (
                                                    <div className="flex items-center justify-start space-x-3 cursor-move w-full group">
                                                        {/* Section Index*/}
                                                        <p className="font-bold">
                                                            Section {section.index}:
                                                        </p>

                                                        <div className="flex items-center space-x-2">
                                                            {/* Section Title */}
                                                            {!isEditingSectionId && (
                                                                <div className="flex items-center space-x-2">
                                                                    <img className="w-3 cursor-pointer" src={DocumentIcon} alt="document-icon" />
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
                                                                <img
                                                                    className="w-3 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                                                    src={PencilIcon}
                                                                    alt="pencil-icon"
                                                                />
                                                            </div>

                                                            {/* Trash Icon */}
                                                            <div
                                                                onClick={() => handleRemoveSection(section.id)}
                                                                className="p-1.5 rounded-md bg-transparent hover:bg-gray-200 transition-colors duration-200">
                                                                <img
                                                                    className="w-3 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                                                    src={TrashIcon}
                                                                    alt="trash-icon"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Edit Section */}
                                                {/* nhớ sửa đk chỗ này lại */}
                                                {isEditingSectionId && (
                                                    <div className="flex flex-col items-center justify-start w-full space-y-5 px-2 py-5 bg-white border">
                                                        <div className="flex items-center space-x-3 cursor-move w-full group">
                                                            {/* Section Index*/}
                                                            <p className="font-bold w-21">
                                                                Section {section.index}:
                                                            </p>

                                                            {/* Input Rename Section */}
                                                            {isEditingSectionId && (
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
                                                                onClick={() => handleSaveRenamedSection(section.id, editedSectionName)}
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
                                            <div className="flex flex-col items-center justify-start space-y-5 w-full pl-14">
                                                {/* Curriculum Item */}
                                                <SectionItem
                                                    section={section}
                                                />

                                                {/* Add more curriculum  */}
                                                <div className="w-full flex flex-col items-start justify-start flex-1 space-x-2 h-14">
                                                    {/* Curriculum item button */}
                                                    {!isAddingCurrItem && (
                                                        <button
                                                            onClick={() => setIsAddingCurrItem(true)}
                                                            className="flex items-center justify-center gap-x-2 px-5 py-2 cursor-pointer border bg-white text-purple-800 text-sm font-bold rounded-md hover:bg-gray-200">
                                                            <img className="w-3" src={PlusIcon} alt="plus-icon"/>
                                                            Curriculum item
                                                        </button>
                                                    )}

                                                    {isAddingCurrItem && (
                                                        <div className="w-full">
                                                            {/* Select item */}
                                                            <div className="flex w-full bg-white">
                                                                {!(isNewLecture || isNewQuiz) && (
                                                                    <div className="flex border border-dashed px-3 py-2 w-full">
                                                                        {/* Lecture */}
                                                                        <div
                                                                            onClick={() => setIsNewLecture(true)}
                                                                            className="flex items-center justify-center gap-x-2 hover:bg-purple-100 text-purple-800 font-bold px-2 rounded-sm cursor-pointer">
                                                                            <img className="w-3" src={PlusIcon} alt="plus-icon"/>
                                                                            Lecture
                                                                        </div>

                                                                        {/* Quiz */}
                                                                        <div
                                                                            onClick={() => setIsNewQuiz(true)}
                                                                            className="flex items-center justify-center gap-x-2 hover:bg-purple-100 text-purple-800 font-bold p-1.5 rounded-sm cursor-pointer">
                                                                            <img className="w-3" src={PlusIcon} alt="plus-icon"/>
                                                                            Quiz
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {/* Cancel select item */}
                                                                <div
                                                                    className="p-0.5 rounded-sm cursor-pointer relative">
                                                                    <img
                                                                        onClick={() => {
                                                                            setIsNewLecture(false);
                                                                            setIsNewQuiz(false);
                                                                            setIsAddingCurrItem(false);
                                                                        }}
                                                                        className="flex items-center min-w-5 w-5 absolute right-208 -top-5 rounded-sm hover:bg-gray-200" src={CancelIcon} alt="cancel-icon"/>
                                                                </div>
                                                            </div>

                                                            {/* When selected Lecture */}
                                                            {isNewLecture && (
                                                                <div className="flex flex-col items-center justify-start w-full space-y-5 px-2 py-3 bg-white border">
                                                                    <div className="flex items-center space-x-3 cursor-move w-full group">
                                                                        {/* Title Lecture */}
                                                                        <p className="font-bold w-30">
                                                                            New Lecture:
                                                                        </p>

                                                                        {/* Input New Lecture Title */}
                                                                        <div className="flex items-center space-x-2 w-full">
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
                                                                    <div className="flex items-center justify-end w-full space-x-5">
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
                                                                <div className="flex flex-col items-center justify-start w-full space-y-5 px-2 py-3 bg-white border">
                                                                    <div className="flex items-center space-x-3 cursor-move w-full group">
                                                                        {/* Title Quiz */}
                                                                        <p className="font-bold w-23">
                                                                            New Quiz:
                                                                        </p>

                                                                        {/* Input New Quiz Title */}
                                                                        <div className="flex items-center space-x-2 w-full">
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
                                                                    <div className="flex items-center justify-end w-full space-x-5">
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
                                                                            onClick={() => {handleAddQuiz(section.id)}}
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
                                                                <div className="p-0.5 rounded-sm cursor-pointer relative">
                                                                    <img
                                                                        onClick={() => {
                                                                            setIsNewLecture(false);
                                                                            setIsNewQuiz(false);
                                                                            setIsAddingCurrItem(false);
                                                                        }}
                                                                        className="flex items-center min-w-5 w-5 absolute right-208 -top-34.5 rounded-sm hover:bg-gray-200" src={CancelIcon} alt="cancel-icon"/>
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
                                        <img className="w-3.5" src={PlusIcon} alt="plus-icon"/>
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