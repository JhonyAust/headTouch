// pages/ResetPassword.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useToast } from '@/components/ui/use-toast';
import { Eye, EyeOff, Lock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { verifyResetToken, resetPassword } from '@/store/auth-slice';

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(null);
  const [verifyingToken, setVerifyingToken] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);

  // Password Validation Function
  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    if (password.length < minLength) {
      return "Password must be at least 8 characters long";
    }
    if (!hasUpperCase) {
      return "Password must contain at least one uppercase letter";
    }
    if (!hasNumber) {
      return "Password must contain at least one digit";
    }
    if (!hasSpecialChar) {
      return "Password must contain at least one special character";
    }
    return "";
  };

  // Check password requirements for display
  const getPasswordRequirements = (password) => {
    return {
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    };
  };

  // Verify token on component mount
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const result = await dispatch(verifyResetToken(token));
        
        if (result.payload?.success) {
          setTokenValid(true);
          setUserEmail(result.payload.email);
        } else {
          setTokenValid(false);
          toast({
            title: 'Invalid or Expired Link',
            description: result.payload || 'This reset link is no longer valid',
            variant: 'destructive'
          });
        }
      } catch (error) {
        setTokenValid(false);
        toast({
          title: 'Invalid or Expired Link',
          description: 'This reset link is no longer valid',
          variant: 'destructive'
        });
      } finally {
        setVerifyingToken(false);
      }
    };

    verifyToken();
  }, [token, dispatch, toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate password
    const passwordValidationError = validatePassword(password);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      toast({
        title: 'Invalid Password',
        description: passwordValidationError,
        variant: 'destructive'
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: 'Passwords do not match',
        description: 'Please make sure both passwords are the same',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    setPasswordError('');

    try {
      const result = await dispatch(resetPassword({ token, newPassword: password }));

      if (result.payload?.success) {
        setResetSuccess(true);
        toast({
          title: '✅ Password Reset Successful!',
          description: 'Redirecting to homepage...'
        });

        // Redirect to home after 3 seconds
        setTimeout(() => {
          navigate('/shop/home');
        }, 3000);
      } else {
        toast({
          title: 'Reset Failed',
          description: result.payload || 'Failed to reset password',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Reset Failed',
        description: 'Failed to reset password',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state while verifying token
  if (verifyingToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Verifying reset link...</p>
        </div>
      </div>
    );
  }

  // Invalid token state
  if (tokenValid === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-12 h-12 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Invalid Reset Link
          </h1>
          <p className="text-gray-600 mb-6">
            This password reset link is invalid or has expired. Please request a new one.
          </p>
          <button
            onClick={() => navigate('/shop/home')}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 hover:scale-105"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  // Success state
  if (resetSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Password Reset Successful! 🎉
          </h1>
          <p className="text-gray-600 mb-6">
            Your password has been changed successfully. You can now login with your new password.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/shop/home')}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 hover:scale-105"
            >
              Go to Homepage & Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Reset password form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-purple-600" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2 bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 bg-clip-text text-transparent">
            Reset Your Password
          </h1>
          <p className="text-sm text-gray-600">
            for <span className="font-semibold text-purple-600">{userEmail}</span>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setShowPasswordRequirements(e.target.value.length > 0);
                  setPasswordError('');
                }}
                placeholder="Enter new password"
                className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors duration-300"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Password Requirements Indicator */}
          {showPasswordRequirements && password && (
            <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-3 space-y-1">
              <p className="text-xs font-semibold text-gray-700 mb-1.5">
                Password Requirements:
              </p>
              {(() => {
                const requirements = getPasswordRequirements(password);
                return (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {requirements.minLength ? (
                        <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full border-2 border-gray-300"></div>
                      )}
                      <span className={`text-xs ${requirements.minLength ? 'text-green-600 font-medium' : 'text-gray-600'}`}>
                        At least 8 characters
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {requirements.hasUpperCase ? (
                        <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full border-2 border-gray-300"></div>
                      )}
                      <span className={`text-xs ${requirements.hasUpperCase ? 'text-green-600 font-medium' : 'text-gray-600'}`}>
                        One uppercase letter
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {requirements.hasNumber ? (
                        <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full border-2 border-gray-300"></div>
                      )}
                      <span className={`text-xs ${requirements.hasNumber ? 'text-green-600 font-medium' : 'text-gray-600'}`}>
                        At least one digit
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {requirements.hasSpecialChar ? (
                        <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full border-2 border-gray-300"></div>
                      )}
                      <span className={`text-xs ${requirements.hasSpecialChar ? 'text-green-600 font-medium' : 'text-gray-600'}`}>
                        One special character (!@#$%^&*...)
                      </span>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Password Error Message */}
          {passwordError && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-2.5 text-xs text-red-700">
              {passwordError}
            </div>
          )}

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
                className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors duration-300"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Password Match Indicator */}
          {password && confirmPassword && (
            <div className={`text-sm flex items-center gap-2 ${
              password === confirmPassword ? 'text-green-600' : 'text-red-600'
            }`}>
              {password === confirmPassword ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Passwords match
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4" />
                  Passwords do not match
                </>
              )}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !password || !confirmPassword}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Resetting Password...
              </>
            ) : (
              <>
                <Lock className="w-5 h-5" />
                Reset Password
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/shop/home')}
            className="text-sm text-gray-500 hover:text-purple-600 font-medium transition-colors duration-300"
          >
            Back to Homepage
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;