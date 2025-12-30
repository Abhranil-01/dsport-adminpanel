import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faX,
  faCircleXmark,
  faCircleCheck,
  faRotateLeft,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

import SelectBox from "../SelectBox/SelectBox";
import LoaderBox from "../LoaderBox/LoaderBox";

import {
  useGetOrderByIdQuery,
  useUpdateOrderMutation,
} from "../../Services/fetchDataFromApi";

function OrderViewCard({ orderId, onClose }) {
  const { data, isLoading, isError } = useGetOrderByIdQuery(orderId);
  const [updateOrder, { isLoading: updating }] = useUpdateOrderMutation();

  const order = data?.data;

  const [paymentStatus, setPaymentStatus] = useState("");
  const [deliveryStatus, setDeliveryStatus] = useState("");

  useEffect(() => {
    if (order) {
      setPaymentStatus(order.paymentStatus);
      setDeliveryStatus(order.deliveryStatus);
    }
  }, [order]);

  /* 🔐 Lock rules */
  const isPaymentLocked = ["Paid", "Refunded", "Cancelled"].includes(
    order?.paymentStatus
  );

  const isDeliveryLocked = ["Delivered", "Cancelled"].includes(
    order?.deliveryStatus
  );

  const isLocked = isPaymentLocked && isDeliveryLocked;

  /* 🎯 Order states */
  const isCancelled = order?.orderStatus === "CANCELLED";
  const isDelivered = order?.deliveryStatus === "Delivered";
  const isRefunded = order?.paymentStatus === "Refunded";

  /* 🔄 Update handler */
  const handleUpdate = async () => {
    try {
      const payload = { id: orderId };

      if (paymentStatus !== order.paymentStatus) {
        payload.paymentStatus = paymentStatus;
      }

      if (deliveryStatus !== order.deliveryStatus) {
        payload.deliveryStatus = deliveryStatus;
      }

      if (Object.keys(payload).length === 1) {
        toast.info("No changes to update");
        return;
      }

      await updateOrder(payload).unwrap();
      toast.success("Order updated successfully");
      onClose();
    } catch (err) {
      toast.error(err?.data?.message || "Update failed");
    }
  };

  if (isLoading) return <LoaderBox />;
  if (isError) return <div className="text-red-500">Error loading order</div>;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center dark:text-white">
      <div
        className={`w-[65vw] h-[75vh] rounded-lg p-6 overflow-y-auto
          ${
            isCancelled
              ? "bg-red-50 dark:bg-red-950 border-2 border-red-500"
              : "bg-white dark:bg-gray-900"
          }`}
      >
        {/* 🔴🟢🟠 STATUS BANNER */}
        {(isCancelled || isDelivered || isRefunded) && (
          <div
            className={`mb-6 flex items-center gap-3 px-4 py-3 rounded-lg font-semibold
              ${
                isCancelled
                  ? "bg-red-600 text-white"
                  : isDelivered
                  ? "bg-green-600 text-white"
                  : "bg-orange-500 text-white"
              }`}
          >
            <FontAwesomeIcon
              icon={
                isCancelled
                  ? faCircleXmark
                  : isDelivered
                  ? faCircleCheck
                  : faRotateLeft
              }
              size="lg"
            />
            <span>
              {isCancelled && "ORDER CANCELLED"}
              {isDelivered && "ORDER DELIVERED"}
              {isRefunded && "PAYMENT REFUNDED"}
            </span>
          </div>
        )}

        {/* 🔹 Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-bold text-lg">Order Details</h2>
          <button onClick={onClose}>
            <FontAwesomeIcon icon={faX} />
          </button>
        </div>

        {/* 🔹 Order Summary */}
        <div className="grid grid-cols-2 gap-4 text-sm mb-6 border rounded-lg p-4">
          <div><b>Order ID:</b> {order.orderId || order._id}</div>
          <div><b>Date:</b> {new Date(order.createdAt).toLocaleString()}</div>
          <div><b>Customer:</b> {order.user?.email}</div>
          <div><b>Payment Mode:</b> {order.paymentMode}</div>
          <div><b>Payment Status:</b> {order.paymentStatus}</div>
          <div><b>Delivery Status:</b> {order.deliveryStatus}</div>
          <div className="col-span-2 font-semibold">
            Total Amount: ₹{order.totalPayableAmount.toLocaleString("en-IN")}
          </div>
        </div>

        {/* 🔴 Cancelled Notice */}
        {isCancelled && (
          <div className="mb-4 px-4 py-3 rounded-lg bg-red-100 text-red-700 text-sm font-medium">
            This order has been cancelled. The charges below are shown for
            record and audit purposes only.
          </div>
        )}

        {/* 🔹 Price Breakdown (Always Visible) */}
        <div
          className={`border rounded-lg p-4 mb-6 text-sm
            ${isCancelled ? "opacity-60 line-through text-gray-500" : ""}
          `}
        >
          <h3 className="font-semibold mb-3">
            {isCancelled
              ? "Original Price Details (Cancelled Order)"
              : "Price Details"}
          </h3>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Total Quantity</span>
              <span>{order.totalQuantity}</span>
            </div>

            <div className="flex justify-between">
              <span>Items Price</span>
              <span>₹{order.totalPrice?.toLocaleString("en-IN")}</span>
            </div>

            <div className="flex justify-between">
              <span>Tax</span>
              <span>₹{order.tax}</span>
            </div>

            <div className="flex justify-between">
              <span>Delivery Charge</span>
              <span>₹{order.deliveryCharge}</span>
            </div>

            <div className="flex justify-between">
              <span>Handling Charge</span>
              <span>₹{order.handlingCharge}</span>
            </div>

            {order.discountPrice > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>- ₹{order.discountPrice}</span>
              </div>
            )}

            <hr />

            <div className="flex justify-between font-bold text-base">
              <span>
                {isCancelled ? "Original Order Amount" : "Total Payable"}
              </span>
              <span>
                ₹{order.totalPayableAmount.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>

        {/* 🔹 Status Update */}
        <div
          className={`grid grid-cols-2 gap-6 mb-6 ${
            isCancelled ? "opacity-60 pointer-events-none" : ""
          }`}
        >
          <SelectBox
            label="Payment Status"
            value={paymentStatus}
            onChange={setPaymentStatus}
            data={["Pending", "Paid", "Failed", "Refunded", "Cancelled"]}
            editable={!isPaymentLocked}
          />

          <SelectBox
            label="Delivery Status"
            value={deliveryStatus}
            onChange={setDeliveryStatus}
            data={[
              "Pending",
              "Processing",
              "Shipped",
              "Out for Delivery",
              "Delivered",
              "Cancelled",
            ]}
            editable={!isDeliveryLocked}
          />
        </div>

        {/* 🔹 Actions */}
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2 border rounded">
            Close
          </button>

          <button
            onClick={handleUpdate}
            disabled={updating || isLocked}
            className={`px-6 py-2 rounded text-white ${
              updating || isLocked
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {updating ? "Updating..." : "Update Order"}
          </button>
        </div>

        {isLocked && (
          <p className="text-xs text-red-500 mt-3">
            This order is locked and cannot be updated further.
          </p>
        )}
      </div>
    </div>
  );
}

export default OrderViewCard;
