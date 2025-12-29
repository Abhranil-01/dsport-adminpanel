import React, { useCallback, useState } from "react";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import InputBox from "../InputBox/InputBox";
import ImageBox from "../ImageBox/ImageBox";
import SelectBox from "../SelectBox/SelectBox";
import {
  useCreateSubCategoryMutation,
  useGetCategoriesQuery,
} from "../../Services/fetchDataFromApi";

import { toast } from "react-toastify";

function SubCategoryForm({ setShowForm }) {
  const [subCategory, setSubCategory] = useState({
    subCategoryName: "",
    categoryId: "",
  });

  const [imagesWithId, setImagesWithId] = useState([]); // stores local files and backend images
  const [loader, setLoader] = useState(false);
  const [createSubCategory] = useCreateSubCategoryMutation();
  const { data } = useGetCategoriesQuery();

  const handleSubCategoryChange = useCallback((key, value) => {
    setSubCategory((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  // ✅ Handle delete image properly
// ✅ Handle delete image properly
const handleDeleteImage = (image) => {
  setImagesWithId((prev) => {
    if (image.type === "backend") {
      return prev.filter((img) => img._id !== image.id);
    }
    if (image.type === "local") {
      return prev.filter((img) => img._id !== image.id);
    }
    return prev;
  });
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);

    try {
      const formData = new FormData();
      formData.append("subCategoryName", subCategory.subCategoryName);
      formData.append("categoryId", subCategory.categoryId);

      imagesWithId.forEach(({ file }) => {
        if (file) {
          formData.append("subCategoryImage", file);
        }
      });

      await createSubCategory(formData).unwrap();

      toast.success("Subcategory created successfully");
      setSubCategory({ subCategoryName: "", categoryId: "" });
      setImagesWithId([]);
      setShowForm(false);
    } catch (err) {
      const errorMessage =
        err?.data?.errors || "Something went wrong. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoader(false);
    }
  };

  return (
    <div
      className="fixed top-0 left-0 w-full h-full bg-opacity-50 z-50"
      style={{ background: "rgba(36, 35, 35, 0.301)" }}
    >
      <div className="fixed left-[26%] top-[18%] bg-white shadow-lg shadow-gray-800 rounded-lg w-[56vw] h-[70%] py-5 px-5 dark:bg-gray-900 dark:text-white dark:shadow-gray-200/100">
        <div className="flex justify-between items-center font-bold h-[5%] mb-2">
          <span className="font-bold">Enter Subcategory Details</span>
          <span className="cursor-pointer" onClick={() => setShowForm(false)}>
            <FontAwesomeIcon icon={faX} />
          </span>
        </div>

        <div className="relative w-full h-[92%] flex items-center justify-center border-2 rounded border-gray-800 px-7 py-5 dark:border-gray-400">
          <form
            onSubmit={handleSubmit}
            className="flex items-center justify-center gap-5 w-full h-full"
          >
            <div className="h-[80%] w-[55%]">
              <ImageBox
                images={imagesWithId}
                editable={true}
                maxImages={1} // ✅ or adjust if multiple subcategory images are allowed
                onAddImages={(newImgs) =>
                  setImagesWithId((prev) => [...prev, ...newImgs])
                }
                onDeleteImage={handleDeleteImage} // ✅ now wired
              />
            </div>

            <div className="h-full w-[50%] flex flex-col gap-10 items-center justify-center">
              <InputBox
                label="Enter Subcategory Name"
                placeholder="Like 'Footballs'"
                value={subCategory.subCategoryName}
                onChange={(e) =>
                  handleSubCategoryChange("subCategoryName", e.target.value)
                }
              />

              <SelectBox
                label="Enter Category"
                placeholder="Select a category"
                data={data?.data?.data || []}
                value={subCategory.categoryId}
                onChange={(id) => handleSubCategoryChange("categoryId", id)}
              />

              <div className="w-full flex justify-end relative">
   <button
    type="submit"
    disabled={loader} // ✅ disable when submitting
    className={`font-medium rounded-lg text-sm px-12 py-2 text-center flex items-center justify-center gap-2
      ${
        loader
          ? "bg-gray-400 cursor-not-allowed"
          : "text-white bg-[#5103e2] hover:bg-[#5103e2ef] focus:ring-4 focus:outline-none focus:ring-blue-300"
      }
    `}
  >
    {loader && (
      <svg
        aria-hidden="true"
        role="status"
        className="inline w-4 h-4 mr-2 text-white animate-spin"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 
          100.591 50 100.591C22.3858 100.591 0 
          78.2051 0 50.5908C0 22.9766 22.3858 
          0.59082 50 0.59082C77.6142 0.59082 100 
          22.9766 100 50.5908ZM9.08197 50.5908C9.08197 
          73.1895 27.4013 91.5089 50 91.5089C72.5987 
          91.5089 90.918 73.1895 90.918 50.5908C90.918 
          27.9921 72.5987 9.67273 50 9.67273C27.4013 
          9.67273 9.08197 27.9921 9.08197 50.5908Z"
          fill="#E5E7EB"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 
          97.8624 35.9116 97.0079 33.5539C95.2932 
          28.8227 92.871 24.3692 89.8167 20.348C85.8452 
          15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 
          4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 
          0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 
          1.69328 37.813 4.19778 38.4501 6.62326C39.0873 
          9.04864 41.5694 10.4717 44.0505 10.1071C47.8511 
          9.49638 51.7191 9.52689 55.081 10.3658C60.3545 
          11.246 65.1774 13.7444 69.6296 16.5176C73.9781 
          19.4904 77.576 23.0875 80.3709 27.5459C82.0846 
          32.197 83.5053 36.7379 84.5724 41.4012C85.1791 
          43.8601 87.542 45.4092 90.0112 44.0463C91.3573 
          43.559 92.6781 42.508 93.9676 39.0409Z"
          fill="currentColor"
        />
      </svg>
    )}
    {loader ? "Saving..." : "Save Product"}
  </button>
              </div>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}

export default SubCategoryForm;
