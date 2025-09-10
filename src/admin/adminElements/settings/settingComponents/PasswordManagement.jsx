import { useState } from 'react'
import { Lock, Edit2, Save, X, AlertCircle, AlertTriangle, Eye, EyeOff, CheckCircle } from "lucide-react";
import { UPDATE_ADMIN_PASSWORD } from '../../../apiServices/dataApi'
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

// Error Message Component
const ErrorMessage = ({ message }) => {
  if (!message) return null;

  return (
    <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
      <AlertCircle className="w-4 h-4" />
      <span>{message}</span>
    </div>
  );
};

// Success Message Component
const SuccessMessage = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-green-800 font-medium">{message}</span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-green-600 hover:text-green-800"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

// General Error Message Component
const GeneralErrorMessage = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <span className="text-red-800 font-medium">{message}</span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-red-600 hover:text-red-800"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

// Confirmation Modal Component
const PasswordConfirmationModal = ({ isOpen, onClose, onConfirm, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-shrink-0">
            <AlertTriangle className="w-6 h-6 text-amber-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Confirm Password Change</h3>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-600 mb-3">
            Are you sure you want to change your password? This action will:
          </p>
          <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
            <li>Update your login credentials</li>
            <li>Require you to use the new password for future logins</li>
            <li>Cannot be undone without creating another new password</li>
          </ul>
        </div>
        
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? "Updating..." : "Change Password"}
          </button>
        </div>
      </div>
    </div>
  );
};

// Password Strength Indicator
const PasswordStrengthIndicator = ({ password }) => {
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, text: '', color: '' };
    
    let score = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      numbers: /\d/.test(password),
      symbols: /[^a-zA-Z0-9]/.test(password)
    };
    
    score = Object.values(checks).filter(Boolean).length;
    
    if (score <= 2) return { strength: score, text: 'Weak', color: 'bg-red-500' };
    if (score <= 3) return { strength: score, text: 'Fair', color: 'bg-yellow-500' };
    if (score <= 4) return { strength: score, text: 'Good', color: 'bg-blue-500' };
    return { strength: score, text: 'Strong', color: 'bg-green-500' };
  };

  const { strength, text, color } = getPasswordStrength(password);

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex justify-between text-xs text-gray-600 mb-1">
        <span>Password Strength</span>
        <span>{text}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${color}`}
          style={{ width: `${(strength / 5) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

function PasswordManagement() {
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Error states
  const [currentPasswordError, setCurrentPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  
  // General messages
  const [successMessage, setSuccessMessage] = useState("");
  const [generalError, setGeneralError] = useState("");

  // Show password states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const userData = useSelector((state) => state.admin);


  // Clear all messages
  const clearMessages = () => {
    setSuccessMessage("");
    setGeneralError("");
  };

  // Validation functions
  const validateCurrentPassword = (password) => {
    if (!password.trim()) {
      return "Current password is required";
    }
    return "";
  };

  const validateNewPassword = (password) => {
    if (!password.trim()) {
      return "New password is required";
    }
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])/.test(password)) {
      return "Password must contain both uppercase and lowercase letters";
    }
    if (!/(?=.*\d)/.test(password)) {
      return "Password must contain at least one number";
    }
    if (password === currentPassword) {
      return "New password must be different from current password";
    }
    return "";
  };

  const validateConfirmPassword = (password, newPass) => {
    if (!password.trim()) {
      return "Please confirm your new password";
    }
    if (password !== newPass) {
      return "Passwords do not match";
    }
    return "";
  };

  // Handle input changes
  const handleCurrentPasswordChange = (e) => {
    const value = e.target.value;
    setCurrentPassword(value);
    if (currentPasswordError) {
      setCurrentPasswordError("");
    }
    clearMessages();
  };

  const handleNewPasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);
    if (newPasswordError) {
      setNewPasswordError("");
    }
    // Re-validate confirm password if it exists
    if (confirmPassword && confirmPasswordError) {
      setConfirmPasswordError("");
    }
    clearMessages();
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    if (confirmPasswordError) {
      setConfirmPasswordError("");
    }
    clearMessages();
  };

  // Show confirmation dialog
  const handlePasswordSave = () => {
    // Clear previous messages
    clearMessages();

    // Validate all fields
    const currentError = validateCurrentPassword(currentPassword);
    const newError = validateNewPassword(newPassword);
    const confirmError = validateConfirmPassword(confirmPassword, newPassword);

    setCurrentPasswordError(currentError);
    setNewPasswordError(newError);
    setConfirmPasswordError(confirmError);

    // If any validation fails, don't proceed
    if (currentError || newError || confirmError) {
      setGeneralError("Please fix the validation errors above before proceeding.");
      return;
    }
     
    // Show confirmation dialog
    setShowConfirmation(true);
  };

  // Actual password update after confirmation
  const confirmPasswordUpdate = async () => {
    setIsUpdatingPassword(true);
    clearMessages();

    try {
      const reqData = {
        adminId:userData?.adminId,
        currentPassword: currentPassword.trim(),
        newPassword: newPassword.trim(),
      };

      await UPDATE_ADMIN_PASSWORD(reqData);
      // Reset form and close editing mode
      setIsEditingPassword(false);
      setShowConfirmation(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
      // Show success message
      setSuccessMessage("Password updated successfully! Please use your new password for future logins.");

    } catch (error) {
      // console.error("Failed to update password:", error);
       toast.error(error.response.data.message)
   
    } finally {
      setIsUpdatingPassword(false);
      setShowConfirmation(false);
    }
  };

  const handlePasswordCancel = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setCurrentPasswordError("");
    setNewPasswordError("");
    setConfirmPasswordError("");
    setIsEditingPassword(false);
    clearMessages();
  };

  return (
    <>
      {/* Password Confirmation Modal */}
      <PasswordConfirmationModal
        isOpen={showConfirmation}
        onClose={() => {setShowConfirmation(false)}}
        onConfirm={confirmPasswordUpdate}
        isLoading={isUpdatingPassword}
      />

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Password Settings
          </h2>
        </div>
        <div className="p-6">
          {/* Success Message */}
          <SuccessMessage 
            message={successMessage} 
            onClose={() => setSuccessMessage("")} 
          />

          {/* General Error Message */}
          <GeneralErrorMessage 
            message={generalError} 
            onClose={() => setGeneralError("")} 
          />

          {!isEditingPassword ? (
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="text-gray-800 font-medium">••••••••••••</div>
                <p className="text-sm text-gray-500 mt-1">
                  Last updated: Not available
                </p>
              </div>
              <button
                onClick={() => {
                  setIsEditingPassword(true);
                  clearMessages();
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                Change Password
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <form onClick={e=>e.preventDefault()}>
              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <input
                     autoComplete="current-password"
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={handleCurrentPasswordChange}
                    className={`w-full px-3 py-2 pr-10 border rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none ${
                      currentPasswordError ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Enter current password"
                    disabled={isUpdatingPassword}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    disabled={isUpdatingPassword}
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <ErrorMessage message={currentPasswordError} />
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    autoComplete="new-password"

                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={handleNewPasswordChange}
                    className={`w-full px-3 py-2 pr-10 border rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none ${
                      newPasswordError ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Enter new password"
                    disabled={isUpdatingPassword}
                  />
                  <button
                   
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    disabled={isUpdatingPassword}
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <ErrorMessage message={newPasswordError} />
                <PasswordStrengthIndicator password={newPassword} />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    autoComplete="new-password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    className={`w-full px-3 py-2 pr-10 border rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none ${
                      confirmPasswordError ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Confirm new password"
                    disabled={isUpdatingPassword}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    disabled={isUpdatingPassword}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <ErrorMessage message={confirmPasswordError} />
              </div>

              {/* Password Requirements */}
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm font-medium text-gray-700 mb-2">Password Requirements:</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li className={`${newPassword.length >= 8 ? 'text-green-600' : 'text-gray-600'}`}>
                    ✓ At least 8 characters long
                  </li>
                  <li className={`${/(?=.*[a-z])(?=.*[A-Z])/.test(newPassword) ? 'text-green-600' : 'text-gray-600'}`}>
                    ✓ Contains both uppercase and lowercase letters
                  </li>
                  <li className={`${/(?=.*\d)/.test(newPassword) ? 'text-green-600' : 'text-gray-600'}`}>
                    ✓ Contains at least one number
                  </li>
                  <li className={`${/[^a-zA-Z0-9]/.test(newPassword) ? 'text-green-600' : 'text-gray-600'}`}>
                    ✓ Contains special characters (recommended)
                  </li>
                </ul>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handlePasswordSave}
                  disabled={isUpdatingPassword}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                  {isUpdatingPassword ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={handlePasswordCancel}
                  disabled={isUpdatingPassword}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
              </form>
            </div>
          )}
        </div>
        
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Security Notice:</strong> If you change your password and later forget it,
          it cannot be recovered as all passwords are securely encrypted.
          We recommend keeping your recovery email up to date to ensure you can reset your password if needed.
        </p>
      </div>
    </>
  );
}

export default PasswordManagement;