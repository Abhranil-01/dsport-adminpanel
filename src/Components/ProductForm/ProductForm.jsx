import React, { useCallback, useState } from "react";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import InputBox from "../InputBox/InputBox";
import ImageBox from "../ImageBox/ImageBox";
import SelectBox from "../SelectBox/SelectBox";
import {
  useCreateProductMutation,
  useGetSubCategoriesQuery,
} from "../../Services/fetchDataFromApi";
import { toast } from "react-toastify";
import TextArea from "../TextArea/TextArea";
import MultipleImageUploadBox from "../MultipleImageUploadBox/MultipleImageUploadBox";
import OptionBox from "../OptionBox/OptionBox";

function ProductForm({ setShowForm }) {
  const [product, setProduct] = useState({
    productName: "",
    productSubCategory: "",
  });

  const [colors, setColors] = useState([
    {
      productColorName: "",
      productDescription: "",
      color: "", // ✅ manual color text
      gender: "No",
      sizes: [
        {
          defaultsize: "",
          size: "",
          stock: "",
          actualPrice: "",
          offerPercentage: "",
        },
      ],
      coverImage: [],
      productImages: [],
    },
  ]);

  const [loader, setLoader] = useState(false);
  const [activeColorTab, setActiveColorTab] = useState(0);
  const [createProduct] = useCreateProductMutation();
  const { data, error, isLoading } = useGetSubCategoriesQuery();
  const handleProductChange = useCallback((name, id) => {
    setProduct((prev) => ({
      ...prev,
      [name]: id,
    }));
  }, []);

  const handleColorChange = useCallback((index, e) => {
    setColors((prev) => {
      const newColors = [...prev];
      newColors[index][e.target.name] = e.target.value;
      return newColors;
    });
  }, []);

  const handleSizeChange = useCallback((colorIndex, sizeIndex, e) => {
    const { name, value } = e.target;

    // Convert string to boolean if the field is defaultsize
    const booleanValue =
      name === "defaultsize" ? value === "true" || value === true : value;

    setColors((prevColors) => {
      const newColors = [...prevColors];

      // If defaultsize is being set to true, turn all others to false
      if (name === "defaultsize" && booleanValue === true) {
        newColors[colorIndex].sizes = newColors[colorIndex].sizes.map((s) => ({
          ...s,
          defaultsize: false,
        }));
      }

      const sizeItem = {
        ...newColors[colorIndex].sizes[sizeIndex],
        [name]: booleanValue,
      };

      // Price calculation
      const actualPrice = parseFloat(sizeItem.actualPrice) || 0;
      const offerPercentage = parseFloat(sizeItem.offerPercentage) || 0;

      if (actualPrice && offerPercentage) {
        sizeItem.offerPrice = (
          actualPrice -
          (actualPrice * offerPercentage) / 100
        ).toFixed(2);
      } else {
        sizeItem.offerPrice = "";
      }

      newColors[colorIndex].sizes[sizeIndex] = sizeItem;

      return newColors;
    });
  }, []);

  const handleImageUpload = useCallback((colorIndex, newFiles) => {
    setColors((prev) => {
      const newColors = [...prev];
      const existingFiles = newColors[colorIndex].productImages || [];
      newColors[colorIndex] = {
        ...newColors[colorIndex],
        productImages: [...existingFiles, ...newFiles],
      };
      return newColors;
    });
  }, []);

  const handleCoverImageUpload = useCallback((colorIndex, file) => {
    setColors((prev) => {
      const newColors = [...prev];
      newColors[colorIndex].coverImage = [...file];
      return newColors;
    });
  }, []);

  const addColor = useCallback(() => {
    setColors((prevColors) => {
      if (prevColors.length >= 10) return prevColors;

      const newColorVariant = {
        productColorName: "",
        productDescription: "",
        color: "", // ✅ manual
        gender: "No",
        sizes: [
          {
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
      };

      const updatedColors = [...prevColors, newColorVariant];
      setActiveColorTab(updatedColors.length - 1);
      return updatedColors;
    });
  }, []);

  const removeColor = useCallback(
    (index) => {
      setColors((prev) => {
        const newColors = [...prev];
        newColors.splice(index, 1);
        return newColors;
      });
      if (activeColorTab >= index) {
        setActiveColorTab(Math.max(0, activeColorTab - 1));
      }
    },
    [activeColorTab]
  );
  const addSize = useCallback((colorIndex) => {
    console.log(colorIndex);

    setColors((prevColors) => {
      const newColors = [...prevColors];
      newColors[colorIndex] = {
        ...newColors[colorIndex],
        sizes: [
          ...newColors[colorIndex].sizes,
          {
            defaultsize: "",
            size: "",
            stock: "",
            actualPrice: "",
            offerPercentage: "",
            offerPrice: "",
          },
        ],
      };
      return newColors;
    });
  }, []);

  const removeSize = useCallback((colorIndex, sizeIndex) => {
    setColors((prev) => {
      const newColors = [...prev];
      newColors[colorIndex].sizes.splice(sizeIndex, 1);
      return newColors;
    });
  }, []);
  const handleImageDelete = useCallback((colorIndex, image) => {
    setColors((prevColors) => {
      const newColors = [...prevColors];
      const list = newColors[colorIndex].productImages || [];

      if (image.type === "backend") {
        // mark backend images for deletion
        newColors[colorIndex].deleteProductImageIds = [
          ...(newColors[colorIndex].deleteProductImageIds || []),
          image.id,
        ];
        newColors[colorIndex].productImages = list.filter(
          (img) => img._id !== image.id
        );
      } else if (image.type === "local") {
        // just filter local ones
        newColors[colorIndex].productImages = list.filter(
          (img) => img._id !== image.id
        );
      }

      return newColors;
    });
  }, []);

  const handleCoverImageDelete = useCallback((colorIndex, image) => {
    setColors((prevColors) => {
      const newColors = [...prevColors];
      const list = newColors[colorIndex].coverImage || [];

      if (image.type === "backend") {
        newColors[colorIndex].deleteCoverImageIds = [
          ...(newColors[colorIndex].deleteCoverImageIds || []),
          image.id,
        ];
        newColors[colorIndex].coverImage = list.filter(
          (img) => img._id !== image.id
        );
      } else if (image.type === "local") {
        newColors[colorIndex].coverImage = list.filter(
          (img) => img._id !== image.id
        );
      }

      return newColors;
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);

    const formData = new FormData();
    formData.append("productName", product.productName);
    formData.append("productSubCategory", product.productSubCategory);

    colors.forEach((color, colorIndex) => {
      formData.append(
        `colors[${colorIndex}][productColorName]`,
        color.productColorName
      );
      formData.append(
        `colors[${colorIndex}][productDescription]`,
        color.productDescription
      );
      formData.append(`colors[${colorIndex}][color]`, color.color);
      formData.append(`colors[${colorIndex}][gender]`, color.gender);

      color.sizes.forEach((size, sizeIndex) => {
        formData.append(
          `colors[${colorIndex}][sizes][${sizeIndex}][defaultsize]`, // ✅ default size
          size.defaultsize
        );
        formData.append(
          `colors[${colorIndex}][sizes][${sizeIndex}][size]`, // ✅ size (e.g., "M", "L")
          size.size
        );
        formData.append(
          `colors[${colorIndex}][sizes][${sizeIndex}][stock]`, // ✅ stock (e.g., 12)
          size.stock
        );
        formData.append(
          `colors[${colorIndex}][sizes][${sizeIndex}][actualPrice]`, // ✅ actual price (e.g., 500)
          size.actualPrice
        );
        formData.append(
          `colors[${colorIndex}][sizes][${sizeIndex}][offerPercentage]`, // ✅ offer percentage (e.g., 10)
          size.offerPercentage
        );
      });

      color.productImages.forEach((img) => {
        const actualFile = img.file || img;
        if (actualFile instanceof File) {
          formData.append(`colors[${colorIndex}][productImages]`, actualFile);
        }
      });

      // ✅ Append coverImage
      color.coverImage.forEach((img) => {
        const actualFile = img.file || img;
        if (actualFile instanceof File) {
          formData.append(`colors[${colorIndex}][coverImage]`, actualFile);
        }
      });
    });
    // console.log(colors[0].productImages);

    try {
      const res = await createProduct(formData);
      console.log(res);

      if (res.error) {
        toast.error(res.error?.data?.errors || "Error creating product");
      } else {
        toast.success("Product created successfully");
        setShowForm(false);
      }
    } catch (error) {
      toast.error("Error creating product");
      console.error("Error creating product:", error);
    } finally {
      setLoader(false);
    }
  };

  return (
    <div
      className="relative top-0 left-0 w-full   bg-opacity-50 z-50"
      style={{ background: "rgba(36, 35, 35, 0.301)" }}
    >
      <div className="fixed left-[10%]  bg-white shadow-lg shadow-gray-800 rounded-lg w-[80vw] h-[100vh] px-5 dark:bg-gray-900 dark:text-white dark:shadow-gray-200/100 overflow-y-scroll">
        <div className="flex justify-between items-center font-bold h-[5%] mb-2">
          <span className="font-bold">Enter Product Details</span>
          <span className="cursor-pointer" onClick={() => setShowForm(false)}>
            <FontAwesomeIcon icon={faX} />
          </span>
        </div>

        <div className=" w-full  flex flex-col border-2 rounded border-gray-800 px-7 py-3  dark:border-gray-400">
          <form onSubmit={handleSubmit} className=" gap-5  h-full">
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
              />
              <SelectBox
                label="Enter Sub Category"
                placeholder="Like 'Footballs'"
                data={data?.data?.subCategories || []}
                value={product.productSubCategory}
                onChange={(id) => {
                  handleProductChange("productSubCategory", id);
                }}
              />
            </div>

            {/* Color Variants Tabs */}
            <div className="flex flex-col gap-4 flex-grow py-5">
              <div className="flex justify-between items-center">
                <h3 className="font-bold">Color Variants / Item</h3>
                <button
                  type="button"
                  onClick={addColor}
                  className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
                  disabled={colors.length >= 10}
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
                    {colors.length > 1 && (
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
                    />

                    <div className="flex items-center  gap-4">
                      <div>
                              <InputBox
                        label="Color (e.g. Red, Blue)"
                        name="color"
                        type="text"
                        placeholder="Enter color name"
                        value={colors[activeColorTab].color}
                        onChange={(e) => handleColorChange(activeColorTab, e)}
                        required
                      />
                      </div>
          `      
                         <div>
                      <OptionBox
                        label="Gender"
                        placeholder="Choose"
                        name="gender"
                        value={colors[activeColorTab].gender}
                        onChange={(e) => handleColorChange(activeColorTab, e)}
                        data={["No","Men","Women","Boys","Girls"]}
                      />
                    </div>`
                    </div>
                 
                  </div>

                  <TextArea
                    label="Description"
                    name="productDescription"
                    value={colors[activeColorTab].productDescription}
                    onChange={(e) => handleColorChange(activeColorTab, e)}
                    editable={true}
                  />

                  <div className="flex items-center justify-around gap-3 w-[100%] h-[55vh] font-bold ">
                    <div className="h-[100%] w-[48%]  ">
                      <ImageBox
                        label="Cover Image"
                        images={colors[activeColorTab].coverImage}
                        editable={true}
                        onAddImages={(file) =>
                          handleCoverImageUpload(activeColorTab, file)
                        }
                        onDeleteImage={(file) =>
                          handleCoverImageDelete(activeColorTab, file)
                        }
                      />
                    </div>
                    <div className="h-[100%] w-[48%]  ">
                      <MultipleImageUploadBox
                        label="Product Images"
                        images={colors[activeColorTab].productImages}
                        editable={true}
                        maxImages={12}
                        onAddImages={(files) =>
                          handleImageUpload(activeColorTab, files)
                        }
                        onDeleteImage={(file) =>
                          handleImageDelete(activeColorTab, file)
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-bold">Sizes & Pricing</h4>
                      <button
                        type="button"
                        onClick={() => addSize(activeColorTab)}
                        className="text-white bg-green-600 hover:bg-green-700 px-2 py-1 rounded text-sm"
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
                          {sizeIndex > 0 && (
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
                          />

                          <InputBox
                            label="Size"
                            name="size"
                            type="text"
                            value={size.size}
                            onChange={(e) =>
                              handleSizeChange(activeColorTab, sizeIndex, e)
                            }
                            editable={true}
                          />
                          <InputBox
                            label="Stock"
                            name="stock"
                            type="number"
                            value={size.stock}
                            onChange={(e) =>
                              handleSizeChange(activeColorTab, sizeIndex, e)
                            }
                          />
                          <InputBox
                            label="Actual Price"
                            name="actualPrice"
                            type="number"
                            value={size.actualPrice}
                            onChange={(e) =>
                              handleSizeChange(activeColorTab, sizeIndex, e)
                            }
                          />
                          <InputBox
                            label="Offer Percentage(%)"
                            name="offerPercentage"
                            type="number"
                            value={size.offerPercentage}
                            onChange={(e) =>
                              handleSizeChange(activeColorTab, sizeIndex, e)
                            }
                          />
                          <InputBox
                            label="Offer Price"
                            name="offerPercentage"
                            type="number"
                            value={size.offerPrice}
                            editable={false}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end mt-4">
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
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProductForm;
