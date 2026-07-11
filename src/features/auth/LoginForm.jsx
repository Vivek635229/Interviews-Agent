import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { ROUTES } from '../../constants/routes';
import { useAuth } from '../../context/AuthContext';

/**
 * LoginForm — clean auth form with pill inputs and primary CTA.
 */
const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      navigate(ROUTES.DASHBOARD, { replace: true });
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-[400px] mx-auto"
    >
      <div className="text-center mb-8">
        <Link to={ROUTES.HOME} className="inline-flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
            <i className="bi-cpu text-on-primary" />
          </div>
          <span className="font-display text-heading-md text-ink">InterviewAI</span>
        </Link>
        <h1 className="font-display text-display-lg text-ink mb-2">Welcome back</h1>
        <p className="text-body-md text-body">Sign in to continue your practice</p>
      </div>

      <Card className="p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-red-600/10 text-red-500 text-body-sm">
              {error}
            </div>
          )}
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            iconLeft="bi-envelope"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            iconLeft="bi-lock"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-body-sm text-body cursor-pointer">
              <input type="checkbox" className="rounded" />
              Remember me
            </label>
            <a href="#" className="text-body-sm text-ink font-medium hover:underline">Forgot password?</a>
          </div>

          <Button fullWidth size="lg" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        <div className="relative my-6">
          <div className="w-full h-px bg-hairline" />
          <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-canvas px-3 text-caption-sm text-mute">or</span>
        </div>

        <Button variant="secondary" fullWidth icon="bi-github">
          Continue with GitHub
        </Button>
      </Card>

      <p className="text-center text-body-sm text-body mt-6">
        Don't have an account?{' '}
        <Link to={ROUTES.REGISTER} className="text-ink font-medium hover:underline">Create account</Link>
      </p>
    </motion.div>
  );
};

export default LoginForm;
