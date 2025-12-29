import React, { useState } from "react";
import AdminCard from "../AdminCard/AdminCard";
import AdminDrawer from "../AdminDrawer/AdminDrawer";
import AddAdminModal from "../AddAdminModal/AddAdminModal";
import {
  useGetAllAdminsQuery,
  useDeleteAdminMutation,
  useGetMyProfileQuery,
  useUpdateAdminRoleMutation,
} from "../../Services/fetchDataFromApi";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";

function Admins() {
  const { data: myProfile } = useGetMyProfileQuery();
  const myRole = myProfile?.data?.role;
  const myId = myProfile?.data?._id;
  const myEmail = myProfile?.data?.email;

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const { data: adminsData, isLoading } = useGetAllAdminsQuery({
    search,
    role: myRole === "superadmin" ? roleFilter : "",
  });

  const [deleteAdmin] = useDeleteAdminMutation();
  const [updateAdminRole] = useUpdateAdminRoleMutation();

  const [drawerAdmin, setDrawerAdmin] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const admins = adminsData?.data || [];

  const handleRoleChange = async (id, newRole, oldRole) => {
    try {
      await updateAdminRole({ id, role: newRole }).unwrap();
      toast.success("Role updated successfully");
    } catch (err) {
      toast.error(err?.data?.message || "Role update failed");
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteAdmin(deleteTarget._id).unwrap();
      toast.success("Admin deleted successfully");
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err?.data?.message || "Delete failed");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="sm:ml-45 min-h-screen bg-gray-900 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Admins</h1>

        {myRole === "superadmin" && (
          <button
            onClick={() => setOpenModal(true)}
            className="bg-purple-600 text-white px-5 py-2 rounded flex gap-2
                       hover:scale-105 transition shadow-lg"
          >
            Add Admin <FontAwesomeIcon icon={faPlusCircle} />
          </button>
        )}
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border px-4 py-2 rounded w-full mb-4 bg-gray-800 text-white"
      />

      {/* Admin List */}
      {isLoading ? (
        <p className="text-center text-white">Loading...</p>
      ) : admins.length === 0 ? (
        <p className="text-center text-white">No admins found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {admins.map((admin) => (
            <AdminCard
              key={admin._id}
              admin={admin}
              myId={myId}
              myEmail={myEmail}
              myRole={myRole}
              onView={setDrawerAdmin}
              onDelete={setDeleteTarget}
              onRoleChange={handleRoleChange}
            />
          ))}
        </div>
      )}

      <AdminDrawer admin={drawerAdmin} onClose={() => setDrawerAdmin(null)} />
      {openModal && <AddAdminModal onClose={() => setOpenModal(false)} />}

      {/* DELETE MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-96 shadow-xl text-white">
            <h2 className="text-lg font-bold text-red-500 mb-3">
              Confirm Delete
            </h2>

            <p className="mb-4">
              Delete admin:
              <br />
              <b className="text-blue-400">{deleteTarget.email}</b>
            </p>

            <div className="flex justify-end gap-3">
              <button
                disabled={isDeleting}
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-1 border rounded"
              >
                Cancel
              </button>

              <button
                disabled={isDeleting}
                onClick={handleDelete}
                className="px-4 py-1 bg-red-600 rounded flex items-center gap-2
                           disabled:opacity-60"
              >
                {isDeleting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admins;
