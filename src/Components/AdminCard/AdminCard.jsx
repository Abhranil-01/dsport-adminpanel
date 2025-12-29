import React, { useState } from "react";

function AdminCard({
  admin,
  myId,
  myEmail,
  myRole,
  onView,
  onDelete,
  onRoleChange,
}) {
  const isSelf = myId === admin._id;
  const isMeByEmail = myEmail === admin.email;
  const canEditRole = myRole === "superadmin" && !isSelf;

  const [pendingRole, setPendingRole] = useState(null);
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);

  return (
    <>
      {/* CARD */}
      <div className="border-2 border-white rounded-lg p-5 bg-gray-800
                      hover:-translate-y-1 hover:shadow-xl transition-all">
        {/* Avatar */}
        <img
          src={admin.avatar || "Images/avatar-general.png"}
          alt={admin.fullname}
          className="w-16 h-16 rounded-full mx-auto object-cover"
        />

        {/* Username */}
        <div
          className="mt-3 flex justify-center cursor-pointer"
          title="Click to copy username"
          onClick={() => navigator.clipboard.writeText(admin.username)}
        >
          <span className="px-3 py-0.5 text-sm font-semibold rounded-full 
                           bg-gray-900 border border-gray-700 
                           text-green-400 tracking-wide
                           hover:bg-gray-700 transition">
            {admin.username}
          </span>
        </div>

        {/* Name + Badges */}
        <h2 className="font-bold text-center mt-3 flex justify-center gap-2 items-center text-white flex-wrap">
          {admin.fullname}

          {admin.role === "superadmin" && (
            <span className="px-2 py-0.5 text-xs bg-purple-600 rounded">
              SUPER ADMIN
            </span>
          )}

          {admin.role === "admin" && (
            <span className="px-2 py-0.5 text-xs bg-blue-600 rounded">
              ADMIN
            </span>
          )}

          {isMeByEmail && (
            <span className="px-2 py-0.5 text-xs bg-green-600 rounded">
              YOU
            </span>
          )}
        </h2>

        {/* Email */}
        <p className="text-sm text-center text-gray-400">{admin.email}</p>

        {/* Role Selector */}
        <p className="mt-3 text-sm text-center text-white">
          Role:
          <select
            value={admin.role}
            disabled={!canEditRole || isUpdatingRole}
            onChange={(e) => setPendingRole(e.target.value)}
            className="ml-2 border px-2 py-1 rounded
                       disabled:opacity-50 bg-gray-900"
          >
            <option value="admin">Admin</option>
            <option value="superadmin">Super Admin</option>
          </select>
        </p>

        {/* Actions */}
        {myRole === "superadmin" && !isSelf && (
          <div className="flex justify-between mt-5">
            <button
              onClick={() => onDelete(admin)}
              className="text-red-500 hover:underline"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* ROLE CHANGE MODAL */}
      {pendingRole && pendingRole !== admin.role && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-gray-800 text-white rounded-lg p-6 w-96 shadow-xl">
            <h2 className="text-lg font-bold mb-3">Confirm Role Change</h2>

            <p className="mb-4 text-sm">
              Change role from{" "}
              <b>{admin.role.toUpperCase()}</b> →{" "}
              <b className="text-purple-400">
                {pendingRole.toUpperCase()}
              </b>
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setPendingRole(null)}
                disabled={isUpdatingRole}
                className="px-4 py-1 border rounded hover:bg-gray-200 hover:text-black"
              >
                Cancel
              </button>

              <button
                disabled={isUpdatingRole}
                onClick={async () => {
                  try {
                    setIsUpdatingRole(true);
                    await onRoleChange(
                      admin._id,
                      pendingRole,
                      admin.role
                    );
                    setPendingRole(null);
                  } finally {
                    setIsUpdatingRole(false);
                  }
                }}
                className="px-4 py-1 bg-purple-600 rounded flex items-center gap-2
                           disabled:opacity-60"
              >
                {isUpdatingRole ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Confirm"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AdminCard;
