import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { ROUTES } from '../../constants/routes';
import { useAuth } from '../../context/AuthContext';

/**
 * RegisterForm — registration form with clean design.
 */
const RegisterForm = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!firstName || !lastName || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    if (!agreed) {
      setError('Please agree to the Terms of Service and Privacy Policy.');
      return;
    }

    const name = `${firstName} ${lastName}`.trim();

    setLoading(true);
    try {
      await register(name, email, password);
      navigate(ROUTES.DASHBOARD, { replace: true });
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed. Please try again.';
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
        <h1 className="font-display text-display-lg text-ink mb-2">Create your account</h1>
        <p className="text-body-md text-body">Start your interview preparation journey</p>
      </div>

      <Card className="p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-red-600/10 text-red-500 text-body-sm">
              {error}
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First name"
              placeholder="John"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <Input
              label="Last name"
              placeholder="Doe"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
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
            helperText="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <label className="flex items-start gap-2 text-body-sm text-body cursor-pointer">
            <input
              type="checkbox"
              className="rounded mt-0.5"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <span>I agree to the <a href="#" className="text-ink font-medium hover:underline">Terms of Service</a> and <a href="#" className="text-ink font-medium hover:underline">Privacy Policy</a></span>
          </label>

          <Button fullWidth size="lg" type="submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
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
        Already have an account?{' '}
        <Link to={ROUTES.LOGIN} className="text-ink font-medium hover:underline">Sign in</Link>
      </p>
    </motion.div>
  );
};

export default RegisterForm;
