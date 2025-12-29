import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useGetMyProfileQuery } from "../Services/fetchDataFromApi";

const AdminAuthGuard = () => {
  const { data, isLoading, isError } = useGetMyProfileQuery();
console.log("profile",data);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Checking authentication...
      </div>
    );
  }

  // ❌ Not logged in
  if (isError || !data?.data) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};

export default AdminAuthGuard;
