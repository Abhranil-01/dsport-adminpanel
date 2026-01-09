import React from "react";

function Popup({ description, onConfirm, onClose }) {
  return (
    <div
      tabIndex={-1}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
    >
      <div className="relative w-full max-w-md p-4">
        <div className="relative rounded-lg bg-gray-700 text-white shadow">

     
          {/* CONTENT */}
          <div className="p-6 text-center">
            <svg
              className="mx-auto mb-4 h-12 w-12 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>

            <h3 className="mb-5 text-lg font-medium ">
              {description}
            </h3>

            <button
              onClick={onConfirm}
              className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700 cursor-pointer"
            >
              Yes, I'm sure
            </button>

            <button
              onClick={onClose}
              className="ml-3 rounded-lg border px-5 py-2.5 text-sm font-medium text-white cursor-pointer"
            >
              No, cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Popup;
