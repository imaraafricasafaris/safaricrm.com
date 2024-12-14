import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';

export default function TopNav() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 border-gray-200 backdrop-blur-sm border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src="/src/img/logos/logo.png" alt="Safari CRM" className="h-8 w-auto" />
            <span className="font-semibold text-lg text-gray-900">Safaricrm</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="#features" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
              Features
            </Link>
            <Link to="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
              Pricing
            </Link>
            <Link to="#about" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
              About
            </Link>
            <Link to="#contact" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
              Contact
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="hidden md:inline-flex transition-colors font-medium text-gray-600 hover:text-gray-900"
            >
              Sign in
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium text-black bg-primary hover:bg-primary/90 transition-colors shadow-sm"
            >
              Get Started
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg transition-colors text-gray-600 hover:bg-gray-100"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden shadow-lg bg-white border-gray-200 border-t">
          <div className="px-4 py-3 space-y-1">
            <Link
              to="#features"
              className="block px-3 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-100"
            >
              Features
            </Link>
            <Link
              to="#pricing"
              className="block px-3 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-100"
            >
              Pricing
            </Link>
            <Link
              to="#about"
              className="block px-3 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-100"
            >
              About
            </Link>
            <Link
              to="#contact"
              className="block px-3 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-100"
            >
              Contact
            </Link>
            <Link
              to="/login"
              className="block px-3 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-100"
            >
              Sign in
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}