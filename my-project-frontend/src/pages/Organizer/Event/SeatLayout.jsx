import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "../../../components/Header";
import { useAuth } from "../../../context/AuthContext.jsx";
import { ArrowRightIcon, ClockIcon } from "lucide-react";
import api from "../../../api/axios";
import screenImage from "../../../assets/images/screenImage.svg";
import axios from "axios";
import {apiUrl} from "../../../services/http.jsx";
import {addMinutes, format} from "date-fns";

const formatTimeRange = (start_at, duration_minutes) => {
    try {
        const start = new Date(start_at);
        const end = addMinutes(start, duration_minutes); // cộng phút vào
        return `${format(start, "HH:mm")} - ${format(end, "HH:mm")}`;
    } catch (error) {
        return start_at;
    }
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
  const { token } = useAuth();
  const navigate = useNavigate();

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const [ event, setEvent ] = useState([]);

    // Lấy danh sách seat đã được đặt
    useEffect(() => {
        const fetchOccupiedSeats = async () => {
            try {
                const res = await api.get(`/events/${id}/seats`, {
                    headers: {
                        Authorization: `Bearer ${token}`,   // token từ useAuth()
                    }
                });

                setOccupiedSeats(res.data.occupiedSeats || []);
            } catch (err) {
                console.error("Failed to fetch occupied seats", err);
                toast.error("Failed to load seats");
            }
        };

        const fetchEvent = async () => {
            try {
                const res = await axios.get(`${apiUrl}/events/${id}`, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {}
                });

                setEvent(res.data.data);
            } catch (error) {
                console.error("Failed to fetch event: ", error);
            }
        };

        fetchOccupiedSeats();
        fetchEvent();
    }, [id]);

  const handleSeatClick = (seatId) => {
        if (!selectedSeats.includes(seatId) && selectedSeats.length > 4) {
            return toast.error("You can only select 5 seats");
        }
        if (occupiedSeats.includes(seatId)) {
            return toast.error("This seat is already occupied");
        }
        setSelectedSeats((prev) =>
            prev.includes(seatId)
                ? prev.filter((seat) => seat !== seatId)
                : [...prev, seatId]
        );
    };

  const renderSeats = (row, count = 9) => (
    <div
        key={row}
        className="flex gap-2 mt-2">
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

  const handleProceed = async () => {
        if (!selectedSeats.length) {
            return toast.error("Please select at least 1 seat");
        }

        try {
            const res = await api.post(`/events/${id}/register`, {
                seats: selectedSeats,
            });

            toast.success(res.data.message);

            navigate(`/event/${id}`);
        } catch (err) {
            const msg =
                err.response?.data?.error ||
                err.response?.data?.message ||
                "Registration failed";
            toast.error(msg);
        }
    };

  return (
    <>
      <Header />
      <div className="flex flex-col md:flex-row px-6 md:px-16 lg:px-40 py-10 md:pt-20">
        <div className="w-40 border rounded-lg py-5 h-max md:sticky md:top-30">
          <p className="text-lg font-semibold px-6">
              Event Time
          </p>
        <div
          className="flex items-center gap-2 px-6 py-2 w-max rounded-r-md
            bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md mt-2"
        >
          <ClockIcon className="w-4 h-4" />
            <p className="text-sm">
                {formatTimeRange(event.start_at, event.duration_minutes)}
            </p>
        </div>
        </div>

        {/* Seats Layout */}
        <div className="relative flex-1 flex flex-col items-center max-md:mt-16">
          <h1 className="text-2xl font-semibold mb-4">
              Select your seat
          </h1>
          <img src={screenImage} alt="Screen Image" />
          <p className="text-gray-400 text-sm mb-6">
              SCREEN SIDE
          </p>
          <div className="flex flex-col items-center mt-10 text-xs text-gray-300">
            <div className="grid grid-cols-2 md:grid-cols-1 gap-8 md:gap-2 mb-6">
              {groupRows[0].map((row) => renderSeats(row))}
            </div>
            <div className="grid grid-cols-2 gap-11">
              {groupRows.slice(1).map((group, index) => (
                <div key={index}>{group.map((row) => renderSeats(row))}</div>
              ))}
            </div>
          </div>

          <button
            onClick={handleProceed}
            className="btn-gradient flex gap-2 items-center px-2 mt-20"
          >
            Proceed to Checkout
            <ArrowRightIcon strokeWidth={3} className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  )
};

export default SeatLayout;
