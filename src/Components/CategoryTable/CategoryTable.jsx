import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import CategoryViewCard from "../CategoryViewCard/CategoryViewCard";
import {
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
} from "../../Services/fetchDataFromApi";
import { Bounce, toast, ToastContainer } from "react-toastify";
import Popup from "../Popup/Popup";
import SpinLoader from "../SpinLoader/SpinLoader";
import LoaderBox from "../loaderBox/LoaderBox.jsx";
import TableSkeleton from "../Skeleton/TableSkeleton/TableSkeleton.jsx";

function CategoryTable({ data, error, isLoading }) {
  const [showForm, setShowForm] = useState(false);
  const [deletePopup, setDeletePopup] = useState({
    isDelete: false,
    categoryName: "",
    categoryId: "",
    loader: false,
  });
  console.log(data?.data, error);
  const [deleteCategory] = useDeleteCategoryMutation();

  const [categoryId, setCategoryId] = useState("");
  console.log("delete", deletePopup);

  const handelDeleteCategory = async (id) => {
    // Step 1: Show loader
    setDeletePopup({ loader: true, isDelete: false });

    // Step 2: Wait 5 seconds before performing deletion
    await new Promise((resolve) => setTimeout(resolve, 3000));

    if (id) {
      const res = await deleteCategory(id);

      // Step 3: Wait additional 1.5 seconds to keep loader
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Step 4: Hide loader
      setDeletePopup({ loader: false });

      // Step 5: Show toast after loader disappears
      if (res.error) {
        toast.error(res.error?.data?.errors || "Something went wrong");
      } else {
        toast.success("Category deleted successfully");
        console.log(res);
      }
    }
  };

  return (
    <>
      {showForm && (
        <CategoryViewCard setShowForm={setShowForm} categoryId={categoryId} />
      )}

      <div className="  h-[70vh] w-full border-2 border-gray-400 overflow-y-scroll  relative  shadow-md sm:rounded-lg flex-col items-center justify-center ">
        <table className="w-full  text-sm  text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-white uppercase bg-[#612bc5] sticky">
            <tr>
              <th scope="col" class="px-2 py-3">
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
              <th scope="col" class="px-6 py-3">
                Name
              </th>
              <th scope="col" class="px-6 py-3">
                Image
              </th>
              <th scope="col" class="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="text-center dark:text-white ">
            {isLoading &&
              Array.from({ length: 11 }).map((_, index) => (
                <TableSkeleton key={index} colSpan={"4"} />
              ))}
            {data?.data?.data?.length !== 0 &&
              data?.data?.data?.map((data) => (
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
                  <td class="px-5 py-1">{data.categoryName}</td>
                  <td class="px-5 py-1 flex items-center justify-center ">
                    <img
                      class="w-7 h-7 rounded-full"
                      src={data.image[0]?.url}
                      alt={data.categoryName}
                      high
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
                          setCategoryId(data._id);
                        }}
                      >
                        <FontAwesomeIcon icon={faPencil} />
                      </span>
                      {/* handelDeleteCategory(data._id)         */}
                      <span
                        className="text-red-900  dark:text-red-600"
                        onClick={() =>
                          setDeletePopup({
                            isDelete: true,
                            categoryName: data.categoryName,
                            categoryId: data._id,
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

        {data?.data?.categories?.length == 0 && (
          <div className=" h-[58vh] flex flex-col justify-center items-center ">
            <img
              className="w-[50%] h-[40%] object-contain"
              src="\public\Images\undraw_no-data_ig65 .svg"
              alt="no data available"
            />
            <span className="text-gray-500">No Category Available</span>
          </div>
        )}
      </div>
      {(deletePopup.isDelete || deletePopup.loader) && (
        <div className="w-full">
          {deletePopup.isDelete && (
            <Popup
              description={`Are you sure to delete category "${deletePopup.categoryName}"? Deleting this will also remove its subcategories and products.`}
              categoryDetails={deletePopup}
              onClick={() => handelDeleteCategory(deletePopup.categoryId)}
              setDeletePopup={setDeletePopup}
            />
          )}
          {deletePopup.loader && <LoaderBox />}
        </div>
      )}
    </>
  );
}

export default CategoryTable;
