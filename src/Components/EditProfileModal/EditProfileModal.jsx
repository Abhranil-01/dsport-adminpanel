import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useUpdateMyProfileMutation } from "../../Services/fetchDataFromApi";
import { toast } from "react-toastify";

function EditProfileModal({ isOpen, onClose, admin }) {
  const [fullname, setFullname] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);

  const [updateMyProfile, { isLoading }] =
    useUpdateMyProfileMutation();

  useEffect(() => {
    if (admin) {
      setFullname(admin.fullname || "");
      setPreview(admin.avatar || null);
    }
  }, [admin]);

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setAvatar(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    if (fullname) formData.append("fullname", fullname);
    if (avatar) formData.append("avatar", avatar);

    try {
      await updateMyProfile(formData).unwrap();
      toast.success("Profile updated successfully");
      onClose();
    } catch (err) {
      toast.error(err?.data?.message || "Update failed");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-gray-700 text-white rounded-lg w-[420px] p-5 relative">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <X size={20} />
        </button>

        <h2 className="text-lg font-semibold mb-4 text-white">
          Edit Profile
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Avatar */}
          <div className="flex flex-col items-center gap-3">
            <img
              src={preview || "/default-avatar.png"}
              alt="avatar"
              className="w-24 h-24 rounded-full object-cover border"
            />

            <label className="text-sm cursor-pointer bg-white text-purple-700 px-3 py-1 rounded-md hover:bg-purple-100">
              Change Avatar
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageChange}
              />
            </label>
          </div>

          {/* Full Name (editable) */}
          <div>
            <label className="text-sm font-medium">
              Full Name
            </label>
            <input
              type="text"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              className="w-full border rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-[#5006d8]"
            />
          </div>

          {/* Email (read-only) */}
          <div>
            <label className="text-sm font-medium  text-white">
              Email
            </label>
            <input
              type="text"
              value={admin?.email || ""}
              disabled
              className="w-full border rounded-md px-3 py-2 mt-1 bg-gray-100 text-gray-700 cursor-not-allowed"
            />
          </div>

          {/* Username (read-only) */}
          <div>
            <label className="text-sm font-medium text-white">
              Username
            </label>
            <input
              type="text"
              value={admin?.username || ""}
              disabled
              className="w-full border rounded-md px-3 py-2 mt-1 bg-gray-100 text-gray-700 cursor-not-allowed"
            />
          </div>

          {/* Role (read-only) */}
          <div>
            <label className="text-sm font-medium text-white">
              Role
            </label>
            <input
              type="text"
              value={admin?.role || ""}
              disabled
              className="w-full border rounded-md px-3 py-2 mt-1 bg-gray-100 text-gray-700 capitalize cursor-not-allowed"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-md border"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm rounded-md bg-[#5006d8] text-white disabled:opacity-50"
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfileModal;
