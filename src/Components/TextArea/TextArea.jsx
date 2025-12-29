import React from "react";

function TextArea({
  label,
  placeholder,
  id,
  name,
  value,
  onChange,
  editable = true,
  ref = null,
  readOnly = false,
  autoFocus = false,
  required = false,
}) {
  return (
    <div className="w-full">
      <label
        htmlFor={id || name}
        className="block mb-2 text-sm font-bold text-gray-900 dark:text-white"
      >
        {label}
      </label>
      <textarea
        id={id || name}
        name={name}
        ref={ref}
        className={`bg-gray-50 border border-gray-300 min-h-[120px] text-gray-900 dark:bg-gray-900 dark:text-white text-sm rounded-lg transition-all outline-0 block w-full p-2.5 
                    ${
                      editable
                        ? "cursor-text focus:ring-2 focus:ring-blue-500 border-blue-500"
                        : "cursor-not-allowed bg-gray-200"
                    }`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        readOnly={!editable || readOnly} // ✅ Controls typing
        autoFocus={autoFocus}
        disabled={false} // ✅ Ensure it's always focusable
      />
    </div>
  );
}

export default React.memo(TextArea);
