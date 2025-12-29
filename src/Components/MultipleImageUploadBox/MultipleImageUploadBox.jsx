import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faImage } from "@fortawesome/free-solid-svg-icons";
import ImageUpload from "../ImageUpload/ImageUpload";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import MultipleImageUpload from "../MultipleImageUpload/MultipleImageUpload";

function MultipleImageUploadBox({
  images = [],
  onDeleteImage,
  onAddImages,
  editable = false,
  maxImages = 1,
  label = "Image",
}) {
  const [showUploadSection, setShowUploadSection] = useState(false);

  const addImages = (newFiles) => {
    if (images.length >= maxImages) {
      alert(`You can upload only ${maxImages} image(s).`);
      return;
    }

    const newImages = newFiles
      .slice(0, maxImages - images.length)
      .map((file) => ({
        _id: Date.now() + Math.random().toString(), // temporary local id
        file,
      }));

    if (onAddImages) {
      onAddImages(newImages);
    }
  };

  const handleDeleteImage = (image) => {
    // Backend image → has a `url` and probably an `_id`
    if (image.url && image._id && onDeleteImage) {
      onDeleteImage({
        type: "backend",
        id: image._id,
        url: image.url,
      });
    }

    // Local image → has a `file` only
    if (image.file && onDeleteImage) {
      onDeleteImage({
        type: "local",
        id: image._id, // just local temp id
      });
    }
  };

  return (
    <div className="w-[100%] h-[100%]">
      <div className="mb-2">
        <label>{label}</label>
      </div>
      <div className="h-[85%] border-2 border-gray-400 rounded p-1">
        {images?.length > 0 ? (
          <Swiper
            navigation
            modules={[Navigation, Pagination]}
            className="mySwiper rounded w-full h-full"
          >
            {images.map((image) => (
              <SwiperSlide key={image._id || image.name}>
                <div className="relative w-full h-full">
                  <img
                    src={
                      image.file ? URL.createObjectURL(image.file) : image.url
                    }
                    alt="image"
                    className="w-full h-full object-contain"
                  />
                  {editable && (
                    <div className="absolute inset-0 z-50 flex items-end bg-black bg-opacity-30">
                      <div className="flex justify-end w-full py-2 px-5 text-white">
                        <div
                          className="cursor-pointer"
                          onClick={() => handleDeleteImage(image)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </SwiperSlide>
            ))}

            {images.length < maxImages && (
              <SwiperSlide>
                <div
                  className="h-full flex flex-col items-center justify-center gap-2 cursor-pointer "
                  onClick={() => setShowUploadSection(true)}
                >
                  <span className="text-[28px]">
                    <FontAwesomeIcon icon={faImage} />
                  </span>
                  <span>Click To Upload Image</span>
                </div>
              </SwiperSlide>
            )}
          </Swiper>
        ) : (
          <div
            className="h-full flex flex-col items-center justify-center gap-2 cursor-pointer "
            onClick={() => setShowUploadSection(true)}
          >
            <span className="text-[28px]">
              <FontAwesomeIcon icon={faImage} />
            </span>
            <span>Click To Upload Image</span>
          </div>
        )}
      </div>

      {showUploadSection && (
        <MultipleImageUpload
          setShowUplodSection={setShowUploadSection}
          onAddImages={addImages}
        />
      )}
    </div>
  );
}

export default MultipleImageUploadBox;
