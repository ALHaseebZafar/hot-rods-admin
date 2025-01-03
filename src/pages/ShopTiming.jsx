import React, { useState, useEffect } from "react";
import axios from "axios";
import { AiFillEdit } from "react-icons/ai";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactLoading from "react-loading";

const API_URL = "https://hotrodsbackend.onrender.com";

const ShopTimings = () => {
  const defaultTimings = {
    Monday: { time: "09:00-17:00" },
    Tuesday: { time: "09:00-17:00" },
    Wednesday: { time: "09:00-17:00" },
    Thursday: { time: "09:00-17:00" },
    Friday: { time: "09:00-17:00" },
    Saturday: { time: "09:00-17:00" },
    Sunday: { time: "09:00-17:00" }
  };

  const hours = Array.from({ length: 24 }, (_, i) => 
    i.toString().padStart(2, '0') + ":00"
  );

  const [timings, setTimings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingDay, setEditingDay] = useState(null);
  const [editTiming, setEditTiming] = useState({ open: "", close: "" });

  useEffect(() => {
    fetchTimings();
  }, []);

  const fetchTimings = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/shop-timing`);
      const formattedTimings = {};
      response.data.forEach(timing => {
        formattedTimings[timing.day] = {
          _id: timing._id,
          time: timing.time
        };
      });
      
      const finalTimings = { ...defaultTimings, ...formattedTimings };
      setTimings(finalTimings);
    } catch (error) {
      console.error("Error fetching timings:", error);
      toast.error("Failed to load shop timings.");
      setTimings(defaultTimings);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (day) => {
    const [open, close] = timings[day].time.split("-");
    setEditingDay(day);
    setEditTiming({ open, close });
  };

  const handleUpdate = async (day) => {
    const timingId = timings[day]._id;
    const newTime = `${editTiming.open}-${editTiming.close}`;

    try {
      if (timingId) {
        const response = await axios.put(`${API_URL}/shop-timing/${timingId}`, {
          day,
          time: newTime
        });
        console.log("Update response:", response);
        setTimings({
          ...timings,
          [day]: { _id: timingId, time: newTime }
        });
      } else {
        const response = await axios.post(`${API_URL}/shop-timing`, {
          day,
          time: newTime
        });
        console.log("Create response:", response);
        setTimings({
          ...timings,
          [day]: { _id: response.data._id, time: newTime }
        });
      }
      toast.success("Shop timing updated successfully.");
    } catch (error) {
      console.error("Error updating timing:", error);
      toast.error("Failed to update timing.");
    }
    setEditingDay(null);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-6">Shop Timings</h1>

      {isLoading && (
      <div className="relative flex flex-col w-full h-full text-gray-700 bg-white shadow-md rounded-lg bg-clip-border overflow-hidden">
        <div className="flex justify-center items-center h-48">
          <ReactLoading type="spin" color="#4B2E2E" />
        </div>
      </div>
    )}

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="p-4 border-b border-gray-300 text-left">Day</th>
            <th className="p-4 border-b border-gray-300 text-left">Opening Time</th>
            <th className="p-4 border-b border-gray-300 text-left">Closing Time</th>
            <th className="p-4 border-b border-gray-300 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(timings).map(([day, timing]) => {
            const [open, close] = timing.time.split("-");
            return (
              <tr key={day}>
                <td className="p-4 border-b border-gray-200">{day}</td>
                <td className="p-4 border-b border-gray-200">
                  {editingDay === day ? (
                    <select
                      value={editTiming.open}
                      onChange={(e) => setEditTiming({ ...editTiming, open: e.target.value })}
                      className="border rounded p-2"
                    >
                      {hours.map(hour => (
                        <option key={`open-${hour}`} value={hour}>
                          {hour}
                        </option>
                      ))}
                    </select>
                  ) : (
                    open
                  )}
                </td>
                <td className="p-4 border-b border-gray-200">
                  {editingDay === day ? (
                    <select
                      value={editTiming.close}
                      onChange={(e) => setEditTiming({ ...editTiming, close: e.target.value })}
                      className="border rounded p-2"
                    >
                      {hours.map(hour => (
                        <option key={`close-${hour}`} value={hour}>
                          {hour}
                        </option>
                      ))}
                    </select>
                  ) : (
                    close
                  )}
                </td>
                <td className="p-4 border-b border-gray-200">
                  {editingDay === day ? (
                    <button
                      onClick={() => handleUpdate(day)}
                      className="relative font-montserrat inline-flex items-center justify-center rounded-[10px] overflow-hidden tracking-tighter group border border-brown-primary px-4 py-2 bg-white text-brown-primary hover:bg-[#4B2E2E] hover:shadow-lg !shadow-brown-primary hover:text-white hover-styling"
                    >
                      <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-[#4B2E2E] rounded-full group-hover:w-72 group-hover:h-56"></span>
                      <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent"></span>
                      <span className="relative">Save</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEdit(day)}
                      className="relative font-montserrat inline-flex items-center justify-center rounded-[10px] overflow-hidden tracking-tighter group border sm:place-self-center lg:place-self-start border-brown-primary text-[12px] sm:text-[14px] px-3 sm:w-32 md:w-40 h-9 bg-white text-brown-primary hover:bg-[#4B2E2E] hover:shadow-lg !shadow-brown-primary hover:text-white hover-styling"
                      >
                      <AiFillEdit />
                      {/* <span>Update</span> */}
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <ToastContainer />
    </div>
  );
};

export default ShopTimings;
