import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send, CheckCircle } from 'lucide-react';
import { forgotPasswordSchema, ForgotPasswordFormData } from '../schemas/authSchemas';

export const ForgotPasswordPage: React.FC = () => {
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedEmail(data.email);
    }, 500);
  };

  return (
    <div className="card shadow-lg border-0" style={{ backgroundColor: 'var(--netrix-bg-surface)' }}>
      <div className="card-body p-4 p-sm-5">
        <div className="text-center mb-4">
          <h1 className="fs-4 fw-bold text-white mb-1">Reset Password</h1>
          <p className="text-muted small">
            Enter your enterprise email to receive secure recovery instructions.
          </p>
        </div>

        {submittedEmail ? (
          <div className="text-center py-3">
            <div
              className="p-3 rounded-circle d-inline-flex mb-3"
              style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--netrix-status-online)' }}
            >
              <CheckCircle size={32} />
            </div>
            <h5 className="fw-bold text-white mb-2">Recovery Email Sent</h5>
            <p className="text-muted small mb-4">
              We have dispatched cryptographic password reset directives to <strong>{submittedEmail}</strong>.
            </p>
            <Link to="/auth/login" className="btn btn-primary w-100 py-2">
              Return to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label className="form-label" htmlFor="forgot-email">Enterprise Email</label>
              <div className="input-group">
                <span className="input-group-text">
                  <Mail size={16} />
                </span>
                <input
                  id="forgot-email"
                  type="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  placeholder="name@company.com"
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <div className="text-danger small mt-1">{errors.email.message}</div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary w-100 py-2 d-flex align-items-center justify-content-center gap-2 mb-3"
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" />
                  <span>Transmitting Token...</span>
                </>
              ) : (
                <>
                  <Send size={16} />
                  <span>Send Recovery Instructions</span>
                </>
              )}
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
