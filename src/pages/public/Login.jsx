// src/pages/public/Login.jsx
//
// New (Auth & Favourites Architecture Plan §2/§4) — single shared login
// surface for public users AND admins (replaces AdminLogin.jsx's role).
// Email/password, magic link, and Google are all offered; whichever
// succeeds lands the person here (or straight back here for OAuth/magic
// link) with a session, and usePostAuthRedirect does the post-auth
// branch: /admin if admin_users says so, otherwise /dashboard (or
// wherever they were headed before being sent to /login).
import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { usePostAuthRedirect } from '../../hooks/usePostAuthRedirect';
import { isDemoMode } from '../../lib/supabaseClient';
import Button from '../../components/ui/Button';
import './AuthPages.css';

const Login = () => {
  if (isDemoMode) return <Navigate to="/admin" replace />;

  // Handles the redirect once a session appears — from this form's own
  // signIn() call below, or from a Google/magic-link redirect landing
  // back on this page with a session already set.
  usePostAuthRedirect();

  const { signIn, signInWithGoogle, signInWithMagicLink } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [magicLoading, setMagicLoading] = useState(false);
  const [magicSent, setMagicSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      await signIn(email.trim().toLowerCase(), password);
      // usePostAuthRedirect takes it from here once the session lands.
    } catch (err) {
      setErrorMsg(
        err.message === 'Invalid login credentials'
          ? 'Incorrect email or password.'
          : err.message || 'An unexpected error occurred. Please try again.',
      );
      setLoading(false);
    }
  };

  const handleMagicLink = async () => {
    if (!email.trim()) {
      setErrorMsg("Enter your email above first, then tap 'Email me a link'.");
      return;
    }
    setMagicLoading(true);
    setErrorMsg('');
    try {
      await signInWithMagicLink(email.trim().toLowerCase());
      setMagicSent(true);
    } catch (err) {
      setErrorMsg(err.message || 'Could not send the sign-in link. Please try again.');
    } finally {
      setMagicLoading(false);
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

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Sign In</h1>
        <p className="auth-subtitle">
          Save your favourite properties and pick up where you left off.
        </p>

        {errorMsg && <p className="auth-error">{errorMsg}</p>}
        {magicSent && (
          <p className="auth-success">
            Check your email — we've sent you a sign-in link.
          </p>
        )}

        <form onSubmit={handleLogin} className="auth-form">
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
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
          <Button type="submit" variant="primary" size="medium" fullWidth loading={loading}>
            Sign In
          </Button>
        </form>

        <button
          type="button"
          className="auth-link-btn"
          onClick={handleMagicLink}
          disabled={magicLoading}
        >
          {magicLoading ? 'Sending…' : 'Email me a sign-in link instead'}
        </button>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <Button variant="outline" size="medium" fullWidth onClick={handleGoogle}>
          Continue with Google
        </Button>

        <div className="auth-footer-links">
          <Link to="/reset-password">Forgot password?</Link>
          <Link to="/signup">Create an account</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
