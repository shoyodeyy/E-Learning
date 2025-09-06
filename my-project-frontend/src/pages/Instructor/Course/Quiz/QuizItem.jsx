import { useState, useCallback } from "react";
import {Book, FileQuestionMark, Pencil, Plus, Trash, X} from "lucide-react";

import QuizOptions from "./QuizOptions.jsx";

export default function QuizItem({ sectionId, itemId, quiz, setCourse, handleRemoveItem }) {
    const [ editedNameQuiz, setEditedNameQuiz ] = useState("");
    const [ isEditingQuizId, setIsEditingQuizId ] = useState(null);

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

    // Sử dụng useCallback để memoize các hàm callback
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

    function handleAddQuestion(sectionId, itemId) {
        // validate by alert
        if (!questionText.trim()) return;
        if (options.length < 2) {
            alert("A question needs at least 2 options");
            return;
        }
        if (!options.some(opt => opt.isCorrect)) {
            alert("You must mark 1 option as correct");
            return;
        }

        const newQuestion = {
            id: crypto.randomUUID(),
            questionText: questionText,
            options: options,
        };

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
                                    hasMultipleQuestion: true,
                                    questions: [
                                        ...(it.questions || []),
                                        newQuestion
                                    ],
                                }
                                : it
                        )
                    }
                    : sec
            )
        }));

        // reset inputs
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
        isAddingQuestionLocal = false;

        console.log("isAddingQuestionLocal: ", isAddingQuestionLocal);
        console.log("isNewQuestion: ", isNewQuestion);
        console.log("----------------------------------");
    }

    function handleRenameQuiz(sectionId, itemId, newTitle) {
        setCourse((prev) => ({
            ...prev,
            sections: prev.sections.map((sec) =>
                sec.id === sectionId
                    ? {
                        ...sec,
                        items: sec.items.map((it) =>
                            it.id === itemId && it.type === "Quiz"
                                ? {
                                    ...it,
                                    title: newTitle
                                } : it
                        ),
                    }
                    : sec
            ),
        }));

        setIsEditingQuizId(null);
        setEditedNameQuiz("");
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

        // check
        console.log("isAddingQuestionLocal: ", isAddingQuestionLocal);
        console.log("isNewQuestion: ", isNewQuestion);
        console.log("----------------------------------");
    }

    function toggleArrowQuestion(sectionId, itemId, isNewQuestion) {
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
                                } : it
                        )
                    } : sec
            )
        }));

        setIsNewQuestion(!isNewQuestion);

        // check
        console.log("isAddingQuestionLocal: ", isAddingQuestionLocal);
        console.log("isNewQuestion: ", isNewQuestion);
        console.log("----------------------------------");
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
                            onClick={() => {handleRemoveItem(sectionId, itemId)}}
                            className="p-1.5 rounded-md bg-transparent hover:bg-gray-200 transition-colors duration-200">
                            <Trash
                                className="w-3 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            />
                        </div>
                    </div>

                    {/* Add Question Toggle */}
                    <div className="flex-1 flex justify-end">
                        {/* Plus Question Button */}
                        {(!(isAddingQuestionLocal || isNewQuestion) && quiz.questions.length === 0) && (
                            <button
                                onClick={() => toggleAddQuestion(sectionId, itemId, true)}
                                className="flex items-center w-32 gap-x-2 px-5 py-1.5 cursor-pointer border bg-transparent text-purple-800 text-sm font-bold rounded-md hover:bg-gray-100">
                                <Plus className="w-3" />
                                Questions
                            </button>
                        )}

                        {/* Add Multiple Choice Cancel */}
                        {(((isAddingQuestionLocal || isNewQuestion) && !quiz.questions) || ((isAddingQuestionLocal || isNewQuestion) && quiz.questions)) && (
                            <div className="relative">
                                <div className="bg-white w-50 h-8 px-2 flex items-center justify-center gap-x-2 border border-b-0 absolute right-0 -top-[0.45rem]">
                                    <p className="cursor-text">
                                        Add Multiple Choice
                                    </p>
                                    <div
                                        onClick={() => toggleAddQuestion(sectionId, itemId, false)}
                                        className="hover:bg-gray-200 p-0.5 rounded-sm cursor-pointer">
                                        <X className="w-5" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/*/!* Arrow Up Icon *!/*/}
                        {/*{((quiz.questions.length > 0 && !(isAddingQuestionLocal || isNewQuestion))) && (*/}
                        {/*    <div>*/}
                        {/*        <div className="w-32 h-8 px-2 flex items-center justify-end gap-x-2">*/}
                        {/*            <div*/}
                        {/*                onClick={() => {*/}
                        {/*                    toggleArrowQuestion(sectionId, itemId, false);*/}
                        {/*                }}*/}
                        {/*                className="hover:bg-gray-200 p-1 rounded-sm cursor-pointer">*/}
                        {/*                <img className="w-3" src={ArrowUpIcon} alt="cancel-icon"/>*/}
                        {/*            </div>*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*)}*/}

                        {/*/!* Arrow Down Icon *!/*/}
                        {/*{(quiz.questions.length > 0 && isAddingQuestionLocal) || (quiz.questions.length > 0 && isNewQuestion) && (*/}
                        {/*    <div>*/}
                        {/*        <div className=" w-32 h-8 px-2 flex items-center justify-end gap-x-2">*/}
                        {/*            <div*/}
                        {/*                onClick={() => toggleArrowQuestion(sectionId, itemId, false)}*/}
                        {/*                className="hover:bg-gray-200 p-0 rounded-sm cursor-pointer">*/}
                        {/*                <img className="w-5" src={ArrowDownIcon} alt="cancel-icon"/>*/}
                        {/*            </div>*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*)}*/}
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

            {/* Add Question Container */}
            {/*{((isNewQuestion || isAddingQuestionLocal) && (isNewQuestion && isAddingQuestionLocal) ||*/}
            {/*(isNewQuestion || isAddingQuestionLocal) && (isNewQuestion || isAddingQuestionLocal)) &&*/}
            {(((isNewQuestion || isAddingQuestionLocal) && quiz.questions) ||
            ((isNewQuestion || isAddingQuestionLocal) && quiz.questions.length > 0)) &&
            (
                <div className="flex flex-col pb-3 w-full border-t bg-white">
                    {/* Add Questions */}
                    <div className="flex flex-col gap-x-5 px-3 py-2 pb-0">
                        <div className="flex flex-col w-full space-y-3">
                            {/* Title Question */}
                            <div className="w-full">
                                <p className="font-bold text-sm">
                                    Question
                                </p>
                            </div>

                            {/* Input Question */}
                            <textarea
                                // autoFocus
                                onChange={(e) => {
                                    setQuestionText(e.target.value);
                                }}
                                value={questionText}
                                className="px-4 py-2 w-full h-20 border border-gray-400 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-800 focus:border-purple-800 resize-none"
                            />

                            <div className="flex items-center justifetween space-x-3 w-full">
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

                        {/* Save Quiz */}
                        <div className="flex items-center justify-end w-full space-x-5 px-3">
                            <button
                                onClick={() => {
                                    handleAddQuestion(sectionId, itemId);
                                }}
                                className="px-5 py-1.5 cursor-pointer bg-purple-800 text-white font-bold rounded-md shadow hover:bg-purple-800 disabled:opacity-30 disabled:cursor-not-allowed"
                                // disabled={!editedNameLecture.trim()}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Question List Added */}
            {(quiz.questions && quiz.questions.length > 0 &&
            !((isAddingQuestionLocal && isNewQuestion) &&
            (quiz.hasMultipleQuestion || !quiz.hasMultipleQuestion))) &&
            (
                <div className="flex flex-col space-y-4 w-full border-t bg-white p-3">
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
                                <div className="flex space-x-1"
                                     key={index}>
                                        <span className="font-bold">
                                            {index}.
                                        </span>
                                    <span>
                                            {q.questionText}
                                        </span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}
