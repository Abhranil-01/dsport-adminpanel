import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useGetMyProfileQuery } from "../Services/fetchDataFromApi";

const SuperAdminGuard = () => {
  const { data, isLoading } = useGetMyProfileQuery();
console.log(data);

  if (isLoading) {
    return <div className="p-6">Checking permissions...</div>;
  }

  const role = data?.data?.role;

  if (role !== "superadmin") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default SuperAdminGuard;
