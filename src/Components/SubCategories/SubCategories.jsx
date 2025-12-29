import React, { useCallback, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faSearch } from "@fortawesome/free-solid-svg-icons";
import SubCategoryForm from "../SubCategoryFrom/SubCategoryForm.jsx";
import SubCategoryTable from "../SubCategoryTable/SubCategoryTable.jsx";
import {
  useGetCategoriesQuery,
  useGetSubCategoriesQuery,
} from "../../Services/fetchDataFromApi.js";
import debounce from "../../Utils/debounce.js";
import Dropdown from "../Dropdown/Dropdown.jsx";
import SelectBox from "../SelectBox/SelectBox.jsx";
import SearchBox from "../SearchBox/SearchBox.jsx";

function SubCategories() {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [choseCategory, setChoseCategory] = useState("");
  // Debounce only updates debouncedSearchTerm after 500ms of inactivity
  const debounced = useCallback(
    debounce((value) => {
      setDebouncedSearchTerm(value);
    }, 500),
    []
  );

  const handleChange = (e) => {
    const value = e.target.value;
    // console.log("value", value);

    setSearchTerm(value);
    debounced(value); // debounce update
  };
  console.log("debouncedSearchTerm", debouncedSearchTerm);

  // useGetCategoriesQuery will automatically refetch on param change
  const { data, error, isLoading } = useGetSubCategoriesQuery({
    subCategoryName: debouncedSearchTerm,
    categoryId: choseCategory,
  });
  // console.log("data", data, "error", error, "isLoading", isLoading);
  const { data: categoriesData } = useGetCategoriesQuery();

 

  
  return (
    <>
      {showForm && <SubCategoryForm setShowForm={setShowForm} />}
      <div className="sm:ml-45 ">
        <div className="dark:bg-gray-900 p-2 ">
          <div className="flex justify-between items-center ">
            <div className="font-bold text-[20px] p-4 dark:text-white">
              Sub Categories
            </div>
            <button
              className="bg-[#612bc5] text-white font-bold rounded py-2 px-4 cursor-pointer flex gap-2 items-center text-sm"
              onClick={() => setShowForm(!showForm)}
            >
              Add Sub Category
              <span>
                <FontAwesomeIcon icon={faPlusCircle} />
              </span>
            </button>
          </div>

          <div className="w-[90%] mx-auto mt-3">
            <div className="h-[85vh]">
              <div className=" flex justify-between items-center my-1">
                <Dropdown
                  button="All"
                  data={categoriesData?.data?.data}
                  onClick={(id) => setChoseCategory(id)} // FIXED
                />

                <SearchBox value={searchTerm} onChange={handleChange} />
              </div>

              <SubCategoryTable
                data={data}
                error={error}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SubCategories;
