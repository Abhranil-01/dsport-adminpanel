import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  useDeleteCategoryMutation,
  useDeleteSubCategoryMutation,
  useGetCategoriesQuery,
} from "../../Services/fetchDataFromApi";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { faEye, faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import SubCategoryViewCard from "../SubcategoryViewCard/SubCategoryViewCard";
import TableSkeleton from "../Skeleton/TableSkeleton/TableSkeleton.jsx";
import Popup from "../Popup/Popup.jsx";
import LoaderBox from "../LoaderBox/LoaderBox.jsx";

function SubCategoryTable({ data, error, isLoading }) {
  const [showForm, setShowForm] = useState(false);
  const [deletePopup, setDeletePopup] = useState({
    isDelete: false,
    subCategoryName: "",
    subCategoryId: "",
    loader: false,
  });

  console.log(data, error);
  const [deleteSubCategory] = useDeleteSubCategoryMutation();

  const [subCategoryId, setSubCategoryId] = useState("");

  const handelDeleteSubCategory = async (id) => {
    // Step 1: Show loader
    setDeletePopup({ loader: true, isDelete: false });

    // Step 2: Wait 5 seconds before performing deletion
    await new Promise((resolve) => setTimeout(resolve, 3000));

    if (id) {
      const res = await deleteSubCategory(id);

      // Step 3: Wait additional 1.5 seconds to keep loader
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Step 4: Hide loader
      setDeletePopup({ loader: false });

      // Step 5: Show toast after loader disappears
      if (res.error) {
        toast.error(res.error?.data?.errors || "Something went wrong");
      } else {
        toast.success("Subcategory deleted successfully");
        console.log(res);
      }
    }
  };
  return (
    <>
      {showForm && (
        <SubCategoryViewCard
          setShowForm={setShowForm}
          subCategoryId={subCategoryId}
        />
      )}

      <div className="  h-[70vh] w-full border-2 border-gray-400 overflow-y-scroll relative  shadow-md sm:rounded-lg flex-col items-center justify-center ">
        <table className="w-full  text-sm  text-gray-500 dark:text-gray-400">
          <thead class="text-xs text-white uppercase bg-[#612bc5] ">
            <tr>
              <th scope="col" class="p-2">
                <div class="flex items-center">
                  <input
                    id="checkbox-all-search"
                    type="checkbox"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label for="checkbox-all-search" class="sr-only">
                    checkbox
                  </label>
                </div>
              </th>
              <th scope="col" class=" px-5">
                Category
              </th>
              <th scope="col">Name</th>
              <th scope="col">Image</th>

              <th scope="col" class="px-5 ">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="text-center dark:text-white ">
            {isLoading &&
              Array.from({ length: 11 }).map((_, index) => (
                <TableSkeleton key={index} colSpan={"5"} />
              ))}
            {data?.data?.subCategories?.length !== 0 &&
              data?.data?.subCategories.map((data) => (
                <tr class="bg-gray-200 font-bold border-b dark:bg-gray-800 dark:border-gray-700 border-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td class="w-4 p-2 ">
                    <div class="flex items-center">
                      <input
                        id="checkbox-table-search-1"
                        type="checkbox"
                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label for="checkbox-table-search-1" class="sr-only">
                        checkbox
                      </label>
                    </div>
                  </td>
                  <td class="px-5 py-1">{data.category.categoryName}</td>
                  <td class="px-5 py-1">{data.subCategoryName}</td>
                  <td class="px-5 py-1 flex items-center justify-center ">
                    <img
                      class="w-7 h-7 rounded-full"
                      src={data.image[0]?.url}
                      alt={data.subCategoryName}
                    />
                  </td>

                  <td className=" px-5 py-1">
                    <div className="flex gap-5 justify-center cursor-pointer text-sm">
                      <span className="text-blue-700 dark:text-blue-500">
                        <FontAwesomeIcon icon={faEye} />
                      </span>
                      <span
                        className="text-green-900 dark:text-green-500"
                        onClick={() => {
                          setShowForm(true);
                          setSubCategoryId(data._id);
                        }}
                      >
                        <FontAwesomeIcon icon={faPencil} />
                      </span>
                      <span
                        className="text-red-900  dark:text-red-600"
                        onClick={() =>
                          setDeletePopup({
                            isDelete: true,
                            subCategoryName: data.subCategoryName,
                            subCategoryId: data._id,
                          })
                        }
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {data?.data?.subCategories?.length == 0 && (
          <div className=" h-[58vh] flex flex-col justify-center items-center ">
            <img
              className="w-[50%] h-[40%] object-contain"
              src="\public\Images\undraw_no-data_ig65 .svg"
              alt="no data available"
            />
            <span className="text-gray-500">No Subcategories Available</span>
          </div>
        )}
      </div>
      {(deletePopup.isDelete || deletePopup.loader) && (
        <div className="w-full">
          {deletePopup.isDelete && (
            <Popup
              description={`Are you sure to delete subcategory "${deletePopup.subCategoryName}"? Deleting subcategory "${deletePopup.subCategoryName}" will also remove its subcategories and products.`}
              categoryDetails={deletePopup}
              onClick={() => handelDeleteSubCategory(deletePopup.subCategoryId)}
              setDeletePopup={setDeletePopup}
            />
          )}
          {deletePopup.loader && <LoaderBox />}
        </div>
      )}
    </>
  );
}

export default SubCategoryTable;
