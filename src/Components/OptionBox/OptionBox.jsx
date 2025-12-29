import React from "react";
import { useGetCategoriesQuery } from "../../Services/fetchDataFromApi";

function OptionBox({
  label,
  placeholder,
  type,
  id,
  value,
  onChange,
  editable = true,
  ref = null,
  readOnly = false,
  autoFocus = false,
  data,
  name
}) {
  console.log(value);

  return (
    <div className="w-full">
      <label
        htmlFor={id}
        className="block mb-2 text-sm font-bold text-gray-900 dark:text-white"
      >
        {label}
      </label>
      <select
        id={id}
        name={name}
        value={value} // <-- This binds the selected value
        onChange={onChange}
        required
        ref={ref}
        className={`bg-gray-50 border border-gray-300 text-gray-900 dark:bg-gray-900 dark:text-white text-sm rounded-lg transition-all outline-0 block w-full p-2.5 
                    ${
                      editable
                        ? "cursor-text focus:ring-2 focus:ring-blue-500 border-blue-500"
                        : "cursor-not-allowed bg-gray-200"
                    }`}
        disabled={!editable}
        readOnly={readOnly}
        autoFocus={autoFocus}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {data?.length === 0 ? (
          <option value="" disabled>
            Not available
          </option>
        ) : (
          data?.map((data, index) => (
            <option key={index} value={data}>
              {data.toString()}
            </option>
          ))
        )}
      </select>
    </div>
  );
}

export default React.memo(OptionBox);
