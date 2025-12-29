import React, { useCallback, useEffect, useRef, useState } from "react";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import InputBox from "../InputBox/InputBox";
import ImageBox from "../ImageBox/ImageBox";
import {
  useGetCategoryByIdQuery,
  useUpdateCategoryMutation,
} from "../../Services/fetchDataFromApi";
import { toast } from "react-toastify";

function CategoryViewCard({ setShowForm, categoryId }) {
  const [editCategory, setEditCategory] = useState(false);
  const [imagesWithId, setImagesWithId] = useState([]);
  const [deletedImageIds, setDeletedImageIds] = useState([]);
  const [categoryImageIdToDelete, setCategoryImageIdToDelete] = useState("");
  const [loader, setLoader] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const { data, error, isLoading } = useGetCategoryByIdQuery(categoryId);
  const [updateCategory] = useUpdateCategoryMutation();
  const inputRef = useRef(null);

  // Sync category data when fetched
  useEffect(() => {
    if (data?.data[0]) {
      setCategoryName(data.data[0].categoryName || "");

      const filteredImages = data.data[0].image
        .filter((img) => !deletedImageIds.includes(img._id))
        .map((img) => ({
          _id: img._id,
          url: img.url,
        }));

      setImagesWithId(filteredImages);
    }
  }, [data, deletedImageIds]);

  useEffect(() => {
    if (editCategory) {
      inputRef.current?.focus();
    }
  }, [editCategory]);

const handleUpdate = async (e) => {
  e.preventDefault();
  setLoader(true);

  const formData = new FormData();
  formData.append("categoryName", categoryName);

  if (categoryImageIdToDelete) {
    formData.append("categoryImageID", categoryImageIdToDelete);
  }

  imagesWithId.forEach((img) => {
    if (img.file) {
      formData.append("categoryImage", img.file);
    }
  });

  try {
    await updateCategory({ id: categoryId, formData }).unwrap();
    toast.success("Category updated successfully");
    setEditCategory(false);
  } catch (err) {
    toast.error("Update failed");
  } finally {
    setLoader(false);
  }
};


  const handleCategoryNameChange = useCallback((e) => {
    setCategoryName(e.target.value);
  }, []);

  const handleDeleteImage = (image) => {
    if (image.type === "backend") {
      setCategoryImageIdToDelete(image.id); // backend deletion
      setDeletedImageIds((prev) => [...prev, image.id]);
      setImagesWithId((prev) => prev.filter((img) => img._id !== image.id));
    } else if (image.type === "local") {
      setImagesWithId((prev) => prev.filter((img) => img._id !== image.id));
    }
  };

  const handleAddImages = (newImgs) => {
    setImagesWithId((prev) => [...prev, ...newImgs]);
  };

  return (
    <div
      className="fixed top-0 left-0 w-full h-full bg-opacity-50 z-50"
      style={{ background: "rgba(36, 35, 35, 0.301)" }}
    >
      <div className="fixed left-[24%] top-[18%] bg-white shadow-lg dark:shadow-gray-400/100 rounded-lg w-[64vw] h-[70%] px-5 dark:bg-gray-900 dark:text-white">
        <div className="flex justify-between items-center py-4 font-bold">
          <span>Update Category Details</span>
          <span className="cursor-pointer" onClick={() => setShowForm(false)}>
            <FontAwesomeIcon icon={faX} />
          </span>
        </div>

        <div className="w-full h-[80%] border-2 rounded border-gray-800 dark:border-gray-400 px-7 py-5">
          {isLoading && (
            <div className="flex items-center justify-center z-50">
              <div className="text-gray-800 font-bold">Loading...</div>
            </div>
          )}

          {error && (
            <div className="w-full h-full flex items-center justify-center z-50">
              <div className="text-red-500 font-bold">Something Went Wrong</div>
            </div>
          )}

          {!isLoading && !error && data?.data[0] && (
            <div className="h-full flex gap-5 items-center justify-center relative">
              <div className="h-[90%] w-[60%] flex items-center justify-center">
                <ImageBox
                  images={imagesWithId}
                  editable={editCategory}
                  onDeleteImage={handleDeleteImage}
                  onAddImages={handleAddImages}
                  categoryId={data.data[0]._id}
                />
              </div>

              <div className="h-[90%] w-[52%] flex flex-col items-center justify-center">
                <div className="w-full">
                  <InputBox
                    label="Enter Category Name"
                    placeholder="Like 'Footballs'"
                    type="text"
                    ref={inputRef}
                    value={categoryName}
                    onChange={handleCategoryNameChange}
                    readOnly={!editCategory}
                    autoFocus={editCategory}
                  />
                </div>

                <div className="w-full mt-2">
                  <div className="text-sm text-gray-400 font-bold">
                    Created At: 2021-10-10
                  </div>
                  <div className="text-sm text-gray-400 font-bold">
                    Created By: 879548-Abhranil Kundu
                  </div>
                </div>

                <div className="w-full flex justify-end relative top-14">
                  {!editCategory ? (
                    <button
                      type="button"
                      onClick={() => setEditCategory(true)}
                      className="text-white bg-green-700 hover:bg-green-800 font-medium rounded-lg text-sm w-full sm:w-auto px-12 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700"
                    >
                      Edit
                    </button>
                  ) : (
                    <button
                      type="submit"
                      onClick={handleUpdate}
                      disabled={loader} // ✅ disable when updating
                      className={`font-medium rounded-lg text-sm w-full sm:w-auto px-12 py-2 text-center flex items-center justify-center gap-2
                        ${
                          loader
                            ? "bg-gray-400 cursor-not-allowed"
                            : "text-white bg-green-700 hover:bg-green-800 dark:bg-blue-600 dark:hover:bg-blue-700"
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
                      {loader ? "Updating..." : "Save"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CategoryViewCard;
