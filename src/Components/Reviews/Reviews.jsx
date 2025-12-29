import React, { useState } from "react";
import ReviewTable from "../ReviewTable/ReviewTable";
import ReviewViewCard from "../ReviewViewCard/ReviewViewCard";
import {  useGetReviewsColorWiseProductsQuery } from "../../Services/fetchDataFromApi";
import { useReviewSocket } from "../../hooks/useReviewSocket";

function Reviews() {
  const [open, setOpen] = useState(false);
  const [colorWiseId, setColorWiseId] = useState(null);
  const [sortBy, setSortBy] = useState(""); // ✅ NEW
useReviewSocket(); // 🔥 LISTEN TO REVIEW EVENTS
  const { data, isLoading } = useGetReviewsColorWiseProductsQuery({
    page: 1,
    limit: 20,
    sortBy, // ✅ PASS TO API
  });


  return (
    <div className="sm:ml-45 pt-10 px-5 bg-gray-900 h-screen">
      <h2 className="text-xl font-bold m-4 dark:text-white">
        Product Reviews
      </h2>

      {/* 🔽 SORT FILTER */}
      <div className="mb-4 flex gap-4">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2 rounded bg-gray-900 text-white text-sm border border-white"
        >
          <option value="">Default</option>
          <option value="rating_desc">Highest Rating</option>
          <option value="rating_asc">Lowest Rating</option>
          <option value="reviews_desc">Highest Reviews</option>
          <option value="reviews_asc">Lowest Reviews</option>
        </select>
      </div>

      <ReviewTable
        data={data}
        isLoading={isLoading}
        onView={(id) => {
          setColorWiseId(id);
          setOpen(true);
        }}
      />

      {open && (
        <ReviewViewCard
          colorWiseId={colorWiseId}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}

export default Reviews;
