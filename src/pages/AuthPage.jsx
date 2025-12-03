import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";

import {
  FaHome,
  FaFacebook,
  FaGoogle,
  FaApple,
  FaEnvelope,
  FaUser,
  FaBuilding,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { toast } from "react-toastify";
import supabase from "../supabase/supabase";
import { signInWithGoogle } from "../supabase/supabase";

function AuthPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "guest",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = location.state?.from || "/";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const { data, error: loginError } =
        await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

      if (loginError) {
        if (loginError.message === "Invalid login credentials") {
          toast.error("Incorrect email or password. Please try again.");
        } else if (loginError.message === "Email not confirmed") {
          toast.error("Please confirm your email before logging in.");
        } else {
          toast.error("Authentication failed. Please try again later.");
        }
        setError(loginError.message);
        return;
      }

      const { data: userRoleData, error: roleError } = await supabase.rpc(
        "login_user",
        {
          input_email: formData.email,
          expected_role: formData.role,
        }
      );

      if (roleError) {
        await supabase.auth.signOut();
        toast.error(roleError.message);
        return;
      }

      toast.success("Successfully logged in!");
      navigate(redirectPath);
    } catch (err) {
      toast.error(err.message || "Authentication failed. Please try again.");
      setError(err.message || "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!resetEmail) {
      toast.error("Please enter your email address");
      return;
    }

    setLoading(true);

    try {
      const { data: exists, error: checkError } = await supabase.rpc(
        "check_user_exists",
        {
          email_input: resetEmail,
        }
      );

      if (checkError) throw checkError;

      if (!exists) {
        toast.error("No account found with this email. Please sign up first.");
        return;
      }

      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast.success("Password reset link sent to your email!");
      setShowResetPassword(false);
      setResetEmail("");
    } catch (err) {
      toast.error(err.message || "Failed to send reset password email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex justify-center items-center px-4 py-12">
      

      <motion.div 
        className="w-full max-w-md relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-card-hover p-8 mb-6 border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.div 
            className="text-center mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
          >
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
              {showResetPassword ? "Reset Password" : "Welcome Back"}
            </h1>
            <p className="text-gray-600 mt-2">
              {showResetPassword ? "Enter your email to reset password" : "Log in to continue your journey"}
            </p>
          </motion.div>
          {error && (
            <motion.div 
              className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 flex items-start gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <span className="text-red-500 text-xl">⚠️</span>
              <span>{error}</span>
            </motion.div>
          )}

          {showResetPassword ? (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0F1520] focus:ring-4 focus:ring-gray-200 transition-all"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <motion.button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-[#0F1520] to-[#1a2332] text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
                disabled={loading}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.div
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    Sending...
                  </span>
                ) : "Send Reset Link"}
              </motion.button>

              <motion.button
                type="button"
                onClick={() => setShowResetPassword(false)}
                className="w-full text-[#0F1520] hover:text-[#0F1520] font-medium py-2"
                whileHover={{ scale: 1.02 }}
              >
                ← Back to Login
              </motion.button>
            </form>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0F1520] focus:ring-4 focus:ring-gray-200 transition-all"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0F1520] focus:ring-4 focus:ring-gray-200 transition-all"
                      placeholder="Enter your password"
                    />
                    <motion.button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                 
                      
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </motion.button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Account Type
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <motion.label
                      className={`flex flex-col items-center justify-center p-5 border-2 rounded-xl cursor-pointer transition-all ${
                        formData.role === "guest"
                          ? "border-[#0F1520] bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg"
                          : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                      }`}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <input
                        type="radio"
                        name="role"
                        value="guest"
                        checked={formData.role === "guest"}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <motion.div
                        animate={formData.role === "guest" ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <FaUser className="text-3xl mb-2 text-[#0F1520]" />
                      </motion.div>
                      <span className="font-bold text-gray-900">Guest</span>
                      <span className="text-xs text-gray-500 text-center mt-1">
                        Book amazing stays
                      </span>
                    </motion.label>

                    <motion.label
                      className={`flex flex-col items-center justify-center p-5 border-2 rounded-xl cursor-pointer transition-all ${
                        formData.role === "host"
                          ? "border-[#0F1520] bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg"
                          : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                      }`}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <input
                        type="radio"
                        name="role"
                        value="host"
                        checked={formData.role === "host"}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <motion.div
                        animate={formData.role === "host" ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <FaBuilding className="text-3xl mb-2 text-[#0F1520]" />
                      </motion.div>
                      <span className="font-bold text-gray-900">Host</span>
                      <span className="text-xs text-gray-500 text-center mt-1">
                        List properties
                      </span>
                    </motion.label>
                  </div>
                </div>

                <div className="flex justify-end">
                  <motion.button
                    type="button"
                    onClick={() => setShowResetPassword(true)}
                    className="text-[#0F1520] hover:text-[#0F1520] font-medium text-sm"
                    whileHover={{ scale: 1.05 }}
                  >
                    Forgot password?
                  </motion.button>
                </div>

                <motion.button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-[#0F1520] to-[#1a2332] text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
                  disabled={loading}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <motion.div
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      Logging in...
                    </span>
                  ) : "Log in"}
                </motion.button>
              </form>

              {/* <div className="flex items-center my-6">
                <div className="flex-grow border-t border-gray-300"></div>
                <div className="px-4 text-gray-500 text-sm font-medium">or continue with</div>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>

              <div className="space-y-3">
                <motion.button
                  className="w-full flex items-center justify-center py-3 px-4 border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all font-medium group"
                  onClick={signInWithGoogle}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaGoogle className="text-red-500 mr-3 text-xl" />
                  <span className="group-hover:text-gray-900 transition-colors">Continue with Google</span>
                </motion.button>
              </div> */}
            </>
          )}
        </motion.div>

        <motion.p 
          className="text-center text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-[#0F1520] hover:text-[#0F1520] font-bold underline"
          >
            Sign up
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}

export default AuthPage;
