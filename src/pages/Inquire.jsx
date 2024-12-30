import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import ReactLoading from 'react-loading';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = 'https://hotrodsbackend.onrender.com';

const Inquire = () => {
  const [professionals, setProfessionals] = useState([]);
  const [selectedProfessional, setSelectedProfessional] = useState(null);
  const [bookingDetails, setBookingDetails] = useState({
    date: '',
    startTime: '',
    endTime: ''
  });
  const [submittedData, setSubmittedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingInquiryId, setEditingInquiryId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Reset form fields
  const resetForm = () => {
    setSelectedProfessional(null);
    setBookingDetails({ date: '', startTime: '', endTime: '' });
    setEditingInquiryId(null);
  };

  // -----------------------------
  // Handle submission (create or edit)
  // -----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProfessional) {
      toast.error('Please select a professional');
      return;
    }

    setLoading(true);

    try {
      if (editingInquiryId) {
        // -----------------------------
        // Updating existing booking
        // -----------------------------
        const response = await axios.patch(
          `${API_URL}/inquire/${selectedProfessional}`, // Using professionalId
          {
            // We only pass manualBookingDetails here for demonstration;
            // add onlineBookingDetails if you need to update those too.
            manualBookingDetails: [
              {
                date: bookingDetails.date,
                startTime: bookingDetails.startTime,
                endTime: bookingDetails.endTime
              }
            ]
          }
        );

        // Find the professional details to keep them populated in local state
        const professionalDetails = professionals.find(
          (p) => p._id === selectedProfessional
        );

        // Merge updated inquiry with the professional’s data (front-end only)
        const updatedInquiry = {
          ...response.data.inquire,
          professional: professionalDetails
        };

        // Replace the old inquiry in state by matching _id
        const updatedInquiries = submittedData.map((inquiry) =>
          inquiry._id === editingInquiryId ? updatedInquiry : inquiry
        );

        setSubmittedData(updatedInquiries);
        toast.success('Booking updated successfully!');
      } else {
        // -----------------------------
        // Creating a new booking
        // -----------------------------
        const response = await axios.post(`${API_URL}/inquire`, {
          professional: selectedProfessional,
          manualBookingDetails: [
            {
              date: bookingDetails.date,
              startTime: bookingDetails.startTime,
              endTime: bookingDetails.endTime
            }
          ]
        });

        // Populate the professional in the newly created inquiry
        const professionalDetails = professionals.find(
          (p) => p._id === selectedProfessional
        );
        const newInquiry = {
          ...response.data.inquire,
          professional: professionalDetails
        };

        setSubmittedData([newInquiry, ...submittedData]);
        toast.success('Booking submitted successfully!');
      }

      setIsFormVisible(false);
      resetForm();
    } catch (error) {
      console.error('Submission error:', error);
      toast.error(
        error.response?.data?.message || 'Failed to submit/update booking'
      );
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Refetch professionals & inquiries
  // -----------------------------
  const refetchData = async () => {
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
      toast.error(error.response?.data?.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetchData();
  }, []);

  // -----------------------------
  // Edit an existing booking
  // -----------------------------
  const handleEdit = (index) => {
    const dataToEdit = submittedData[index];
    if (
      !dataToEdit?.professional?._id ||
      !dataToEdit?.manualBookingDetails?.[0]
    ) {
      toast.error('Invalid booking data');
      return;
    }

    // Extract the first booking detail from the array
    const bookingDetail = dataToEdit.manualBookingDetails[0];

    setSelectedProfessional(dataToEdit.professional._id);
    setBookingDetails({
      date: bookingDetail.date,
      startTime: bookingDetail.startTime,
      endTime: bookingDetail.endTime
    });

    // Keep track of which inquiry we’re editing by ID (not used in the backend, but for local state)
    setEditingInquiryId(dataToEdit._id);

    setIsFormVisible(true);
  };

  // -----------------------------
  // Delete a booking
  // -----------------------------
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

  // -----------------------------
  // Pagination
  // -----------------------------
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = submittedData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(submittedData.length / itemsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // -----------------------------
  // Show loading spinner
  // -----------------------------
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

      {/* Add Booking Button */}
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

      {/* Booking Form */}
      {isFormVisible && (
        <form onSubmit={handleSubmit} className="mb-4 mt-4">
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

          {/* Date */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              type="date"
              value={bookingDetails.date}
              onChange={(e) =>
                setBookingDetails({ ...bookingDetails, date: e.target.value })
              }
              className="mt-1 p-2 w-full border border-gray-300 rounded"
              required
            />
          </div>

          {/* Start Time */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Start Time
            </label>
            <input
              type="time"
              value={bookingDetails.startTime}
              onChange={(e) =>
                setBookingDetails({
                  ...bookingDetails,
                  startTime: e.target.value
                })
              }
              className="mt-1 p-2 w-full border border-gray-300 rounded"
              required
            />
          </div>

          {/* End Time */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              End Time
            </label>
            <input
              type="time"
              value={bookingDetails.endTime}
              onChange={(e) =>
                setBookingDetails({
                  ...bookingDetails,
                  endTime: e.target.value
                })
              }
              className="mt-1 p-2 w-full border border-gray-300 rounded"
              required
            />
          </div>

          {/* Submit & Cancel Buttons */}
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
              ) : editingInquiryId ? (
                'Update'
              ) : (
                'Submit'
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

      {/* Bookings Table */}
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
                      {/* Professional Name */}
                      <td className="border px-4 py-2">
                        {booking.professional?.name || 'N/A'}
                      </td>

                      {/* Date */}
                      <td className="border px-4 py-2">
                        {booking.manualBookingDetails?.[0]?.date || 'N/A'}
                      </td>

                      {/* Start to End Time */}
                      <td className="border px-4 py-2">
                        {`${booking.manualBookingDetails?.[0]?.startTime || 'N/A'}
                        to
                        ${booking.manualBookingDetails?.[0]?.endTime || 'N/A'}`}
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

          {/* Pagination */}
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
