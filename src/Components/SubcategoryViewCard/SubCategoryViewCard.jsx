import React, { useCallback, useEffect, useRef, useState } from "react";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import InputBox from "../InputBox/InputBox";
import ImageBox from "../ImageBox/ImageBox";
import {
  useGetCategoriesQuery,
  useGetSubCategoryByIdQuery,
  useUpdateSubCategoryMutation,
} from "../../Services/fetchDataFromApi";
import { toast } from "react-toastify";
import SelectBox from "../SelectBox/SelectBox";

function SubCategoryViewCard({ setShowForm, subCategoryId }) {
  const [editSubCategory, setEditSubCategory] = useState(false);
  const [imagesWithId, setImagesWithId] = useState([]);
  const [deletedBackendImageId, setDeletedBackendImageId] = useState(null);
  const [loader, setLoader] = useState(false);

  const [subCategoryName, setSubCategoryName] = useState("");
  const [choseCategory, setChoseCategory] = useState("");
  const [originalCategoryId, setOriginalCategoryId] = useState("");

  const inputRef = useRef(null);
  const selectRef = useRef(null);

  /* ================= API ================= */
  const { data, error, isLoading } = useGetSubCategoryByIdQuery(subCategoryId, {
    skip: !subCategoryId,
  });

  const { data: categoriesData } = useGetCategoriesQuery();
  const [updateSubCategory] = useUpdateSubCategoryMutation();

  /* ================= SET INITIAL DATA ================= */
  useEffect(() => {
    if (!data?.data) return;

    const subCat = data.data;

    setSubCategoryName(subCat.subCategoryName || "");

    const backendImage =
      subCat.image?.[0]
        ? [
            {
              _id: subCat.image[0]._id,
              url: subCat.image[0].url,
              type: "backend",
            },
          ]
        : [];

    setImagesWithId(backendImage);

    const catId = subCat.category?.[0]?._id || "";
    setChoseCategory(catId);
    setOriginalCategoryId(catId);
  }, [data]);

  /* ================= HANDLERS ================= */
  const handleSubCategoryNameChange = useCallback((e) => {
    setSubCategoryName(e.target.value);
  }, []);

  const handleAddImages = (newImages) => {
    // only allow one image
    setImagesWithId(newImages.slice(0, 1));
  };

  const handleDeleteImage = (image) => {
    if (image.type === "backend") {
      setDeletedBackendImageId(image._id);
    }
    setImagesWithId([]);
  };

  /* ================= UPDATE ================= */
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoader(true);

    if (!subCategoryName.trim()) {
      toast.error("Subcategory name cannot be empty");
      setLoader(false);
      return;
    }

    if (imagesWithId.length === 0) {
      toast.error("Please keep at least one image");
      setLoader(false);
      return;
    }

    const finalCategoryId = choseCategory || originalCategoryId;
    if (!finalCategoryId) {
      toast.error("Please select a category");
      setLoader(false);
      return;
    }

    const formData = new FormData();
    formData.append("subCategoryName", subCategoryName);
    formData.append("categoryId", finalCategoryId);

    // backend image delete
    if (deletedBackendImageId) {
      formData.append("subCategoryImageId", deletedBackendImageId);
    }

    // new image upload
    if (imagesWithId[0]?.file) {
      formData.append("subCategoryImage", imagesWithId[0].file);
    }

    try {
      await updateSubCategory({
        id: subCategoryId,
        subCategory: formData,
      }).unwrap();

      toast.success("Subcategory updated successfully");
      setShowForm(false);
    } catch (err) {
      toast.error(err?.data?.message || "Something went wrong");
    } finally {
      setLoader(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div
      className="fixed top-0 left-0 w-full h-full z-50"
      style={{ background: "rgba(36,35,35,0.3)" }}
    >
      <div className="fixed left-[24%] top-[18%] bg-gray-900 shadow-lg rounded-lg w-[64vw] h-[70%] px-5">
        <div className="flex justify-between items-center py-4 font-bold">
          <span>Update Subcategory Details</span>
          <span className="cursor-pointer" onClick={() => setShowForm(false)}>
            <FontAwesomeIcon icon={faX} />
          </span>
        </div>

        <div className="w-full h-[80%] border-2 border-white rounded px-7 py-5">
          {isLoading && <div className="text-center">Loading...</div>}
          {error && (
            <div className="text-center text-red-500">
              Something went wrong
            </div>
          )}

          {!isLoading && !error && data?.data && (
            <div className="h-full flex gap-6">
              <div className="w-1/2 flex items-center justify-center">
                <ImageBox
                  images={imagesWithId}
                  editable={editSubCategory}
                  onAddImages={handleAddImages}
                  onDeleteImage={handleDeleteImage}
                  maxImages={1}
                />
              </div>

              <div className="w-1/2 flex flex-col gap-6 justify-center">
                <InputBox
                  label="Subcategory Name"
                  placeholder="Like 'Footballs'"
                  value={subCategoryName}
                  onChange={handleSubCategoryNameChange}
                  readOnly={!editSubCategory}
                />

                <SelectBox
                  label="Enter Category"
                  data={categoriesData?.data?.data || []}
                  value={choseCategory}
                  readOnly={!editSubCategory}
                  onChange={(id) => setChoseCategory(id)}
                />

                <div className="flex justify-end">
                  {!editSubCategory ? (
                    <button
                      onClick={() => setEditSubCategory(true)}
                      className="bg-green-700 text-white px-10 py-2 rounded"
                    >
                      Edit
                    </button>
                  ) : (
                    <button
                      onClick={handleUpdate}
                      disabled={loader}
                      className={`px-10 py-2 rounded text-white ${
                        loader
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-green-700 hover:bg-green-800"
                      }`}
                    >
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

export default SubCategoryViewCard;
