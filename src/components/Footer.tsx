
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-primary text-white pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="font-playfair text-xl text-gold mb-4">EduLux</h3>
            <p className="text-white/70 text-sm">
              Redefining education with excellence, exclusivity, and exceptional results for discerning learners.
            </p>
          </div>
          
          <div>
            <h3 className="font-playfair text-xl text-gold mb-4">Programs</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/executive-courses" className="text-white/70 hover:text-white hover:pl-1 transition-all duration-300 text-sm">
                  Executive Courses
                </Link>
              </li>
              <li>
                <Link to="/mentorship" className="text-white/70 hover:text-white hover:pl-1 transition-all duration-300 text-sm">
                  Mentorship
                </Link>
              </li>
              <li>
                <Link to="/masterclasses" className="text-white/70 hover:text-white hover:pl-1 transition-all duration-300 text-sm">
                  Masterclasses
                </Link>
              </li>
              <li>
                <Link to="/corporate-training" className="text-white/70 hover:text-white hover:pl-1 transition-all duration-300 text-sm">
                  Corporate Training
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-playfair text-xl text-gold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/research-papers" className="text-white/70 hover:text-white hover:pl-1 transition-all duration-300 text-sm">
                  Research Papers
                </Link>
              </li>
              <li>
                <Link to="/case-studies" className="text-white/70 hover:text-white hover:pl-1 transition-all duration-300 text-sm">
                  Case Studies
                </Link>
              </li>
              <li>
                <Link to="/toolkits" className="text-white/70 hover:text-white hover:pl-1 transition-all duration-300 text-sm">
                  Toolkits
                </Link>
              </li>
              <li>
                <Link to="/insights" className="text-white/70 hover:text-white hover:pl-1 transition-all duration-300 text-sm">
                  Insights
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-playfair text-xl text-gold mb-4">Connect</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/careers" className="text-white/70 hover:text-white hover:pl-1 transition-all duration-300 text-sm">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/partnerships" className="text-white/70 hover:text-white hover:pl-1 transition-all duration-300 text-sm">
                  Partnerships
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-white/70 hover:text-white hover:pl-1 transition-all duration-300 text-sm">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/invitation-only" className="text-white/70 hover:text-white hover:pl-1 transition-all duration-300 text-sm">
                  Invitation Only
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 text-center text-white/50 text-sm">
          &copy; {currentYear} EduLux. All rights reserved. | Crafted with excellence in India
        </div>
      </div>
    </footer>
  );
};

export default Footer;
