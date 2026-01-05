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
import TableSkeleton from "../Skeleton/TableSkeleton/TableSkeleton.jsx";
import LoaderBox from "../LoaderBox/LoaderBox.jsx"

function CategoryTable({ data, error, isLoading }) {
  const [showForm, setShowForm] = useState(false);
  const [categoryId, setCategoryId] = useState("");

  const [deletePopup, setDeletePopup] = useState({
    isDelete: false,
    categoryName: "",
    categoryId: "",
    loader: false,
  });

  const [deleteCategory] = useDeleteCategoryMutation();

  const handelDeleteCategory = async (id) => {
    setDeletePopup((prev) => ({ ...prev, loader: true, isDelete: false }));

    await new Promise((r) => setTimeout(r, 3000));

    const res = await deleteCategory(id);

    await new Promise((r) => setTimeout(r, 1500));

    setDeletePopup((prev) => ({ ...prev, loader: false }));

    if (res.error) {
      toast.error(res.error?.data?.errors || "Something went wrong");
    } else {
      toast.success("Category deleted successfully");
    }
  };

  return (
    <>
      {showForm && (
        <CategoryViewCard
          setShowForm={setShowForm}
          categoryId={categoryId}
        />
      )}

      {/* ================= TABLE ================= */}
      <div className="relative h-[70vh] w-full overflow-y-auto rounded-lg border border-gray-400 shadow-md">
        <table className="w-full text-sm text-gray-600 dark:text-gray-300">
          <thead className="sticky top-0 z-10 bg-[#612bc5] text-xs uppercase text-white">
            <tr>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-center">Image</th>
              <th className="px-6 py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-300 dark:divide-gray-700 text-center dark:text-white">
            {/* Loading */}
            {isLoading &&
              Array.from({ length: 10 }).map((_, index) => (
                <TableSkeleton key={index} colSpan="3" />
              ))}

            {/* Data */}
            {data?.data?.data?.length > 0 &&
              data.data.data.map((item) => (
                <tr
                  key={item._id}
                  className="bg-gray-100 font-medium dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                >
                  <td className="px-6 py-2 text-left font-semibold">
                    {item.categoryName}
                  </td>

                  <td className="px-6 py-2 flex justify-center">
                    <img
                      src={item?.image?.[0]?.url || "/placeholder.png"}
                      alt={item.categoryName}
                      className="w-8 h-8 rounded-full object-cover border"
                    />
                  </td>

                  <td className="px-6 py-2">
                    <div className="flex justify-center gap-4 text-base">
                      {/* <button className="text-blue-600 hover:text-blue-800">
                        <FontAwesomeIcon icon={faEye} />
                      </button> */}

                      <button
                        className="text-green-600 hover:text-green-800"
                        onClick={() => {
                          setShowForm(true);
                          setCategoryId(item._id);
                        }}
                      >
                        <FontAwesomeIcon icon={faPencil} />
                      </button>

                      <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() =>
                          setDeletePopup({
                            isDelete: true,
                            categoryName: item.categoryName,
                            categoryId: item._id,
                            loader: false,
                          })
                        }
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

            {/* Empty */}
            {!isLoading && data?.data?.data?.length === 0 && (
              <tr>
                <td colSpan="3" className="h-[58vh]">
                  <div className="flex h-full items-center justify-center text-gray-400 text-lg font-semibold">
                    No Category Available 🚫
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ================= POPUP ================= */}
      {(deletePopup.isDelete || deletePopup.loader) && (
        <>
          {deletePopup.isDelete && (
            <Popup
              description={`Are you sure you want to delete "${deletePopup.categoryName}"? This will also delete its subcategories and products.`}
              onClick={() => handelDeleteCategory(deletePopup.categoryId)}
              setDeletePopup={setDeletePopup}
            />
          )}
          {deletePopup.loader && <LoaderBox />}
        </>
      )}
    </>
  );
}


export default CategoryTable;
