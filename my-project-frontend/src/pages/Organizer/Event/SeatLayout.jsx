import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowRightIcon, ClockIcon } from "lucide-react";
import { toast } from "react-toastify";

import screenImage from "../../../assets/images/screenImage.svg";
import Header from "../../../components/Header";
const mockShow = {
    id: "1",
    title: "Avengers: Endgame",
    dateTime: {
        "2025-09-15": [
            { showId: "s1", time: "10:00" },
            { showId: "s2", time: "14:00" },
            { showId: "s3", time: "19:30" },
        ],
        "2025-09-16": [
            { showId: "s4", time: "09:00" },
            { showId: "s5", time: "13:00" },
        ],
    },
};

const mockOccupiedSeats = {
    s1: ["A1", "A2", "B5", "C7"],
    s2: ["D3", "D4", "E1", "F9"],
    s3: ["G2", "G3", "H8", "I5"],
    s4: ["A5", "B6", "C2"],
    s5: ["E7", "F2"],
};

const isoTimeFormat = (time) => {
    return time;
};

const SeatLayout = () => {
    const groupRows = [
        ["A", "B"],
        ["C", "D"],
        ["E", "F"],
        ["G", "H"],
        ["I", "J"],
    ];

    const { id } = useParams();
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [selectedTime, setSelectedTime] = useState(null);
    const [show, setShow] = useState(null);
    const [occupiedSeats, setOccupiedSeats] = useState([]);
    const navigate = useNavigate();

    // Mock fetch show
    useEffect(() => {
        if (mockShow.id === id) {
            setShow(mockShow);

            const firstDate = Object.keys(mockShow.dateTime)[0];
            const firstTime = mockShow.dateTime[firstDate]?.[0];
            if (firstTime) {
                setSelectedTime(firstTime);
            }
        } else {
            toast.error("Show not found");
        }
    }, [id]);

    useEffect(() => {
        if (selectedTime) {
            setOccupiedSeats(mockOccupiedSeats[selectedTime.showId] || []);
        }
    }, [selectedTime]);

    const handleSeatClick = (seatId) => {
        if (!selectedTime) {
            return toast.error("Please select time first");
        }
        if (!selectedSeats.includes(seatId) && selectedSeats.length > 4) {
            return toast.error("You can only select 5 seats");
        }
        if (occupiedSeats.includes(seatId)) {
            return toast.error("This seat is already occupied");
        }
        setSelectedSeats((prev) => (prev.includes(seatId) ? prev.filter((seat) => seat !== seatId) : [...prev, seatId]));
    };

    const renderSeats = (row, count = 9) => (
        <div key={row} className="flex gap-2 mt-2">
            <div className="flex flex-wrap items-center justify-center gap-2">
                {Array.from({ length: count }, (_, i) => {
                    const seatId = `${row}${i + 1}`;
                    const isSelected = selectedSeats.includes(seatId);
                    const isOccupied = occupiedSeats.includes(seatId);

                    return (
                        <button
                            key={seatId}
                            onClick={() => handleSeatClick(seatId)}
                            className={`h-8 w-8 rounded border border-primary/60 transition-colors duration-300 text-black
                ${
                    isSelected
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white opacity-100 cursor-default"
                        : isOccupied
                        ? "bg-gray-400 text-white opacity-80 cursor-not-allowed border-red-700"
                        : "cursor-pointer opacity-60 hover:bg-primary"
                }
                ${isSelected && "hover:bg-primary"} `}
                        >
                            {seatId}
                        </button>
                    );
                })}
            </div>
        </div>
    );

    const bookTickets = () => {
        if (!selectedTime || !selectedSeats.length) {
            return toast.error("Please select time and seats first");
        }
        toast.success(`Booked ${selectedSeats.length} seats for ${selectedTime.time}!`);
        navigate("/checkout");
    };

    return show ? (
        <>
            <Header />
            <div className="flex flex-col md:flex-row px-6 md:px-16 lg:px-40 py-10 md:pt-20">
                <div className="w-40 border rounded-lg py-5 h-max md:sticky md:top-30">
                    <p className="text-lg font-semibold px-6">Event Time</p>
                    {selectedTime && (
                        <div
                            className="flex items-center gap-2 px-6 py-2 w-max rounded-r-md 
                bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md mt-2"
                        >
                            <ClockIcon className="w-4 h-4" />
                            <p className="text-sm">{isoTimeFormat(selectedTime.time)}</p>
                        </div>
                    )}
                </div>

                {/* Seats Layout */}
                <div className="relative flex-1 flex flex-col items-center max-md:mt-16">
                    <h1 className="text-2xl font-semibold mb-4">Select your seat</h1>
                    <img src={screenImage} alt="Screen Image" />
                    <p className="text-gray-400 text-sm mb-6">SCREEN SIDE</p>
                    <div className="flex flex-col items-center mt-10 text-xs text-gray-300">
                        <div className="grid grid-cols-2 md:grid-cols-1 gap-8 md:gap-2 mb-6">{groupRows[0].map((row) => renderSeats(row))}</div>
                        <div className="grid grid-cols-2 gap-11">
                            {groupRows.slice(1).map((group, index) => (
                                <div key={index}>{group.map((row) => renderSeats(row))}</div>
                            ))}
                        </div>
                    </div>

                    <button onClick={bookTickets} className="btn-gradient flex gap-2 items-center px-2 mt-20">
                        Proceed to Checkout
                        <ArrowRightIcon strokeWidth={3} className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </>
    ) : (
        <p>Loading...</p>
    );
};

export default SeatLayout;
