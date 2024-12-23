import React, { useState, useEffect } from 'react';
import { AiFillDelete, AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactLoading from 'react-loading';
import axios from 'axios';

const API_URL = "http://localhost:5000"; // Adjust as needed

const OrderSummary = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get(`${API_URL}/order-summary`);
        if (response.data && response.data.orderSummaries) {
          setOrders(response.data.orderSummaries);
        } else {
          setError('No orders found');
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const calculateOrderTotal = (services = [], tip = 0) => {
    const subtotal = services.reduce((total, service) => {
      const servicePrice = parseFloat(service.price) || 0;
      return total + servicePrice;
    }, 0);

    const totalServiceTime = services.reduce((total, service) => {
      const serviceTime = parseFloat(service.time) || 0;
      return total + serviceTime;
    }, 0);

    const totalAmount = subtotal + tip;
    return { totalServiceTime, subtotal, totalAmount };
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
  };

  const handleBackToList = () => {
    setSelectedOrder(null);
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = orders.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate total pages
  const totalPages = Math.ceil(orders.length / itemsPerPage);

  return (
    <div className="p-4">
      {error && <div className="text-red-500 mb-4">{error}</div>}

      {isLoading ? (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
          <ReactLoading type="spin" color="#ffffff" height={50} width={50} />
        </div>
      ) : selectedOrder ? (
        <div className="p-4 border border-gray-300 rounded-lg shadow-md">
          {/* Selected Order Details */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold">{selectedOrder.professional?.name || 'N/A'}</h2>
            <p className="text-sm text-gray-500">
              Appointment Date: {selectedOrder.appointment?.date?.slice(0, 10) || 'N/A'} at{' '}
              {selectedOrder.appointment?.time || 'N/A'}
            </p>
          </div>

          {/* Services */}
          <div className="mb-6">
            <h3 className="text-xl font-medium">Services</h3>
            <table className="w-full text-left table-auto border-separate border-spacing-2">
              <thead>
                <tr>
                  <th className="p-4 border-b border-gray-300">Service</th>
                  <th className="p-4 border-b border-gray-300">Price</th>
                  <th className="p-4 border-b border-gray-300">Time</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.services?.map((service) => (
                  <tr key={service._id}>
                    <td className="p-4 border-b border-gray-200">{service.title || 'N/A'}</td>
                    <td className="p-4 border-b border-gray-200">${service.price || 'N/A'}</td>
                    <td className="p-4 border-b border-gray-200">{service.time || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="mb-6">
            <h3 className="text-xl font-medium">Summary</h3>
            {(() => {
              const { totalServiceTime, subtotal, totalAmount } = calculateOrderTotal(
                selectedOrder.services,
                selectedOrder.tip
              );
              return (
                <>
                  <div className="flex justify-between py-2">
                    <span>Total Service Time:</span>
                    <span>{totalServiceTime.toFixed(2)} hours</span>
                  </div>
                  <div className="flex justify-between py-2 font-semibold">
                    <span>Subtotal:</span>
                    <span>${subtotal}</span>
                  </div>
                  <div className="flex justify-between py-2 font-semibold text-blue-500">
                    <span>Tip:</span>
                    <span>${selectedOrder.tip || 0}</span>
                  </div>
                  <div className="flex justify-between py-2 font-semibold text-blue-500">
                    <span>Total Amount:</span>
                    <span>${totalAmount}</span>
                  </div>
                </>
              );
            })()}
          </div>

          <button
            onClick={handleBackToList}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Back to Orders
          </button>
        </div>
      ) : (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4">Order List</h3>
          <table className="w-full text-left table-auto border-separate border-spacing-2">
            <thead>
              <tr>
                <th className="p-4 border-b border-gray-300">Name</th>
                <th className="p-4 border-b border-gray-300">Appointment Date</th>
                <th className="p-4 border-b border-gray-300">Time</th>
                <th className="p-4 border-b border-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((order) => (
                <tr key={order._id}>
                  <td className="p-4 border-b border-gray-200">{order.professional?.name || 'N/A'}</td>
                  <td className="p-4 border-b border-gray-200">
                    {order.appointment?.date?.slice(0, 10) || 'N/A'}
                  </td>
                  <td className="p-4 border-b border-gray-200">{order.appointment?.time || 'N/A'}</td>
                  <td className="p-4 border-b border-gray-200">
                    <button
                      onClick={() => handleViewOrder(order)}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

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
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default OrderSummary;