import React, { useState } from "react";

function Dropdown({ button = "Choose Category", data, onClick }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(button);
  console.log("jnhsfjhhf", data);

  const handleSelect = (categoryName, id) => {
    setSelected(categoryName);
    onClick(id);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-white bg-gray-700 focus:ring-4 focus:outline-none focus:ring-blue-900 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
        type="button"
      >
        {selected}
        <svg
          className="w-2.5 h-2.5 ms-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700">
          <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
            {/* All Option */}
            <li
              className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
              onClick={() => handleSelect(  button, "")}
            >
              {button}
            </li>

            {/* Render Categories */}
            {data?.length === 0 ? (
              <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">
                No Categories Available
              </li>
            ) : (
              data?.map((category) => (
                <li
                  key={category._id}
                  className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                  onClick={() =>
                    handleSelect(
                      category.categoryName || category.subCategoryName,
                      category._id
                    )
                  }
                >
                  {category?.categoryName || category?.subCategoryName}
                  {category?.subCategoryName &&
                    ` (${category?.category?.[0]?.categoryName})`}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Dropdown;
