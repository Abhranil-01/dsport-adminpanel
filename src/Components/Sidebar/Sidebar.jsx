import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faUsers,
  faList,
  faLayerGroup,
  faBox,
  faShoppingCart,
  faStar,
  faRightFromBracket,
  faUserPen,
} from "@fortawesome/free-solid-svg-icons";

import {
  useGetMyProfileQuery,
  useAdminLogoutMutation,
} from "../../Services/fetchDataFromApi";

import EditProfileModal from "../EditProfileModal/EditProfileModal";

function Sidebar() {
  const navigate = useNavigate();

  const { data, isLoading } = useGetMyProfileQuery();
  const [adminLogout] = useAdminLogoutMutation();

  const [openProfileModal, setOpenProfileModal] = useState(false);

  const admin = data?.data;
  const role = admin?.role; // "admin" | "superadmin"

  const menuItems = [
    { name: "Dashboard", path: "/", icon: faHouse },

    // 👑 SUPER ADMIN ONLY
    {
      name: "Admins",
      path: "/admins",
      icon: faUsers,
      roles: ["superadmin"], // ✅ FIXED
    },

    { name: "Categories", path: "/categories", icon: faList },
    { name: "Sub Categories", path: "/subCategories", icon: faLayerGroup },
    { name: "Products", path: "/products", icon: faBox },
    { name: "Orders", path: "/orders", icon: faShoppingCart },
    { name: "Reviews", path: "/reviews", icon: faStar },
  ];

  if (isLoading) return null;

  const handleLogout = async () => {
    try {
      // localStorage.removeItem("adminAccessToken");
      // localStorage.removeItem("adminRefreshToken");
      localStorage.removeItem("admin_meta");
      await adminLogout().unwrap();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <>
      <aside className="fixed top-0 left-0 z-40 w-48 h-screen border-e-2 border-gray-300 bg-gray-900 text-white flex flex-col">
        {/* 🔷 BRAND */}
        <div className="h-16 flex items-center justify-center border-b border-gray-700">
          <h1 className="text-xl font-bold tracking-wide text-white">
            DsportAdmin
          </h1>
        </div>

        {/* 🔷 MENU */}
        <div className="flex-1 px-3 py-4 overflow-y-auto">
          <ul className="space-y-2 font-medium">
            {menuItems.map((item) => {
              if (item.roles && !item.roles.includes(role)) return null;

              return (
                <li key={item.name}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center p-2 rounded-lg transition
                      ${
                        isActive
                          ? "bg-[#5006d8] text-white"
                          : "text-gray-300 hover:bg-[#5006d8] hover:text-white"
                      }`
                    }
                  >
                    <FontAwesomeIcon icon={item.icon} className="w-5 h-5" />
                    <span className="ms-3">{item.name}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </div>

        {/* 🔷 PROFILE SECTION */}
        <div className="border-t border-gray-700 p-3">
          <div className="flex items-center gap-3 mb-3">
            <img
              src={admin?.avatar || "/default-avatar.png"}
              alt="profile"
              className="w-10 h-10 rounded-full object-cover border"
            />
            <div>
              <p className="text-sm font-semibold truncate">
                {admin?.fullname}
              </p>

              {role === "superadmin" && (
                <span className="px-2 py-0.5 text-xs bg-purple-600 rounded">
                  SUPER ADMIN
                </span>
              )}

              {role === "admin" && (
                <span className="px-2 py-0.5 text-xs bg-blue-600 rounded">
                  ADMIN
                </span>
              )}
            </div>
          </div>

          {/* ✏️ Edit Profile */}
          <button
            onClick={() => setOpenProfileModal(true)}
            className="w-full flex items-center gap-2 text-sm p-2 rounded-md hover:bg-gray-800 transition"
          >
            <FontAwesomeIcon icon={faUserPen} />
            Edit Profile
          </button>

          {/* 🚪 Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 text-sm p-2 mt-1 rounded-md text-red-400 hover:bg-gray-800 transition"
          >
            <FontAwesomeIcon icon={faRightFromBracket} />
            Logout
          </button>
        </div>
      </aside>

      {/* 🔷 EDIT PROFILE MODAL */}
      <EditProfileModal
        isOpen={openProfileModal}
        onClose={() => setOpenProfileModal(false)}
        admin={admin}
      />
    </>
  );
}

export default Sidebar;
