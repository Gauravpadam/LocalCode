import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/common/Button';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!username.trim() || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    const result = await login(username, password);
    setLoading(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      {/* Simple, Solid Flat Card */}
      <div className="w-full max-w-md p-8 rounded-2xl bg-base-200 border border-base-300 shadow-sm">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-base-content">Login</h2>
          <p className="text-sm text-base-content/60 mt-1">Enter your credentials to continue</p>
        </div>
        
        {error && (
          <div className="alert alert-error flex justify-start gap-2 py-3 mb-6 text-sm rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
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
              placeholder="e.g. janesmith"
              disabled={loading}
            />
          </div>

          <div className="form-control w-full">
            <label className="label py-1 flex justify-between">
              <span className="label-text text-xs font-bold uppercase opacity-50">Password</span>
              <Link to="/forgot" className="label-text-alt link link-hover opacity-50">Forgot?</Link>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input input-bordered w-full bg-base-100 rounded-lg focus:outline-primary"
              placeholder="••••••••"
              disabled={loading}
            />
          </div>

          <Button 
            type="submit" 
            variant="primary"
            className="w-full h-12 rounded-lg mt-2 font-bold"
            disabled={loading}
          >
            {loading ? <span className="loading loading-spinner loading-sm"></span> : 'Sign In'}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-base-300 text-center">
          <p className="text-sm opacity-70">
            New here?{' '}
            <Link to="/register" className="text-primary font-bold hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;