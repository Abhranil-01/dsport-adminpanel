import React from "react";

function SelectBox({
  label,
  placeholder,
  id,
  value,
  onChange,
  editable = true,
  readOnly = false,
  autoFocus = false,
  data = [],
}) {
  return (
    <div className="min-w-[180px]">
      {label && (
        <label
          htmlFor={id}
          className="block mb-1 text-sm font-semibold text-gray-900 dark:text-white"
        >
          {label}
        </label>
      )}

      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`bg-gray-50 border border-gray-300 dark:bg-gray-900 dark:text-white
          text-sm rounded-lg p-2.5 w-full outline-none
          ${
            editable
              ? "focus:ring-2 focus:ring-blue-500"
              : "cursor-not-allowed bg-gray-200"
          }`}
        disabled={!editable}
        readOnly={readOnly}
        autoFocus={autoFocus}
      >
        <option value="">{placeholder}</option>

        {data.length === 0 ? (
          <option disabled>No options</option>
        ) : (
          data.map((item, index) => {
            // ✅ STRING MODE (Orders filters)
            if (typeof item === "string") {
              return (
                <option key={item} value={item}>
                  {item}
                </option>
              );
            }

            // ✅ OBJECT MODE (Categories / SubCategories)
            return (
              <option key={item._id} value={item._id}>
                {item.categoryName ||
                  `${item.subCategoryName} (${item.category?.[0]?.categoryName})`}
              </option>
            );
          })
        )}
      </select>
    </div>
  );
}

export default React.memo(SelectBox);
