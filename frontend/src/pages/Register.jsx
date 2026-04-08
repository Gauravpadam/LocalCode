import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/common/Button';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!username.trim() || username.length < 3) {
      setError('Username must be at least 3 characters long');
      return;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    const result = await register(username, email, password);
    setLoading(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      {/* Simple, Solid Flat Card */}
      <div className="w-full max-w-md p-8 rounded-2xl bg-base-200 border border-base-300 shadow-sm">
        <div className="mb-8 text-left">
          <h2 className="text-2xl font-bold text-base-content">Create Account</h2>
          <p className="text-sm text-base-content/60 mt-1">Join the LocalCode community</p>
        </div>
        
        {error && (
          <div className="alert alert-error flex justify-start gap-2 py-3 mb-6 text-sm rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="form-control w-full">
            <label className="label py-1">
              <span className="label-text text-xs font-bold uppercase opacity-50">Username</span>
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input input-bordered w-full bg-base-100 rounded-lg focus:outline-primary"
              placeholder="coder_123"
              disabled={loading}
            />
            <label className="label py-1">
              <span className="label-text-alt opacity-40">Min. 3 characters</span>
            </label>
          </div>

          <div className="form-control w-full">
            <label className="label py-1">
              <span className="label-text text-xs font-bold uppercase opacity-50">Email Address</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input input-bordered w-full bg-base-100 rounded-lg focus:outline-primary"
              placeholder="name@example.com"
              disabled={loading}
            />
          </div>

          <div className="form-control w-full">
            <label className="label py-1">
              <span className="label-text text-xs font-bold uppercase opacity-50">Password</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input input-bordered w-full bg-base-100 rounded-lg focus:outline-primary"
              placeholder="••••••••"
              disabled={loading}
            />
            <label className="label py-1">
              <span className="label-text-alt opacity-40">Min. 8 characters</span>
            </label>
          </div>

          <Button 
            type="submit" 
            variant="primary"
            className="w-full h-12 rounded-lg mt-4 font-bold"
            disabled={loading}
          >
            {loading ? <span className="loading loading-spinner loading-sm"></span> : 'Create Account'}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-base-300 text-center">
          <p className="text-sm opacity-70">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;