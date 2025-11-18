import axios from "axios";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AddPurchase = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [addProduct, setAddProduct] = useState(false);
  const [suppliers, setSuppliers] = useState([]);

  const getProducts = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/products/allProducts`);
      if (res?.data?.success) {
        setProducts(res?.data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addPurchase = (values) => {
    return axios.post(`${import.meta.env.VITE_API_URL}/purchase/addPurchase`, values);
  };

  const getSuppliers = async () => {
    try {
      const resp = await axios.get(`${import.meta.env.VITE_API_URL}/supplier/supplierMenu`);
      setSuppliers(resp.data.data || []);
    } catch (err) {
      console.error("Error fetching suppliers:", err);
    }
  };

  useEffect(() => {
    getProducts();
    getSuppliers();
  }, []);

  return (
    <div className="flex p-8 flex-col">
      <h3>Add A Purchase</h3>
      <Formik
        initialValues={{
          supplierId: "",
          products: [],
          totalAmount: 0,
          newProducts: [],
        }}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(true);
          let res = await addPurchase(values);
          if (res?.data?.success) {
            setSubmitting(false);
            alert(res?.data?.message);
            navigate(-1);
          }
        }}
      >
        {({ values, errors, handleSubmit, handleChange, isSubmitting, setFieldValue }) => (
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700">Supplier *</label>
              <select
                name="supplierId"
                value={values.supplierId}
                onChange={handleChange}
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
              <p>Products*</p>
              <div>
                {products
                  ?.filter((p) => p.supplier?._id === values.supplierId)
                  ?.map((prd) => (
                    <div className="">
                      <input
                        type="checkbox"
                        value={values?.products?.findIndex((p) => p.productId === prd?._id) > -1}
                        onChange={() => {
                          let prdVals = [...(values?.products?.length ? values.products : [])];
                          let idx = prdVals?.findIndex((p) => p.productId === prd?._id);
                          if (idx > -1) {
                            prdVals = prdVals.filter((p) => p.productId !== prd?._id);
                          } else {
                            let newPrd = { productId: prd?._id, qty: 1, purchasePrice: prd.purchasePrice };
                            prdVals.push(newPrd);
                          }
                          setFieldValue("products", prdVals);
                          let newTotalAmt = prdVals.reduce((prev, acc) => {
                            return prev + acc?.qty * acc?.purchasePrice;
                          }, 0);
                          setFieldValue("totalAmount", newTotalAmt);
                        }}
                      />
                      <span>{prd.name}</span>
                      <span>{prd.purchasePrice}</span>
                      {values?.products?.findIndex((p) => p.productId === prd?._id) > -1 ? (
                        <input
                          className="w-fit border"
                          type="number"
                          onChange={(e) => {
                            let prdVals = [...(values?.products?.length ? values.products : [])];
                            let idx = prdVals?.findIndex((p) => p.productId === prd?._id);
                            if (idx > -1) {
                              prdVals[idx] = {
                                ...prdVals[idx],
                                qty: parseInt(e.target.value),
                              };
                            }
                            setFieldValue("products", prdVals);
                            let newTotalAmt = prdVals.reduce((prev, acc) => {
                              return prev + acc?.qty * acc?.purchasePrice;
                            }, 0);
                            setFieldValue("totalAmount", newTotalAmt);
                          }}
                          value={values?.products?.find((p) => p.productId === prd?._id)?.qty}
                        />
                      ) : null}
                    </div>
                  ))}
              </div>
              {/* <button
                type="button"
                onClick={() => setAddProduct(true)}
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                Add New Product
              </button> */}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Total Amount *</label>
              <input
                type="number"
                name="totalAmount"
                value={values.totalAmount}
                required
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? "Adding..." : "Add Purchase"}
              </button>
            </div>
          </form>
        )}
      </Formik>

      {/* {addProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Add New Product</h3>

            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700">Name *</label>
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
              <label className="block text-sm font-medium text-gray-700">Category *</label>
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
              <label className="block text-sm font-medium text-gray-700">Supplier *</label>
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
              <label className="block text-sm font-medium text-gray-700">Purchase Price *</label>
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
              <label className="block text-sm font-medium text-gray-700">Selling Price *</label>
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
              <label className="block text-sm font-medium text-gray-700">Stock Qty *</label>
              <input
                type="number"
                name="stockQty"
                value={formData.qty}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700">Image URL</label>
              <input
                type="text"
                name="imageURL"
                value={formData.imageURL}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setAddProduct(false)} className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
                {"Add Product"}
              </button>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default AddPurchase;
