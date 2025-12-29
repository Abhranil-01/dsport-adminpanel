import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useAdminLoginMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} from "../../Services/fetchDataFromApi";
import { toast } from "react-toastify";

function AdminLogin() {
  const navigate = useNavigate();

  /* ================= API ================= */
  const [adminLogin, { isLoading }] = useAdminLoginMutation();
  const [forgotPassword, { isLoading: sendingOtp }] =
    useForgotPasswordMutation();
  const [resetPassword, { isLoading: resetting }] =
    useResetPasswordMutation();

  /* ================= STATES ================= */
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [showForgot, setShowForgot] = useState(false);
  const [step, setStep] = useState(1); // 1=email | 2=otp
  const [forgotForm, setForgotForm] = useState({
    email: "",
    otp: "",
    newPassword: "",
  });

  /* ================= HANDLERS ================= */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleForgotChange = (e) =>
    setForgotForm({ ...forgotForm, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await adminLogin(form).unwrap();
      const admin = res.data;

localStorage.setItem("adminRefreshToken", admin.refreshToken );
localStorage.setItem("adminAccessToken", admin.accessToken );
      localStorage.setItem(
        "admin_meta",
        JSON.stringify({
          role: admin.role,
          email: admin.email,
          fullname: admin.fullname,
          avatar: admin.avatar || "",
        })
      );

      toast.success("Admin logged in successfully");
      navigate("/categories", { replace: true });
    } catch (err) {
      toast.error(err?.data?.message || "Login failed");
    }
  };

  const sendOtp = async () => {
    try {
      await forgotPassword({ email: forgotForm.email }).unwrap();
      toast.success("OTP sent to your email");
      setStep(2);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to send OTP");
    }
  };

  const resetPass = async () => {
    try {
      await resetPassword(forgotForm).unwrap();
      toast.success("Password reset successful");
      setShowForgot(false);
      setStep(1);
      setForgotForm({ email: "", otp: "", newPassword: "" });
    } catch (err) {
      toast.error(err?.data?.message || "Invalid OTP");
    }
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen flex items-center justify-center    bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-700 text-white p-8 rounded shadow-md w-96 relative"
      >
        <h2 className="text-2xl font-bold text-center mb-6">
          Admin Login
        </h2>

        <input
          type="text"
          name="identifier"
          placeholder="Email or Username"
          value={form.identifier}
          onChange={handleChange}
          required
          className="w-full mb-4 p-2 border rounded text-white"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full mb-2 p-2 border rounded text-white"
        />

        <p
          onClick={() => setShowForgot(true)}
          className="text-sm text-white cursor-pointer mb-4 hover:underline"
        >
          Forgot password?
        </p>

        <button
          disabled={isLoading}
          className="w-full bg-blue-800 text-white py-2 rounded font-bold"
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>

        {/* FORGOT PASSWORD MODAL */}
        {showForgot && (
          <div className="absolute inset-0 bg-gray-700 p-6 rounded animate-fadeIn">
            <h3 className="text-xl font-bold mb-4 text-center">
              Forgot Password
            </h3>

            {step === 1 && (
              <>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter registered email"
                  value={forgotForm.email}
                  onChange={handleForgotChange}
                  className="w-full mb-4 p-2 border rounded"
                />

                <button
                  type="button"
                  disabled={sendingOtp}
                  onClick={sendOtp}
                  className="w-full bg-purple-600 text-white py-2 rounded"
                >
                  {sendingOtp ? "Sending OTP..." : "Send OTP"}
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <input
                  type="text"
                  name="otp"
                  placeholder="Enter OTP"
                  value={forgotForm.otp}
                  onChange={handleForgotChange}
                  className="w-full mb-3 p-2 border rounded"
                />

                <input
                  type="password"
                  name="newPassword"
                  placeholder="New Password"
                  value={forgotForm.newPassword}
                  onChange={handleForgotChange}
                  className="w-full mb-4 p-2 border rounded"
                />

                <button
                  type="button"
                  disabled={resetting}
                  onClick={resetPass}
                  className="w-full bg-green-600 text-white py-2 rounded"
                >
                  {resetting ? "Resetting..." : "Reset Password"}
                </button>
              </>
            )}

            <button
              type="button"
              onClick={() => {
                setShowForgot(false);
                setStep(1);
              }}
              className="mt-4 text-sm text-gray-300 hover:underline block mx-auto"
            >
              Back to Login
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

export default AdminLogin;
