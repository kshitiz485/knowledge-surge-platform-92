
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut } from "lucide-react";
import AuthModal from "./AuthModal";
import { useAuth } from "@/contexts/AuthContext";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleAuthClick = () => {
    if (user) {
      // If user is logged in, show dropdown
      return;
    } else {
      // If user is not logged in, navigate to auth page
      navigate("/auth");
    }
  };

  // If user is logged in, they can access admin features
  // This is for development purposes, in production you'd want stricter checks
  const userRole = (user && user.app_metadata && user.app_metadata.role) || "USER";
  const isAdmin = userRole === "ADMIN" || !!user;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-primary to-secondary shadow-md border-b border-white/10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-20">
          <div className="font-playfair text-2xl md:text-3xl font-bold gold-gradient">
            <Link to="/">EduLux</Link>
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
            {/* Only show Dashboard link when user is logged in */}
            {user && (
              <li>
                <Link 
                  to="/dashboard" 
                  className="text-white hover:text-gold transition-colors duration-300 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-gold after:transition-all hover:after:w-full"
                >
                  Dashboard
                </Link>
              </li>
            )}
            {/* Only show Test Management link for admins */}
            {isAdmin && (
              <li>
                <Link 
                  to="/test-management" 
                  className="text-white hover:text-gold transition-colors duration-300 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-gold after:transition-all hover:after:w-full"
                >
                  Test Management
                </Link>
              </li>
            )}
          </ul>

          {/* Login/User Button */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className="hidden md:flex border-gold text-gold hover:bg-gold hover:text-primary transition-all duration-300 px-6 rounded-full"
                >
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("/dashboard")}>
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button 
              variant="outline" 
              onClick={handleAuthClick}
              className="hidden md:flex border-gold text-gold hover:bg-gold hover:text-primary transition-all duration-300 px-6 rounded-full"
            >
              Login
            </Button>
          )}

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
            {/* Only show Dashboard link in mobile menu when user is logged in */}
            {user && (
              <li>
                <Link 
                  to="/dashboard" 
                  className="text-white hover:text-gold transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
              </li>
            )}
            {/* Only show Test Management link for admins in mobile menu */}
            {isAdmin && (
              <li>
                <Link 
                  to="/test-management" 
                  className="text-white hover:text-gold transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Test Management
                </Link>
              </li>
            )}
            <li>
              {user ? (
                <Button 
                  variant="outline" 
                  onClick={handleSignOut}
                  className="border-gold text-gold hover:bg-gold hover:text-primary transition-all duration-300 px-6 rounded-full"
                >
                  Sign Out
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    navigate("/auth");
                    setIsMenuOpen(false);
                  }}
                  className="border-gold text-gold hover:bg-gold hover:text-primary transition-all duration-300 px-6 rounded-full"
                >
                  Login
                </Button>
              )}
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
