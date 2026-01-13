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
    setDeletePopup((prev) => ({
      ...prev,
      loader: true,
      isDelete: false,
    }));

    await new Promise((resolve) => setTimeout(resolve, 3000));

    const res = await deleteSubCategory(id);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    setDeletePopup({
      isDelete: false,
      subCategoryName: "",
      subCategoryId: "",
      loader: false,
    });

    if (res.error) {
      toast.error(res.error?.data?.errors || "Something went wrong");
    } else {
      toast.success("Subcategory deleted successfully");
    }
  };

  console.log(data?.data?.subCategories[0]?.category?.categoryName, "oihjoij");

  return (
    <>
      {showForm && (
        <SubCategoryViewCard
          setShowForm={setShowForm}
          subCategoryId={subCategoryId}
        />
      )}

      <div className="relative h-[70vh] w-full overflow-y-auto rounded-lg border border-gray-400 shadow-md">
        <table className="w-full text-sm text-gray-600 dark:text-gray-300">
          {/* ================= HEADER ================= */}
          <thead className="sticky top-0 z-10 bg-[#612bc5] text-xs uppercase text-white">
            <tr>
              <th className="px-5 py-3 text-left">Category</th>
              <th className="px-5 py-3 text-left">Name</th>
              <th className="px-5 py-3 text-center">Image</th>
              <th className="px-5 py-3 text-center">Action</th>
            </tr>
          </thead>

          {/* ================= BODY ================= */}
          <tbody className="divide-y divide-gray-300 dark:divide-gray-700">
            {/* Loading */}
            {isLoading &&
              Array.from({ length: 10 }).map((_, index) => (
                <TableSkeleton key={index} colSpan="4" />
              ))}

            {/* Data */}
            {data?.data?.subCategories?.length > 0 &&
              data.data.subCategories.map((item) => (
                <tr
                  key={item._id}
                  className="bg-gray-100 font-medium dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                >
                  <td className="px-5 py-2">
                    {item?.category?.categoryName || "—"}
                  </td>

                  <td className="px-5 py-2 font-semibold">
                    {item.subCategoryName}
                  </td>

                  <td className="px-5 py-2 flex justify-center">
                    <img
                      src={item?.image?.[0]?.url || "/placeholder.png"}
                      alt={item.subCategoryName}
                      className="w-8 h-8 rounded-full object-cover border"
                    />
                  </td>

                  <td className="px-5 py-2">
                    <div className="flex justify-center gap-4 text-base">
                      {/* <button className="text-blue-600 hover:text-blue-800">
                  <FontAwesomeIcon icon={faEye} />
                </button> */}

                      <button
                        className="text-green-600 hover:text-green-800"
                        onClick={() => {
                          setShowForm(true);
                          setSubCategoryId(item._id);
                        }}
                      >
                        <FontAwesomeIcon icon={faPencil} />
                      </button>

                      <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() =>
                          setDeletePopup({
                            isDelete: true,
                            subCategoryName: item.subCategoryName,
                            subCategoryId: item._id,
                          })
                        }
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

            {/* Empty State */}
            {!isLoading && data?.data?.subCategories?.length === 0 && (
              <tr>
                <td colSpan="4" className="h-[58vh] text-center">
                  <div className="flex h-full flex-col items-center justify-center text-gray-400">
                    <span className="text-lg font-semibold">
                      No Subcategories Available 🚫
                    </span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {deletePopup.isDelete && (
        <Popup
          description={`Are you sure to delete subcategory "${deletePopup.subCategoryName}"? Deleting this will also remove its products.`}
          onConfirm={() => handelDeleteSubCategory(deletePopup.subCategoryId)}
          onClose={() =>
            setDeletePopup({
              isDelete: false,
              subCategoryName: "",
              subCategoryId: "",
              loader: false,
            })
          }
        />
      )}
      {deletePopup.loader && <LoaderBox />}
    </>
  );
}

export default SubCategoryTable;
