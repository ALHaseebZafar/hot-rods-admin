import React, { useState, useEffect } from "react";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactLoading from "react-loading";

export const Appointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [formData, setFormData] = useState({ date: "", time: "" });
  const [updateData, setUpdateData] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const API_URL = "http://localhost:5000"; // Adjust as needed

  // Fetch appointments from API
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch(`${API_URL}/appointment`);
        if (response.ok) {
          const data = await response.json();
          const formattedAppointments = data.appointments.map((appointment) => ({
            ...appointment,
            date: appointment.date.split("T")[0], // Format date to YYYY-MM-DD
          }));
          setAppointments(formattedAppointments);
        } else {
          toast.error("Failed to fetch appointments");
        }
      } catch (error) {
        toast.error("An error occurred while fetching appointments");
      }
    };
    fetchAppointments();
  }, []);

  // Add Appointment
  const handleAddAppointment = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setAppointments([...appointments, { ...formData, id: Date.now() }]);
      setFormData({ date: "", time: "" });
      setIsUpdateModalOpen(false);
      setIsLoading(false);
      toast.success("Appointment added successfully!");
    }, 1000);
  };

  // Update Appointment
  const handleUpdateAppointment = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      const updatedAppointments = appointments.map((appointment) =>
        appointment.id === updateData.id ? updateData : appointment
      );
      setAppointments(updatedAppointments);
      setIsUpdateModalOpen(false);
      setUpdateData(null); // Reset updateData
      setIsLoading(false);
      toast.info("Appointment updated successfully!");
    }, 1000);
  };

  // Delete Appointment
  const handleDeleteAppointment = (id) => {
    setIsLoading(true);
    setTimeout(() => {
      setAppointments(appointments.filter((appointment) => appointment.id !== id));
      setIsLoading(false);
      toast.error("Appointment deleted successfully!");
    }, 1000);
  };

  // Open Add Appointment Modal
  const openAddModal = () => {
    setUpdateData(null); // Explicitly clear updateData
    setFormData({ date: "", time: "" }); // Reset form data
    setIsUpdateModalOpen(true);
  };

  return (
    <div className="p-4">
      {/* Add Appointment Button */}
      <div className="mb-4 flex justify-between">
        <button
          onClick={openAddModal}
          className="relative font-montserrat inline-flex items-center justify-center rounded-[10px] overflow-hidden tracking-tighter group border sm:place-self-center lg:place-self-start border-brown-primary text-[14px] sm:text-[16px] px-4 sm:w-60 md:w-72 h-12 bg-white text-brown-primary hover:bg-[#4B2E2E] hover:shadow-lg !shadow-brown-primary hover:text-white hover-styling"
        >
          Add Appointment
        </button>
      </div>

      {/* Appointments Table */}
      <div className="relative flex flex-col w-full h-full overflow-x-hidden text-gray-700 bg-white shadow-md rounded-lg bg-clip-border">
        <table className="w-full text-left table-auto min-w-full">
          <thead>
            <tr>
              <th className="p-4 border-b border-slate-300 bg-slate-50">
                <p className="block text-sm font-normal leading-none text-slate-500">Date</p>
              </th>
              <th className="p-4 border-b border-slate-300 bg-slate-50">
                <p className="block text-sm font-normal leading-none text-slate-500">Time</p>
              </th>
              <th className="p-4 border-b border-slate-300 bg-slate-50">
                <p className="block text-sm font-normal leading-none text-slate-500">Actions</p>
              </th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr className="hover:bg-slate-50" key={appointment._id}>
                <td className="p-4 border-b border-slate-200">
                  <p className="block text-sm text-slate-800">{appointment.date}</p>
                </td>
                <td className="p-4 border-b border-slate-200">
                  <p className="block text-sm text-slate-800">{appointment.time}</p>
                </td>
                <td className="p-4 border-b border-slate-200">
                  <button
                    onClick={() => {
                      setUpdateData(appointment);
                      setIsUpdateModalOpen(true);
                    }}
                    className="relative font-montserrat inline-flex items-center justify-center rounded-[10px] overflow-hidden tracking-tighter group border sm:place-self-center lg:place-self-start border-brown-primary text-[12px] sm:text-[14px] px-3 sm:w-32 md:w-40 h-9 bg-white text-brown-primary hover:bg-[#4B2E2E] hover:shadow-lg !shadow-brown-primary hover:text-white hover-styling"
                  >
                    <AiFillEdit size={20} />
                  </button>
                  <button
                    onClick={() => handleDeleteAppointment(appointment._id)}
                    className="relative font-montserrat inline-flex items-center justify-center rounded-[10px] overflow-hidden tracking-tighter group border sm:place-self-center lg:place-self-start border-brown-primary text-[12px] sm:text-[14px] px-3 sm:w-32 md:w-40 h-9 bg-white text-brown-primary hover:bg-[#4B2E2E] hover:shadow-lg !shadow-brown-primary hover:text-white hover-styling"
                  >
                    <AiFillDelete size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Adding or Editing Appointment */}
      {isUpdateModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">
              {updateData ? "Update Appointment" : "Add New Appointment"}
            </h2>
            <form
              onSubmit={updateData ? handleUpdateAppointment : handleAddAppointment}
            >
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  value={updateData ? updateData.date : formData.date}
                  onChange={(e) =>
                    updateData
                      ? setUpdateData({ ...updateData, date: e.target.value })
                      : setFormData({ ...formData, date: e.target.value })
                  }
                  className="mt-1 p-2 w-full border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Time</label>
                <input
                  type="time"
                  value={updateData ? updateData.time : formData.time}
                  onChange={(e) =>
                    updateData
                      ? setUpdateData({ ...updateData, time: e.target.value })
                      : setFormData({ ...formData, time: e.target.value })
                  }
                  className="mt-1 p-2 w-full border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsUpdateModalOpen(false);
                    setUpdateData(null); // Reset updateData when closing
                  }}
                  className="relative font-montserrat inline-flex items-center justify-center rounded-[10px] overflow-hidden tracking-tighter group border sm:place-self-center lg:place-self-start border-brown-primary text-[14px] sm:text-[16px] px-4 sm:w-60 md:w-72 h-12 bg-gray-300 text-gray-700 hover:bg-gray-400 hover:shadow-lg !shadow-brown-primary hover:text-white hover-styling"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="relative font-montserrat inline-flex items-center justify-center rounded-[10px] overflow-hidden tracking-tighter group border sm:place-self-center lg:place-self-start border-brown-primary text-[14px] sm:text-[16px] px-4 sm:w-60 md:w-72 h-12 bg-white text-black hover:bg-[#4B2E2E] hover:shadow-lg !shadow-brown-primary hover:text-white hover-styling"
                >
                  {isLoading ? (
                    <ReactLoading type="spin" color="#FFFFFF" height={20} width={20} />
                  ) : (
                    updateData ? "Update" : "Add"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Container for Notifications */}
      <ToastContainer />
    </div>
  );
};
export default Appointment;
