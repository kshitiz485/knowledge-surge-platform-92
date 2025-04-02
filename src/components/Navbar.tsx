
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import AuthModal from "./AuthModal";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-primary to-secondary shadow-md border-b border-white/10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-20">
          <div className="font-playfair text-2xl md:text-3xl font-bold gold-gradient">
            EduLux
          </div>

          {/* Desktop Nav Links */}
          <ul className="hidden md:flex space-x-8">
            <li>
              <Link 
                to="/courses" 
                className="text-white hover:text-gold transition-colors duration-300 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-gold after:transition-all hover:after:w-full"
              >
                Courses
              </Link>
            </li>
            <li>
              <Link 
                to="/vidyapeeth" 
                className="text-white hover:text-gold transition-colors duration-300 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-gold after:transition-all hover:after:w-full"
              >
                VidyaPeeth
              </Link>
            </li>
            <li>
              <Link 
                to="/mentorship" 
                className="text-white hover:text-gold transition-colors duration-300 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-gold after:transition-all hover:after:w-full"
              >
                Mentorship
              </Link>
            </li>
            <li>
              <Link 
                to="/resources" 
                className="text-white hover:text-gold transition-colors duration-300 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-gold after:transition-all hover:after:w-full"
              >
                Resources
              </Link>
            </li>
          </ul>

          {/* Login Button */}
          <Button 
            variant="outline" 
            onClick={() => setIsAuthModalOpen(true)}
            className="hidden md:flex border-gold text-gold hover:bg-gold hover:text-primary transition-all duration-300 px-6 rounded-full"
          >
            Login
          </Button>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-secondary py-4 animate-slide-up">
          <ul className="flex flex-col items-center space-y-4 pb-4">
            <li>
              <Link 
                to="/courses" 
                className="text-white hover:text-gold transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Courses
              </Link>
            </li>
            <li>
              <Link 
                to="/vidyapeeth" 
                className="text-white hover:text-gold transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                VidyaPeeth
              </Link>
            </li>
            <li>
              <Link 
                to="/mentorship" 
                className="text-white hover:text-gold transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Mentorship
              </Link>
            </li>
            <li>
              <Link 
                to="/resources" 
                className="text-white hover:text-gold transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Resources
              </Link>
            </li>
            <li>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsAuthModalOpen(true);
                  setIsMenuOpen(false);
                }}
                className="border-gold text-gold hover:bg-gold hover:text-primary transition-all duration-300 px-6 rounded-full"
              >
                Login
              </Button>
            </li>
          </ul>
        </div>
      )}

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </nav>
  );
};

export default Navbar;
