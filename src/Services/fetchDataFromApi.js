import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { use } from "react";

export const fetchDataFromApi = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL + "/admin",
    credentials: "include", // HttpOnly cookies
  //    prepareHeaders: (headers) => {
  //   const token = localStorage.getItem("adminAccessToken");

  //   if (token) {
  //     headers.set("Authorization", `Bearer ${token}`);
  //   }

  //   return headers;
  // },
  }),

  tagTypes: [
    "Admin",
    "Category",
    "SubCategory",
    "Products",
    "Orders",
    "Reviews",
  ],

  endpoints: (builder) => ({
    /* ================= AUTH ================= */

    adminLogin: builder.mutation({
      query: (data) => ({
        url: "/login",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Admin"],
    }),

    adminLogout: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
      invalidatesTags: ["Admin"],
    }),

    refreshAdminToken: builder.mutation({
      query: () => ({
        url: "/refresh-token",
        method: "POST",
      }),
    }),

    /* ================= ADMIN PROFILE ================= */

    getMyProfile: builder.query({
      query: () => "/me",
      providesTags: ["Admin"],
    }),

    forgotPassword: builder.mutation({
      query: (body) => ({
        url: "/forgot-password",
        method: "POST",
        body,
      }),
    }),

    resetPassword: builder.mutation({
      query: (body) => ({
        url: "/reset-password",
        method: "POST",
        body,
      }),
    }),

    updateMyProfile: builder.mutation({
      query: (formData) => ({
        url: "/me/profile",
        method: "put",
        body: formData,
      }),
      invalidatesTags: ["Admin"],
    }),

    /* ================= SUPER ADMIN → ADMIN MANAGEMENT ================= */

    createAdmin: builder.mutation({
      query: (data) => ({
        url: "/create-admin",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Admin"],
    }),

    getAllAdmins: builder.query({
      query: ({ search = "", role = "" }) => {
        const params = new URLSearchParams();

        if (search) params.append("search", search);
        if (role) params.append("role", role);

        return `/admins?${params.toString()}`;
      },
      providesTags: ["Admin"],
    }),

    updateAdminRole: builder.mutation({
      query: ({ id, role }) => ({
        url: `/admin-role/${id}`,
        method: "put",
        body: { role },
      }),
      invalidatesTags: ["Admin"],
    }),

    deleteAdmin: builder.mutation({
      query: (id) => ({
        url: `/admin/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Admin"],
    }),

    /* ================= CATEGORY ================= */

    createCategory: builder.mutation({
      query: (formData) => ({
        url: "/category",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Category"],
    }),

    getCategories: builder.query({
      query: (params) => ({
        url: "/category",
        params,
      }),
      providesTags: ["Category"],
    }),

    getCategoryById: builder.query({
      query: (id) => `/category/${id}`,
      providesTags: ["Category"],
    }),

    updateCategory: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/category/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Category"],
    }),

    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/category/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category"],
    }),

    deleteCategoryImage: builder.mutation({
      query: (id) => ({
        url: `/category-image/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category"],
    }),

    /* ================= SUB CATEGORY ================= */

    createSubCategory: builder.mutation({
      query: (formData) => ({
        url: "/subcategory",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["SubCategory"],
    }),

    getSubCategories: builder.query({
      query: (params) => ({
        url: "/subcategory",
        params,
      }),
      providesTags: ["SubCategory"],
    }),

    getSubCategoryById: builder.query({
      query: (id) => `/subcategory-byid/${id}`,
      providesTags: ["SubCategory"],
    }),

    updateSubCategory: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/subcategory/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["SubCategory"],
    }),

    deleteSubCategory: builder.mutation({
      query: (id) => ({
        url: `/subcategory/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SubCategory"],
    }),

    /* ================= PRODUCTS ================= */

    createProduct: builder.mutation({
      query: (formData) => ({
        url: "/product",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Products"],
    }),

    getProducts: builder.query({
      query: (params) => ({
        url: "/products",
        params,
      }),
      providesTags: ["Products"],
    }),

    getProductById: builder.query({
      query: (id) => `/product/${id}`,
      providesTags: ["Products"],
    }),

    updateProduct: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/product/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Products"],
    }),

    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/product/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),

    /* ================= COLOR WISE ================= */

    getColorWiseProducts: builder.query({
      query: (params) => ({
        url: "/colorwise-items",
        params,
      }),
      providesTags: ["Products"],
    }),
getReviewsColorWiseProducts: builder.query({
  query: (params) => ({
    url: "/colorwise-items",
    params,
  }),
  providesTags: (result) =>
    result?.colorItems
      ? [
          { type: "Reviews", id: "LIST" },
          ...result.colorItems.map((item) => ({
            type: "Reviews",
            id: item._id, // productcolorId
          })),
        ]
      : [{ type: "Reviews", id: "LIST" }],
}),


getColorWiseProductById: builder.query({
  query: (id) => `/single-colorwise/${id}`,
  providesTags: (result, error, id) => [
    { type: "Reviews", id }, // ✅ NOT Products
  ],
}),


    /* ================= ORDERS ================= */
    getAllOrders: builder.query({
      query: ({
        search,
        orderStatus,
        paymentStatus,
        deliveryStatus,
        paymentMode,
      } = {}) => {
        const params = new URLSearchParams();

        if (search) params.append("search", search);
        if (orderStatus) params.append("orderStatus", orderStatus);
        if (paymentStatus) params.append("paymentStatus", paymentStatus);
        if (deliveryStatus) params.append("deliveryStatus", deliveryStatus);
        if (paymentMode) params.append("paymentMode", paymentMode);

        return `/orders?${params.toString()}`;
      },

      providesTags: (result) =>
        result?.data
          ? [
              { type: "Orders", id: "LIST" },
              ...result.data.map((order) => ({
                type: "Orders",
                id: order._id,
              })),
            ]
          : [{ type: "Orders", id: "LIST" }],

      // 🔥 CRITICAL
      refetchOnMountOrArgChange: true,
    }),

    getOrderById: builder.query({
      query: (id) => `/order/${id}`,
      providesTags: ["Orders"],
    }),

    updateOrder: builder.mutation({
      query: ({ id, deliveryStatus, paymentStatus }) => ({
        url: `/order/${id}`,
        method: "PUT",
        body: { deliveryStatus, paymentStatus },
      }),
      invalidatesTags: ["Orders"],
    }),
    getAllReviews: builder.query({
      query: (params) => ({
        url: "/all-reviews",
        params,
      }),
      providesTags: ["Reviews"],
    }),
generateDescription: builder.mutation({
  query: (prompt) => ({
    url: "/generate-description",
    method: "POST",
    body: { prompt },
  }),
}),

  }),
});
export const {
  useAdminLoginMutation,
  useAdminLogoutMutation,
  useRefreshAdminTokenMutation,

  useGetMyProfileQuery,
  useUpdateMyPasswordMutation,
  useUpdateMyProfileMutation,

  useCreateAdminMutation,
  useGetAllAdminsQuery,
  useUpdateAdminRoleMutation,
  useDeleteAdminMutation,

  useCreateCategoryMutation,
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useDeleteCategoryImageMutation,

  useCreateSubCategoryMutation,
  useGetSubCategoriesQuery,
  useGetSubCategoryByIdQuery,
  useUpdateSubCategoryMutation,
  useDeleteSubCategoryMutation,

  useCreateProductMutation,
  useGetProductsQuery,
  useGetProductByIdQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,

  useGetColorWiseProductsQuery,
  useGetColorWiseProductByIdQuery,

  useGetAllOrdersQuery,
  useGetOrderByIdQuery,
  useUpdateOrderMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetAllReviewsQuery,
  useGetReviewsColorWiseProductsQuery,

  useGenerateDescriptionMutation,
} = fetchDataFromApi;
