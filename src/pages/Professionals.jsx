import React, { useState, useEffect } from "react";
import { AiFillEdit, AiFillDelete, AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactLoading from "react-loading";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const Professionals = () => {
  const [professionals, setProfessionals] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    availability: true,
    image: "",
    notAvailable: [],
  });
  const [updateData, setUpdateData] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const professionalPerPage = 7;
  const API_URL = "https://hotrodsbackend.onrender.com";

  useEffect(() => {
    fetchProfessionals();
  }, []);

  const fetchProfessionals = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/professional`);
      if (!response.ok) throw new Error("Failed to fetch professionals");
      const data = await response.json();
      setProfessionals(Array.isArray(data.professionals) ? data.professionals : 
                      Array.isArray(data) ? data : []);
      setIsLoading(false);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error(error.message);
      setProfessionals([]);
      setIsLoading(false);
    }
  };

  const handleAddProfessional = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const newProfessional = {
        name: formData.name,
        image: formData.image,
      };

      const response = await fetch(`${API_URL}/professional`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProfessional),
      });

      const data = await response.json();
      if (response.ok) {
        setProfessionals(prev => [...prev, data.professional || data]);
        toast.success("Professional added successfully!");
        resetForm();
      } else {
        throw new Error(data.error || "Failed to add professional");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfessional = async (e) => {
    e.preventDefault();
    if (!updateData?._id) {
      toast.error("No professional selected for update.");
      return;
    }

    try {
      setIsLoading(true);
      const updatePayload = {
        name: formData.name,
        image: formData.image,
        availability: formData.availability,
        notAvailable: formData.notAvailable,
      };

      const response = await fetch(`${API_URL}/professional/${updateData._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatePayload),
      });

      const data = await response.json();
      if (response.ok) {
        setProfessionals(prev =>
          prev.map(prof => prof._id === updateData._id ? (data.professional || data) : prof)
        );
        toast.success("Professional updated successfully!");
        resetForm();
      } else {
        throw new Error(data.error || "Failed to update professional");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProfessional = async (id) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/professional/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setProfessionals(prev => prev.filter(prof => prof._id !== id));
        toast.success("Professional deleted successfully!");
      } else {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete professional");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataImg = new FormData();
    formDataImg.append("file", file);
    formDataImg.append("upload_preset", "socialMediaApp");

    try {
      setIsImageUploading(true);
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dfh7msljp/image/upload",
        {
          method: "POST",
          body: formDataImg,
        }
      );
      const data = await response.json();
      setFormData(prev => ({ ...prev, image: data.secure_url }));
      toast.success("Image uploaded successfully!");
    } catch (error) {
      toast.error("Image upload failed.");
    } finally {
      setIsImageUploading(false);
    }
  };

  const handleCalendarChange = (date) => {
    if (!date || !Array.isArray(date)) return;

    const [startDate, endDate] = date;

    // Format the dates as required
    const formattedStartDate = startDate.toISOString().split('T')[0];
    const formattedEndDate = endDate.toISOString().split('T')[0];

    setFormData(prev => ({
      ...prev,
      notAvailable: [{ from: formattedStartDate, to: formattedEndDate }],
      availability: false,  // Set availability to false if there's a date range selected
    }));
  };

  const openUpdateModal = (professional) => {
    setUpdateData(professional);
    setFormData({
      name: professional.name,
      image: professional.image,
      availability: professional.availability,
      notAvailable: professional.notAvailable || [],
    });
    setIsUpdateModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      availability: true,
      image: "",
      notAvailable: [],
    });
    setUpdateData(null);
    setIsUpdateModalOpen(false);
  };

  // Pagination
  const indexOfLastProfessional = currentPage * professionalPerPage;
  const indexOfFirstProfessional = indexOfLastProfessional - professionalPerPage;
  const currentProfessionals = professionals.slice(indexOfFirstProfessional, indexOfLastProfessional);
  const totalPages = Math.ceil(professionals.length / professionalPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const renderFormFields = () => {
    const commonFields = (
      <>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            className="w-full mt-1 p-2 border rounded"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Upload Image</label>
          <input
            type="file"
            onChange={handleImageUpload}
            className="w-full mt-1 p-2 border rounded"
            disabled={isImageUploading}
          />
          {isImageUploading && (
            <ReactLoading type="spin" color="#000" width={30} height={30} className="ml-2" />
          )}
        </div>

        {formData.image && (
          <div className="mb-4">
            <img
              src={formData.image}
              alt="Preview"
              className="w-20 h-20 rounded-full"
            />
          </div>
        )}
      </>
    );

    const availabilityFields = (
      <>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Availability</label>
          <input
            type="checkbox"
            checked={formData.availability}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              availability: e.target.checked,
              notAvailable: e.target.checked ? [] : prev.notAvailable
            }))}
          />
          <label htmlFor="availability" className="ml-2 text-sm font-medium text-gray-700">Available</label>
        </div>

        {!formData.availability && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Not Available</label>
              <Calendar
                onChange={handleCalendarChange}
                selectRange
                value={formData.notAvailable.length > 0 
                  ? [new Date(formData.notAvailable[0].from), new Date(formData.notAvailable[0].to)] 
                  : null}
                className="border rounded w-full"
              />
              {formData.notAvailable.length > 0 && (
                <div className="mt-2 text-sm text-gray-700">
                  Selected Range: {new Date(formData.notAvailable[0].from).toLocaleDateString()} - {new Date(formData.notAvailable[0].to).toLocaleDateString()}
                </div>
              )}
            </div>
          </>
        )}
      </>
    );

    return (
      <>
        {commonFields}
        {updateData && availabilityFields}
      </>
    );
  };

  return (
    <div className="p-4 w-full">
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-center">
      <button
  onClick={() => {
    setUpdateData(null);
    setFormData({
      name: "",
      image: "",
      availability: true,
      notAvailable: [],
    });
    setIsUpdateModalOpen(true);
  }}
  className="relative font-montserrat inline-flex items-center justify-center rounded-[10px] overflow-hidden tracking-tighter group border sm:place-self-center lg:place-self-start border-brown-primary text-[14px] sm:text-[16px] px-2 sm:w-60 md:w-72 h-11 bg-white text-brown-primary hover:bg-[#4B2E2E] hover:shadow-lg !shadow-brown-primary hover:text-white hover-styling"
>
  Add Professional
</button>
      </div>

      <div className="relative flex flex-col w-full h-full text-gray-700 bg-white shadow-md rounded-lg bg-clip-border overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <ReactLoading type="spin" color="#000" />
          </div>
        ) : professionals.length === 0 ? (
          <div className="text-center p-4 text-gray-500">
            No professionals found
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left table-auto min-w-full">
                <thead>
                  <tr>
                    <th className="p-4 border-b border-slate-300 bg-slate-50">Name</th>
                    <th className="p-4 border-b border-slate-300 bg-slate-50">Availability</th>
                    <th className="p-4 border-b border-slate-300 bg-slate-50">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentProfessionals.map((professional) => (
                    <tr key={professional._id} className="hover:bg-slate-50">
                      <td className="p-4 border-b border-slate-200 flex items-center">
                        <img
                          src={professional.image || "https://via.placeholder.com/40"}
                          alt={professional.name}
                          className="w-10 h-10 rounded-full mr-4"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://via.placeholder.com/40";
                          }}
                        />
                        <p className="text-sm text-slate-800">{professional.name}</p>
                      </td>
                      <td className="p-4 border-b border-slate-200">
                        <p className="text-sm text-slate-800">
                          {professional.availability
                            ? "Available"
                            : professional.notAvailable?.length > 0
                            ? professional.notAvailable
                                .map(entry => `${new Date(entry.from).toLocaleDateString()} - ${new Date(entry.to).toLocaleDateString()}`)
                                .join(", ")
                            : "Not Available"}
                        </p>
                      </td>
                      <td className="p-4 border-b border-slate-200">
                        <button
                          onClick={() => openUpdateModal(professional)}
                          className="text-blue-500 mr-2"
                          aria-label={`Edit ${professional.name}`}
                        >
                          <AiFillEdit size={20} />
                        </button>
                        <button
                          onClick={() => handleDeleteProfessional(professional._id)}
                          className="text-red-500"
                          aria-label={`Delete ${professional.name}`}
                        >
                          <AiFillDelete size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-center items-center mt-4 mb-4">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded bg-gray-200 disabled:opacity-50 mr-2"
              >
                <AiOutlineLeft />
              </button>
              <span className="mx-4 text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded bg-gray-200 disabled:opacity-50 ml-2"
              >
                <AiOutlineRight />
              </button>
            </div>
          </>
        )}
      </div>

      {isUpdateModalOpen && (
   <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
  <div className="bg-white p-8 rounded-lg shadow-lg w-128 max-h-[80vh] overflow-y-auto">
    <h2 className="text-2xl font-semibold mb-6 text-center">
      {updateData ? "Update Professional" : "Add New Professional"}
    </h2>
    <form onSubmit={updateData ? handleUpdateProfessional : handleAddProfessional}>
      {renderFormFields()}

      <div className="flex justify-between mt-8 space-x-4">
        <button
          type="button"
          onClick={resetForm}
          className="relative font-montserrat inline-flex items-center justify-center rounded-[10px] overflow-hidden tracking-tighter group border sm:place-self-center lg:place-self-start border-brown-primary text-[14px] sm:text-[16px] px-4 sm:w-60 md:w-72 h-12 bg-white text-brown-primary hover:bg-[#4B2E2E] hover:shadow-lg !shadow-brown-primary hover:text-white hover-styling"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="relative font-montserrat inline-flex items-center justify-center rounded-[10px] overflow-hidden tracking-tighter group border sm:place-self-center lg:place-self-start border-brown-primary text-[14px] sm:text-[16px] px-4 sm:w-60 md:w-72 h-12 bg-white text-brown-primary hover:bg-[#4B2E2E] hover:shadow-lg !shadow-brown-primary hover:text-white hover-styling"
          disabled={isLoading || isImageUploading}
        >
          {isLoading || isImageUploading ? (
            <span className="flex items-center">
              Loading...
              <ReactLoading type="spin" color="#fff" width={20} height={20} className="ml-2" />
            </span>
          ) : (
            updateData ? "Update" : "Add"
          )}
        </button>
      </div>
    </form>
  </div>
</div>

     
      )}
      <ToastContainer />
    </div>
  );
};

export default Professionals;
