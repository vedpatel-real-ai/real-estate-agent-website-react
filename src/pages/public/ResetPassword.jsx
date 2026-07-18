// src/pages/public/ResetPassword.jsx
//
// New (Auth & Favourites Architecture Plan §2) — two modes in one page:
// 1. "request" — enter your email, get a reset link.
// 2. "update"  — landed here via that emailed link (Supabase fires a
//    PASSWORD_RECOVERY auth event once the recovery token in the URL is
//    exchanged for a session); shows a "set new password" form instead.
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import './AuthPages.css';

const ResetPassword = () => {
  const { resetPassword, updatePassword } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState('request'); // 'request' | 'update'
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [sent, setSent] = useState(false);
  const [updated, setUpdated] = useState(false);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setMode('update');
    });
    return () => listener?.subscription?.unsubscribe();
  }, []);

  const handleRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      await resetPassword(email.trim().toLowerCase());
      setSent(true);
    } catch (err) {
      setErrorMsg(err.message || 'Could not send the reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      await updatePassword(newPassword);
      setUpdated(true);
      setTimeout(() => navigate('/login', { replace: true }), 2000);
    } catch (err) {
      setErrorMsg(err.message || 'Could not update your password. Please try again.');
      setLoading(false);
    }
  };

  if (mode === 'update') {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <h1>Set a New Password</h1>
          {updated ? (
            <p className="auth-success">Password updated. Redirecting you to sign in…</p>
          ) : (
            <>
              {errorMsg && <p className="auth-error">{errorMsg}</p>}
              <form onSubmit={handleUpdate} className="auth-form">
                <input
                  type="password"
                  placeholder="New password (min. 6 characters)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  autoComplete="new-password"
                />
                <Button type="submit" variant="primary" size="medium" fullWidth loading={loading}>
                  Update Password
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Reset Password</h1>
        <p className="auth-subtitle">
          Enter your email and we'll send you a link to reset your password.
        </p>
        {sent ? (
          <p className="auth-success">Check your email — a reset link is on its way.</p>
        ) : (
          <>
            {errorMsg && <p className="auth-error">{errorMsg}</p>}
            <form onSubmit={handleRequest} className="auth-form">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
              <Button type="submit" variant="primary" size="medium" fullWidth loading={loading}>
                Send Reset Link
              </Button>
            </form>
          </>
        )}
        <div className="auth-footer-links">
          <Link to="/login">Back to sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
