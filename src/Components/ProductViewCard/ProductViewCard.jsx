import React, { useCallback, useEffect, useMemo, useState } from "react";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import InputBox from "../InputBox/InputBox";
import ImageBox from "../ImageBox/ImageBox";
import SelectBox from "../SelectBox/SelectBox";
import {
  useGetProductByIdQuery,
  useGetSubCategoriesQuery,
  useUpdateProductMutation,
} from "../../Services/fetchDataFromApi";
import { Bounce, toast, ToastContainer } from "react-toastify";
import TextArea from "../TextArea/TextArea";
import WarningPopup from "../WarnningPopup/WarningPopup";
import MultipleImageUploadBox from "./../MultipleImageUploadBox/MultipleImageUploadBox";
import OptionBox from "../OptionBox/OptionBox";

function ProductViewCard({ setShowForm, productId }) {
  const [editProductDetails, setEditProductDetails] = useState(false);
  const [warningPopup, setWarningPopup] = useState(false);
  const [deletedColorIds, setDeletedColorIds] = useState([]);
  const { data } = useGetProductByIdQuery(productId);
  const { data: subCategoriesData } = useGetSubCategoriesQuery();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const [product, setProduct] = useState({
    productName: "",
    productSubCategory: "",
  });

  // Each color also tracks IDs for safe updating
  const [colors, setColors] = useState([
    {
      id: undefined,
      productColorName: "",
      productDescription: "",
      color: "",
      gender: "No",
      sizes: [
        {
          id: undefined,
          defaultsize: "",
          size: "",
          stock: "",
          actualPrice: "",
          offerPercentage: "",
          offerPrice: "",
        },
      ],
      coverImage: [],
      productImages: [],
      deleteProductImageIds: [],
      coverImageIdToDelete: null, // ✅ keep only this
      deleteProductSizeIds: null,
      deletecolorwiseitem: null,
    },
  ]);

  const [overlayLoader, setOverlayLoader] = useState(false); // page overlay loader (re-uses your existing styling)
  const [activeColorTab, setActiveColorTab] = useState(0);

  // ---------- Helpers ----------
  const asFile = useCallback((item) => {
    if (!item) return null;
    if (item instanceof File) return item;
    if (item.file instanceof File) return item.file;
    return null;
  }, []);

  // Normalize API payload into our local shape
  useEffect(() => {
    if (!data?.data) return;

    const p = data.data;
    console.log("p", p);

    setProduct({
      productName: p.productName || "",
      // some APIs send subcategory array, some send FK id; support both
      productSubCategory:
        p.productSubCategory || p?.subcategory?.[0]?._id || "",
    });

    const mappedColors = (p.colors || []).map((c) => ({
      id: c._id,
      productColorName: c.productColorName || "",
      productDescription: c.productDescription || "",
      color: c.color || "",
      gender: c.gender || "No",
      sizes: (c.sizes || c.priceAndStock || []).map((s) => ({
        id: s._id,
        defaultsize: s.defaultsize ?? "",
        size: s.size ?? "",
        stock: s.stock ?? "",
        actualPrice: s.actualPrice ?? "",
        offerPercentage: s.offerPercent ?? s.offerPercentage ?? "",
        offerPrice: s.offerPrice ?? "",
      })),
      coverImage: c.coverImage,
      productImages: c.productImages || c.images || [],
      deleteProductImageIds: [],
      deleteProductSizeIds: [],
      coverImageIdToDelete: null, // ✅
      deletecolorwiseitem: [],
    }));

    console.log("m", mappedColors[0].coverImage[0][0]);

    setColors(mappedColors.length ? mappedColors : colors);
    setActiveColorTab(0);
  }, [data]);

  const handleProductChange = useCallback((name, value) => {
    setProduct((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleColorChange = useCallback((index, e) => {
    setColors((prev) => {
      const draft = [...prev];
      draft[index][e.target.name] = e.target.value;
      return draft;
    });
  }, []);

const handleSizeChange = useCallback((colorIndex, sizeIndex, e) => {
  const { name, value } = e.target;

  const parsedValue =
    name === "defaultsize" ? value === "true" || value === true : value;

  setColors((prev) => {
    const draft = [...prev];

    // ✅ Only one default size per color
    if (name === "defaultsize" && parsedValue === true) {
      draft[colorIndex].sizes = draft[colorIndex].sizes.map((s) => ({
        ...s,
        defaultsize: false,
      }));
    }

    const sizeItem = {
      ...draft[colorIndex].sizes[sizeIndex],
      [name]: parsedValue,
    };

    const actualPrice = Number(sizeItem.actualPrice) || 0;
    const offerPercentage = Number(sizeItem.offerPercentage) || 0;

    // ✅ Rounded offer price (NO decimals)
    if (actualPrice > 0 && offerPercentage > 0) {
      const discounted =
        actualPrice - (actualPrice * offerPercentage) / 100;

      sizeItem.offerPrice = Math.floor(discounted); // 🔥 key change
    } else {
      sizeItem.offerPrice = "";
    }

    draft[colorIndex].sizes[sizeIndex] = sizeItem;
    return draft;
  });
}, []);


  const handleImageUpload = useCallback((colorIndex, newFiles) => {
    setColors((prev) => {
      const draft = [...prev];
      const existing = draft[colorIndex].productImages || [];
      draft[colorIndex] = {
        ...draft[colorIndex],
        productImages: [...existing, ...newFiles],
      };
      return draft;
    });
  }, []);
  const handleCoverImageUpload = useCallback((colorIndex, files) => {
    setColors((prev) => {
      const draft = [...prev];
      draft[colorIndex].coverImage = [...files];
      return draft;
    });
  }, []);

  const addColor = useCallback(() => {
    setColors((prev) => {
      if (prev.length >= 10) {
        toast.warn("❌ Only 10 color variants can be added.");
        return prev;
      }
      const freshSize = {
        id: undefined,
        defaultsize: "",
        size: "",
        stock: "",
        actualPrice: "",
        offerPercentage: "",
        offerPrice: "",
      };
      const newColor = {
        id: undefined,
        productColorName: "",
        productDescription: "",
        color: "",
        gender: "No",
        sizes: [{ ...freshSize }],
        coverImage: [],
        productImages: [],
        deleteProductImageIds: [],
        coverImageIdToReplace: null,
        deletecolorwiseitemId: [],
      };
      const updated = [...prev, newColor];
      setActiveColorTab(updated.length - 1);
      return updated;
    });
  }, []);

  const removeColor = useCallback((index) => {
    setColors((prev) => {
      const draft = [...prev];

      const colorObj = draft[index];

      // store deleted color ID globally (so update API receives it)
      if (colorObj?.id) {
        setDeletedColorIds((prevIds) => [...prevIds, colorObj.id]);
      }

      // remove UI item
      draft.splice(index, 1);

      return draft;
    });

    // fix active tab index
    setActiveColorTab((prev) => {
      if (prev > index) return prev - 1;
      if (prev === index) return 0;
      return prev;
    });
  }, []);

  const addSize = useCallback((colorIndex) => {
    setColors((prev) => {
      const draft = [...prev];

      draft[colorIndex].sizes.push({
        id: undefined,
        size: "",
        stock: "",
        actualPrice: "",
        offerPercentage: "",
        offerPrice: "",
      });

      // prevents React Strict Mode double execution

      return draft;
    });
  }, []);

  const removeSize = useCallback((colorIndex, sizeIndex) => {
    alert(sizeIndex);

    setColors((prev) => {
      const draft = [...prev];
      const color = draft[colorIndex];

      const sizeObj = color.sizes[sizeIndex];

      // Track backend size IDs for deletion
      if (sizeObj?.id) {
        color.deleteProductSizeIds = [
          ...(color.deleteProductSizeIds || []),
          sizeObj.id,
        ];
      }

      // Remove size from state
      color.sizes = color.sizes.filter((_, i) => i !== sizeIndex);

      return draft;
    });
  }, []);

  const handleImageDelete = useCallback((colorIndex, image) => {
    setColors((prev) => {
      const draft = [...prev];
      const list = draft[colorIndex].productImages || [];

      if (image.type === "backend") {
        // track deletion
        draft[colorIndex].deleteProductImageIds = [
          ...(draft[colorIndex].deleteProductImageIds || []),
          image.id,
        ];
        draft[colorIndex].productImages = list.filter(
          (img) => img._id !== image.id
        );
      } else if (image.type === "local") {
        draft[colorIndex].productImages = list.filter(
          (img) => img._id !== image.id
        );
      }
      console.log("nk;h", draft);

      return draft;
    });
  }, []);
  const handleCoverImageDelete = useCallback((colorIndex, image) => {
    setColors((prev) => {
      const draft = [...prev];

      if (image.type === "backend") {
        draft[colorIndex].coverImageIdToDelete = image.id; // ✅ mark for deletion
      }

      draft[colorIndex].coverImage = []; // always clear UI

      return draft;
    });
  }, []);

  // ---------------- UPDATE HANDLER (with button loader + disabled) ----------------
  const handleUpdate = useCallback(async () => {
    try {
      // Basic validation: if a cover is marked for replace but no new file, warn
      for (let i = 0; i < colors.length; i++) {
        const c = colors[i];
        // if (c.coverImageIdToReplace && !c.coverImage.some((x) => asFile(x))) {
        //   toast.error(
        //     "Please upload a new cover image for the color you removed."
        //   );
        //   return;
        // }
      }

      const formData = new FormData();
      formData.append("productName", product.productName);
      formData.append("productSubCategory", product.productSubCategory);
      deletedColorIds.forEach((id) => {
        formData.append("deletecolorwiseitem[]", id);
      });

      colors.forEach((color, colorIndex) => {
        if (color.id) formData.append(`colors[${colorIndex}][id]`, color.id);
        formData.append(
          `colors[${colorIndex}][productColorName]`,
          color.productColorName || ""
        );
        formData.append(
          `colors[${colorIndex}][productDescription]`,
          color.productDescription || ""
        );
        formData.append(`colors[${colorIndex}][color]`, color.color || "");
        formData.append(`colors[${colorIndex}][gender]`, color.gender || "No");
        // sizes
        (color.sizes || []).forEach((size, sizeIndex) => {
          if (size.id)
            formData.append(
              `colors[${colorIndex}][sizes][${sizeIndex}][id]`,
              size.id
            );
          formData.append(
            `colors[${colorIndex}][sizes][${sizeIndex}][defaultsize]`,
            size.defaultsize ?? ""
          );
          formData.append(
            `colors[${colorIndex}][sizes][${sizeIndex}][size]`,
            size.size ?? ""
          );
          formData.append(
            `colors[${colorIndex}][sizes][${sizeIndex}][stock]`,
            size.stock ?? ""
          );
          formData.append(
            `colors[${colorIndex}][sizes][${sizeIndex}][actualPrice]`,
            size.actualPrice ?? ""
          );
          // backend expects offerPercent
          formData.append(
            `colors[${colorIndex}][sizes][${sizeIndex}][offerPercent]`,
            size.offerPercentage ?? ""
          );
          formData.append(
            `colors[${colorIndex}][sizes][${sizeIndex}][offerPrice]`,
            size.offerPrice ?? ""
          );
        });

        (color.deleteProductSizeIds || []).forEach((sizeId) => {
          formData.append(
            `colors[${colorIndex}][deleteProductSizeIds][]`,
            sizeId
          );
        });

        // send cover delete id if exists
        // send cover delete id if exists
        if (color.coverImageIdToDelete) {
          formData.append(
            `colors[${colorIndex}][coverImageIdToDelete]`,
            color.coverImageIdToDelete
          );
        }

        // send new cover file if uploaded
        const coverFile = color.coverImage?.map(asFile).find(Boolean);
        if (coverFile) {
          formData.append(`colors[${colorIndex}][coverImage]`, coverFile);
        }

        // mark product images to delete
        (color.deleteProductImageIds || []).forEach((imgId) => {
          formData.append(
            `colors[${colorIndex}][deleteProductImageIds][]`,
            imgId
          );
        });
        // new product images
        // product images: deletions
        (color.deleteProductImageIds || []).forEach((imgId) => {
          formData.append(
            `colors[${colorIndex}][deleteProductImageIds][]`,
            imgId
          );
        });

        // product images: new uploads only
        (color.productImages || []).forEach((img) => {
          const f = asFile(img);
          if (f) {
            formData.append(`colors[${colorIndex}][productImages]`, f);
          }
        });
      });

      setOverlayLoader(true);
      const res = await updateProduct({ id: productId, formData }).unwrap();
      toast.success("Product updated successfully", { transition: Bounce });
      setEditProductDetails(false);
      console.log(res);

      setShowForm(false);
    } catch (err) {
      toast.error(err?.data?.message || "Error updating product", {
        transition: Bounce,
      });
      console.log("error", err);
    } finally {
      setOverlayLoader(false);
    }
  }, [colors, product, productId, updateProduct, asFile]);

  return (
    <div
      className="relative top-0 left-0 w-full   bg-opacity-50 z-50"
      style={{ background: "rgba(36, 35, 35, 0.301)" }}
    >
      <div className="fixed left-[15%] top-0  bg-white shadow-lg shadow-gray-800 rounded-lg w-[80vw] h-[100vh] px-5 dark:bg-gray-900 dark:text-white dark:shadow-gray-200/100 overflow-y-scroll">
        <div className="flex justify-between items-center font-bold h-[5%] mb-2">
          <span className="font-bold">Product Details</span>
          <span className="cursor-pointer" onClick={() => setShowForm(false)}>
            <FontAwesomeIcon icon={faX} />
          </span>
        </div>

        <div className=" w-full  flex flex-col border-2 rounded border-gray-800 px-7 py-3  dark:border-gray-400">
          {/* NOTE: We keep the form, but Save uses handleUpdate instead of submit */}
          <form onSubmit={(e) => e.preventDefault()} className=" gap-5  h-full">
            {/* Product Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <InputBox
                label="Product Name"
                name="productName"
                value={product.productName}
                onChange={(e) =>
                  handleProductChange("productName", e.target.value)
                }
                required
                editable={editProductDetails}
              />
              <SelectBox
                label="Enter Sub Category"
                placeholder="Like 'Footballs'"
                data={subCategoriesData?.data?.subCategories || []}
                value={product.productSubCategory}
                onChange={(id) => handleProductChange("productSubCategory", id)}
                editable={editProductDetails}
              />
            </div>

            {/* Color Variants Tabs */}
            <div className="flex flex-col gap-4 flex-grow py-5">
              <div className="flex justify-between items-center">
                <h3 className="font-bold">Color Variants / Item</h3>
                <button
                  type="button"
                  onClick={addColor}
                  className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={colors.length >= 10 || !editProductDetails}
                >
                  Add More
                </button>
              </div>

              <div className="flex border-b">
                {colors.map((color, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`px-4 py-2 ${
                      activeColorTab === index
                        ? "border-b-2 border-blue-500 font-medium"
                        : ""
                    }`}
                    onClick={() => setActiveColorTab(index)}
                  >
                    {color.productColorName || `Variant ${index + 1}`}
                    {colors.length > 1 && editProductDetails && (
                      <span
                        className="ml-2 text-red-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeColor(index);
                        }}
                      >
                        ×
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Active Color Variant Content */}
              {colors.length > 0 && (
                <div className="flex flex-col gap-4 flex-grow overflow-auto">
                  <div className="grid grid-cols-2 gap-4">
                    <InputBox
                      label="Color Name / Item Name"
                      name="productColorName"
                      value={colors[activeColorTab].productColorName}
                      onChange={(e) => handleColorChange(activeColorTab, e)}
                      editable={editProductDetails}
                    />
                    <div className="flex items-center gap-2">
                      <div >
                        <InputBox
                          type="text"
                          label="Color"
                          name="color"
                          placeholder="Red / Blue / Black"
                          value={colors[activeColorTab].color}
                          onChange={(e) => handleColorChange(activeColorTab, e)}
                          editable={editProductDetails}
                        />
                      </div>

                      <div>
                        <OptionBox
                          label="Gender"
                          placeholder="Choose"
                          name="gender"
                          value={colors[activeColorTab].gender}
                          onChange={(e) => handleColorChange(activeColorTab, e)}
                          data={["No", "Men", "Women", "Boys", "Girls"]}
                          editable={editProductDetails}
                        />
                      </div>
                    </div>
                  </div>

                  <TextArea
                    label="Description"
                    name="productDescription"
                    value={colors[activeColorTab].productDescription}
                    onChange={(e) => handleColorChange(activeColorTab, e)}
                    editable={editProductDetails}
                  />

                  <div className="flex items-center justify-around gap-3 w-[100%] h-[55vh] font-bold ">
                    <div className="h-[100%] w-[48%]  ">
                      <ImageBox
                        label="Cover Image"
                        images={colors[activeColorTab].coverImage}
                        editable={editProductDetails}
                        onAddImages={(files) =>
                          handleCoverImageUpload(activeColorTab, files)
                        }
                        onDeleteImage={(file) =>
                          handleCoverImageDelete(activeColorTab, file)
                        } // ✅ FIXED
                      />
                    </div>
                    <div className="h-[100%] w-[48%]  ">
                      <MultipleImageUploadBox
                        label="Product Images"
                        images={colors[activeColorTab].productImages}
                        editable={editProductDetails}
                        maxImages={12}
                        onAddImages={(files) =>
                          handleImageUpload(activeColorTab, files)
                        }
                        onDeleteImage={(file) =>
                          handleImageDelete(activeColorTab, file)
                        } // ✅ FIXED
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-bold">Sizes & Pricing</h4>
                      <button
                        type="button"
                        onClick={() => addSize(activeColorTab)}
                        className="text-white bg-green-600 hover:bg-green-700 px-2 py-1 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={
                          colors[activeColorTab]?.sizes.length >= 10 ||
                          !editProductDetails
                        }
                      >
                        Add Size
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {colors[activeColorTab].sizes.map((size, sizeIndex) => (
                        <div
                          key={sizeIndex}
                          className="border rounded p-4 relative"
                        >
                          {sizeIndex > 0 && editProductDetails && (
                            <button
                              type="button"
                              onClick={() =>
                                removeSize(activeColorTab, sizeIndex)
                              }
                              className="absolute top-1 right-1 text-red-500"
                            >
                              ×
                            </button>
                          )}
                          <OptionBox
                            label="Set Default"
                            placeholder="Choose"
                            name="defaultsize"
                            value={size.defaultsize}
                            onChange={(e) =>
                              handleSizeChange(activeColorTab, sizeIndex, e)
                            }
                            data={[true, false]}
                            editable={editProductDetails}
                          />
                          <InputBox
                            label="Size"
                            name="size"
                            type="text"
                            value={size.size}
                            onChange={(e) =>
                              handleSizeChange(activeColorTab, sizeIndex, e)
                            }
                            editable={editProductDetails}
                          />
                          <InputBox
                            label="Stock"
                            name="stock"
                            type="number"
                            editable={editProductDetails}
                            value={size.stock}
                            onChange={(e) =>
                              handleSizeChange(activeColorTab, sizeIndex, e)
                            }
                          />
                          <InputBox
                            label="Actual Price"
                            name="actualPrice"
                            type="number"
                            editable={editProductDetails}
                            value={size.actualPrice}
                            onChange={(e) =>
                              handleSizeChange(activeColorTab, sizeIndex, e)
                            }
                          />
                          <InputBox
                            label="Offer Percentage(%)"
                            name="offerPercentage"
                            type="number"
                            editable={editProductDetails}
                            value={size.offerPercentage}
                            onChange={(e) =>
                              handleSizeChange(activeColorTab, sizeIndex, e)
                            }
                          />
                          <InputBox
                            label="Offer Price"
                            name="offerPrice"
                            type="number"
                            value={size.offerPrice}
                            editable={editProductDetails}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </form>

          {/* Footer buttons */}
          {/* Footer buttons */}
          <div className="flex justify-end mt-4">
            {!editProductDetails ? (
              <button
                type="button"
                onClick={() => setEditProductDetails(true)}
                className="text-white bg-green-700 hover:bg-green-800 font-medium rounded-lg text-sm w-full sm:w-auto px-12 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                Edit
              </button>
            ) : (
              <button
                type="button"
                onClick={handleUpdate}
                disabled={isUpdating}
                className="text-white bg-green-700 hover:bg-green-800 font-medium rounded-lg text-sm w-full sm:w-auto px-12 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isUpdating ? (
                  <span className="flex items-center justify-center gap-2">
                    {/* ✅ Spinner inside button */}
                    <svg
                      aria-hidden="true"
                      role="status"
                      className="inline w-4 h-4 text-white animate-spin"
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
                    Saving...
                  </span>
                ) : (
                  "Save"
                )}
              </button>
            )}
          </div>

          {warningPopup && (
            <div className="w-full bg-amber-700">
              <WarningPopup
                description={"warn"}
                setWarningPopup={setWarningPopup}
              />
            </div>
          )}
        </div>
      </div>
      <ToastContainer transition={Bounce} />
    </div>
  );
}

export default ProductViewCard;
