import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import ReactLoading from "react-loading";
import 'react-toastify/dist/ReactToastify.css';

const API_URL = "https://hotrodsbackend.onrender.com";

const Inquire = () => {
  const [professionals, setProfessionals] = useState([]);
  const [selectedProfessional, setSelectedProfessional] = useState(null);
  const [bookingDetails, setBookingDetails] = useState({ date: "", startTime: "", endTime: "" });
  const [submittedData, setSubmittedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingInquiryId, setEditingInquiryId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [professionalsResponse, inquiriesResponse] = await Promise.all([
          axios.get(`${API_URL}/professional`),
          axios.get(`${API_URL}/inquire`)
        ]);
        setProfessionals(professionalsResponse.data.professionals || []);
        setSubmittedData(inquiriesResponse.data.inquires || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error(error.response?.data?.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const resetForm = () => {
    setSelectedProfessional(null);
    setBookingDetails({ date: "", startTime: "", endTime: "" });
    setEditingInquiryId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProfessional) {
      toast.error('Please select a professional');
      return;
    }

    setLoading(true);

    try {
      const selectedProfessionalObj = professionals.find(p => p._id === selectedProfessional);
      
      if (!selectedProfessionalObj) {
        throw new Error('Selected professional not found');
      }

      const inquireData = {
        professional: selectedProfessionalObj,
        manualBooking: true,
        manualBookingDetails: bookingDetails,
        checkedByAdmin: false,
      };

      if (editingInquiryId) {
        const response = await axios.patch(`${API_URL}/inquire/${editingInquiryId}`, inquireData);
        const updatedInquiries = submittedData.map(inquiry =>
          inquiry._id === editingInquiryId
            ? { ...response.data.inquire, professional: selectedProfessionalObj }
            : inquiry
        );
        setSubmittedData(updatedInquiries);
        toast.success("Booking updated successfully!");
      } else {
        const response = await axios.post(`${API_URL}/inquire`, inquireData);
        setSubmittedData([
          {
            ...response.data.inquire,
            professional: selectedProfessionalObj
          },
          ...submittedData
        ]);
        toast.success("Booking submitted successfully!");
      }

      setIsFormVisible(false);
      resetForm();
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(error.response?.data?.message || "Failed to submit/update booking");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (index) => {
    const dataToEdit = submittedData[index];
    if (!dataToEdit || !dataToEdit.professional) {
      toast.error('Invalid booking data');
      return;
    }

    setSelectedProfessional(dataToEdit.professional._id);
    setBookingDetails(dataToEdit.manualBookingDetails || { date: "", startTime: "", endTime: "" });
    setEditingInquiryId(dataToEdit._id);
    setIsFormVisible(true);
  };

  const handleDelete = async (index) => {
    try {
      const inquiryToDelete = submittedData[index];
      if (!inquiryToDelete || !inquiryToDelete._id) {
        throw new Error('Invalid booking data');
      }

      await axios.delete(`${API_URL}/inquire/${inquiryToDelete._id}`);
      const updatedData = submittedData.filter((_, i) => i !== index);
      setSubmittedData(updatedData);
      toast.success('Booking deleted successfully!');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete booking');
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = submittedData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(submittedData.length / itemsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading && !isFormVisible) {
    return (
      <div className="flex justify-center items-center h-48">
        <ReactLoading type="spin" color="#000" />
      </div>
    );
  }

  return (
    <div className="p-4 w-full">
      <h1 className="text-xl font-semibold mb-4">Manual Booking</h1>
      <button
        onClick={() => {
          setIsFormVisible(true);
          resetForm();
        }}
        className="relative font-montserrat inline-flex items-center justify-center rounded-[10px] overflow-hidden tracking-tighter group border sm:place-self-center lg:place-self-start border-brown-primary text-[14px] sm:text-[16px] px-4 sm:w-60 md:w-72 h-12 bg-white text-brown-primary hover:bg-[#4B2E2E] hover:shadow-lg !shadow-brown-primary hover:text-white hover-styling"
        disabled={isFormVisible}
      >
        Add Booking
      </button>

      {isFormVisible && (
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Select Professional
            </label>
            <select
              value={selectedProfessional || ''}
              onChange={(e) => setSelectedProfessional(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded"
              required
            >
              <option value="">Select a professional</option>
              {professionals.map((professional) => (
                <option key={professional._id} value={professional._id}>
                  {professional.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              value={bookingDetails.date}
              onChange={(e) => setBookingDetails({...bookingDetails, date: e.target.value})}
              className="mt-1 p-2 w-full border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Start Time</label>
            <input
              type="time"
              value={bookingDetails.startTime}
              onChange={(e) => setBookingDetails({...bookingDetails, startTime: e.target.value})}
              className="mt-1 p-2 w-full border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">End Time</label>
            <input
              type="time"
              value={bookingDetails.endTime}
              onChange={(e) => setBookingDetails({...bookingDetails, endTime: e.target.value})}
              className="mt-1 p-2 w-full border border-gray-300 rounded"
              required
            />
          </div>

          <div className="flex space-x-2">
            <button
              type="submit"
              disabled={loading}
              className="relative font-montserrat inline-flex items-center justify-center rounded-[10px] overflow-hidden tracking-tighter group border sm:place-self-center lg:place-self-start border-brown-primary text-[14px] sm:text-[16px] px-4 sm:w-60 md:w-72 h-12 bg-white text-brown-primary hover:bg-[#4B2E2E] hover:shadow-lg !shadow-brown-primary hover:text-white hover-styling"
            >
              {loading ? (
                <span className="flex items-center">
                  Loading...
                  <ReactLoading
                    type="spin"
                    color="#fff"
                    width={20}
                    height={20}
                    className="ml-2"
                  />
                </span>
              ) : (
                editingInquiryId ? 'Update' : 'Submit'
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsFormVisible(false);
                resetForm();
              }}
              disabled={loading}
              className="relative font-montserrat inline-flex items-center justify-center rounded-[10px] overflow-hidden tracking-tighter group border sm:place-self-center lg:place-self-start border-brown-primary text-[14px] sm:text-[16px] px-4 sm:w-60 md:w-72 h-12 bg-gray-500 text-white hover:bg-gray-600 hover:shadow-lg !shadow-brown-primary hover:text-white hover-styling"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {!isFormVisible && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold">Submitted Bookings</h2>
          <div className="overflow-x-auto">
            <table className="table-auto w-full mt-4">
              <thead>
                <tr>
                  <th className="border px-4 py-2">Professional</th>
                  <th className="border px-4 py-2">Date</th>
                  <th className="border px-4 py-2">Time</th>
                  <th className="border px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((booking, index) => (
                    <tr key={booking._id || index}>
                      <td className="border px-4 py-2">
                        {booking.professional?.name || 'N/A'}
                      </td>
                      <td className="border px-4 py-2">
                        {booking.manualBookingDetails?.date || 'N/A'}
                      </td>
                      <td className="border px-4 py-2">
                        {`${booking.manualBookingDetails?.startTime || 'N/A'} to ${booking.manualBookingDetails?.endTime || 'N/A'}`}
                      </td>
                      <td className="border px-4 py-2 flex space-x-2 justify-center">
                        <button
                          onClick={() => handleEdit(indexOfFirstItem + index)}
                          className="relative font-montserrat inline-flex items-center justify-center rounded-[10px] overflow-hidden tracking-tighter group border sm:place-self-center lg:place-self-start border-brown-primary text-[12px] sm:text-[14px] px-3 sm:w-32 md:w-40 h-9 bg-white text-brown-primary hover:bg-[#4B2E2E] hover:shadow-lg !shadow-brown-primary hover:text-white hover-styling"
                        >
                          <FaEdit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(indexOfFirstItem + index)}
                          className="relative font-montserrat inline-flex items-center justify-center rounded-[10px] overflow-hidden tracking-tighter group border sm:place-self-center lg:place-self-start border-brown-primary text-[12px] sm:text-[14px] px-3 sm:w-32 md:w-40 h-9 bg-white text-brown-primary hover:bg-[#4B2E2E] hover:shadow-lg !shadow-brown-primary hover:text-white hover-styling"
                        >
                          <FaTrashAlt size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="border px-4 py-2 text-center">
                      No bookings found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-4 space-x-4">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative font-montserrat inline-flex items-center justify-center rounded-[10px] overflow-hidden tracking-tighter group border sm:place-self-center lg:place-self-start border-brown-primary text-[12px] sm:text-[14px] px-3 sm:w-32 md:w-40 h-9 bg-white text-brown-primary hover:bg-[#4B2E2E] hover:shadow-lg !shadow-brown-primary hover:text-white hover-styling"
              >
                <AiOutlineLeft className="w-5 h-5" />
              </button>

              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="relative font-montserrat inline-flex items-center justify-center rounded-[10px] overflow-hidden tracking-tighter group border sm:place-self-center lg:place-self-start border-brown-primary text-[12px] sm:text-[14px] px-3 sm:w-32 md:w-40 h-9 bg-white text-brown-primary hover:bg-[#4B2E2E] hover:shadow-lg !shadow-brown-primary hover:text-white hover-styling"
              >
                <AiOutlineRight className="w-5 h-5" />
              </button>
              </div>
          )}
        </div>
      )}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default Inquire;