import React, { useCallback, useState } from "react";
import debounce from "../../Utils/debounce.js";

import SelectBox from "../SelectBox/SelectBox.jsx";
import OrderTable from "../OrderTable/OrderTable.jsx";
import OrderViewCard from "../OrderViewCard/OrderViewCard.jsx";

import { useGetAllOrdersQuery } from "../../Services/fetchDataFromApi.js";
import { useOrderSocket } from "../../hooks/useOrderSocket.js";
import SearchBox from "../SearchBox/SearchBox.jsx";

function Orders() {
  useOrderSocket();

  // 🔹 Search
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // 🔹 Filters
  const [orderStatus, setOrderStatus] = useState(""); // ✅ NEW
  const [paymentStatus, setPaymentStatus] = useState("");
  const [deliveryStatus, setDeliveryStatus] = useState("");
  const [paymentMode, setPaymentMode] = useState("");

  // 🔹 Order View Modal
  const [showOrderView, setShowOrderView] = useState(false);
  const [orderId, setOrderId] = useState("");

  // 🔹 Debounce search
  const debouncedSearchHandler = useCallback(
    debounce((value) => {
      setDebouncedSearch(value);
    }, 500),
    []
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (!value.trim()) {
      setDebouncedSearch("");
    } else {
      debouncedSearchHandler(value);
    }
  };

  // 🔹 API call
  const {
    data: orders,
    isLoading,
    isError,
    error,
  } = useGetAllOrdersQuery({
    search: debouncedSearch,
    orderStatus, // ✅ NEW
    paymentStatus,
    deliveryStatus,
    paymentMode,
  });

  // 🔹 Clear filters
  const clearFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setOrderStatus(""); // ✅ NEW
    setPaymentStatus("");
    setDeliveryStatus("");
    setPaymentMode("");
  };
console.log(orders);

  return (
    <div className="sm:ml-45  px-6 bg-gray-900 h-screen">
      <h1 className="text-xl font-bold p-2 text-white">Orders</h1>

      {/* 👁 Order View Card */}
      {showOrderView && (
        <OrderViewCard
          orderId={orderId}
          onClose={() => setShowOrderView(false)}
        />
      )}
       <SearchBox
          value={search}
          onChange={handleSearchChange}
          placeholder="Search by Order ID or Email"
        />


      {/* 🔍 Filters */}
      <div className="flex flex-wrap gap-3 mb-4 items-center">
       
        {/* ✅ Order Status Filter */}
        <SelectBox
          placeholder="Order Status"
          value={orderStatus}
          data={["ACTIVE", "CANCELLED", "COMPLETED"]}
          onChange={setOrderStatus}
        />

        <SelectBox
          placeholder="Payment Status"
          value={paymentStatus}
          data={["Pending", "Paid", "Failed", "Refunded","Cancelled "]}
          onChange={setPaymentStatus}
        />

        <SelectBox
          placeholder="Delivery Status"
          value={deliveryStatus}
          data={[
            "Pending",
            "Processing",
            "Shipped",
            "Out for Delivery",
            "Delivered",
            "Cancelled",
          ]}
          onChange={setDeliveryStatus}
        />

        <SelectBox
          placeholder="Payment Mode"
          value={paymentMode}
          data={["Razorpay", "COD"]}
          onChange={setPaymentMode}
        />

        <button
          onClick={clearFilters}
          className="px-3 py-2 text-sm border rounded bg-white hover:border-2 hover:border-white hover:text-white hover:bg-transparent cursor-pointer"
        >
          Clear
        </button>
      </div>

      {/* 📦 Orders Table */}
      <OrderTable
        data={orders}
        isLoading={isLoading}
        error={isError ? error : null}
        onView={(id) => {
          setOrderId(id);
          setShowOrderView(true);
        }}
      />
    </div>
  );
}

export default Orders;
