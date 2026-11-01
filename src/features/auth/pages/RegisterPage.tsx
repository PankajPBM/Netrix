import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Building, User, ArrowRight } from 'lucide-react';
import { registerSchema, RegisterFormData } from '../schemas/authSchemas';
import { useAppDispatch } from '@/app/store';
import { setCredentials } from '../authSlice';

export const RegisterPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      organizationName: '',
      password: '',
      agreeTerms: true,
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      dispatch(
        setCredentials({
          user: {
            id: `usr_${Date.now()}`,
            name: data.name,
            email: data.email,
            role: 'OrgAdmin',
            organizationId: `org_${Date.now()}`,
            organizationName: data.organizationName,
            twoFactorEnabled: false,
          },
          accessToken: 'mock_jwt_token_' + Date.now(),
        })
      );
      navigate('/');
    }, 600);
  };

  return (
    <div className="card shadow-lg border-0" style={{ backgroundColor: 'var(--netrix-bg-surface)' }}>
      <div className="card-body p-4 p-sm-5">
        <div className="text-center mb-4">
          <h1 className="fs-4 fw-bold text-white mb-1">Create NETRIX Organization</h1>
          <p className="text-muted small">Deploy remote desktop command infrastructure for your enterprise</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Name */}
          <div className="mb-3">
            <label className="form-label" htmlFor="reg-name">Administrator Name</label>
            <div className="input-group">
              <span className="input-group-text"><User size={16} /></span>
              <input
                id="reg-name"
                type="text"
                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                placeholder="Pankaj Sharma"
                {...register('name')}
              />
            </div>
            {errors.name && <div className="text-danger small mt-1">{errors.name.message}</div>}
          </div>

          {/* Org Name */}
          <div className="mb-3">
            <label className="form-label" htmlFor="reg-org">Organization / Enterprise</label>
            <div className="input-group">
              <span className="input-group-text"><Building size={16} /></span>
              <input
                id="reg-org"
                type="text"
                className={`form-control ${errors.organizationName ? 'is-invalid' : ''}`}
                placeholder="PB Tech Zone Global"
                {...register('organizationName')}
              />
            </div>
            {errors.organizationName && <div className="text-danger small mt-1">{errors.organizationName.message}</div>}
          </div>

          {/* Work Email */}
          <div className="mb-3">
            <label className="form-label" htmlFor="reg-email">Work Email</label>
            <div className="input-group">
              <span className="input-group-text"><Mail size={16} /></span>
              <input
                id="reg-email"
                type="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                placeholder="admin@pbtechzone.com"
                {...register('email')}
              />
            </div>
            {errors.email && <div className="text-danger small mt-1">{errors.email.message}</div>}
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="form-label" htmlFor="reg-password">Master Password</label>
            <div className="input-group">
              <span className="input-group-text"><Lock size={16} /></span>
              <input
                id="reg-password"
                type="password"
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                placeholder="••••••••••••"
                {...register('password')}
              />
            </div>
            {errors.password && <div className="text-danger small mt-1">{errors.password.message}</div>}
          </div>

          <div className="form-check mb-4">
            <input
              type="checkbox"
              className="form-check-input"
              id="agreeTerms"
              {...register('agreeTerms')}
            />
            <label className="form-check-label text-muted small" htmlFor="agreeTerms">
              I agree to the NETRIX Enterprise Service Terms and Data Privacy Policy.
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary w-100 py-2 d-flex align-items-center justify-content-center gap-2 mb-3"
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" />
                <span>Provisioning Environment...</span>
              </>
            ) : (
              <>
                <span>Provision Organization</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-3">
          <p className="text-muted small mb-0">
            Already registered? <Link to="/auth/login" className="fw-semibold">Sign in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
