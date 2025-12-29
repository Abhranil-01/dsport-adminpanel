import React, { useCallback, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faSearch } from "@fortawesome/free-solid-svg-icons";
import {
  useGetCategoriesQuery,
  useGetProductsQuery,
  useGetSubCategoriesQuery,
} from "../../Services/fetchDataFromApi.js";
import debounce from "../../Utils/debounce.js";
import Dropdown from "../Dropdown/Dropdown.jsx";
import SearchBox from "../searchBox/SearchBox.jsx";
import SelectBox from "../SelectBox/SelectBox.jsx";
import ProductTable from "../ProductTable/ProductTable.jsx";
import ProductForm from "../ProductForm/ProductForm.jsx";

function Products() {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");

  const {
    data: products,
    isLoading: isProductLoading,
    isError: isProductError,
  } = useGetProductsQuery({
    categoryId,
    subcategoryId,
  });

  // useGetCategoriesQuery will automatically refetch on param change
  const { data, error, isLoading } = useGetSubCategoriesQuery();

  const { data: categoriesData } = useGetCategoriesQuery();
  console.log("okhh", categoriesData);

  return (
    <>
      {showForm && <ProductForm setShowForm={setShowForm} />}
      <div className="sm:ml-45 ">
        <div className="dark:bg-gray-900 p-3 ">
          <div className="flex justify-between items-center ">
            <div className="font-bold text-[20px] p-2 dark:text-white">
              Products
            </div>
            <button
              className="bg-[#612bc5] text-white font-bold rounded py-2 px-4 cursor-pointer flex gap-2 items-center text-sm"
              onClick={() => setShowForm(!showForm)}
            >
              Add Product
              <span>
                <FontAwesomeIcon icon={faPlusCircle} />
              </span>
            </button>
          </div>

          <div className="w-[90%] mx-auto mt-3">
            <div className="h-[87vh]">
              <div className=" flex gap-2 items-center my-1">
                <Dropdown
                  button="All Categories"
                  data={categoriesData?.data?.data}
                  onClick={(id) => {
                    setCategoryId(id);
                    setSubcategoryId(""); // reset subcategory when category changes
                  }}
                />

                <Dropdown
                  button="All SubCategories"
                  data={data?.data?.subCategories}
                  onClick={(id) => setSubcategoryId(id)}
                />
              </div>

              <ProductTable
                data={products}
                error={isProductError}
                isLoading={isProductLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Products;
