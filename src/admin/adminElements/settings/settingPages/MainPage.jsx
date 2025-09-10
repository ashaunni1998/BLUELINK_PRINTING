import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { User, Mail, Edit2, Save, X, AlertCircle, AlertTriangle } from "lucide-react";
import { toast } from "react-toastify";
import { UPDATE_ADMIN_DATA } from '../../../apiServices/dataApi'
import { updateData } from '../../../redux/slices/userSlice';

import PasswordManagement from "../settingComponents/PasswordManagement";

const ErrorMessage = ({ message }) => {
  if (!message) return null;

  return (
    <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
      <AlertCircle className="w-4 h-4" />
      <span>{message}</span>
    </div>
  );
};

// Confirmation Modal Component
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-shrink-0">
            <AlertTriangle className="w-6 h-6 text-amber-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        
        <p className="text-gray-600 mb-6">{message}</p>
        
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
            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? "Processing..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

function MainPage() {
  const userData = useSelector((state) => state.admin);

  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);

  const [newName, setNewName] = useState(userData?.adminName || "");
  const [newEmail, setNewEmail] = useState(userData?.email || "");

  // Error states
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");

  // Loading states
  const [isUpdatingName, setIsUpdatingName] = useState(false);
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);

  // Confirmation modal states
  const [showNameConfirmation, setShowNameConfirmation] = useState(false);
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);

  const dispatch = useDispatch();

  const adminData = {
    adminId: userData?.adminId || "",
    adminName: userData?.adminName || "",
    email: userData?.email || "",
  };

  // Validation functions
  const validateName = (name) => {
    const nameRegex = /^[a-zA-Z ]{2,30}$/;

    if (!name.trim()) {
      return "Name cannot be empty";
    }

    if (name.trim().length < 2) {
      return "Name must be at least 2 characters long";
    }

    if (name.trim().length > 30) {
      return "Name cannot exceed 30 characters";
    }

    if (!nameRegex.test(name.trim())) {
      return "Name can only contain letters and spaces";
    }

    return "";
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (!email.trim()) {
      return "Email cannot be empty";
    }

    if (!emailRegex.test(email.trim())) {
      return "Please enter a valid email address";
    }

    return "";
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    setNewName(value);
    if (nameError) {
      setNameError("");
    }
  };

  // Show confirmation before saving name
  const handleNameSave = () => {
    const trimmedName = newName.trim();
    const error = validateName(trimmedName);

    if (error) {
      setNameError(error);
      return;
    }

    setNameError("");
    if(newName.trim()===userData?.adminName){
      setIsEditingName(false); 
      setShowNameConfirmation(false);
      return 
    }
    setShowNameConfirmation(true);
  };

  // Actual name save function after confirmation
  const confirmNameSave = async () => {
    setIsUpdatingName(true);

    try {
      const reqData = {
        orgData: userData,
        field: "name",
        now: newName.trim(),
      }

      const res = await UPDATE_ADMIN_DATA(reqData);
      dispatch(updateData(res.data));
      
      setIsEditingName(false);
      setShowNameConfirmation(false);
      toast.success("Name updated successfully!");

    } catch (error) {
      console.error("Failed to update name:", error);
      setNameError("Failed to update name. Please try again.");
      toast.error("Failed to update name. Please try again.");
    } finally {
      setIsUpdatingName(false);
    }
  };

  const handleNameCancel = () => {
    setNewName(adminData.adminName);
    setIsEditingName(false);
    setNameError("");
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setNewEmail(value);

    if (emailError) {
      setEmailError("");
    }
  };

  // Show confirmation before saving email
  const handleEmailSave = () => {
    const trimmedEmail = newEmail.trim();
    const error = validateEmail(trimmedEmail);

    if (error) {
      setEmailError(error);
      return;
    }

    setEmailError("");

    if(newEmail.trim()===userData?.email){
      setIsEditingEmail(false); 
      setShowEmailConfirmation(false);
      return 
    }
    setShowEmailConfirmation(true);
  };

  // Actual email save function after confirmation
  const confirmEmailSave = async () => {
    setIsUpdatingEmail(true);

    try {
      const reqData = {
        orgData: userData,
        field: "email",
        now: newEmail.trim(),
      }

      const res = await UPDATE_ADMIN_DATA(reqData);
      dispatch(updateData(res.data));
      
      setIsEditingEmail(false);
      setShowEmailConfirmation(false);
      toast.success("Email updated successfully!");

    } catch (error) {
      console.error("Failed to update email:", error);
      setEmailError("Failed to update email. Please try again.");
      toast.error("Failed to update email. Please try again.");
    } finally {
      setIsUpdatingEmail(false);
    }
  };

  const handleEmailCancel = () => {
    setNewEmail(adminData.email);
    setIsEditingEmail(false);
    setEmailError("");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={showNameConfirmation}
        onClose={() => {setShowNameConfirmation(false),setIsEditingName(false)}}
        onConfirm={confirmNameSave}
        title="Confirm Name Change"
        message={`Are you sure you want to change your name from "${adminData.adminName}" to "${newName.trim()}"?`}
        isLoading={isUpdatingName}
      />

      <ConfirmationModal
        isOpen={showEmailConfirmation}
        onClose={() => {setShowEmailConfirmation(false),setIsEditingEmail(false)}}
        onConfirm={confirmEmailSave}
        title="Confirm Email Change"
        message={`Are you sure you want to change your email from "${adminData.email}" to "${newEmail.trim()}"? `}
        isLoading={isUpdatingEmail}
      />

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-1">Admin Settings</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
          <p className="text-gray-700 font-medium mt-2">
            Logged in as: <span className="text-gray-900">{adminData.email}</span>
          </p>
        </div>

        {/* Admin Info Card */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <User className="w-5 h-5" />
              Admin Information
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Admin ID
                </label>
                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-800">
                  {adminData.adminId || "Not available"}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Admin Name
                </label>
                {!isEditingName ? (
                  <div className="flex items-center justify-between">
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-800">
                      {adminData.adminName || "Not available"}
                    </div>
                    <button
                      onClick={() => setIsEditingName(true)}
                      className="ml-3 flex items-center gap-2 px-3 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                      Change
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <input
                        type="text"
                        value={newName}
                        onChange={handleNameChange}
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none ${nameError ? 'border-red-300 bg-red-50' : 'border-gray-300'
                          }`}
                        placeholder="Enter new name"
                        disabled={isUpdatingName}
                      />
                      <ErrorMessage message={nameError} />
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={handleNameSave}
                        disabled={isUpdatingName}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Save className="w-4 h-4" />
                        {isUpdatingName ? "Saving..." : "Save Changes"}
                      </button>
                      <button
                        onClick={handleNameCancel}
                        disabled={isUpdatingName}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Email Settings Card */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Email Settings
            </h2>
          </div>
          <div className="p-6">
            {!isEditingEmail ? (
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Email
                  </label>
                  <div className="text-gray-800 font-medium">
                    {adminData.email || "Not available"}
                  </div>
                </div>
                <button
                  onClick={() => setIsEditingEmail(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Change Email
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Email Address
                  </label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={handleEmailChange}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none ${emailError ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    placeholder="Enter new email address"
                    disabled={isUpdatingEmail}
                  />
                  <ErrorMessage message={emailError} />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleEmailSave}
                    disabled={isUpdatingEmail}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-4 h-4" />
                    {isUpdatingEmail ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    onClick={handleEmailCancel}
                    disabled={isUpdatingEmail}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <PasswordManagement />
      </div>
    </div>
  );
}

export default MainPage;