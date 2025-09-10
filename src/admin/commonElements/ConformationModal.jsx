import React from 'react'
import { X, AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react'
import LoadingSmall from './LoadingSmall.jsx'

function ConfirmationModal({ title, message, onConfirm, onCancel, type = 'default', confirmText = 'Confirm', cancelText = 'Cancel', isOpen = true, loading }) {
  if (!isOpen) return null

  const getIcon = () => {
    switch (type) {
      case 'danger':
        return <XCircle className="text-red-500" size={24} />
      case 'warning':
        return <AlertTriangle className="text-yellow-500" size={24} />
      case 'success':
        return <CheckCircle className="text-green-500" size={24} />
      case 'info':
        return <Info className="text-blue-500" size={24} />
      default:
        return <Info className="text-blue-500" size={24} />
    }
  }

  const getConfirmButtonStyle = () => {
    switch (type) {
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
      case 'warning':
        return 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500'
      case 'success':
        return 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
      case 'info':
        return 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
      default:
        return 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
    }
  }



  return (
    <div>
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[1px] transition-opacity"
        onClick={(e) => {
          e.preventDefault()
          onCancel()
        }}
        role="dialog"
        aria-modal="false"
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >


        <div className="flex min-h-full items-center justify-center p-4"
          >
          <div className="relative transform overflow-hidden rounded-lg bg-white shadow-xl transition-all w-full max-w-md"
          onClick={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <button
              onClick={onCancel}
              disabled={loading}
              className={`absolute hover:cursor-pointer top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <X size={20} />
            </button>

            {/* Modal Content */}
            <div className="px-6 pt-6 pb-4">
              {/* Icon and Title */}
              <div className="flex items-center space-x-3 mb-4">
                {getIcon()}
                <h3 className="text-lg font-semibold text-gray-900">
                  {title}
                </h3>
              </div>

              {/* Message */}
              <div className="mb-6">
                <p className="text-sm text-gray-600 leading-relaxed">
                  {message}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row-reverse gap-3">
              <button
                disabled={loading}
                onClick={onConfirm}
                className={`w-full sm:w-[125px] inline-flex justify-center  rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 hover:cursor-pointer ${getConfirmButtonStyle()} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? (<LoadingSmall />) : confirmText}
                {/* {confirmText} */}
              </button>
              <button
                disabled={loading}
                onClick={onCancel}
                className={`w-full sm:w-auto inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 hover:cursor-pointer transition-colors${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {cancelText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}

export default ConfirmationModal