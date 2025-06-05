import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaHome, FaAirbnb, FaFacebookF, FaGoogle, FaApple, FaUser, FaBuilding } from 'react-icons/fa';
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
      }

      toast.success('Successfully signed up! Please check your email for verification.');
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
          <FaHome className="text-green-500 text-4xl mx-auto mb-4" />
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
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Account Type
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label
                  className={`flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer transition-all ${
                    formData.role === 'guest'
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="guest"
                    checked={formData.role === 'guest'}
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                  <FaUser className="text-2xl mb-2 text-green-500" />
                  <span className="font-medium">Guest</span>
                  <span className="text-sm text-gray-500 text-center mt-1">
                    Book and experience stays
                  </span>
                </label>

                <label
                  className={`flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer transition-all ${
                    formData.role === 'host'
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="host"
                    checked={formData.role === 'host'}
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                  <FaBuilding className="text-2xl mb-2 text-green-500" />
                  <span className="font-medium">Host</span>
                  <span className="text-sm text-gray-500 text-center mt-1">
                    List and manage properties
                  </span>
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
              <FaFacebookF className="text-blue-600 mr-3" />
              <span>Continue with Facebook</span>
            </button>
            
            <button className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors" onClick={signInWithGoogle}>
              <FaGoogle className="text-green-500 mr-3" />
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
          <Link to="/login" className="text-green-500 hover:underline font-medium">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignupPage;