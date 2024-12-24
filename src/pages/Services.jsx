import React, { useState, useEffect } from 'react';
import { AiFillEdit, AiFillDelete, AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';

const API_URL = "https://hotrodsbackend.onrender.com";

const Services = () => {
  const [services, setServices] = useState([]);
  const [professionalsList, setProfessionalsList] = useState([]);
  const [formData, setFormData] = useState({ title: '', time: '', price: '' });
  const [updateData, setUpdateData] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedProfessionals, setSelectedProfessionals] = useState([]);
  const [currentServiceId, setCurrentServiceId] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const servicesPerPage = 7;

  // Fetch services and professionals on component mount
  useEffect(() => {
    // Fetch services
    fetch(`${API_URL}/service`)
      .then((response) => response.json())
      .then((data) => {
        if (data.services) {
          setServices(data.services);
        }
      })
      .catch((err) => console.error("Error fetching services:", err));

    // Fetch professionals
    fetch(`${API_URL}/professional`)
      .then((response) => response.json())
      .then((data) => {
        if (data.professionals) {
          setProfessionalsList(data.professionals);
        }
      })
      .catch((err) => console.error("Error fetching professionals:", err));
  }, []);

  // Add input validation
  const validateServiceInput = (data) => {
    if (!data.title || !data.time || !data.price) {
      alert('Please fill in all fields');
      return false;
    }
    return true;
  };

  // Add service
  const handleAddService = (e) => {
    e.preventDefault();

    // Validate input before submitting
    if (!validateServiceInput(formData)) return;

    fetch(`${API_URL}/service`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to add service');
        }
        return response.json();
      })
      .then((data) => {
        if (data.service) {
          // Add the new service to the list
          const updatedServices = [...services, data.service];
          setServices(updatedServices);

          // Reset form data
          setFormData({ title: '', time: '', price: '' });

          // Close the modal
          setIsUpdateModalOpen(false);

          // Reset to first page after adding service
          setCurrentPage(1);
        }
      })
      .catch((err) => {
        console.error("Error adding service:", err);
        alert('Failed to add service. Please try again.');
      });
  };

  // Update service
  const handleUpdateService = (e) => {
    e.preventDefault();

    // Validate input before submitting
    if (!validateServiceInput(updateData)) return;

    const updatedFields = {
      title: updateData.title || "",
      time: updateData.time || "",
      price: updateData.price || "",
    };

    fetch(`${API_URL}/service/${updateData._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedFields),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.service) {
          setServices(
            services.map((service) =>
              service._id === data.service._id ? data.service : service
            )
          );
        }
        setIsUpdateModalOpen(false);
      })
      .catch((err) => console.error("Error updating service:", err));
  };

  // Delete service
  const handleDeleteService = (id) => {
    // Confirmation before deletion
    const confirmDelete = window.confirm("Are you sure you want to delete this service?");
    if (!confirmDelete) return;

    fetch(`${API_URL}/service/${id}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          const updatedServices = services.filter((service) => service._id !== id);
          setServices(updatedServices);

          // Adjust pagination if needed
          const totalPages = Math.ceil(updatedServices.length / servicesPerPage);
          if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
          }
        }
      })
      .catch((err) => console.error("Error deleting service:", err));
  };

  // Handle assigning service
  const handleAssignService = (serviceId) => {
    setCurrentServiceId(serviceId);
    const currentService = services.find((service) => service._id === serviceId);
    setSelectedProfessionals(currentService?.assignedProfessionals.map((pro) => pro._id) || []);
    setIsAssignModalOpen(true);
  };

  // Save assigned professionals for a service
  const handleSaveAssignments = () => {
    fetch(`${API_URL}/service/${currentServiceId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assignedProfessionals: selectedProfessionals }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.service) {
          setServices(
            services.map((service) => (service._id === data.service._id ? data.service : service))
          );
        }
        setIsAssignModalOpen(false);
      })
      .catch((err) => console.error("Error saving assignments:", err));
  };

  // Toggle professional selection
  const handleProfessionalSelection = (professionalId) => {
    setSelectedProfessionals((prevSelected) => {
      if (prevSelected.includes(professionalId)) {
        return prevSelected.filter((id) => id !== professionalId);
      }
      return [...prevSelected, professionalId];
    });
  };

  // Handler to open add service modal
  const handleOpenAddServiceModal = () => {
    // Reset form data when opening the modal
    setFormData({ title: '', time: '', price: '' });
    setUpdateData(null);
    setIsUpdateModalOpen(true);
  };

  // Pagination calculations
  const indexOfLastService = currentPage * servicesPerPage;
  const indexOfFirstService = indexOfLastService - servicesPerPage;
  const currentServices = services.slice(indexOfFirstService, indexOfLastService);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate total pages
  const totalPages = Math.ceil(services.length / servicesPerPage);

  return (
    <div className="p-4 w-full">
      {/* Add Service Button */}
      <div className="mb-4 flex justify-between">
        <button
          onClick={handleOpenAddServiceModal}
          className="relative font-montserrat inline-flex items-center justify-center rounded-[10px] overflow-hidden tracking-tighter group border sm:place-self-center lg:place-self-start border-brown-primary text-[14px] sm:text-[16px] px-4 sm:w-60 md:w-72 h-12 bg-white text-brown-primary hover:bg-[#4B2E2E] hover:shadow-lg !shadow-brown-primary hover:text-white hover-styling"
        >
          Add Service
        </button>
      </div>

      {/* Table of Services */}
      <div className="w-full text-gray-700 bg-white shadow-md rounded-lg bg-clip-border overflow-hidden">
        <table className="w-full text-left table-fixed">
          <thead>
            <tr>
              <th className="p-2 border-b border-slate-300 bg-slate-50">Title</th>
              <th className="p-2 border-b border-slate-300 bg-slate-50">Time</th>
              <th className="p-2 border-b border-slate-300 bg-slate-50">Price</th>
              <th className="p-2 border-b border-slate-300 bg-slate-50">Assigned To</th>
              <th className="p-2 border-b border-slate-300 bg-slate-50">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentServices.map((service) => (
              <tr className="hover:bg-slate-50" key={service._id}>
                <td className="p-2 border-b border-slate-200 truncate">{service.title}</td>
                <td className="p-2 border-b border-slate-200 truncate">{service.time}</td>
                <td className="p-2 border-b border-slate-200 truncate">{service.price}</td>
                <td className="p-2 border-b border-slate-200">
                  {service.assignedProfessionals?.length > 0 ? (
                    <div className="flex items-center">
                      {service.assignedProfessionals.slice(0, 2).map((professional) => (
                        <span key={professional._id} className="mr-1">
                          {professional.name}
                        </span>
                      ))}
                      {service.assignedProfessionals.length > 2 && (
                        <span className="text-gray-500">
                          ...and {service.assignedProfessionals.length - 2} more
                        </span>
                      )}
                    </div>
                  ) : (
                    'No professionals assigned'
                  )}
                </td>
                <td className="p-2 border-b border-slate-200">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleAssignService(service._id)}
                      className="relative font-montserrat inline-flex items-center justify-center rounded-[10px] overflow-hidden tracking-tighter group border sm:place-self-center lg:place-self-start border-brown-primary text-[12px] sm:text-[14px] px-3 sm:w-32 md:w-40 h-9 bg-white text-brown-primary hover:bg-[#4B2E2E] hover:shadow-lg !shadow-brown-primary hover:text-white hover-styling"
                    >
                      Assign
                    </button>
                    <button
                      onClick={() => {
                        setIsUpdateModalOpen(true);
                        setUpdateData(service);
                      }}
                      className="relative font-montserrat inline-flex items-center justify-center rounded-[10px] overflow-hidden tracking-tighter group border sm:place-self-center lg:place-self-start border-brown-primary text-[12px] sm:text-[14px] px-3 sm:w-32 md:w-40 h-9 bg-white text-brown-primary hover:bg-[#4B2E2E] hover:shadow-lg !shadow-brown-primary hover:text-white hover-styling"
                    >
                      <AiFillEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteService(service._id)}
                      className="relative font-montserrat inline-flex items-center justify-center rounded-[10px] overflow-hidden tracking-tighter group border sm:place-self-center lg:place-self-start border-brown-primary text-[12px] sm:text-[14px] px-3 sm:w-32 md:w-40 h-9 bg-white text-brown-primary hover:bg-[#4B2E2E] hover:shadow-lg !shadow-brown-primary hover:text-white hover-styling"
                    >
                      <AiFillDelete />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center mt-4">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded bg-gray-200 disabled:opacity-50"
          aria-label="Previous Page"
        >
          <AiOutlineLeft />
        </button>

        <span className="mx-4 text-sm text-gray-700">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded bg-gray-200 disabled:opacity-50"
          aria-label="Next Page"
        >
          <AiOutlineRight />
        </button>
      </div>

      {/* Modal for Assigning Professionals */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Assign Professionals</h2>
            <div className="space-y-4 max-h-60 overflow-y-auto">
              {professionalsList.map((professional) => (
                <div key={professional._id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`professional-${professional._id}`}
                    checked={selectedProfessionals.includes(professional._id)}
                    onChange={() => handleProfessionalSelection(professional._id)}
                    className="mr-2"
                  />
                  <label htmlFor={`professional-${professional._id}`}>{professional.name}</label>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => setIsAssignModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveAssignments}
                className="px-4 py-2 border border-blue-500 text-blue-500 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Updating/Adding Service */}
{isUpdateModalOpen && (
  <div
    className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50"
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-title"
  >
    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
      <h2 id="modal-title" className="text-xl font-semibold mb-4">
        {updateData ? 'Update Service' : 'Add Service'}
      </h2>
      <form onSubmit={updateData ? handleUpdateService : handleAddService}>
        <div className="mb-4">
          <label className="block text-sm font-medium">Title</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded"
            value={updateData ? updateData.title : formData.title}
            onChange={(e) => 
              updateData 
                ? setUpdateData({ ...updateData, title: e.target.value })
                : setFormData({ ...formData, title: e.target.value })
            }
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Time</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded"
            value={updateData ? updateData.time : formData.time}
            onChange={(e) => 
              updateData 
                ? setUpdateData({ ...updateData, time: e.target.value })
                : setFormData({ ...formData, time: e.target.value })
            }
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Price</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded"
            value={updateData ? updateData.price : formData.price}
            onChange={(e) => 
              updateData 
                ? setUpdateData({ ...updateData, price: e.target.value })
                : setFormData({ ...formData, price: e.target.value })
            }
            required
          />
        </div>
        <div className="flex justify-end gap-2 mt-4">
          {/* Apply the previous button styling here */}
          <button
            type="button"
            onClick={() => setIsUpdateModalOpen(false)}
            className="relative font-montserrat inline-flex items-center justify-center rounded-[10px] overflow-hidden tracking-tighter group border sm:place-self-center lg:place-self-start border-brown-primary text-[14px] sm:text-[16px] px-4 sm:w-60 md:w-72 h-12 bg-white text-brown-primary hover:bg-[#4B2E2E] hover:shadow-lg !shadow-brown-primary hover:text-white hover-styling"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="relative font-montserrat inline-flex items-center justify-center rounded-[10px] overflow-hidden tracking-tighter group border sm:place-self-center lg:place-self-start border-brown-primary text-[14px] sm:text-[16px] px-4 sm:w-60 md:w-72 h-12 bg-white text-brown-primary hover:bg-[#4B2E2E] hover:shadow-lg !shadow-brown-primary hover:text-white hover-styling"
          >
            {updateData ? 'Update' : 'Add'}
          </button>
        </div>
      </form>
    </div>
  </div>
)}

    </div>
  );
};

export default Services;
