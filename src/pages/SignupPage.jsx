import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaAirbnb, FaFacebook, FaGoogle, FaApple } from 'react-icons/fa';
import { toast } from 'react-toastify';
import supabase from '../supabase/supabase';

function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!name || !email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      // 1. Check if email already exists
      const { data: existingUser, error: existingUserError } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .maybeSingle();

      if (existingUser) {
        toast.error('An account with this email already exists. Please log in.');
        setLoading(false);
        return;
      }

      // 2. Signup using Supabase Auth
     const { data, error: signupError } = await supabase.auth.signUp({
  email,
  password,
  options: {
    data: {
      name,
      role: 'guest',
    },
    redirectTo: 'https://localhost:3000/', // Specify the redirect URL after email verification
  }
});


      const user = data?.user;

      if (signupError || !user) {
        throw new Error(signupError?.message || 'Unknown error during signup');
      }

      // 3. Insert additional info into `users` table
      const { error: insertError } = await supabase
        .from('users')
        .insert([
          {
            id: user.id,
            email,
            username: email.split('@')[0],
            fullname: name,
            phone: '',
            role: 'guest',
            profile_image: `https://api.dicebear.com/7.x/initials/svg?seed=${email}`
          }
        ]);

      if (insertError) {
        throw new Error(insertError.message);
      }

      toast.success('Successfully signed up! Please check your email for verification.');
      navigate('/');
    } catch (err) {
      toast.error(err.message || 'Failed to create an account. Please try again.');
      setError(err.message || 'Failed to create an account. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <FaAirbnb className="text-airbnb-primary text-5xl mx-auto mb-4" />
          <h1 className="text-2xl font-bold">Sign up for Airbnb</h1>
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
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
                placeholder="Enter your name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="Enter your email"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="Create a password"
              />
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
            
            <button className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
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