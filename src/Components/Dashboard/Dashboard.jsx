import React from "react";
import {
  Users,
  ShieldCheck,
  Boxes,
  Layers,
  ListTree,
  IndianRupee,
  Truck,
  XCircle,
  Clock,
  Wallet,
  CreditCard,
} from "lucide-react";

import {
  useGetAllAdminsQuery,
  useGetCategoriesQuery,
  useGetSubCategoriesQuery,
  useGetAllOrdersQuery,
  useGetColorWiseProductsQuery,
  useGetMyProfileQuery,
} from "../../Services/fetchDataFromApi";

function Dashboard() {
  /* ================= PROFILE ================= */
  const { data: profileData, isLoading: profileLoading } =
    useGetMyProfileQuery();

  const role = profileData?.data?.role; // "admin" | "superadmin"

  /* ================= API CALLS ================= */
  const { data: adminsData } = useGetAllAdminsQuery({});
  const { data: productsData } = useGetColorWiseProductsQuery();
  const { data: categoriesData } = useGetCategoriesQuery();
  const { data: subCategoriesData } = useGetSubCategoriesQuery();
  const { data: ordersData } = useGetAllOrdersQuery();

  if (profileLoading) return null;

  /* ================= SAFE FALLBACKS ================= */
  const admins = adminsData?.data || [];
  const products = productsData?.colorItems || [];
  const categories = categoriesData?.data?.data || [];
  const subCategories = subCategoriesData?.data?.subCategories || [];
  const orders = ordersData?.data || [];

  /* ================= CALCULATIONS ================= */
  const totalAdmins = admins.filter((admin) => admin.role === "admin").length;

  const totalSuperAdmins = admins.filter(
    (admin) => admin.role === "superadmin"
  ).length;

  const totalSales = orders.reduce(
    (sum, order) =>
      order.paymentStatus === "Paid" && order.deliveryStatus === "Delivered"
        ? sum + order.totalPayableAmount
        : sum,
    0
  );

  const deliveredOrders = orders.filter(
    (o) => o.deliveryStatus === "Delivered"
  ).length;

  const cancelledOrders = orders.filter(
    (o) => o.orderStatus === "Cancelled"
  ).length;
  /* ================= EXTRA ORDER STATS ================= */

  // Pending orders (not delivered & not cancelled)
  const pendingOrders = orders.filter(
    (o) => o.orderStatus === "Active" && o.deliveryStatus !== "Delivered"
  ).length;

  // Payment mode counts
  const codOrders = orders.filter((o) => o.paymentMode === "COD").length;

  const razorpayOrders = orders.filter(
    (o) => o.paymentMode === "Razorpay"
  ).length;

  /* ================= DASHBOARD STATS ================= */
  const stats = [
    // 👑 SUPER ADMIN ONLY
    ...(role === "superadmin"
      ? [
          {
            title: "Total Admins",
            value: totalAdmins,
            icon: <Users />,
            color: "bg-blue-600",
          },
          {
            title: "Total Super Admins",
            value: totalSuperAdmins,
            icon: <ShieldCheck />,
            color: "bg-purple-600",
          },
        ]
      : []),

    {
      title: "Products",
      value: products.length,
      icon: <Boxes />,
      color: "bg-green-600",
    },
    {
      title: "Categories",
      value: categories.length,
      icon: <Layers />,
      color: "bg-indigo-600",
    },
    {
      title: "Sub Categories",
      value: subCategories.length,
      icon: <ListTree />,
      color: "bg-cyan-600",
    },
    {
      title: "Total Sales",
      value: `₹ ${totalSales.toLocaleString("en-IN")}`,
      icon: <IndianRupee />,
      color: "bg-emerald-600",
    },
    {
      title: "Delivered Orders",
      value: deliveredOrders,
      icon: <Truck />,
      color: "bg-teal-600",
    },

    {
      title: "Pending Orders",
      value: pendingOrders,
      icon: <Clock />,
      color: "bg-yellow-600",
    },
    {
      title: "COD Orders",
      value: codOrders,
      icon: <Wallet />,
      color: "bg-orange-600",
    },
    {
      title: "Razorpay Orders",
      value: razorpayOrders,
      icon: <CreditCard />,
      color: "bg-pink-600",
    },
    {
      title: "Cancelled Orders",
      value: cancelledOrders,
      icon: <XCircle />,
      color: "bg-red-600",
    },
  ];

  /* ================= UI ================= */
  return (
    <div className="sm:ml-45 min-h-screen p-6 dark:bg-gray-900 transition-all">
      <h1 className="text-2xl font-bold mb-6 dark:text-white">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5
                       hover:scale-105 transition-transform"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {item.title}
                </p>
                <h2 className="text-2xl font-bold dark:text-white mt-1">
                  {item.value}
                </h2>
              </div>

              <div className={`${item.color} text-white p-3 rounded-full`}>
                {item.icon}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
