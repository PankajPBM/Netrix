import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, ArrowRight } from 'lucide-react';
import { loginSchema, LoginFormData } from '../schemas/authSchemas';
import { useAppDispatch } from '@/app/store';
import { setCredentials, DEFAULT_MOCK_USER } from '../authSlice';

export const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: true,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    setAuthError(null);

    // Authenticate user credentials
    setTimeout(() => {
      setIsSubmitting(false);
      if (data.email.includes('@') && data.password.length >= 8) {
        dispatch(
          setCredentials({
            user: {
              ...DEFAULT_MOCK_USER,
              email: data.email,
              name: 'Pankaj Kushwaha',
              organizationName: 'PB Tech Zone',
            },
            accessToken: 'nx_auth_token_' + Date.now(),
          })
        );
        navigate('/');
      } else {
        setAuthError('Invalid credentials. Please verify your email and password.');
      }
    }, 600);
  };

  return (
    <div className="card shadow-lg border-0" style={{ backgroundColor: 'var(--netrix-bg-surface)' }}>
      <div className="card-body p-4 p-sm-5">
        <div className="text-center mb-4">
          <h1 className="fs-4 fw-bold text-white mb-1">Sign in to NETRIX Console</h1>
          <p className="text-muted small">PB Tech Zone Enterprise Remote Access</p>
        </div>

        {authError && (
          <div className="alert alert-danger d-flex align-items-center gap-2 p-2 mb-3" style={{ fontSize: '0.8125rem' }}>
            <Lock size={15} className="flex-shrink-0" />
            <div>{authError}</div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Email */}
          <div className="mb-3">
            <label className="form-label" htmlFor="login-email">Enterprise Email</label>
            <div className="input-group">
              <span className="input-group-text">
                <Mail size={16} />
              </span>
              <input
                id="login-email"
                type="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                placeholder="name@pbtechzone.com"
                autoComplete="email"
                {...register('email')}
              />
            </div>
            {errors.email && (
              <div className="text-danger small mt-1">{errors.email.message}</div>
            )}
          </div>

          {/* Password */}
          <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center">
              <label className="form-label mb-0" htmlFor="login-password">Password</label>
              <Link to="/auth/forgot-password" className="small text-decoration-none">
                Forgot password?
              </Link>
            </div>
            <div className="input-group mt-1">
              <span className="input-group-text">
                <Lock size={16} />
              </span>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                placeholder="••••••••••••"
                autoComplete="current-password"
                {...register('password')}
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <div className="text-danger small mt-1">{errors.password.message}</div>
            )}
          </div>

          {/* Remember Me */}
          <div className="form-check mb-4">
            <input
              type="checkbox"
              className="form-check-input"
              id="rememberMe"
              {...register('rememberMe')}
            />
            <label className="form-check-label text-muted small" htmlFor="rememberMe">
              Keep this administrative session active for 30 days
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary w-100 py-2 d-flex align-items-center justify-content-center gap-2 mb-3"
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Sign In to Console</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-muted small mb-0">
            Need an enterprise account?{' '}
            <Link to="/auth/register" className="fw-semibold">
              Create Organization
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
