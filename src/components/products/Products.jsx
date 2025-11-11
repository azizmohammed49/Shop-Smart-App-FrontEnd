import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Products = () => {
  const user = useSelector((state) => state.user.data);
  const [data, setData] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    supplier: "", // supplier id
    purchasePrice: "",
    sellingPrice: "",
    stockQty: "",
    imageURL: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const getData = async () => {
    try {
      setLoading(true);
      const resp = await axios.get(
        `${import.meta.env.VITE_API_URL}/products/allProducts`,
        {
          headers: { Authorization: `Bearer ${user?.token}` },
        }
      );
      setData(resp.data.data || []);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error(err);
      setError(err.response?.data?.message || err.message);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      // payload matches backend product schema
      const payload = {
        name: formData.name,
        category: formData.category,
        supplier: formData.supplier,
        purchasePrice: Number(formData.purchasePrice),
        sellingPrice: Number(formData.sellingPrice),
        stockQty: Number(formData.stockQty),
        imageURL: formData.imageURL || undefined,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/products/addProduct`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("[Products] Product added:", response.data);
      setShowModal(false);
      setFormData({
        name: "",
        category: "",
        supplier: "",
        purchasePrice: "",
        sellingPrice: "",
        stockQty: "",
        imageURL: "",
      });
      await getData();
      setSubmitting(false);
    } catch (err) {
      console.error("[Products] Error adding product:", err);
      setError(err.response?.data?.message || err.message);
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (user?.token) {
      getData();
      getSuppliers();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.token]);

  if (loading)
    return <div className="p-6 text-center">Loading products...</div>;
  if (error)
    return <div className="p-6 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Products ({data.length})</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Product
        </button>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Product name
              </th>
              <th scope="col" className="px-6 py-3">
                Category
              </th>
              <th scope="col" className="px-6 py-3">
                Supplier
              </th>
              <th scope="col" className="px-6 py-3">
                Purchase Price
              </th>
              <th scope="col" className="px-6 py-3">
                Selling Price
              </th>
              <th scope="col" className="px-6 py-3">
                Stock Qty
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.length ? (
              data.map((dt) => (
                <tr
                  key={dt._id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {dt.name}
                  </th>
                  <td className="px-6 py-4">{dt.category}</td>
                  <td className="px-6 py-4">
                    {dt?.supplier?.supplierName || dt?.supplier?._id}
                  </td>
                  <td className="px-6 py-4">{dt.purchasePrice}</td>
                  <td className="px-6 py-4">{dt.sellingPrice}</td>
                  <td className="px-6 py-4">{dt.stockQty}</td>
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
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Add New Product</h3>

            <form onSubmit={handleAddProduct}>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Category *
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Supplier *
                </label>
                <select
                  name="supplier"
                  value={formData.supplier}
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

              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Purchase Price *
                </label>
                <input
                  type="number"
                  name="purchasePrice"
                  value={formData.purchasePrice}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Selling Price *
                </label>
                <input
                  type="number"
                  name="sellingPrice"
                  value={formData.sellingPrice}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Stock Qty *
                </label>
                <input
                  type="number"
                  name="stockQty"
                  value={formData.stockQty}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Image URL
                </label>
                <input
                  type="text"
                  name="imageURL"
                  value={formData.imageURL}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
                  {submitting ? "Adding..." : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
