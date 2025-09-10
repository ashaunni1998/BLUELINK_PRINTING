import React from 'react';
import { useNavigate } from 'react-router-dom';

function NotFoundPage() {

    const navigator = useNavigate();
    const handleGoHome = () => {
        // Replace with your routing logic
       navigator('/admin/');
    };

    const handleGoBack = () => {
               navigator('/admin/');

    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
            </div>

            <div className="relative max-w-md w-full text-center">
                {/* Error Card */}
                <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 transform transition-all duration-300">
                    {/* 404 Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            <div className="w-24 h-24 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                                <svg 
                                    className="w-12 h-12 text-white" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth="2" 
                                        d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 20.5a7.962 7.962 0 01-5-1.709M15 3.5a7.966 7.966 0 00-6 2.709A7.966 7.966 0 003 8.5c0 2.137.833 4.146 2.343 5.657l.707.707a1 1 0 001.414-1.414l-.707-.707A5.964 5.964 0 015 8.5a5.964 5.964 0 015.757-5.973A5.964 5.964 0 0116 8.5a5.964 5.964 0 01-1.757 4.243l-.707.707a1 1 0 001.414 1.414l.707-.707A7.966 7.966 0 0018 8.5a7.966 7.966 0 00-2.343-5.657z" 
                                    />
                                </svg>
                            </div>
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">!</span>
                            </div>
                        </div>
                    </div>

                    {/* Error Message */}
                    <div className="mb-8">
                        <h1 className="text-6xl font-bold text-blue-600 mb-2">404</h1>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Page Not Found</h2>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            Sorry, the page you're looking for doesn't exist or has been moved.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <button
                            onClick={handleGoHome}
                            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-200 shadow-lg"
                        >
                            Go to Home
                        </button>
                        
                        <button
                            onClick={handleGoBack}
                            className="w-full bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold py-3 px-6 rounded-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-100 border border-blue-200"
                        >
                            Go Back
                        </button>
                    </div>

                    {/* Help Text */}
                    <div className="mt-6 pt-6 border-t border-blue-100">
                        <p className="text-xs text-gray-500">
                            Need help? Contact our support team
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NotFoundPage;