// import React, { useState, useEffect } from 'react';
// import { AiFillDelete, AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import ReactLoading from 'react-loading';
// import axios from 'axios';

// const API_URL = "http://localhost:5000"; // Adjust as needed

// const OrderSummary = () => {
//   const [orders, setOrders] = useState([]);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
  
//   // Pagination state
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 7;

//   useEffect(() => {
//     const fetchOrders = async () => {
//       setIsLoading(true);
//       setError(null);

//       try {
//         const response = await axios.get(`${API_URL}/order-summary`);
//         if (response.data && response.data.orderSummaries) {
//           setOrders(response.data.orderSummaries);
//         } else {
//           setError('No orders found');
//         }
//       } catch (err) {
//         console.error('Error fetching orders:', err);
//         setError('Failed to load orders. Please try again later.');
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchOrders();
//   }, []);

//   const calculateOrderTotal = (services = [], tip = 0) => {
//     const subtotal = services.reduce((total, service) => {
//       const servicePrice = parseFloat(service.price) || 0;
//       return total + servicePrice;
//     }, 0);

//     const totalServiceTime = services.reduce((total, service) => {
//       const serviceTime = parseFloat(service.time) || 0;
//       return total + serviceTime;
//     }, 0);

//     const totalAmount = subtotal + tip;
//     return { totalServiceTime, subtotal, totalAmount };
//   };

//   const handleViewOrder = (order) => {
//     setSelectedOrder(order);
//   };

//   const handleBackToList = () => {
//     setSelectedOrder(null);
//   };

//   // Pagination logic
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = orders.slice(indexOfFirstItem, indexOfLastItem);

//   // Change page
//   const paginate = (pageNumber) => setCurrentPage(pageNumber);

//   // Calculate total pages
//   const totalPages = Math.ceil(orders.length / itemsPerPage);

//   return (
//     <div className="p-4">
//       {error && <div className="text-red-500 mb-4">{error}</div>}

//       {isLoading ? (
//         <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
//           <ReactLoading type="spin" color="#ffffff" height={50} width={50} />
//         </div>
//       ) : selectedOrder ? (
//         <div className="p-4 border border-gray-300 rounded-lg shadow-md">
//           {/* Selected Order Details */}
//           <div className="mb-6">
//             <h2 className="text-2xl font-semibold">{selectedOrder.professional?.name || 'N/A'}</h2>
//             <p className="text-sm text-gray-500">
//               Appointment Date: {selectedOrder.appointment?.date?.slice(0, 10) || 'N/A'} at{' '}
//               {selectedOrder.appointment?.time || 'N/A'}
//             </p>
//           </div>

//           {/* Services */}
//           <div className="mb-6">
//             <h3 className="text-xl font-medium">Services</h3>
//             <table className="w-full text-left table-auto border-separate border-spacing-2">
//               <thead>
//                 <tr>
//                   <th className="p-4 border-b border-gray-300">Service</th>
//                   <th className="p-4 border-b border-gray-300">Price</th>
//                   <th className="p-4 border-b border-gray-300">Time</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {selectedOrder.services?.map((service) => (
//                   <tr key={service._id}>
//                     <td className="p-4 border-b border-gray-200">{service.title || 'N/A'}</td>
//                     <td className="p-4 border-b border-gray-200">${service.price || 'N/A'}</td>
//                     <td className="p-4 border-b border-gray-200">{service.time || 'N/A'}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Summary */}
//           <div className="mb-6">
//             <h3 className="text-xl font-medium">Summary</h3>
//             {(() => {
//               const { totalServiceTime, subtotal, totalAmount } = calculateOrderTotal(
//                 selectedOrder.services,
//                 selectedOrder.tip
//               );
//               return (
//                 <>
//                   <div className="flex justify-between py-2">
//                     <span>Total Service Time:</span>
//                     <span>{totalServiceTime.toFixed(2)} hours</span>
//                   </div>
//                   <div className="flex justify-between py-2 font-semibold">
//                     <span>Subtotal:</span>
//                     <span>${subtotal}</span>
//                   </div>
//                   <div className="flex justify-between py-2 font-semibold text-blue-500">
//                     <span>Tip:</span>
//                     <span>${selectedOrder.tip || 0}</span>
//                   </div>
//                   <div className="flex justify-between py-2 font-semibold text-blue-500">
//                     <span>Total Amount:</span>
//                     <span>${totalAmount}</span>
//                   </div>
//                 </>
//               );
//             })()}
//           </div>

//           <button
//             onClick={handleBackToList}
//             className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
//           >
//             Back to Orders
//           </button>
//         </div>
//       ) : (
//         <div className="mb-6">
//           <h3 className="text-xl font-semibold mb-4">Order List</h3>
//           <table className="w-full text-left table-auto border-separate border-spacing-2">
//             <thead>
//               <tr>
//                 <th className="p-4 border-b border-gray-300">Name</th>
//                 <th className="p-4 border-b border-gray-300">Appointment Date</th>
//                 <th className="p-4 border-b border-gray-300">Time</th>
//                 <th className="p-4 border-b border-gray-300">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {currentItems.map((order) => (
//                 <tr key={order._id}>
//                   <td className="p-4 border-b border-gray-200">{order.professional?.name || 'N/A'}</td>
//                   <td className="p-4 border-b border-gray-200">
//                     {order.appointment?.date?.slice(0, 10) || 'N/A'}
//                   </td>
//                   <td className="p-4 border-b border-gray-200">{order.appointment?.time || 'N/A'}</td>
//                   <td className="p-4 border-b border-gray-200">
//                     <button
//                       onClick={() => handleViewOrder(order)}
//                       className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//                     >
//                       View
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {/* Pagination Controls */}
//           <div className="flex justify-center items-center mt-4 space-x-2">
//             <button 
//               onClick={() => paginate(currentPage - 1)} 
//               disabled={currentPage === 1}
//               className="p-2 rounded bg-gray-200 disabled:opacity-50"
//             >
//               <AiOutlineLeft />
//             </button>
            
//             <span className="text-sm text-gray-700">
//               Page {currentPage} of {totalPages}
//             </span>
            
//             <button 
//               onClick={() => paginate(currentPage + 1)} 
//               disabled={currentPage === totalPages}
//               className="p-2 rounded bg-gray-200 disabled:opacity-50"
//             >
//               <AiOutlineRight />
//             </button>
//           </div>
//         </div>
//       )}

//       <ToastContainer />
//     </div>
//   );
// };

// export default OrderSummary;



import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import ReactLoading from 'react-loading';

const API_URL = "https://hotrodsbackend.onrender.com"; // Base API URL

const AuthorizeDisplay = () => {
  const [authorizations, setAuthorizations] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchAuthorizations = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${API_URL}/pay`);
        setAuthorizations(response.data);
      } catch (err) {
        console.error('Error fetching authorizations:', err);
        setError('Failed to fetch authorization records. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuthorizations();
  }, []);

  const handleViewDetails = (record) => {
    setSelectedRecord(record);
  };

  const handleBack = () => {
    setSelectedRecord(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <ReactLoading type="spin" color="#4F46E5" height={50} width={50} />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  if (selectedRecord) {
    return (
      <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6">Authorization Details</h2>
        
        <div className="space-y-6">
          {/* Personal Information */}
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold mb-3">Personal Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Name</p>
                <p className="font-medium">{`${selectedRecord.firstName} ${selectedRecord.lastName}`}</p>
              </div>
              <div>
                <p className="text-gray-600">Email</p>
                <p className="font-medium">{selectedRecord.email}</p>
              </div>
              <div>
                <p className="text-gray-600">Phone</p>
                <p className="font-medium">{selectedRecord.phone}</p>
              </div>
              <div>
                <p className="text-gray-600">Address</p>
                <p className="font-medium">
                  {`${selectedRecord.address}, ${selectedRecord.city}, ${selectedRecord.state} ${selectedRecord.zipCode}`}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold mb-3">Payment Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Transaction ID</p>
                <p className="font-medium">{selectedRecord.transactionId}</p>
              </div>
              <div>
                <p className="text-gray-600">Amount</p>
                <p className="font-medium">${selectedRecord.amount}</p>
              </div>
              <div>
                <p className="text-gray-600">Subtotal</p>
                <p className="font-medium">${selectedRecord.subTotal}</p>
              </div>
              <div>
                <p className="text-gray-600">Tip</p>
                <p className="font-medium">${selectedRecord.tip || 0}</p>
              </div>
              <div>
                <p className="text-gray-600">Grand Total</p>
                <p className="font-medium">${selectedRecord.grandTotal}</p>
              </div>
            </div>
          </div>

          {/* Professional and Services Information */}
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold mb-3">Professional & Services</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Professional</p>
                <p className="font-medium">
                  {selectedRecord.professional ? selectedRecord.professional.name : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Services</p>
                <div className="space-y-1">
                  {selectedRecord.services && selectedRecord.services.map((service, index) => (
                    <p key={index} className="font-medium">
                      {service.title} - ${service.price} ({service.time} mins)
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Appointment Information */}
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold mb-3">Appointment Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Date</p>
                <p className="font-medium">{new Date(selectedRecord.date).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-600">Time</p>
                <p className="font-medium">{selectedRecord.time}</p>
              </div>
              <div>
                <p className="text-gray-600">Total Service Time</p>
                <p className="font-medium">{selectedRecord.totalServiceTime}</p>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleBack}
          className="relative font-montserrat inline-flex items-center justify-center rounded-[10px] overflow-hidden tracking-tighter group border border-brown-primary px-4 py-2 bg-white text-brown-primary hover:bg-[#4B2E2E] hover:shadow-lg !shadow-brown-primary hover:text-white hover-styling"
        >
          <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-[#4B2E2E] rounded-full group-hover:w-72 group-hover:h-56"></span>
          <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent"></span>
          <span className="relative">Back to List</span>
        </button>
      </div>
    );
  }

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = authorizations.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(authorizations.length / itemsPerPage);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Professional</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Amount</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Transaction ID</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentItems.map((auth) => (
              <tr key={auth._id} className="hover:bg-gray-50">
                <td className="px-6 py-4">{`${auth.firstName} ${auth.lastName}`}</td>
                <td className="px-6 py-4">{new Date(auth.date).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  {auth.professional ? auth.professional.name : 'N/A'}
                </td>
                <td className="px-6 py-4">${auth.amount}</td>
                <td className="px-6 py-4">{auth.transactionId}</td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleViewDetails(auth)}
                    className="relative font-montserrat inline-flex items-center justify-center rounded-[10px] overflow-hidden tracking-tighter group border border-brown-primary px-4 py-2 bg-white text-brown-primary hover:bg-[#4B2E2E] hover:shadow-lg !shadow-brown-primary hover:text-white hover-styling"
                  >
                    <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-[#4B2E2E] rounded-full group-hover:w-72 group-hover:h-56"></span>
                    <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent"></span>
                    <span className="relative">View Details</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-6 space-x-4">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="p-2 rounded bg-gray-100 disabled:opacity-50"
        >
          <AiOutlineLeft />
        </button>
        
        <span className="text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="p-2 rounded bg-gray-100 disabled:opacity-50"
        >
          <AiOutlineRight />
        </button>
      </div>
    </div>
  );
};

export default AuthorizeDisplay;
