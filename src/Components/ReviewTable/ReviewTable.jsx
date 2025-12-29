import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import TableSkeleton from "../Skeleton/TableSkeleton/TableSkeleton";

function ReviewTable({ data, isLoading, onView }) {
  return (
    <div className="h-[70vh] overflow-y-auto border border-white rounded-lg shadow-sm">
      <table className="w-full text-sm text-left text-gray-600 dark:text-gray-300">
        <thead className="sticky top-0 bg-[#612bc5] text-white text-xs uppercase">
          <tr>
            <th className="px-4 py-3">Cover</th>
            <th className="px-4 py-3">Product</th>
            <th className="px-4 py-3">Color</th>
            <th className="px-4 py-3 text-center">Avg Rating ⭐</th>
            <th className="px-4 py-3 text-center">Reviews</th>
            <th className="px-4 py-3 text-center">Action</th>
          </tr>
        </thead>

        <tbody className="bg-white dark:bg-gray-900">
          {/* Loading */}
          {isLoading &&
            Array.from({ length: 8 }).map((_, i) => (
              <TableSkeleton key={i} colSpan="6" />
            ))}

          {/* Data */}
          {!isLoading &&
            data?.colorItems?.map((item) => (
              <tr
                key={item._id}
                className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                {/* Cover Image */}
                <td className="px-4 py-2">
                  <img
                    src={item.coverImage?.[0]?.url}
                    alt="cover"
                    className="w-12 h-12 rounded object-cover border"
                  />
                </td>

                {/* Product Name */}
                <td className="px-4 py-2 font-medium">
                  {item.productName}
                </td>

                {/* Color Variant */}
                <td className="px-4 py-2 flex items-center gap-2">
                  {item.productColorName}
                </td>

                {/* Avg Rating */}
                <td className="px-4 py-2 text-center font-bold">
                  {item.averageRating?.toFixed(1) || "0.0"}
                </td>

                {/* Total Reviews */}
                <td className="px-4 py-2 text-center">
                  {item.totalReviews}
                </td>

                {/* Action */}
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => onView(item._id)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                </td>
              </tr>
            ))}

          {/* No Data */}
          {!isLoading && data?.colorItems?.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center py-10 text-gray-400">
                No reviews available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ReviewTable;
