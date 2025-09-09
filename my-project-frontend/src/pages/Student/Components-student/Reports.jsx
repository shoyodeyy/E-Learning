import { useState } from "react";

export default function Reports() {
    const [open, setOpen] = useState(false);
    const [issue, setIssue] = useState("");
    const [details, setDetails] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({ issue, details });
        alert("Your report has been submitted. Thank you!");
        setIssue("");
        setDetails("");
        setOpen(false);
    };

    return (
        <div className="mt-6">
            {/* Nút text "Report abuse" */}
            <div className="flex justify-center">
                <button
                    onClick={() => setOpen(true)}
                    className="text-purple-600 border border-purple-600 px-4 py-2 rounded-md hover:bg-purple-50 font-medium"
                >
                    Report abuse
                </button>
            </div>

            {/* Modal overlay */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
                    onClick={() => setOpen(false)}
                >
                    {/* Modal content */}
                    <div
                        className="bg-white rounded-lg shadow-lg w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl mx-4 p-6 relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close button */}
                        <button
                            onClick={() => setOpen(false)}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
                        >
                            ✕
                        </button>

                        <h2 className="text-lg font-semibold mb-4">Report abuse</h2>
                        <p className="text-gray-600 text-sm mb-4">
                            Flagged content is reviewed by staff to determine whether it violates Terms of Service or Community Guidelines.
                            If you have a question or technical issue, please contact our{" "}
                            <a href="#" className="underline text-purple-600">Support team</a>.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Issue type */}
                            <div>
                                <label className="block text-sm mb-1">Issue type</label>
                                <select
                                    value={issue}
                                    onChange={(e) => setIssue(e.target.value)}
                                    className="w-full border rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                    <option value="">Select an issue</option>
                                    <option value="inappropriate">Inappropriate Content</option>
                                    <option value="copyright">Copyright Violation</option>
                                    <option value="spam">Spam or Misleading</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            {/* Details */}
                            <div>
                                <label className="block text-sm mb-1">Issue details</label>
                                <textarea
                                    value={details}
                                    onChange={(e) => setDetails(e.target.value)}
                                    rows="4"
                                    placeholder="Please provide more details about the issue."
                                    className="w-full border rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setOpen(false)}
                                    className="text-gray-600 hover:underline text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 text-sm"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
