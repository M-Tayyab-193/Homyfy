import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaHome, FaAirbnb, FaFacebook, FaGoogle, FaApple } from 'react-icons/fa';
import { toast } from 'react-toastify';
import supabase from '../supabase/supabase';
import { signInWithGoogle } from '../supabase/supabase';

function SignupPage() {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    fullname: '',
    phone: '',
    password: '',
    role: 'guest'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const { email, username, fullname, phone, password, role } = formData;
    
    if (!email || !username || !fullname || !phone || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      // Sign up using Supabase Auth
      const { data, error: signupError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            fullname,
            role,
          }
        }
      });

      const user = data?.user;

      if (signupError || !user) {
        throw new Error(signupError?.message || 'Unknown error during signup');
      }

      // Insert additional info into users table using RPC
      const {error: insertError } = await supabase.rpc('signup_user', {
        p_id : user.id,
        p_email: formData.email,
        p_username: formData.username,
        p_fullname: formData.fullname,
        p_phone: formData.phone,
        p_role: formData.role
      });

      if (insertError) {
        throw new Error(insertError.message);
      }else{
        
      toast.success('Successfully signed up! Please check your email for verification.');
      }

      navigate('/');
    } catch (err) {
      toast.error(err.message || 'Failed to create an account. Please try again.');
      setError(err.message || 'Failed to create an account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <FaHome className="text-airbnb-primary text-4xl mx-auto mb-4" />
          <h1 className="text-2xl font-bold">Sign up for Homyfy</h1>
        </div>
        
        <div className="bg-white rounded-xl shadow-card p-6 mb-6">
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Choose a username"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="fullname"
                value={formData.fullname}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mobile Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Enter your mobile number"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Create a password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Type
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="role"
                    value="guest"
                    checked={formData.role === 'guest'}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  Guest
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="role"
                    value="host"
                    checked={formData.role === 'host'}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  Host
                </label>
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full btn-primary"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Sign up'}
            </button>
          </form>
          
          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-gray-200"></div>
            <div className="px-3 text-gray-500 text-sm">or</div>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>
          
          <div className="space-y-3">
            <button className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <FaFacebook className="text-blue-600 mr-3" />
              <span>Continue with Facebook</span>
            </button>
            
            <button className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors" onClick={signInWithGoogle}>
              <FaGoogle className="text-red-500 mr-3" />
              <span>Continue with Google</span>
            </button>
            
            <button className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <FaApple className="mr-3" />
              <span>Continue with Apple</span>
            </button>
          </div>
        </div>
        
        <p className="text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-airbnb-primary hover:underline font-medium">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignupPage;
