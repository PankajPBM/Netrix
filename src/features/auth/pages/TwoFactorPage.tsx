import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, KeyRound, ArrowRight, ArrowLeft } from 'lucide-react';
import { twoFactorSchema, TwoFactorFormData } from '../schemas/authSchemas';
import { useAppDispatch } from '@/app/store';
import { setCredentials, clearTwoFactorPending, DEFAULT_MOCK_USER } from '../authSlice';

export const TwoFactorPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TwoFactorFormData>({
    resolver: zodResolver(twoFactorSchema),
    defaultValues: {
      code: '',
    },
  });

  const onSubmit = async (data: TwoFactorFormData) => {
    setIsVerifying(true);
    setErrorMsg(null);

    setTimeout(() => {
      setIsVerifying(false);
      if (data.code.length === 6) {
        dispatch(
          setCredentials({
            user: {
              ...DEFAULT_MOCK_USER,
              name: 'Pankaj Kushwaha',
              organizationName: 'PB Tech Zone',
            },
            accessToken: 'nx_verified_token_' + Date.now(),
          })
        );
        navigate('/');
      } else {
        setErrorMsg('Invalid authenticator code. Please check your token generator and try again.');
      }
    }, 500);
  };

  return (
    <div className="card shadow-lg border-0" style={{ backgroundColor: 'var(--netrix-bg-surface)' }}>
      <div className="card-body p-4 p-sm-5">
        <div className="text-center mb-4">
          <div
            className="p-3 rounded-circle d-inline-flex mb-3"
            style={{ backgroundColor: 'rgba(37, 99, 235, 0.15)', color: 'var(--netrix-brand-400)' }}
          >
            <ShieldAlert size={32} />
          </div>
          <h1 className="fs-4 fw-bold text-white mb-1">Two-Factor Verification</h1>
          <p className="text-muted small">
            Enter the 6-digit TOTP code from your mobile authenticator app.
          </p>
        </div>

        {errorMsg && (
          <div className="alert alert-danger p-2 mb-3 small">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="form-label text-center d-block">Security Verification Code</label>
            <div className="input-group">
              <span className="input-group-text font-monospace">
                <KeyRound size={16} />
              </span>
              <input
                type="text"
                maxLength={6}
                className={`form-control font-monospace text-center fs-4 letter-spacing-lg ${errors.code ? 'is-invalid' : ''}`}
                placeholder="000000"
                autoFocus
                {...register('code')}
              />
            </div>
            {errors.code && (
              <div className="text-danger small mt-1 text-center">{errors.code.message}</div>
            )}
          </div>

          <button
            type="submit"
            disabled={isVerifying}
            className="btn btn-primary w-100 py-2 d-flex align-items-center justify-content-center gap-2 mb-3"
          >
            {isVerifying ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" />
                <span>Validating Key...</span>
              </>
            ) : (
              <>
                <span>Verify & Proceed</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              dispatch(clearTwoFactorPending());
              navigate('/auth/login');
            }}
            className="btn btn-ghost w-100 btn-sm text-muted d-flex align-items-center justify-content-center gap-1"
          >
            <ArrowLeft size={14} />
            <span>Back to sign in</span>
          </button>
        </form>
      </div>
    </div>
  );
};
