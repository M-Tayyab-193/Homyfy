import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaHome,
  FaAirbnb,
  FaFacebookF,
  FaGoogle,
  FaApple,
  FaUser,
  FaBuilding,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaUserCircle,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { toast } from "react-toastify";
import supabase, { signInWithGoogle } from "../supabase/supabase";

function SignupPage() {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    fullname: "",
    phone: "",
    password: "",
    role: "guest",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

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

    const { email, username, fullname, phone, password, role } = formData;

    if (!email || !username || !fullname || !phone || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const { data, error: signupError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            fullname,
            role,
          },
        },
      });

      const user = data?.user;

      if (signupError || !user) {
        throw new Error(signupError?.message || "Unknown error during signup");
      }

      const { error: insertError } = await supabase.rpc("signup_user", {
        p_id: user.id,
        p_email: formData.email,
        p_username: formData.username,
        p_fullname: formData.fullname,
        p_phone: formData.phone,
        p_role: formData.role,
      });

      if (insertError) {
        throw new Error(insertError.message);
      }

      toast.success(
        "Successfully signed up! Please check your email for verification."
      );
      navigate("/");
    } catch (err) {
      toast.error(
        err.message || "Failed to create an account. Please try again."
      );
      setError(err.message || "Failed to create an account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex justify-center items-center px-4 py-12 mt-[45px]">
      

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
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
            Sign Up
          </h1>
          <p className="text-gray-600 mt-2">
            Create your account and start your journey
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

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
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

            {/* Username */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <FaUserCircle className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0F1520] focus:ring-4 focus:ring-gray-200 transition-all"
                  placeholder="Choose a unique username"
                />
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0F1520] focus:ring-4 focus:ring-gray-200 transition-all"
                  placeholder="John Doe"
                />
              </div>
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Mobile Number
              </label>
              <div className="relative">
                <FaPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0F1520] focus:ring-4 focus:ring-gray-200 transition-all"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            {/* Password */}
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
                  placeholder="Create a strong password"
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

            {/* Account Type */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Account Type
              </label>
              <div className="grid grid-cols-2 gap-4">
                {/* Guest */}
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

                {/* Host */}
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

            {/* Submit */}
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
                  Creating account...
                </span>
              ) : "Create Account"}
            </motion.button>
          </form>

          {/* Divider
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-300" />
            <div className="px-4 text-gray-500 text-sm font-medium">or sign up with</div>
            <div className="flex-grow border-t border-gray-300" />
          </div> */}

          {/* OAuth
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
        </motion.div>

        {/* Footer */}
        <motion.p 
          className="text-center text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[#0F1520] hover:text-[#0F1520] font-bold underline"
          >
            Log in
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}

export default SignupPage;
