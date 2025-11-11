import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Suppliers = () => {
  const user = useSelector((state) => state.user.data);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    supplierName: "",
    contactName: "",
    contactPhone: "",
    contactPhoneCode: "",
    email: "",
    address: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const getData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/supplier/all`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      setData(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error("[Suppliers] Error:", error);
      setError(error.response?.data?.message || error.message);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddSupplier = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/supplier/addSupplier`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("[Suppliers] Supplier added:", response.data);
      setShowModal(false);
      setFormData({
        supplierName: "",
        contactName: "",
        contactPhone: "",
        contactPhoneCode: "",
        email: "",
        address: "",
      });
      getData(); // Refresh suppliers list
      setSubmitting(false);
    } catch (error) {
      console.error("[Suppliers] Error adding supplier:", error);
      setError(error.response?.data?.message || error.message);
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (user?.token) {
      getData();
    }
  }, [user?.token]);

  if (loading)
    return <div className="p-6 text-center">Loading suppliers...</div>;

  if (error)
    return <div className="p-6 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Suppliers ({data.length})</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Supplier
        </button>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Supplier name
              </th>
              <th scope="col" className="px-6 py-3">
                Contact Name
              </th>
              <th scope="col" className="px-6 py-3">
                Contact Phone
              </th>
              <th scope="col" className="px-6 py-3">
                Contact Phone Code
              </th>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
              <th scope="col" className="px-6 py-3">
                Address
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.length > 0 ? (
              data.map((dt) => (
                <tr
                  key={dt._id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {dt.supplierName}
                  </th>
                  <td className="px-6 py-4">{dt.contactName}</td>
                  <td className="px-6 py-4">{dt?.contactPhone}</td>
                  <td className="px-6 py-4">{dt.contactPhoneCode}</td>
                  <td className="px-6 py-4">{dt.email}</td>
                  <td className="px-6 py-4">{dt.address}</td>
                  <td className="px-6 py-4">
                    <a
                      href="#"
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      Edit
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center px-6 py-4">
                  NO Records Found!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h3 className="text-lg font-bold mb-4">Add New Supplier</h3>

            <form onSubmit={handleAddSupplier}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Supplier Name *
                </label>
                <input
                  type="text"
                  name="supplierName"
                  value={formData.supplierName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Contact Name *
                </label>
                <input
                  type="text"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Contact Phone *
                </label>
                <input
                  type="number"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Contact Phone Code *
                </label>
                <input
                  type="text"
                  name="contactPhoneCode"
                  value={formData.contactPhoneCode}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {submitting ? "Adding..." : "Add Supplier"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Suppliers;
