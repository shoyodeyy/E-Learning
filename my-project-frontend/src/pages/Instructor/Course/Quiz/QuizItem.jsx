import { useState, useCallback } from "react";
import { Book, FileQuestionMark, Pencil, Plus, Trash, X } from "lucide-react";
import axios from "axios";
import { apiUrl } from "../../../../services/http.jsx";

import QuizOptions from "./QuizOptions.jsx";
import {toast} from "react-toastify";

export default function QuizItem({ sectionId, itemId, quiz, setCourse, handleRemoveItem }) {
    const [ editedNameQuiz, setEditedNameQuiz ] = useState("");
    const [ isEditingQuizId, setIsEditingQuizId ] = useState(null);
    const [ isEditingQuestionId, setIsEditingQuestionId ] = useState(null);

    const [ questionText, setQuestionText ] = useState("");
    const [ isNewQuestion, setIsNewQuestion ] = useState(false);
    const [options, setOptions] = useState(
        Array(4).fill(null).map(() => ({
            id: crypto.randomUUID(),
            optionText: "",
            explainText: "",
            isCorrect: false,
        }))
    );

    const isEditingQuizLocal = isEditingQuizId === quiz.id;
    let isAddingQuestionLocal = quiz.isAddingQuestion;

    const shouldShowQuestionForm =
        isNewQuestion ||
        isAddingQuestionLocal ||
        isEditingQuestionId !== null;

    const handleChangeOption = useCallback((optionId, changes) => {
        setOptions(prevOptions => {
            if (changes.isCorrect) {
                return prevOptions.map(opt => ({
                    ...opt,
                    isCorrect: opt.id === optionId
                }));
            } else {
                return prevOptions.map(opt =>
                    opt.id === optionId
                        ? { ...opt, ...changes }
                        : { ...opt }
                );
            }
        });
    }, []);

    const handleDeleteOption = useCallback((optionId) => {
        setOptions(prev => prev.filter(opt => opt.id !== optionId));
    }, []);

    const handleAddOption = useCallback(() => {
        setOptions(prev => [
            ...prev,
            {
                id: crypto.randomUUID(),
                optionText: "",
                explainText: "",
                isCorrect: false
            }
        ]);
    }, []);

    const resetQuestionForm = () => {
        setQuestionText("");
        setOptions(
            Array(4).fill(null).map(() => ({
                id: crypto.randomUUID(),
                optionText: "",
                explainText: "",
                isCorrect: false,
            }))
        );
        setIsNewQuestion(false);
        setIsEditingQuestionId(null);

        setCourse(prev => ({
            ...prev,
            sections: prev.sections.map(sec =>
                sec.id === sectionId
                    ? {
                        ...sec,
                        items: sec.items.map(it =>
                            (it.id === itemId && it.type === "Quiz")
                                ? { ...it, isAddingQuestion: false }
                                : it
                        )
                    }
                    : sec
            )
        }));
    };

    async function handleAddQuestion(sectionId, itemId) {
        if (!questionText.trim()) return;
        const validOptions = options.filter(opt => opt.optionText.trim() !== "");

        if (validOptions.length < 2) {
            toast.info("A question needs at least 2 options");
            return;
        }
        if (!validOptions.some(opt => opt.isCorrect)) {
            toast.info("You must mark 1 option as correct");
            return;
        }

        try {
            const res = await axios.post(`${apiUrl}/sections/${sectionId}/quizzes/${itemId}/questions`, {
                questionText,
                options: validOptions.map(opt => ({
                    optionText: opt.optionText,
                    explainText: opt.explainText || "",
                    isCorrect: opt.isCorrect ? 1 : 0
                }))
            });

            const newQuestion = res.data.question;

            // Update local state
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
                                        questions: [...(it.questions || []), newQuestion],
                                        hasMultipleQuestion: true,
                                    }
                                    : it
                            )
                        }
                        : sec
                )
            }));

            // Reset form
            resetQuestionForm();

            console.log("Question added successfully");

        } catch (err) {
            console.error("Failed to add question:", err);
            toast.error("Failed to add question");
        }
    }

    async function handleUpdateQuestion(sectionId, itemId, questionId) {
        if (!questionText.trim()) return;
        const validOptions = options.filter(opt => opt.optionText.trim() !== "");

        if (validOptions.length < 2) {
            toast.info("A question needs at least 2 options");
            return;
        }
        if (!validOptions.some(opt => opt.isCorrect)) {
            toast.info("You must mark 1 option as correct");
            return;
        }

        try {
            const res = await axios.put(`${apiUrl}/sections/${sectionId}/quizzes/${itemId}/questions/${questionId}`, {
                questionText,
                options: validOptions.map(opt => ({
                    optionText: opt.optionText,
                    explainText: opt.explainText || "",
                    isCorrect: opt.isCorrect ? 1 : 0
                }))
            });

            const updatedQuestion = res.data.question;

            // Update local state
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
                                        questions: it.questions.map(q =>
                                            q.id === questionId ? updatedQuestion : q
                                        )
                                    }
                                    : it
                            )
                        }
                        : sec
                )
            }));

            // Reset form
            resetQuestionForm();

            console.log("Question updated successfully");

        } catch (err) {
            console.error("Failed to update question:", err);
            toast.error("Failed to update question");
        }
    }

    async function handleRenameQuiz(sectionId, quizId, newTitle) {
        if (!newTitle.trim()) return;

        try {
            const res = await axios.put(`${apiUrl}/sections/${sectionId}/quizzes/${quizId}`, {
                quizTitle: newTitle
            });

            const updatedQuiz = res.data.quiz;

            setCourse(prev => ({
                ...prev,
                sections: prev.sections.map(sec =>
                    sec.id === sectionId
                        ? {
                            ...sec,
                            items: sec.items.map(it =>
                                it.id === quizId && it.type === "Quiz"
                                    ? {
                                        ...it,
                                        title: updatedQuiz.quizTitle
                                    }
                                    : it
                            ),
                        }
                        : sec
                ),
            }));

            setIsEditingQuizId(null);
            setEditedNameQuiz("");

        } catch (error) {
            console.error("Error renaming quiz:", error);
            toast.error("Failed to rename quiz");
        }
    }

    function toggleAddQuestion(sectionId, itemId, isNewQuestion) {
        setCourse(prev => ({
            ...prev,
            sections: prev.sections.map(sec =>
                sec.id === sectionId
                    ? {
                        ...sec,
                        items: sec.items.map(it =>
                            (it.id === itemId && it.type === "Quiz")
                                ? {
                                    ...it,
                                    isAddingQuestion: !it.isAddingQuestion,
                                    hasMultipleQuestion: isNewQuestion,
                                } : it
                        )
                    } : sec
            )
        }));

        setIsNewQuestion(isNewQuestion);
        isAddingQuestionLocal = true;

        // check
        console.log("isAddingQuestionLocal: ", isAddingQuestionLocal);
        console.log("isNewQuestion: ", isNewQuestion);
        console.log("----------------------------------");
    }

    async function handleRemoveQuestion(sectionId, itemId, questionId) {
        if (!window.confirm("Are you sure you want to delete this question?")) return;

        try {
            await axios.delete(`${apiUrl}/sections/${sectionId}/quizzes/${itemId}/questions/${questionId}`);

            // Cập nhật state local
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
                                        questions: it.questions.filter(q => q.questionId !== questionId)
                                    }
                                    : it
                            )
                        }
                        : sec
                )
            }));

            console.log("Question deleted successfully");
        } catch (err) {
            console.error("Failed to delete question:", err);
            toast.error("Failed to delete question");
        }
    }

    return (
        <div className="w-full border">
            {/* Quiz Info */}
            {!isEditingQuizLocal && (
                <div className="flex items-center justify-start space-x-3 cursor-move w-full group bg-white px-3 py-3">
                    {/* Quiz Index */}
                    <Book className="w-3" />
                    <p className="font-bold">
                        {quiz.type} {quiz.index}:
                    </p>

                    <div className="flex items-center space-x-2">
                        {/* Quiz Title */}
                        {!isEditingQuizLocal && (
                            <div className="flex items-center space-x-2">
                                <FileQuestionMark className="w-4 mt-0.5 cursor-pointer" />
                                <p>{quiz.title}</p>
                            </div>
                        )}

                        {/* Pencil Icon */}
                        <div
                            onClick={() => {
                                setEditedNameQuiz(quiz.title);
                                setIsEditingQuizId(quiz.id);
                            }}
                            className="p-1.5 rounded-md bg-transparent hover:bg-gray-200 transition-colors duration-200">
                            <Pencil
                                className="w-3 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            />
                        </div>

                        {/* Trash Icon */}
                        <div
                            onClick={() => {handleRemoveItem(sectionId, itemId, "Quiz")}}
                            className="p-1.5 rounded-md bg-transparent hover:bg-gray-200 transition-colors duration-200">
                            <Trash
                                className="w-3 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            />
                        </div>
                    </div>

                    {/* Add Question Toggle */}
                    <div className="flex-1 flex justify-end">
                        {/* Plus Question Button */}
                        {/*{(!(isAddingQuestionLocal || isNewQuestion) && !quiz.questions) && (*/}
                        {(!(isAddingQuestionLocal || isNewQuestion) && !(Array.isArray(quiz.questions) && quiz.questions[0])
                        ) && (
                            <button
                                onClick={() => toggleAddQuestion(sectionId, itemId, true)}
                                className="flex items-center w-32 gap-x-2 px-5 py-1.5 cursor-pointer border bg-transparent text-purple-800 text-sm font-bold rounded-md hover:bg-gray-100">
                                <Plus className="w-3" />
                                Questions
                            </button>
                        )}

                        {/* Add Multiple Choice Cancel */}
                        {/*{((isNewQuestion || isAddingQuestionLocal) && (!quiz.questions) ||*/}
                        {/*    ((isNewQuestion || isAddingQuestionLocal) && (quiz.questions && quiz.questions.length > 0)) ||*/}
                        {/*    isEditingQuestionId !== null) && (*/}
                        {((isNewQuestion || isAddingQuestionLocal) ||
                            ((isNewQuestion || isAddingQuestionLocal) && (quiz.questions && quiz.questions.length > 0)) ||
                            isEditingQuestionId !== null) && (
                            <div className="relative">
                                <div className="bg-white w-50 h-8 px-2 flex items-center justify-center gap-x-2 border border-b-0 absolute right-0 -top-[0.10rem]">
                                    <p className="cursor-text">
                                        {isEditingQuestionId ? "Edit Question" : "Add Multiple Choice"}
                                    </p>
                                    <div
                                        onClick={() => {
                                            if (isEditingQuestionId) {
                                                resetQuestionForm();
                                            } else {
                                                toggleAddQuestion(sectionId, itemId, false);
                                            }
                                        }}
                                        className="hover:bg-gray-200 p-0.5 rounded-sm cursor-pointer">
                                        <X className="w-5" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Edit Quiz Mode */}
            {isEditingQuizLocal && (
                <div className="flex flex-col items-center justify-start w-full space-y-5 px-2 py-5 bg-white">
                    <div className="flex items-center space-x-3 cursor-move w-full group">
                        {/* Quiz Index*/}
                        <p className="font-bold w-21">
                            Quiz {quiz.index}:
                        </p>

                        {/* Input Rename Quiz */}
                        {isEditingQuizLocal && (
                            <div className="flex items-center space-x-2 w-full">
                                <input
                                    type="text"
                                    autoFocus
                                    onChange={(e) => {
                                        setEditedNameQuiz(e.target.value)
                                    }}
                                    value={editedNameQuiz}
                                    className="px-4 py-1 w-full border border-gray-400 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-800 focus:border-purple-800"
                                />
                            </div>
                        )}
                    </div>

                    {/* Cancel and Save button */}
                    <div className="flex items-center justify-end w-full space-x-5">
                        <button
                            onClick={() => {
                                setIsEditingQuizId(null);
                                setEditedNameQuiz("");
                            }}
                            className="px-5 py-1.5 cursor-pointer bg-transparent hover:bg-gray-100 transition text-purple-800 font-bold rounded-md"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                handleRenameQuiz(sectionId, itemId, editedNameQuiz)
                            }}
                            className="px-5 py-1.5 cursor-pointer bg-purple-800 text-white font-bold rounded-md shadow hover:bg-purple-800 disabled:opacity-30 disabled:cursor-not-allowed"
                            disabled={!editedNameQuiz.trim()}
                        >
                            Save Quiz
                        </button>
                    </div>
                </div>
            )}

            {/* Add/Edit Question Container - ĐIỀU KIỆN MỚI ĐƠN GIẢN */}
            {shouldShowQuestionForm && (
                <div className="flex flex-col pb-3 w-full border-t bg-white">
                    {/* Add Questions */}
                    <div className="flex flex-col gap-x-5 px-3 py-2 pb-0">
                        <div className="flex flex-col w-full space-y-3">
                            {/* Title Question */}
                            <div className="w-full">
                                <p className="font-bold text-sm">
                                    {isEditingQuestionId ? "Edit Question" : "Question"}
                                </p>
                            </div>

                            {/* Input Question */}
                            <textarea
                                autoFocus
                                onChange={(e) => {
                                    setQuestionText(e.target.value);
                                }}
                                value={questionText}
                                className="px-4 py-2 w-full h-20 border border-gray-400 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-800 focus:border-purple-800 resize-none"
                            />

                            <div className="flex items-center justify-between space-x-3 w-full">
                                {/* Title Answer */}
                                <p className="font-bold text-sm">
                                    Answer
                                </p>

                                {/* New Option Button */}
                                <button
                                    onClick={handleAddOption}
                                    className="min-w-24 py-1.5 px-3 border text-purple-800 text-sm font-bold rounded-md hover:bg-gray-100 cursor-pointer">
                                    New Option
                                </button>
                            </div>

                            {/* Multiple Choice */}
                            <div className="w-full flex flex-col space-y-4">
                                <QuizOptions
                                    options={options || []}
                                    onChangeOption={handleChangeOption}
                                    onDeleteOption={handleDeleteOption}
                                    isAddingQuestion={isAddingQuestionLocal}
                                    isNewQuestion={isNewQuestion}
                                    hasMultipleQuestion={quiz.hasMultipleQuestion}
                                />
                            </div>
                        </div>

                        {/* Note */}
                        <div className="px-3 py-2">
                            <p className="text-sm text-gray-500">
                                Write up to 5 possible answers and indicate which one is the best.
                            </p>
                        </div>

                        {/* Save/Update and Cancel Buttons */}
                        <div className="flex items-center justify-end w-full space-x-5 px-3">
                            {/* Cancel Button - Chỉ hiện khi đang edit */}
                            {isEditingQuestionId && (
                                <button
                                    onClick={resetQuestionForm}
                                    className="px-5 py-1.5 cursor-pointer bg-gray-500 text-white font-bold rounded-md hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                            )}

                            {/* Save/Update Button */}
                            <button
                                onClick={() => {
                                    if (isEditingQuestionId) {
                                        handleUpdateQuestion(sectionId, itemId, isEditingQuestionId);
                                    } else {
                                        handleAddQuestion(sectionId, itemId);
                                    }
                                }}
                                className="px-5 py-1.5 cursor-pointer bg-purple-800 text-white font-bold rounded-md shadow hover:bg-purple-700 disabled:opacity-30 disabled:cursor-not-allowed"
                                disabled={!questionText.trim()}
                            >
                                {isEditingQuestionId ? "Update Question" : "Save Question"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Question List Added */}
            {/*{(quiz.questions && quiz.questions.length > 0 && !shouldShowQuestionForm) &&*/}
            {(Array.isArray(quiz.questions) && quiz.questions[0] && !shouldShowQuestionForm) &&
                (
                    <div className="flex flex-col space-y-4 w-full bg-white border-t p-3">
                        {/* Header List */}
                        <div className="flex items-center space-x-2">
                            {/* Title Question */}
                            <p className="font-bold">
                                Questions
                            </p>

                            {/* Question Button */}
                            <div className="flex-1">
                                <button
                                    onClick={() => {
                                        toggleAddQuestion(sectionId, itemId, true)
                                    }}
                                    className="flex items-center w-32 gap-x-2 px-5 py-1.5 cursor-pointer border bg-transparent text-purple-800 text-sm font-bold rounded-md hover:bg-gray-100">
                                    <Plus className="w-3" />
                                    Questions
                                </button>
                            </div>

                            {/* Preview Button */}
                            <label
                                className="w-25 h-10 px-5 border bg-purple-800 text-white text-sm font-bold rounded-md hover:bg-purple-700 flex items-center justify-center cursor-pointer"
                            >
                                Preview
                            </label>
                        </div>

                        {/* List Items */}
                        <div className="w-full">
                            {quiz.questions.map((q, index) => {
                                index++;

                                return (
                                    <div className="flex flex-col space-x-1 space-y-1"
                                         key={q.questionId || q.id}>
                                        <div className="flex items-center group">
                                        <span className="font-bold">
                                            {index}.
                                        </span>
                                            <span className="flex-1">
                                            {q.questionText}
                                        </span>
                                            <div className="flex">
                                                {/* Pencil Icon - ĐƯỢC CẢI THIỆN */}
                                                <div
                                                    onClick={() => {
                                                        // Cài đặt ID của câu hỏi cần chỉnh sửa
                                                        setIsEditingQuestionId(q.questionId || q.id);

                                                        // Reset các trạng thái thêm câu hỏi mới
                                                        setIsNewQuestion(false);
                                                        setCourse(prev => ({
                                                            ...prev,
                                                            sections: prev.sections.map(sec =>
                                                                sec.id === sectionId
                                                                    ? {
                                                                        ...sec,
                                                                        items: sec.items.map(it =>
                                                                            (it.id === itemId && it.type === "Quiz")
                                                                                ? { ...it, isAddingQuestion: false }
                                                                                : it
                                                                        )
                                                                    }
                                                                    : sec
                                                            )
                                                        }));

                                                        // Cập nhật các trường input với dữ liệu của câu hỏi cần chỉnh sửa
                                                        setQuestionText(q.questionText);
                                                        setOptions(q.options.map(opt => ({
                                                            id: opt.questionId || opt.id,
                                                            optionText: opt.optionText,
                                                            explainText: opt.explainText || "", // Nếu không có, gán rỗng
                                                            isCorrect: opt.isCorrect === 1,
                                                        })));
                                                    }}
                                                    className="p-1.5 rounded-md bg-transparent hover:bg-gray-200 transition-colors duration-200">
                                                    <Pencil
                                                        className="w-3 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                                    />
                                                </div>

                                                {/* Trash Icon */}
                                                <div
                                                    // onClick={() => {handleRemoveItem(sectionId, itemId, "Quiz")}}
                                                    onClick={() => handleRemoveQuestion(sectionId, itemId, q.questionId)}
                                                    className="p-1.5 rounded-md bg-transparent hover:bg-gray-200 transition-colors duration-200">
                                                    <Trash
                                                        className="w-3 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}
        </div>
    )
}