import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { Star } from "lucide-react";
import { useGetColorWiseProductByIdQuery } from "../../Services/fetchDataFromApi";
import { useReviewSocket } from "../../hooks/useReviewSocket";

/* ⭐ STAR RENDER (FULL + HALF) */
const renderStars = (rating) => {
  const totalStars = 5;

  return Array.from({ length: totalStars }).map((_, i) => {
    const starNumber = i + 1;
    const fillPercent =
      starNumber <= rating
        ? 100
        : starNumber - rating < 1
        ? (rating % 1) * 100
        : 0;

    return (
      <span key={i} className="relative inline-block w-4 h-4">
        <Star className="absolute w-4 h-4 text-gray-300 fill-gray-300" />
        <Star
          className="absolute w-4 h-4 text-yellow-400 fill-yellow-400"
          style={{ clipPath: `inset(0 ${100 - fillPercent}% 0 0)` }}
        />
      </span>
    );
  });
};

function ReviewViewCard({ colorWiseId, onClose }) {
   useReviewSocket(); 
  const { data, isLoading } =
    useGetColorWiseProductByIdQuery(colorWiseId);
console.log(data);

  if (isLoading) return null;

  const reviews = data?.reviews || [];

  /* ===== SAME LOGIC AS PRODUCT PAGE ===== */

  // All ratings
  const totalRatings = reviews.length;

  const ratingSum = reviews.reduce(
    (sum, r) => sum + (r.rating || 0),
    0
  );

  const avgRating = totalRatings ? ratingSum / totalRatings : 0;

  // Reviews with text
  const reviewsWithComments = reviews.filter(
    (r) => r.review && r.review.trim() !== ""
  );

  const totalReviews = reviewsWithComments.length;

  // Star distribution
  const starCounts = [1, 2, 3, 4, 5].reduce((acc, star) => {
    acc[star] = reviews.filter((r) => r.rating === star).length;
    return acc;
  }, {});

  /* ===================================== */

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex justify-end">
      <div className="w-full md:w-[520px] bg-gray-900 text-white h-full p-5 overflow-y-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h3 className="font-bold text-lg">Ratings & Reviews</h3>
          <button onClick={onClose}>
            <FontAwesomeIcon icon={faX} />
          </button>
        </div>

        {/* PRODUCT INFO */}
        <div className="mb-5">
          <p className="font-semibold">{data?.productName}</p>

          <div className="flex items-center gap-2 mt-1">
                <img
                    src={data.coverImage?.url}
                    alt="cover"
                    className="w-12 h-12 rounded object-cover border"
                  />
            <span className="text-sm ">
              {data?.productColorName}
            </span>
          </div>
        </div>

        {/* AVG RATING */}
        <div className="flex gap-6 items-center mb-6">
          <div className="flex flex-col items-center border rounded-lg p-4 w-32">
            <h1 className="text-4xl font-bold">
              {avgRating.toFixed(1)}
            </h1>

            <div className="flex mt-1">
              {renderStars(avgRating)}
            </div>

            <p className="text-xs  mt-1 text-center">
              {totalRatings} Ratings <br />
              {totalReviews} Reviews
            </p>
          </div>

          {/* STAR DISTRIBUTION */}
          <div className="flex flex-col gap-1 w-full">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = starCounts[star] || 0;
              const percent = totalRatings
                ? (count / totalRatings) * 100
                : 0;

              return (
                <div key={star} className="flex items-center gap-3">
                  <span className="w-6 text-sm">{star}★</span>

                  <div className="w-full h-2 bg-gray-200 rounded">
                    <div
                      className="h-full bg-green-500 rounded"
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <span className="w-6 text-sm text-right">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* REVIEWS LIST */}
        <div className="space-y-4">
          {reviewsWithComments.length === 0 && (
            <p className=" text-center">
              No written reviews available
            </p>
          )}

          {reviewsWithComments.map((r, i) => (
            <div
              key={i}
              className="border rounded-lg p-3"
            >
              <div className="flex items-center gap-2">
                {renderStars(r.rating)}
                <span className="text-sm font-medium">
                  {r.rating.toFixed(1)}
                </span>
              </div>

              <p className="text-sm mt-2 ">
                {r.review}
              </p>

              <div className="text-xs text-gray-500 mt-2">
                {r.addressName} • {r.city}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default ReviewViewCard;
