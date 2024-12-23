import React, { useState, useEffect } from 'react';
import { AiFillDelete, AiOutlineEye, AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ContactUs = () => {
  const [contactData, setContactData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // Get the backend URL from environment variables
  const API_URL = "http://localhost:5000"; 

  // Fetch contact data from the API when the component mounts
  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const response = await fetch(`${API_URL}/contactus`); // Get all contact submissions
        const data = await response.json();
        setContactData(data);
      } catch (error) {
        toast.error('Error fetching contact data');
      }
    };

    fetchContactData();
  }, [API_URL]);

  // Open modal with the specific question
  const handleViewQuestion = (question) => {
    setCurrentQuestion(question);
    setIsModalOpen(true);
  };

  // Close the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentQuestion('');
  };

  // Handle delete contact
  const handleDeleteContact = async (id) => {
    try {
      const response = await fetch(`${API_URL}/contactus/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setContactData(contactData.filter((contact) => contact._id !== id)); // Remove the deleted contact from state
        toast.success('Contact deleted successfully');
      } else {
        toast.error('Failed to delete contact');
      }
    } catch (error) {
      toast.error('Error deleting contact');
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = contactData.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate total pages
  const totalPages = Math.ceil(contactData.length / itemsPerPage);

  return (
    <div className="p-6">
      {/* Contact Us Table */}
      <div className="overflow-x-auto shadow-md rounded-lg bg-white">
        <table className="min-w-full bg-white text-left table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border-b text-sm text-gray-700">Full Name</th>
              <th className="px-4 py-2 border-b text-sm text-gray-700">Email</th>
              <th className="px-4 py-2 border-b text-sm text-gray-700">Question</th>
              <th className="px-4 py-2 border-b text-sm text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((contact) => (
              <tr className="hover:bg-gray-50" key={contact._id}>
                <td className="px-4 py-2 border-b text-sm text-gray-800">{contact.fullname}</td>
                <td className="px-4 py-2 border-b text-sm text-gray-800">{contact.email}</td>
                <td className="px-4 py-2 border-b text-sm text-gray-800">
                  <button
                    onClick={() => handleViewQuestion(contact.question)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <AiOutlineEye size={20} />
                  </button>
                </td>
                <td className="px-4 py-2 border-b text-sm">
                  <button
                    onClick={() => handleDeleteContact(contact._id)}
                    className="text-red-500"
                  >
                    <AiFillDelete size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center mt-4 space-x-2">
        <button 
          onClick={() => paginate(currentPage - 1)} 
          disabled={currentPage === 1}
          className="p-2 rounded bg-gray-200 disabled:opacity-50"
        >
          <AiOutlineLeft />
        </button>
        
        <span className="text-sm text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        
        <button 
          onClick={() => paginate(currentPage + 1)} 
          disabled={currentPage === totalPages}
          className="p-2 rounded bg-gray-200 disabled:opacity-50"
        >
          <AiOutlineRight />
        </button>
      </div>

      {/* Modal to show the question */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Question</h2>
            <p className="text-gray-800">{currentQuestion}</p>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Container for Notifications */}
      <ToastContainer />
    </div>
  );
};

export default ContactUs;