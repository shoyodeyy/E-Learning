import React from "react";

import QuizOption from "./QuizOption.jsx";

export default function QuizOptions({ options, onChangeOption, onDeleteOption, isAddingQuestion, isNewQuestion, hasMultipleQuestion }) {
    return (
        <>
            {options.map((opt) => (
                <QuizOption
                    key={opt.id}
                    option={opt}
                    onChangeOption={onChangeOption}
                    onDeleteOption={onDeleteOption}
                    isAddingQuestion={isAddingQuestion}
                    isNewQuestion={isNewQuestion}
                    hasMultipleQuestion={hasMultipleQuestion}
                />
            ))}
        </>
    )
}