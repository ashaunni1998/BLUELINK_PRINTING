import React from 'react';
import { Heart, Facebook, Twitter, Linkedin } from 'lucide-react';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t-2 border-gray-200 mt-auto pb-4 text-gray-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Logo Section */}
          <div className="flex flex-col items-center ">
            <img src="/logoIcon.png" className="w-[170px] mb-3" alt="Blue Link Logo" />
            <div className="flex space-x-3"> 
              <Facebook size={18} className="text-blue-500 hover:text-blue-600 cursor-pointer transition-colors" />
              <Twitter size={18} className="text-blue-500 hover:text-blue-600 cursor-pointer transition-colors" />
              <Linkedin size={18} className="text-blue-500 hover:text-blue-600 cursor-pointer transition-colors" />
            </div> 
          </div>

          {/* About Section */}
          <div>
            <h4 className="text-base font-semibold text-gray-800 mb-3">Blue Link Admin</h4>
            <p className="text-sm leading-relaxed">
              Empowering administrators with intuitive controls, real-time monitoring, and modern design.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base font-semibold text-gray-800 mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <div className="hover:cursor-pointer hover:text-blue-600 transition-colors">
                  Dashboard
                </div>
              </li>
              <li>
                <div className="hover:cursor-pointer hover:text-blue-600 transition-colors">
                  Settings
                </div>
              </li>
              <li>
                <div className="hover:cursor-pointer hover:text-blue-600 transition-colors">
                  Support
                </div>
              </li>
              <li>
                <div className="hover:cursor-pointer hover:text-blue-600 transition-colors">
                  Privacy Policy
                </div>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-base font-semibold text-gray-800 mb-3">Contact</h4>
            <div className="space-y-1 text-sm">
              <p>
                <span className="text-blue-600 font-medium">Email:</span> support@bluelink.com
              </p>
              <p>
                <span className="text-blue-600 font-medium">Phone:</span> +91 98765 43210
              </p>
              <p>
                <span className="text-blue-600 font-medium">Hours:</span> Mon - Fri: 9am - 6pm
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-blue-100 mt-6 pt-4">
          {/* Copyright and Made with Love */}
          <div className="text-sm text-gray-500 flex flex-col sm:flex-row justify-between items-center mb-3">
            <div className="flex items-center space-x-2">
              <span>© {currentYear} Blue Link Admin.</span>
              <span className="hidden sm:inline">All rights reserved.</span>
            </div>

            <div className="flex items-center space-x-1 mt-2 sm:mt-0">
              <span>Made with</span>
              <Heart size={14} className="text-red-400 fill-current" />
              <span>for administrators</span>
            </div>
          </div>

          {/* Version and Status */}
          <div className="text-xs text-gray-400 flex flex-col sm:flex-row justify-between items-center">
            <span className="font-medium">Version 1.2.0</span>
            <div className="flex items-center space-x-2 mt-1 sm:mt-0">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>System Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;