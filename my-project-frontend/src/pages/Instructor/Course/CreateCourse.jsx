import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import CreateStepOne from "./CreateStepOne.jsx";
import CreateStepTwo from "./CreateStepTwo.jsx";

export default function CreateCourse() {
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");

    return (
        <Routes>
            <Route
                path="1"
                element={<CreateStepOne title={title} setTitle={setTitle} />}
            />
            <Route
                path="2"
                element={<CreateStepTwo
                            title={title} setTitle={setTitle}
                            category={category} setCategory={setCategory}
                        />}
            />
        </Routes>
    );
}
