import React, { useState } from "react";
import { useCreateAdminMutation } from "../../Services/fetchDataFromApi";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

function AddAdminModal({ onClose }) {
  const [createAdmin, { isLoading }] = useCreateAdminMutation();

  const [form, setForm] = useState({
    fullname: "",
    email: "",
    password: "",
    role: "admin",
  });

  const [showPassword, setShowPassword] = useState(false);

  const submit = async () => {
    try {
      await createAdmin(form).unwrap();
      toast.success("Admin created successfully");
      onClose();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to create admin");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-gray-800 text-white p-6 rounded-xl w-96 shadow-xl animate-scaleIn">
        <h2 className="text-xl font-bold mb-5 text-center">
          Add New Admin
        </h2>

        {/* Fullname */}
        <input
          placeholder="Full Name"
          type="text"
          className="border w-full mb-3 px-3 py-2 rounded bg-gray-900 focus:outline-none focus:ring-2 focus:ring-green-600"
          onChange={(e) =>
            setForm({ ...form, fullname: e.target.value })
          }
        />

        {/* Email */}
        <input
          placeholder="Email"
          type="email"
          className="border w-full mb-3 px-3 py-2 rounded bg-gray-900 focus:outline-none focus:ring-2 focus:ring-green-600"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        {/* Password with Eye Toggle */}
        <div className="relative mb-4">
          <input
            placeholder="Password"
            type={showPassword ? "text" : "password"}
            className="border w-full px-3 py-2 rounded bg-gray-900 pr-10
                       focus:outline-none focus:ring-2 focus:ring-green-600"
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2
                       text-gray-400 hover:text-white transition"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Role */}
        <select
          className="border w-full mb-5 bg-gray-900 px-3 py-2 rounded
                     focus:outline-none focus:ring-2 focus:ring-green-600"
          onChange={(e) =>
            setForm({ ...form, role: e.target.value })
          }
        >
          <option value="admin">Admin</option>
          <option value="superadmin">Super Admin</option>
        </select>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border border-gray-500
                       hover:bg-gray-600 transition"
          >
            Cancel
          </button>

          <button
            onClick={submit}
            disabled={isLoading}
            className="px-4 py-2 rounded bg-green-600 text-white
                       hover:bg-green-700 transition
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Creating..." : "Create Admin"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddAdminModal;
