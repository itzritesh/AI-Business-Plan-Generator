import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { register as registerApi } from '../services/authApi.js';
import { FiUser, FiMail, FiLock, FiCheck } from 'react-icons/fi';

const Register = () => {
  const { token, register } = useAuth();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register: formRegister,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  // If already authenticated, redirect straight to dashboard
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = async (data) => {
    setLoading(true);
    setApiError('');
    try {
      const response = await registerApi({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      register(response);
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      setApiError(error.response?.data?.message || 'Registration failed. Email might be already in use.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-slate-900 overflow-hidden font-sans">
      {/* Background Gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-650/30 rounded-full filter blur-[100px] animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-650/20 rounded-full filter blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

      <div className="relative z-10 w-full max-w-md px-6 py-6">
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <span className="inline-block px-3 py-1 text-xs font-bold text-indigo-400 bg-indigo-500/10 rounded-full border border-indigo-500/20">
              Get Started
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-white">
              Create an Account
            </h2>
            <p className="text-sm text-slate-400">
              Generate plans, build pitch decks, and validate ideas.
            </p>
          </div>

          {apiError && (
            <div className="p-3.5 text-xs text-red-400 bg-red-950/20 border border-red-500/20 rounded-xl">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-350">Full Name</label>
              <div className="relative">
                <FiUser className="absolute left-3.5 top-3.5 text-slate-500" />
                <input
                  type="text"
                  disabled={loading}
                  placeholder="John Doe"
                  className="w-full bg-slate-950/50 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-slate-600 transition-all duration-200"
                  {...formRegister('name', { required: 'Full name is required' })}
                />
              </div>
              {errors.name && <span className="text-[10px] text-red-400">{errors.name.message}</span>}
            </div>

            {/* Email Address */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-350">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-3.5 text-slate-500" />
                <input
                  type="email"
                  disabled={loading}
                  placeholder="name@company.com"
                  className="w-full bg-slate-950/50 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-slate-600 transition-all duration-200"
                  {...formRegister('email', {
                    required: 'Email address is required',
                    pattern: {
                      value: /^\S+@\S+\.\S+$/,
                      message: 'Please enter a valid email address',
                    },
                  })}
                />
              </div>
              {errors.email && <span className="text-[10px] text-red-400">{errors.email.message}</span>}
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-350">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-3.5 text-slate-500" />
                <input
                  type="password"
                  disabled={loading}
                  placeholder="••••••••"
                  className="w-full bg-slate-950/50 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-slate-600 transition-all duration-200"
                  {...formRegister('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters long',
                    },
                  })}
                />
              </div>
              {errors.password && <span className="text-[10px] text-red-400">{errors.password.message}</span>}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-350">Confirm Password</label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-3.5 text-slate-500" />
                <input
                  type="password"
                  disabled={loading}
                  placeholder="••••••••"
                  className="w-full bg-slate-950/50 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-slate-600 transition-all duration-200"
                  {...formRegister('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (value) => value === watch('password') || 'Passwords do not match',
                  })}
                />
              </div>
              {errors.confirmPassword && <span className="text-[10px] text-red-400">{errors.confirmPassword.message}</span>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold text-sm rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-indigo-550/20"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Register
                  <FiCheck className="w-4 h-4 ml-2" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2">
            <span className="text-xs text-slate-500">Already have an account? </span>
            <Link to="/login" className="text-xs font-bold text-indigo-400 hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
