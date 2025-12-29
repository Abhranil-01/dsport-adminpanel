import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";


function ImageUpload({ setShowUplodSection,onAddImages }) {
  const [imgFile, setImgFile] = useState('');


  const handleChange = (e) => {
    const files = Array.from(e.target.files);
    setImgFile(files);
    // e.target.value = '';
  };
  const uploadImage = (e) => {
    e.preventDefault();
    if (imgFile.length > 0) {
      
      onAddImages(imgFile);
      setImgFile([]); // Clear local files after passing
      setShowUplodSection(false); // Close the upload section
    }
      
  };
  return (
    <>
      <div
        className=" fixed top-0 left-0 w-full h-full   bg-opacity-50 z-50  "
        style={{ background: "rgba(36, 35, 35, 0.301)" }}
      >
        <div className=" fixed left-[27%] top-[25%]  bg-white shadow-lg shadow-gray-800 dark:shadow-gray-500 dark:bg-gray-900 dark:text-white rounded-lg w-[54vw] h-[45vh] px-8  ">
          <div className="flex justify-end items-center py-3 font-bold px-5  ">
            <span
              className="cursor-pointer"
              onClick={() => setShowUplodSection(false)}
            >
              <FontAwesomeIcon icon={faX} />
            </span>
          </div>
          <div className="flex justify-around font-bold " id="primary">
            <div>
              <button
                className="text-white 
                cursor-pointer"
              >
                Upload File
              </button>
            </div>
          </div>

          <div className="h-[62%] w-[100%] flex flex-col items-center justify-end  border-2 border-gray-400 rounded mt-4">
            <form className="w-[100%] h-[100%] flex flex-col items-center justify-around ">
              <div className="w-[80%] h-[100%] flex justify-center items-center">
                <input
                  className="file:bg-[#5103e2] border-2 w-full  file:text-white font-bold file:py-2 file:px-4 cursor-pointer  "
                  id="file_input"
                  type="file"
                
                  onChange={handleChange}
                />
              </div>

              <div className="w-[100%] h-[100%] flex justify-center items-center ">
                <button
                  onClick={(e) => uploadImage(e)}
                  type="submit"
                  className="bg-[#5103e2] font-bold hover:bg-[#5103e2ef] focus:ring-4 focus:outline-none text-white py-2 px-7 rounded me-3 mb-3  cursor-pointer "
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

export default React.memo(ImageUpload);
