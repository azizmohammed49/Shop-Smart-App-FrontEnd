import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Purchases = () => {
  const user = useSelector((state) => state.user.data);
  const [data, setData] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    supplierId: "", // Changed back to supplierId
    products: [],
    date: "",
    totalAmount: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const getPurchases = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/purchase/`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      console.log("[Purchases] Data loaded:", response.data);
      setData(response.data.data || []); // Changed this line
      setLoading(false);
    } catch (error) {
      console.error("[Purchases] Error:", error);
      setError(error.response?.data?.message || error.message);
      setLoading(false);
    }
  };

  const getSuppliers = async () => {
    try {
      const resp = await axios.get(
        `${import.meta.env.VITE_API_URL}/supplier/all`,
        {
          headers: { Authorization: `Bearer ${user?.token}` },
        }
      );
      setSuppliers(resp.data.data || []);
    } catch (err) {
      console.error("Error fetching suppliers:", err);
    }
  };

  const getProducts = async () => {
    try {
      const resp = await axios.get(
        `${import.meta.env.VITE_API_URL}/products/allProducts`,
        {
          headers: { Authorization: `Bearer ${user?.token}` },
        }
      );
      setProducts(resp.data.data || []);
    } catch (err) {
      console.error("Error fetching Products:", err);
    }
  };

  useEffect(() => {
    if (user?.token) {
      getPurchases();
      getSuppliers();
      getProducts();
    }
  }, [user?.token]);

  // Handler to add a product to purchase with default quantity and price
  const addProduct = () => {
    setSelectedProducts([
      ...selectedProducts,
      { productId: "", quantity: 1, price: 0 },
    ]);
  };

  // Handle changes for each product in the list
  const handleProductChange = (index, field, value) => {
    const newProducts = [...selectedProducts];
    newProducts[index][field] =
      field === "quantity" || field === "price" ? Number(value) : value;

    // Auto-set price when productId changes
    if (field === "productId") {
      const productInfo = products.find((p) => p._id === value);
      if (productInfo) {
        newProducts[index].price = productInfo.purchasePrice;
      }
    }

    setSelectedProducts(newProducts);
  };

  // Calculate total amount whenever selectedProducts changes
  useEffect(() => {
    const total = selectedProducts.reduce(
      (sum, p) => sum + p.quantity * p.price,
      0
    );
    setTotalAmount(total);
  }, [selectedProducts]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddPurchase = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (!selectedSupplier || selectedProducts.length === 0) {
        alert("Please select supplier and add at least one product.");
        return;
      }

      const payload = {
        supplierId: selectedSupplier,
        products: selectedProducts,
        totalAmount,
        date: new Date(),
      };
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/purchase/addPurchase`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      console.log("Purchase added:", res.data);
      setShowModal(false);
      setFormData({
        supplierId: "", // Changed back to supplierId
        date: "",
        totalAmount: "",
      });
      await getPurchases();
    } catch (err) {
      console.error("Add purchase error:", err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return <div className="p-6 text-center">Loading Purchases...</div>;

  if (error)
    return <div className="p-6 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Purchases ({data.length})</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Purchase
        </button>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                ID
              </th>
              <th scope="col" className="px-6 py-3">
                Purchase Date
              </th>
              <th scope="col" className="px-6 py-3">
                Supplier
              </th>
              <th scope="col" className="px-6 py-3">
                Total Amount
              </th>
              <th scope="col" className="px-6 py-3">
                Items Count
              </th>
              <th scope="col" className="px-6 py-3">
                Actions
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
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {dt._id?.slice(-8) || dt.id}
                  </td>
                  <td className="px-6 py-4">
                    {dt.date
                      ? new Date(dt.date).toLocaleDateString()
                      : dt.createdAt
                      ? new Date(dt.createdAt).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="px-6 py-4">
                    {dt.supplierId?.supplierName || dt.supplierId?._id || "-"}
                  </td>
                  <td className="px-6 py-4">${dt.totalAmount || 0}</td>
                  <td className="px-6 py-4">
                    {Array.isArray(dt.products) ? dt.products.length : 0}
                  </td>
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
                <td colSpan="6" className="text-center px-6 py-4">
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
            <h3 className="text-lg font-bold mb-4">Add New Purchase</h3>

            <form onSubmit={handleAddPurchase}>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Supplier *
                </label>
                <select
                  name="supplier"
                  value={formData.supplierId}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select supplier</option>
                  {suppliers.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.supplierName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Supplier ID *
                </label>
                <input
                  type="text"
                  name="supplierId" // Changed to supplierId
                  value={formData.supplierId}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Purchase Date *
                </label>
                <input
                  type="date"
                  name="date" // Changed from purchaseDate
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Total Amount *
                </label>
                <input
                  type="number"
                  name="totalAmount"
                  value={formData.totalAmount}
                  onChange={handleInputChange}
                  required
                  step="0.01"
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
                  {submitting ? "Adding..." : "Add Purchase"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Purchases;
