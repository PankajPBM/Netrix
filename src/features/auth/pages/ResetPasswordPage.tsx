import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, ArrowLeft, CheckCircle } from 'lucide-react';
import { resetPasswordSchema, ResetPasswordFormData } from '../schemas/authSchemas';

export const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const onSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      setTimeout(() => navigate('/auth/login'), 2500);
    }, 600);
  };

  return (
    <div className="card shadow-lg border-0" style={{ backgroundColor: 'var(--netrix-bg-surface)' }}>
      <div className="card-body p-4 p-sm-5">
        <div className="text-center mb-4">
          <h1 className="fs-4 fw-bold text-white mb-1">Set New Password</h1>
          <p className="text-muted small">Choose a strong master password for your administrative credentials.</p>
        </div>

        {success ? (
          <div className="text-center py-3">
            <div
              className="p-3 rounded-circle d-inline-flex mb-3"
              style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--netrix-status-online)' }}
            >
              <CheckCircle size={32} />
            </div>
            <h5 className="fw-bold text-white mb-2">Password Successfully Updated</h5>
            <p className="text-muted small mb-4">Redirecting you to the console sign in portal...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <label className="form-label">New Password</label>
              <div className="input-group">
                <span className="input-group-text"><Lock size={16} /></span>
                <input
                  type="password"
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                  placeholder="••••••••••••"
                  {...register('password')}
                />
              </div>
              {errors.password && <div className="text-danger small mt-1">{errors.password.message}</div>}
            </div>

            <div className="mb-4">
              <label className="form-label">Confirm New Password</label>
              <div className="input-group">
                <span className="input-group-text"><Lock size={16} /></span>
                <input
                  type="password"
                  className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                  placeholder="••••••••••••"
                  {...register('confirmPassword')}
                />
              </div>
              {errors.confirmPassword && <div className="text-danger small mt-1">{errors.confirmPassword.message}</div>}
            </div>

            <button type="submit" disabled={isSubmitting} className="btn btn-primary w-100 py-2 mb-3">
              {isSubmitting ? 'Updating...' : 'Set Master Password'}
            </button>

            <Link
              to="/auth/login"
              className="btn btn-ghost w-100 btn-sm text-muted d-flex align-items-center justify-content-center gap-1"
            >
              <ArrowLeft size={14} />
              <span>Back to sign in</span>
            </Link>
          </form>
        )}
      </div>
    </div>
  );
};
