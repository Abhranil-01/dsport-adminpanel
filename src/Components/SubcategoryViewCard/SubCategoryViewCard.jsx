import React, { useEffect, useState } from "react";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import InputBox from "../InputBox/InputBox";
import ImageBox from "../ImageBox/ImageBox";
import SelectBox from "../SelectBox/SelectBox";
import {
  useGetCategoriesQuery,
  useGetSubCategoryByIdQuery,
  useUpdateSubCategoryMutation,
} from "../../Services/fetchDataFromApi";
import { toast } from "react-toastify";

function SubCategoryViewCard({ setShowForm, subCategoryId }) {
  const [editSubCategory, setEditSubCategory] = useState(false);
  const [imagesWithId, setImagesWithId] = useState([]);
  const [subCategoryName, setSubCategoryName] = useState("");
  const [choseCategory, setChoseCategory] = useState("");
  const [originalCategoryId, setOriginalCategoryId] = useState("");
  const [loader, setLoader] = useState(false);

  /* ================= API ================= */
  const { data, isLoading, error } =
    useGetSubCategoryByIdQuery(subCategoryId, {
      skip: !subCategoryId,
    });

  const { data: categoriesData } = useGetCategoriesQuery();
  const [updateSubCategory] = useUpdateSubCategoryMutation();

  /* ================= INITIAL DATA ================= */
  useEffect(() => {
    if (!data?.data) return;

    const subCat = data.data;

    setSubCategoryName(subCat.subCategoryName || "");

    const backendImage = subCat.image?.[0]
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

  // Replace image (backend auto-handles deletion)
  const handleAddImages = (newImages) => {
    setImagesWithId(newImages.slice(0, 1));
  };

  const handleDeleteImage = () => {
    setImagesWithId([]);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoader(true);

    if (!subCategoryName.trim()) {
      toast.error("Subcategory name is required");
      setLoader(false);
      return;
    }

    if (imagesWithId.length === 0) {
      toast.error("At least one image is required");
      setLoader(false);
      return;
    }

    const formData = new FormData();
    formData.append("subCategoryName", subCategoryName);
    formData.append("categoryId", choseCategory || originalCategoryId);

    // only send image if user selected a new one
    if (imagesWithId[0]?.file) {
      formData.append("subCategoryImage", imagesWithId[0].file);
    }

    try {
      await updateSubCategory({
        id: subCategoryId,
        formData,
      }).unwrap();

      toast.success("Subcategory updated successfully");
      setShowForm(false);
    } catch (err) {
      toast.error(err?.data?.message || "Update failed");
    } finally {
      setLoader(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="fixed inset-0 bg-black/40 z-50">
      <div className="fixed left-[24%] top-[18%] bg-gray-900 text-white rounded-lg w-[64vw] h-[70%] px-5">
        <div className="flex justify-between items-center py-4 font-bold">
          <span>Update Subcategory</span>
          <span className="cursor-pointer" onClick={() => setShowForm(false)}>
            <FontAwesomeIcon icon={faX} />
          </span>
        </div>

        <div className="h-[80%] border rounded px-7 py-5">
          {isLoading && <div className="text-center">Loading...</div>}
          {error && (
            <div className="text-center text-red-500">Something went wrong</div>
          )}

          {!isLoading && !error && (
            <div className="h-full flex gap-6">
              <ImageBox
                images={imagesWithId}
                editable={editSubCategory}
                onAddImages={handleAddImages}
                onDeleteImage={handleDeleteImage}
                maxImages={1}
              />

              <div className="flex flex-col gap-6 w-1/2 justify-center">
                <InputBox
                  label="Subcategory Name"
                  value={subCategoryName}
                  onChange={(e) => setSubCategoryName(e.target.value)}
                  readOnly={!editSubCategory}
                />

                <SelectBox
                  label="Category"
                  data={categoriesData?.data?.data || []}
                  value={choseCategory}
                  onChange={setChoseCategory}
                  readOnly={!editSubCategory}
                />

                <div className="flex justify-end">
                  {!editSubCategory ? (
                    <button
                      onClick={() => setEditSubCategory(true)}
                      className="bg-green-700 px-10 py-2 rounded"
                    >
                      Edit
                    </button>
                  ) : (
                    <button
                      onClick={handleUpdate}
                      disabled={loader}
                      className={`px-10 py-2 rounded ${
                        loader
                          ? "bg-gray-400"
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
