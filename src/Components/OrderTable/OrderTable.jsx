import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import TableSkeleton from "../Skeleton/TableSkeleton/TableSkeleton.jsx";

function OrderTable({ data = [], isLoading, error, onView }) {
  return (
    <div className="h-[70vh] w-full border border-gray-300 overflow-y-auto shadow-md rounded-lg">
      <table className="w-full text-sm text-gray-700 dark:text-gray-300">
        <thead className="text-xs text-white uppercase bg-[#612bc5] sticky top-0">
          <tr>
            <th className="px-4 py-3">Order ID</th>
            <th className="px-4 py-3">Customer</th>
            <th className="px-4 py-3">Amount</th>
            <th className="px-4 py-3">Order Status</th>
            <th className="px-4 py-3">Payment Status</th>
            <th className="px-4 py-3">Payment Mode</th>
            <th className="px-4 py-3">Delivery Status</th>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3 text-center">Action</th>
          </tr>
        </thead>

        <tbody className="text-center bg-white dark:bg-gray-900">
          {/* ⏳ Loading */}
          {isLoading &&
            Array.from({ length: 8 }).map((_, index) => (
              <TableSkeleton key={index} colSpan="9" />
            ))}

          {/* ❌ Error */}
          {!isLoading && error && (
            <tr>
              <td colSpan="9" className="py-6 text-red-500">
                Failed to load orders
              </td>
            </tr>
          )}

          {/* 📦 Orders */}
          {!isLoading &&
            !error &&
            data?.data?.map((order) => (
              <tr
                key={order._id}
                className="border-b hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td className="px-4 py-2 font-semibold">
                  {order.orderId || order._id}
                </td>

                <td className="px-4 py-2">
                  {order.user?.email || "Guest"}
                </td>

                <td className="px-4 py-2 font-semibold">
                  ₹{order.totalPayableAmount.toLocaleString("en-IN")}
                </td>

                {/* 🟣 Order Status */}
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-bold
                      ${
                        order.orderStatus === "ACTIVE"
                          ? "bg-blue-100 text-blue-700"
                          : order.orderStatus === "CANCELLED"
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                  >
                    {order.orderStatus}
                  </span>
                </td>

                {/* 💰 Payment Status */}
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-bold
                      ${
                        order.paymentStatus === "Paid"
                          ? "bg-green-100 text-green-700"
                          : order.paymentStatus === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : order.paymentStatus === "Refunded"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-red-100 text-red-700"
                      }`}
                  >
                    {order.paymentStatus}
                  </span>
                </td>

                <td className="px-4 py-2">{order.paymentMode}</td>

                {/* 🚚 Delivery Status */}
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-bold
                      ${
                        order.deliveryStatus === "Delivered"
                          ? "bg-green-100 text-green-700"
                          : order.deliveryStatus === "Cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                  >
                    {order.deliveryStatus}
                  </span>
                </td>

                <td className="px-4 py-2">
                  {new Date(order.createdAt).toLocaleDateString("en-IN")}
                </td>

                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => onView(order._id)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                </td>
              </tr>
            ))}

          {/* 📭 No Data */}
          {!isLoading && !error && data?.data?.length === 0 && (
            <tr>
              <td colSpan="9" className="py-10 text-gray-500">
                No orders found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default OrderTable;
