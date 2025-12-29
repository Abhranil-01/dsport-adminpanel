import React, { useCallback, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faSearch } from "@fortawesome/free-solid-svg-icons";
import CategoryTable from "../CategoryTable/CategoryTable.jsx";
import CategoryForm from "../CategoryForm/CategoryForm.jsx";
import { useGetCategoriesQuery } from "../../Services/fetchDataFromApi.js";
import debounce from "../../Utils/debounce.js";
import InputBox from "../InputBox/InputBox.jsx";
import SearchBox from "../SearchBox/SearchBox";



function Categories() {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Debounce only updates debouncedSearchTerm after 500ms of inactivity
  const debounced = useCallback(
    debounce((value) => {
      setDebouncedSearchTerm(value);
    }, 500),
    []
  );

  const handleChange = (e) => {
    const value = e.target.value;
    console.log("value", value);
    
    setSearchTerm(value);
    debounced(value); // debounce update
  };
console.log("debouncedSearchTerm", debouncedSearchTerm);

  // useGetCategoriesQuery will automatically refetch on param change
  const { data, isLoading,isError } = useGetCategoriesQuery({categoryName:debouncedSearchTerm});
console.log(data,isError);

  return (
    <>
      {showForm && <CategoryForm setShowForm={setShowForm} />}
      <div className=" sm:ml-45">
        <div className=" dark:bg-gray-900 p-3  ">
          <div className="flex justify-between items-center ">
            <div className="font-bold text-[20px] p-2 dark:text-white">Categories</div>
            <button
              className="bg-[#612bc5] text-white font-bold rounded py-2 px-4 cursor-pointer flex gap-2 items-center text-sm"
              onClick={() => setShowForm(!showForm)}
            >
              Add Category
              <span><FontAwesomeIcon icon={faPlusCircle} /></span>
            </button>
          </div>

          <div className="w-[85%] mx-auto mt-3">
            <div className="h-[87vh]">
              <div className="flex justify-center  my-1">
                <div className="relative">
                  <span className="absolute top-2 left-2 dark:text-white">
                    <FontAwesomeIcon icon={faSearch} />
                  </span>
                  {/* <input
                    type="text"
                    placeholder="Search Category"
                    value={searchTerm}
                    onChange={handleChange}
                    className="outline-none border-3 border-gray-400 rounded px-6 py-1 text-gray-600 text-bold w-[30vw] dark:text-white"
                  /> */}
                   <SearchBox value={searchTerm} onChange={handleChange} />
                 
                </div>
              </div>

              <CategoryTable data={data} error={isError} isLoading={isLoading} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Categories;
