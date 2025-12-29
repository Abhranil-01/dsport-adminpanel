import { faX, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";

function MultipleImageUpload({ setShowUplodSection, onAddImages }) {
  const [imgFile, setImgFile] = useState([]);

  const handleChange = (e) => {
    const files = Array.from(e.target.files);
    setImgFile((prev) => [...prev, ...files]); // ✅ Add new files to existing ones
    e.target.value = "";
  };

  const handleRemoveFile = (index) => {
    setImgFile((prev) => prev.filter((_, i) => i !== index)); // ✅ Remove by index
  };

  const uploadImage = (e) => {
    e.preventDefault();
    if (imgFile.length > 0) {
      onAddImages(imgFile);
      setImgFile([]);
      setShowUplodSection(false);
    }
  };

  return (
    <>
      <div
        className="fixed top-0 left-0 w-full h-full bg-opacity-50 z-50"
        style={{ background: "rgba(36, 35, 35, 0.301)" }}
      >
        <div className="fixed left-[27%] top-[25%] bg-white shadow-lg shadow-gray-800 dark:shadow-gray-500 dark:bg-gray-900 dark:text-white rounded-lg w-[54vw] h-[55vh] px-8">
          <div className="flex justify-end items-center py-1 font-bold px-5">
            <span
              className="cursor-pointer"
              onClick={() => setShowUplodSection(false)}
            >
              <FontAwesomeIcon icon={faX} />
            </span>
          </div>

          <div className="flex justify-around font-bold" id="primary">
            <div>
              <button className="text-white cursor-pointer">Upload File</button>
            </div>
          </div>

          <div className="h-[70%] w-[100%] flex flex-col items-center justify-end border-2 border-gray-400 rounded mt-4">
            <form className="w-[100%] h-[100%] flex flex-col items-center justify-around">
              <div className="w-[80%] h-[100%] flex flex-col justify-center items-center  overflow-y-auto">
                <input
                  className="file:bg-[#5103e2] border-2 w-full file:text-white font-bold file:py-2 file:px-4 cursor-pointer"
                  id="file_input"
                  type="file"
                  multiple
                  onChange={handleChange}
                />

                {/* ✅ Show selected files with remove option */}
                {imgFile.length > 0 && (
                  <div className="w-full  border  border-gray-300 rounded-lg  h-full overflow-y-auto bg-gray-50 dark:bg-gray-800">
                    {imgFile.map((file, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center px-3 mb-1 bg-white dark:bg-gray-700 rounded-md shadow-sm"
                      >
                        <span className="truncate max-w-[85%] text-sm font-medium text-gray-800 dark:text-gray-100">
                          {file.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(index)}
                          className="text-red-600 hover:text-red-800 transition-all"
                          title="Remove"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="w-[100%] h-[100%] flex justify-center items-center">
                <button
                  onClick={(e) => uploadImage(e)}
                  type="submit"
                  className="bg-[#5103e2] font-bold hover:bg-[#5103e2ef] focus:ring-4 focus:outline-none text-white py-2 px-7 rounded me-3 mb-3 cursor-pointer"
                >
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default React.memo(MultipleImageUpload);
