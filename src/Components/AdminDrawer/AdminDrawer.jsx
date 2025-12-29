import React from "react";

function AdminDrawer({ admin, onClose }) {
  if (!admin) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-end z-50">
      <div className="w-96 bg-white p-6 animate-slideIn shadow-xl">
        <button
          onClick={onClose}
          className="float-right text-lg font-bold hover:scale-110 transition"
        >
          ✕
        </button>

        <img
          src={admin.avatar || "/default-avatar.png"}
          className="w-32 h-32 rounded-full mx-auto object-cover mt-4"
        />

        <h2 className="text-xl font-bold text-center mt-4">
          {admin.fullname}
        </h2>

        <p className="text-center text-sm">{admin.email}</p>
        <p className="text-center text-sm">{admin.phonenumber}</p>

        <p className="mt-4 text-center font-semibold">
          Role: {admin.role}
        </p>
      </div>
    </div>
  );
}

export default AdminDrawer;
