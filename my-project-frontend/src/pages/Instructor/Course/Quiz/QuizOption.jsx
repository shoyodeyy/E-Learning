import React from "react";
import {Trash} from "lucide-react";

export default function QuizOption({ option, onChangeOption, onDeleteOption, isAddingQuestion, isNewQuestion, hasMultipleQuestion }) {
    return (
        <>
            {(isAddingQuestion || isNewQuestion && (hasMultipleQuestion || !hasMultipleQuestion)) &&  (
            <div className="flex w-full space-x-2 group">
                {/* Radio Button */}
                <input
                    type="radio"
                    checked={option.isCorrect}
                    onChange={() => onChangeOption(option.id, { isCorrect: true })}
                    name="quiz-option"
                    className="w-5 h-5 accent-purple-600"
                />

                {/* Inputs */}
                <div className="w-full">
                    {/* Option */}
                    <textarea
                        value={option.optionText}
                        onChange={(e) =>
                            onChangeOption(option.id, { optionText: e.target.value })
                        }
                        placeholder="Add an answer"
                        className="px-4 py-2 w-full h-20 border rounded-md resize-none"
                    />

                    {/* Explain */}
                    <textarea
                        value={option.explainText}
                        onChange={(e) =>
                            onChangeOption(option.id, { explainText: e.target.value })
                        }
                        placeholder="Explain why this is/isn't correct"
                        className="px-4 py-2 w-9/10 flex h-12 border rounded-md resize-none mt-2 ml-auto"
                    />
                </div>

                {/* Trash */}
                <div
                    onClick={() => onDeleteOption(option.id)}
                    className="h-7 w-7 p-1.5 rounded-md hover:bg-gray-200 cursor-pointer"
                >
                    <Trash
                        className="opacity-0 group-hover:opacity-100"
                    />
                </div>
            </div>
            )}
        </>
    );
}