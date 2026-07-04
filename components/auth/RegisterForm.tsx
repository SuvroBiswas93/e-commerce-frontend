'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '@/store/auth';
import Loader from '@/components/common/Loader';
import { Store, Mail, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react';

interface RegisterFormFields {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterForm() {
  const router = useRouter();
  const { register: registerUser } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
    getValues,
  } = useForm<RegisterFormFields>();

  const onSubmit = async (data: RegisterFormFields) => {
    clearErrors('root');
    try {
      await registerUser(data.name, data.email, data.password);
      router.push('/products');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      setError('root', { message });
    }
  };

  const displayError = errors.root?.message;

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="relative overflow-hidden bg-card border border-border/50 rounded-3xl shadow-xl shadow-primary/5">
        <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-primary/40 via-primary to-primary/40" />
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/3 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-primary/3 rounded-full blur-3xl" />

        <div className="relative p-8 max-md:p-6">
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-linear-to-br from-primary/10 to-primary/5 text-primary mb-5 ring-1 ring-primary/10">
              <Store className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Create account</h1>
            <p className="text-sm text-muted-foreground mt-1.5">
              Join us and start shopping today
            </p>
          </div>

          {displayError && (
            <div
              className="bg-destructive/5 border border-destructive/15 text-destructive p-3.5 rounded-xl text-sm mb-6 text-center font-medium"
              role="alert"
              aria-live="polite"
            >
              {displayError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-sm font-medium text-foreground/80">
                Full Name
              </label>
              <div className="relative group">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors duration-200">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  {...register('name', {
                    required: 'Name is required',
                  })}
                  disabled={isSubmitting}
                  className="w-full pl-10 pr-4 py-3 bg-background border border-border/60 rounded-xl text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all disabled:opacity-50"
                  autoComplete="name"
                />
              </div>
              {errors.name && (
                <p className="text-destructive text-xs mt-1.5">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium text-foreground/80">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors duration-200">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  disabled={isSubmitting}
                  className="w-full pl-10 pr-4 py-3 bg-background border border-border/60 rounded-xl text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all disabled:opacity-50"
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <p className="text-destructive text-xs mt-1.5">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-medium text-foreground/80">
                Password
              </label>
              <div className="relative group">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors duration-200">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                  disabled={isSubmitting}
                  className="w-full pl-10 pr-10 py-3 bg-background border border-border/60 rounded-xl text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all disabled:opacity-50"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-foreground/60 transition-colors cursor-pointer bg-none border-none p-1"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-destructive text-xs mt-1.5">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground/80">
                Confirm Password
              </label>
              <div className="relative group">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors duration-200">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (value) =>
                      value === getValues('password') || 'Passwords do not match',
                  })}
                  disabled={isSubmitting}
                  className="w-full pl-10 pr-10 py-3 bg-background border border-border/60 rounded-xl text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all disabled:opacity-50"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-foreground/60 transition-colors cursor-pointer bg-none border-none p-1"
                  tabIndex={-1}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-destructive text-xs mt-1.5">{errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-linear-to-r from-primary to-primary/90 text-primary-foreground border-none rounded-xl text-sm font-semibold cursor-pointer hover:from-primary/90 hover:to-primary hover:shadow-lg hover:shadow-primary/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none flex items-center justify-center gap-2 min-h-12 mt-2"
            >
              {isSubmitting ? (
                <>
                  <Loader size="sm" />
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      <p className="text-sm text-muted-foreground/70 text-center mt-6">
        Already have an account?{' '}
        <Link href="/auth/login" className="text-primary font-semibold no-underline hover:text-primary/80 transition-colors">
          Sign in here
        </Link>
      </p>
    </div>
  );
}
