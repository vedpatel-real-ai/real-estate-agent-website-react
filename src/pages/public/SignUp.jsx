// src/pages/public/Signup.jsx
//
// New (Auth & Favourites Architecture Plan §2) — public account
// creation. Email/password + Google. A `profiles` row is created
// automatically by the `handle_new_user` DB trigger (Phase A migration)
// for every sign-up method, so this page never inserts into `profiles`
// itself.
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { usePostAuthRedirect } from '../../hooks/usePostAuthRedirect';
import Button from '../../components/ui/Button';
import './AuthPages.css';

const Signup = () => {
  // Only fires the redirect if Supabase returns a session immediately
  // (i.e. email confirmation is disabled in the dashboard). If
  // confirmation is required, `session` stays null and we show the
  // "check your email" message below instead.
  usePostAuthRedirect();

  const { signUp, signInWithGoogle } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmSent, setConfirmSent] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const { session } = await signUp(
        email.trim().toLowerCase(),
        password,
        fullName.trim(),
      );
      if (!session) {
        setConfirmSent(true);
        setLoading(false);
      }
      // If a session came back immediately, usePostAuthRedirect handles it.
    } catch (err) {
      setErrorMsg(err.message || 'Could not create your account. Please try again.');
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setErrorMsg('');
    try {
      await signInWithGoogle();
    } catch (err) {
      setErrorMsg(err.message || 'Could not start Google sign-in.');
    }
  };

  if (confirmSent) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <h1>Almost there</h1>
          <p className="auth-subtitle">
            We've sent a confirmation link to <strong>{email}</strong>. Confirm
            your email, then sign in.
          </p>
          <Link to="/login">
            <Button variant="primary" size="medium" fullWidth>
              Go to Sign In
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Create Account</h1>
        <p className="auth-subtitle">
          Save properties you like and pick up where you left off, on any device.
        </p>

        {errorMsg && <p className="auth-error">{errorMsg}</p>}

        <form onSubmit={handleSignup} className="auth-form">
          <input
            type="text"
            placeholder="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            autoComplete="name"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <input
            type="password"
            placeholder="Password (min. 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            autoComplete="new-password"
          />
          <Button type="submit" variant="primary" size="medium" fullWidth loading={loading}>
            Create Account
          </Button>
        </form>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <Button variant="outline" size="medium" fullWidth onClick={handleGoogle}>
          Continue with Google
        </Button>

        <div className="auth-footer-links">
          <Link to="/login">Already have an account? Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
